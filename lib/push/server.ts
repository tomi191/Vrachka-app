import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

// Initialize web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@vrachka.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
  tag?: string
}

// Send push notification to a single subscription
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
) {
  try {
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/icon-192.png',
      data: {
        url: payload.url || '/',
      },
      tag: payload.tag || 'general',
    })

    await webpush.sendNotification(subscription, notificationPayload)
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)

    // If subscription is no longer valid (410 Gone), mark as inactive
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const statusCode = (error as { statusCode: number }).statusCode
      if (statusCode === 410 || statusCode === 404) {
        // Subscription expired or invalid
        return { success: false, expired: true }
      }
    }

    return { success: false, error }
  }
}

// Send push notification to a user (all their devices)
export async function sendPushToUser(
  userId: string,
  payload: NotificationPayload
) {
  const supabase = await createClient()

  // Get all active subscriptions for user
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error || !subscriptions || subscriptions.length === 0) {
    return { success: false, sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0
  const expiredEndpoints: string[] = []

  // Send to all subscriptions
  await Promise.all(
    subscriptions.map(async (sub) => {
      const subscription: PushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }

      const result = await sendPushNotification(subscription, payload)

      if (result.success) {
        sent++
      } else {
        failed++
        if (result.expired) {
          expiredEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  // Mark expired subscriptions as inactive
  if (expiredEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .in('endpoint', expiredEndpoints)
  }

  // Log notification
  await supabase.from('push_notification_logs').insert({
    user_id: userId,
    type: payload.tag || 'custom',
    title: payload.title,
    body: payload.body,
    success: sent > 0,
  })

  return { success: sent > 0, sent, failed }
}

// Send push to multiple users
export async function sendPushToUsers(
  userIds: string[],
  payload: NotificationPayload
) {
  const results = await Promise.all(
    userIds.map((userId) => sendPushToUser(userId, payload))
  )

  const totalSent = results.reduce((sum, r) => sum + r.sent, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)

  return {
    success: totalSent > 0,
    sent: totalSent,
    failed: totalFailed,
    users: results.length,
  }
}

// Send daily horoscope reminder to all subscribed users
export async function sendDailyHoroscopeReminders() {
  const supabase = await createClient()

  // Get all users with active push subscriptions
  const { data: users } = await supabase
    .from('push_subscriptions')
    .select('user_id')
    .eq('is_active', true)
    .order('user_id')

  if (!users || users.length === 0) {
    return { success: false, sent: 0 }
  }

  // Get unique user IDs
  const uniqueUserIds = [...new Set(users.map((u) => u.user_id))]

  // Send to all users
  const result = await sendPushToUsers(uniqueUserIds, {
    title: '🌟 Твоят дневен хороскоп е готов!',
    body: 'Виж какво подготвят звездите за теб днес',
    url: '/dashboard',
    tag: 'daily_horoscope',
  })

  return result
}

// Send streak reminder (when user hasn't visited for 2 days)
export async function sendStreakReminder(userId: string, streakDays: number) {
  return await sendPushToUser(userId, {
    title: `🔥 Твоя ${streakDays}-дневен streak е застрашен!`,
    body: 'Не го губи! Провери хороскопа си още днес.',
    url: '/dashboard',
    tag: 'streak_reminder',
  })
}
