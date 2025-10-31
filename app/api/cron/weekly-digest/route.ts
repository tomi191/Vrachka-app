import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklyDigestEmail } from '@/lib/email/send';

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Vercel Cron Job: Send weekly digest to all active users
 * Schedule: Every Monday at 9:00 AM UTC
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get all users with active subscriptions or trials
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, zodiac_sign')
      .or('subscription_tier.eq.basic,subscription_tier.eq.ultimate,trial_tier.eq.ultimate')
      .eq('subscription_status', 'active');

    if (error) {
      console.error('[Cron] Error fetching profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('[Cron] No active users found for weekly digest');
      return NextResponse.json({ message: 'No active users to send digest to', sent: 0 });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send weekly digest to each user
    for (const profile of profiles) {
      try {
        const { data: user } = await supabase.auth.admin.getUserById(profile.id);

        if (user?.user?.email) {
          // Get weekly horoscope for user's zodiac sign
          const weeklyHighlight = `Седмицата носи нови възможности за ${profile.zodiac_sign}. Следи своя дневен хороскоп за детайли!`;

          const result = await sendWeeklyDigestEmail(user.user.email, {
            firstName: profile.full_name?.split(' ')[0] || '',
            zodiacSign: profile.zodiac_sign || 'твоя знак',
            weeklyHighlight,
          });

          if (result.success) {
            // Log successful email send
            await supabase.rpc('log_email_sent', {
              p_email_type: 'weekly_digest',
              p_recipient_email: user.user.email,
              p_recipient_name: profile.full_name || null,
              p_subject: `Твоята седмична прогноза - ${profile.zodiac_sign} 🌙`,
              p_template_used: 'WeeklyDigestEmail',
              p_subscriber_id: null,
              p_user_id: profile.id,
              p_metadata: {
                zodiac_sign: profile.zodiac_sign,
              },
            });

            successCount++;
            console.log(`[Cron] Weekly digest sent to ${user.user.email}`);
          } else {
            throw new Error('Failed to send weekly digest email');
          }
        }
      } catch (emailError) {
        console.error(`[Cron] Error sending weekly digest to profile ${profile.id}:`, emailError);

        // Log failure to database
        try {
          const { data: user } = await supabase.auth.admin.getUserById(profile.id);
          if (user?.user?.email) {
            await supabase.rpc('log_email_failure', {
              p_email_type: 'weekly_digest',
              p_recipient_email: user.user.email,
              p_error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
              p_subscriber_id: null,
            });
          }
        } catch (logError) {
          console.error('[Cron] Failed to log email failure:', logError);
        }

        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Weekly digest cron job completed',
      total: profiles.length,
      sent: successCount,
      failed: failureCount,
    });
  } catch (error) {
    console.error('[Cron] Error in weekly digest cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
