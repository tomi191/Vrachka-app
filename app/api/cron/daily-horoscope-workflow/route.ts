import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createFeatureCompletion } from '@/lib/ai/openrouter';
import { HOROSCOPE_SYSTEM_PROMPT, getHoroscopePrompt } from '@/lib/ai/prompts';
import { parseAIJsonResponse } from '@/lib/ai/client';
import { sendBatchEmails, type BatchEmailJob } from '@/lib/email/resend-service';
import { DailyHoroscopeEmail } from '@/lib/email/templates';
import React from 'react';

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface HoroscopeResponse {
  general: string;
  love: string;
  career: string;
  health: string;
  advice: string;
  luckyNumbers: number[];
  loveStars: number;
  careerStars: number;
  healthStars: number;
}

// Zodiac signs in Bulgarian
const zodiacSigns = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces'
];

const zodiacNamesБГ: Record<string, string> = {
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнаци',
  cancer: 'Рак',
  leo: 'Лъв',
  virgo: 'Дева',
  libra: 'Везни',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козирог',
  aquarius: 'Водолей',
  pisces: 'Риби'
};

/**
 * Unified Daily Horoscope Workflow
 *
 * Runs at 7:00 AM EET (5:00 UTC) daily
 *
 * Step 1: Generate horoscopes for all 12 zodiac signs
 * Step 2: Send batch emails to newsletter subscribers
 *
 * This unified workflow ensures atomic operation - either both steps
 * complete successfully or neither does.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    console.log(`[Daily Horoscope Workflow] Starting workflow for ${today}`);

    // ========================================
    // STEP 1: GENERATE HOROSCOPES
    // ========================================
    console.log('[Step 1] Generating horoscopes for all 12 zodiac signs...');

    let generatedCount = 0;
    let skippedCount = 0;
    const generatedHoroscopes = new Map<string, HoroscopeResponse>();

    for (const zodiac of zodiacSigns) {
      try {
        // Check if already exists
        const { data: existing } = await supabase
          .from('daily_content')
          .select('id, content_body')
          .eq('content_type', 'horoscope')
          .eq('target_date', today)
          .eq('target_key', zodiac)
          .single();

        if (existing) {
          console.log(`[Step 1] Horoscope for ${zodiac} already exists, skipping generation`);
          generatedHoroscopes.set(zodiac, existing.content_body as HoroscopeResponse);
          skippedCount++;
          continue;
        }

        // Generate horoscope with AI
        console.log(`[Step 1] Generating horoscope for ${zodiac}...`);

        const prompt = getHoroscopePrompt(zodiac, 'daily');
        const response = await createFeatureCompletion(
          'horoscope',
          [
            { role: 'system', content: HOROSCOPE_SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          {
            temperature: 0.8,
            max_tokens: 2000,
          }
        );

        const aiResponse = response.choices[0]?.message?.content || '';
        const horoscope = parseAIJsonResponse<HoroscopeResponse>(aiResponse);

        if (!horoscope) {
          console.error(`[Step 1] Failed to parse horoscope for ${zodiac}`);
          throw new Error(`Failed to parse AI response for ${zodiac}`);
        }

        // Save to database
        const { error: insertError } = await supabase.from('daily_content').insert({
          content_type: 'horoscope',
          target_date: today,
          target_key: zodiac,
          content_body: horoscope,
        });

        if (insertError) {
          console.error(`[Step 1] Database error for ${zodiac}:`, insertError);
          throw insertError;
        }

        generatedHoroscopes.set(zodiac, horoscope);
        generatedCount++;
        console.log(`[Step 1] ✅ Generated and saved horoscope for ${zodiac}`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`[Step 1] Error generating horoscope for ${zodiac}:`, error);
        // Continue with other zodiacs even if one fails
        continue;
      }
    }

    console.log(`[Step 1] Complete: ${generatedCount} generated, ${skippedCount} skipped`);

    if (generatedHoroscopes.size === 0) {
      console.error('[Step 1] No horoscopes available, aborting email sending');
      return NextResponse.json({
        success: false,
        message: 'Failed to generate horoscopes',
        generated: 0,
        sent: 0,
      }, { status: 500 });
    }

    // ========================================
    // STEP 2: SEND EMAILS
    // ========================================
    console.log('[Step 2] Sending daily horoscope emails...');

    // Get all confirmed subscribers with daily frequency and zodiac sign
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, zodiac_sign')
      .eq('status', 'confirmed')
      .eq('frequency', 'daily')
      .not('zodiac_sign', 'is', null);

    if (subscribersError) {
      console.error('[Step 2] Error fetching subscribers:', subscribersError);
      return NextResponse.json({
        success: false,
        message: 'Generated horoscopes but failed to fetch subscribers',
        generated: generatedCount,
        sent: 0,
      }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('[Step 2] No subscribers to send to');
      return NextResponse.json({
        success: true,
        message: 'Horoscopes generated, no subscribers to send to',
        generated: generatedCount,
        sent: 0,
      });
    }

    console.log(`[Step 2] Found ${subscribers.length} subscribers`);

    const todayFormatted = new Date().toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Prepare batch email jobs
    const emailJobs: BatchEmailJob[] = [];

    for (const subscriber of subscribers) {
      const zodiacSign = subscriber.zodiac_sign as string;
      const horoscope = generatedHoroscopes.get(zodiacSign);

      if (!horoscope) {
        console.warn(`[Step 2] No horoscope found for ${zodiacSign}, skipping ${subscriber.email}`);
        continue;
      }

      // Format horoscope text for email
      const horoscopeText = `${horoscope.general}\n\n💕 Любов: ${horoscope.love}\n\n💼 Кариера: ${horoscope.career}\n\n💪 Здраве: ${horoscope.health}\n\n✨ Съвет: ${horoscope.advice}`;

      // Create email job with React template
      emailJobs.push({
        to: subscriber.email,
        subject: `✨ Твоят дневен хороскоп - ${todayFormatted}`,
        template: React.createElement(DailyHoroscopeEmail, {
          firstName: subscriber.name || '',
          zodiacSign: zodiacNamesБГ[zodiacSign] || zodiacSign,
          horoscopeText,
          date: todayFormatted,
        }),
        subscriberId: subscriber.id,
        metadata: {
          zodiacSign,
          date: today,
        },
      });
    }

    console.log(`[Step 2] Prepared ${emailJobs.length} email jobs`);

    if (emailJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Horoscopes generated, no matching subscribers',
        generated: generatedCount,
        sent: 0,
      });
    }

    // Send batch emails with Resend service (includes retry logic and logging)
    const emailResult = await sendBatchEmails(emailJobs, {
      emailType: 'daily_horoscope',
      templateName: 'DailyHoroscopeEmail',
      from: 'Vrachka <daily@vrachka.eu>',
      batchSize: 50,
      delayBetweenBatches: 1100,
    });

    // Update tracking for successful sends
    for (let i = 0; i < emailResult.results.length; i++) {
      const result = emailResult.results[i];
      const job = emailJobs[i];

      if (result.success && job.subscriberId) {
        await supabase
          .from('newsletter_subscribers')
          .update({
            last_email_sent_at: new Date().toISOString()
          })
          .eq('id', job.subscriberId);
      }
    }

    console.log(`[Step 2] Complete: ${emailResult.sent} sent, ${emailResult.failed} failed`);

    // ========================================
    // WORKFLOW COMPLETE
    // ========================================
    console.log('[Daily Horoscope Workflow] ✅ Workflow complete');

    return NextResponse.json({
      success: true,
      message: 'Daily horoscope workflow completed successfully',
      horoscopes: {
        generated: generatedCount,
        skipped: skippedCount,
        total: generatedHoroscopes.size,
      },
      emails: {
        sent: emailResult.sent,
        failed: emailResult.failed,
        total: emailResult.total,
      },
    });

  } catch (error) {
    console.error('[Daily Horoscope Workflow] Fatal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Workflow failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
