import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTrialExpiringEmail } from '@/lib/email/send';

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Vercel Cron Job: Send trial expiring reminders 1 day before trial expires
 * Schedule: Daily at 9:00 AM UTC
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Find trials expiring in exactly 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, trial_tier, trial_end')
      .not('trial_tier', 'is', null)
      .not('trial_end', 'is', null)
      .gte('trial_end', tomorrow.toISOString())
      .lt('trial_end', dayAfterTomorrow.toISOString());

    if (error) {
      console.error('[Cron] Error fetching profiles with expiring trials:', error);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('[Cron] No trials expiring in 1 day');
      return NextResponse.json({ message: 'No trials to remind', sent: 0 });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send trial expiring reminder to each user
    for (const profile of profiles) {
      try {
        const { data: user } = await supabase.auth.admin.getUserById(profile.id);

        if (user?.user?.email) {
          const expiryDate = new Date(profile.trial_end).toLocaleDateString('bg-BG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          const now = new Date();
          const trialEnd = new Date(profile.trial_end);
          const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          await sendTrialExpiringEmail(user.user.email, {
            firstName: profile.full_name?.split(' ')[0] || '',
            expiryDate,
            daysLeft,
          });

          successCount++;
          console.log(`[Cron] Trial expiring reminder sent to ${user.user.email}`);
        }
      } catch (emailError) {
        console.error(`[Cron] Error sending trial expiring reminder to profile ${profile.id}:`, emailError);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Trial expiring reminder cron job completed',
      total: profiles.length,
      sent: successCount,
      failed: failureCount,
    });
  } catch (error) {
    console.error('[Cron] Error in trial expiring reminder cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
