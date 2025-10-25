import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendUpsellEmail } from '@/lib/email/send';

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Vercel Cron Job: Send upsell emails to free tier users
 * Schedule: Every Wednesday at 10:00 AM UTC
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get free tier users who have been active in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .eq('subscription_tier', 'free')
      .is('trial_tier', null)
      .gte('last_sign_in_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('[Cron] Error fetching free tier profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      console.log('[Cron] No free tier users found for upsell campaign');
      return NextResponse.json({ message: 'No free tier users to send upsell to', sent: 0 });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send upsell email to each free user
    for (const profile of profiles) {
      try {
        // Skip users who registered less than 3 days ago (let them explore first)
        const createdAt = new Date(profile.created_at);
        const daysSinceRegistration = Math.floor(
          (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceRegistration < 3) {
          continue;
        }

        const { data: user } = await supabase.auth.admin.getUserById(profile.id);

        if (user?.user?.email) {
          await sendUpsellEmail(user.user.email, profile.full_name?.split(' ')[0] || '');

          successCount++;
          console.log(`[Cron] Upsell email sent to ${user.user.email}`);
        }
      } catch (emailError) {
        console.error(`[Cron] Error sending upsell email to profile ${profile.id}:`, emailError);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Upsell campaign cron job completed',
      total: profiles.length,
      sent: successCount,
      failed: failureCount,
    });
  } catch (error) {
    console.error('[Cron] Error in upsell campaign cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
