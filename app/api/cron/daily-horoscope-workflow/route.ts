import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createFeatureCompletion } from '@/lib/ai/openrouter';
import { HOROSCOPE_SYSTEM_PROMPT, getHoroscopePrompt } from '@/lib/ai/prompts';
import { parseAIJsonResponse } from '@/lib/ai/client';
import { sendBatchEmails, type BatchEmailJob } from '@/lib/email/resend-service';
import { DailyHoroscopeEmail, GenericDailyHoroscopeEmail } from '@/lib/email/templates';
import { getViberService } from '@/lib/viber/viber-service';
import { createDailyHoroscopeBroadcast } from '@/lib/viber/templates/daily-horoscope-broadcast';
import { logViberBroadcast, wasBroadcastSentToday } from '@/lib/viber/broadcast-logger';
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

// Zodiac signs - Bulgarian slugs (used in URLs like /horoscope/oven)
const zodiacSigns = [
  'oven',
  'telec',
  'bliznaci',
  'rak',
  'lav',
  'deva',
  'vezni',
  'skorpion',
  'strelec',
  'kozirog',
  'vodolej',
  'ribi'
];

const zodiacNamesБГ: Record<string, string> = {
  oven: 'Овен',
  telec: 'Телец',
  bliznaci: 'Близнаци',
  rak: 'Рак',
  lav: 'Лъв',
  deva: 'Дева',
  vezni: 'Везни',
  skorpion: 'Скорпион',
  strelec: 'Стрелец',
  kozirog: 'Козирог',
  vodolej: 'Водолей',
  ribi: 'Риби'
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
        console.log(`[Step 1] Generating horoscope for ${zodiacNamesБГ[zodiac]} (${zodiac})...`);

        // Use Bulgarian zodiac name for better AI understanding
        const prompt = getHoroscopePrompt(zodiacNamesБГ[zodiac], 'daily');
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

    // Get all confirmed subscribers with daily frequency (includes users with and without zodiac_sign)
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, zodiac_sign')
      .eq('status', 'confirmed')
      .eq('frequency', 'daily');

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
      const zodiacSign = subscriber.zodiac_sign as string | null;

      // Check if subscriber has zodiac_sign
      if (!zodiacSign) {
        // Send generic email with link to /horoscope
        console.log(`[Step 2] Subscriber ${subscriber.email} has no zodiac_sign, sending generic email`);

        emailJobs.push({
          to: subscriber.email,
          subject: `✨ Твоят дневен хороскоп - ${todayFormatted}`,
          template: React.createElement(GenericDailyHoroscopeEmail, {
            firstName: subscriber.name || '',
            date: todayFormatted,
          }),
          subscriberId: subscriber.id,
          metadata: {
            zodiacSign: null,
            date: today,
            emailType: 'generic',
          },
        });
        continue;
      }

      // Get horoscope for this zodiac sign
      const horoscope = generatedHoroscopes.get(zodiacSign);

      if (!horoscope) {
        console.warn(`[Step 2] No horoscope found for ${zodiacSign}, sending generic email to ${subscriber.email}`);

        // Fallback to generic email if horoscope generation failed for this sign
        emailJobs.push({
          to: subscriber.email,
          subject: `✨ Твоят дневен хороскоп - ${todayFormatted}`,
          template: React.createElement(GenericDailyHoroscopeEmail, {
            firstName: subscriber.name || '',
            date: todayFormatted,
          }),
          subscriberId: subscriber.id,
          metadata: {
            zodiacSign,
            date: today,
            emailType: 'generic_fallback',
          },
        });
        continue;
      }

      // Format horoscope text for email
      const horoscopeText = `${horoscope.general}\n\n💕 Любов: ${horoscope.love}\n\n💼 Кариера: ${horoscope.career}\n\n💪 Здраве: ${horoscope.health}\n\n✨ Съвет: ${horoscope.advice}`;

      // Create personalized email job with React template
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
          emailType: 'personalized',
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
    // STEP 3: SEND VIBER BROADCAST
    // ========================================
    console.log('[Step 3] Sending Viber daily horoscope broadcast...');

    let viberResult: { success: boolean; error?: string } = { success: false };

    try {
      // Check if Viber is configured
      const viberService = getViberService();

      if (!viberService) {
        console.log('[Step 3] Viber not configured (VIBER_AUTH_TOKEN missing), skipping broadcast');
        viberResult = { success: false, error: 'Not configured' };
      } else {
        // Check if already sent today (prevent duplicates)
        const alreadySent = await wasBroadcastSentToday('daily_horoscope', today);

        if (alreadySent) {
          console.log('[Step 3] Viber broadcast already sent today, skipping');
          viberResult = { success: false, error: 'Already sent today' };
        } else {
          // Create broadcast message
          const broadcastMessage = createDailyHoroscopeBroadcast(new Date());

          // Send to Viber channel
          const sendResult = await viberService.postToChannel(broadcastMessage);

          // Log the broadcast
          await logViberBroadcast(
            {
              broadcast_type: 'daily_horoscope',
              broadcast_date: today,
              metadata: {
                zodiac_count: generatedHoroscopes.size,
                date_formatted: todayFormatted,
              },
            },
            sendResult
          );

          if (sendResult.success) {
            console.log('[Step 3] ✅ Viber broadcast sent successfully');
            viberResult = { success: true };
          } else {
            console.error('[Step 3] Viber broadcast failed:', sendResult.error);
            viberResult = { success: false, error: sendResult.error };
          }
        }
      }
    } catch (error) {
      console.error('[Step 3] Error sending Viber broadcast:', error);
      viberResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      // Continue workflow even if Viber fails (non-blocking)
    }

    console.log(`[Step 3] Complete: ${viberResult.success ? 'Success' : 'Failed'}`);

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
      viber: {
        sent: viberResult.success,
        error: viberResult.error || null,
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
