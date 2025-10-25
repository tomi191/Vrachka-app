import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionRenewalEmail } from '@/lib/email/send';

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Vercel Cron Job: Send renewal reminders 3 days before subscription expires
 * Schedule: Daily at 8:00 AM UTC
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Find subscriptions expiring in exactly 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0, 0);

    const fourDaysFromNow = new Date(threeDaysFromNow);
    fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1);

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('user_id, plan_type, current_period_end')
      .eq('status', 'active')
      .neq('plan_type', 'free')
      .gte('current_period_end', threeDaysFromNow.toISOString())
      .lt('current_period_end', fourDaysFromNow.toISOString());

    if (error) {
      console.error('[Cron] Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Cron] No subscriptions expiring in 3 days');
      return NextResponse.json({ message: 'No subscriptions to remind', sent: 0 });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send renewal reminder to each user
    for (const subscription of subscriptions) {
      try {
        const { data: user } = await supabase.auth.admin.getUserById(subscription.user_id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', subscription.user_id)
          .single();

        if (user?.user?.email) {
          const planName = subscription.plan_type === 'basic' ? 'Basic' : 'Ultimate';
          const amount = subscription.plan_type === 'basic' ? '9.99 BGN' : '19.99 BGN';
          const renewalDate = new Date(subscription.current_period_end).toLocaleDateString('bg-BG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          await sendSubscriptionRenewalEmail(user.user.email, {
            firstName: profile?.full_name?.split(' ')[0] || '',
            plan: planName,
            amount,
            renewalDate,
          });

          successCount++;
          console.log(`[Cron] Renewal reminder sent to ${user.user.email}`);
        }
      } catch (emailError) {
        console.error(`[Cron] Error sending renewal reminder to user ${subscription.user_id}:`, emailError);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Renewal reminder cron job completed',
      total: subscriptions.length,
      sent: successCount,
      failed: failureCount,
    });
  } catch (error) {
    console.error('[Cron] Error in renewal reminder cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
