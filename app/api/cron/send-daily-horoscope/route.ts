import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendBatchEmails, type BatchEmailJob } from '@/lib/email/resend-service';
import { DailyHoroscopeEmail } from '@/lib/email/templates';
import React from 'react';

// Zodiac signs mapping
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

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all confirmed subscribers with daily frequency and zodiac sign
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, zodiac_sign')
      .eq('status', 'confirmed')
      .eq('frequency', 'daily')
      .not('zodiac_sign', 'is', null); // Only users with zodiac sign set

    if (subscribersError) {
      console.error('[Daily Horoscope] Error fetching subscribers:', subscribersError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('[Daily Horoscope] No subscribers with zodiac signs to send to');
      return NextResponse.json({
        success: true,
        message: 'No subscribers to send to',
        sent: 0
      });
    }

    console.log(`[Daily Horoscope] Found ${subscribers.length} subscribers`);

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Fetch today's horoscopes from cache
    const { data: horoscopes, error: horoscopesError } = await supabase
      .from('daily_content')
      .select('target_key, content_body')
      .eq('content_type', 'horoscope')
      .eq('target_date', today);

    if (horoscopesError) {
      console.error('[Daily Horoscope] Error fetching horoscopes:', horoscopesError);
      return NextResponse.json({ error: 'Failed to fetch horoscopes' }, { status: 500 });
    }

    if (!horoscopes || horoscopes.length === 0) {
      console.warn('[Daily Horoscope] No horoscopes available for today');
      return NextResponse.json({
        success: false,
        message: 'No horoscopes available',
        sent: 0
      });
    }

    console.log(`[Daily Horoscope] Found ${horoscopes.length} horoscopes for ${today}`);

    // Convert to map for easy lookup
    const horoscopeMap = new Map(
      horoscopes.map(h => [h.target_key, h.content_body])
    );

    // Prepare batch email jobs
    const emailJobs: BatchEmailJob[] = [];

    for (const subscriber of subscribers) {
      const zodiacSign = subscriber.zodiac_sign as string;
      const horoscopeText = horoscopeMap.get(zodiacSign);

      if (!horoscopeText) {
        console.warn(`[Daily Horoscope] No horoscope found for ${zodiacSign}, skipping ${subscriber.email}`);
        continue;
      }

      // Parse horoscope text (handle both string and JSON formats)
      const horoscopeContent = typeof horoscopeText === 'string'
        ? horoscopeText
        : JSON.stringify(horoscopeText);

      // Create email job with React template
      emailJobs.push({
        to: subscriber.email,
        subject: `✨ Твоят дневен хороскоп - ${todayFormatted}`,
        template: React.createElement(DailyHoroscopeEmail, {
          firstName: subscriber.name || '',
          zodiacSign: zodiacNamesБГ[zodiacSign] || zodiacSign,
          horoscopeText: horoscopeContent,
          date: todayFormatted,
        }),
        subscriberId: subscriber.id,
        metadata: {
          zodiacSign,
          date: today,
        },
      });
    }

    console.log(`[Daily Horoscope] Prepared ${emailJobs.length} email jobs`);

    if (emailJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No emails to send',
        sent: 0
      });
    }

    // Send batch emails with Resend service (includes retry logic and logging)
    const result = await sendBatchEmails(emailJobs, {
      emailType: 'daily_horoscope',
      templateName: 'DailyHoroscopeEmail',
      from: 'Vrachka <daily@vrachka.eu>',
      batchSize: 50, // Resend free tier: 100 emails/second
      delayBetweenBatches: 1100, // 1.1 seconds
    });

    // Update tracking for successful sends
    for (let i = 0; i < result.results.length; i++) {
      const emailResult = result.results[i];
      const job = emailJobs[i];

      if (emailResult.success && job.subscriberId) {
        // Update subscriber tracking
        await supabase
          .from('newsletter_subscribers')
          .update({
            last_email_sent_at: new Date().toISOString()
          })
          .eq('id', job.subscriberId);
      }
    }

    console.log(`[Daily Horoscope] Batch complete: ${result.sent} sent, ${result.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Daily horoscope emails processed',
      sent: result.sent,
      failed: result.failed,
      total: result.total,
    });

  } catch (error) {
    console.error('[Daily Horoscope] Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
