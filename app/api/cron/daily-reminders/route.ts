import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUsers } from "@/lib/push/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Vercel Cron Secret for security
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get all users with daily_reminders enabled AND push subscriptions active
    const { data: users, error } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('daily_reminders', true);

    if (error || !users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with daily reminders enabled',
        sent: 0,
      });
    }

    // Filter users who actually have push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('user_id')
      .eq('is_active', true)
      .in('user_id', users.map(u => u.user_id));

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active push subscriptions',
        sent: 0,
      });
    }

    // Get unique user IDs who have both daily_reminders enabled AND active push subscriptions
    const uniqueUserIds = [...new Set(subscriptions.map(s => s.user_id))];

    // Send daily horoscope reminder
    const result = await sendPushToUsers(uniqueUserIds, {
      title: '🌟 Твоят дневен хороскоп е готов!',
      body: 'Виж какво подготвят звездите за теб днес',
      url: '/dashboard',
      tag: 'daily_horoscope',
    });

    return NextResponse.json({
      success: true,
      message: `Sent daily reminders to ${result.sent} users`,
      sent: result.sent,
      failed: result.failed,
      totalUsers: uniqueUserIds.length,
    });
  } catch (error) {
    console.error('Daily reminders cron error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send daily reminders',
      },
      { status: 500 }
    );
  }
}
