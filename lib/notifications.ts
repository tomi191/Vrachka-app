/**
 * In-App Notifications Helper Functions
 *
 * Use these functions to create notifications for users
 */

import { createClient } from "@/lib/supabase/server";

export type NotificationType =
  | 'achievement'
  | 'streak_milestone'
  | 'referral'
  | 'system'
  | 'payment'
  | 'custom';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Create a notification for a user
 *
 * @example
 * await createNotification({
 *   userId: user.id,
 *   type: 'streak_milestone',
 *   title: '🔥 7-дневен streak!',
 *   message: 'Честито! Постигна 7 последователни дни!',
 *   link: '/profile'
 * });
 */
export async function createNotification(params: CreateNotificationParams): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        read: false,
      });

    if (error) {
      console.error('[Notifications] Create error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Error:', error);
    return false;
  }
}

/**
 * Create a streak milestone notification
 */
export async function notifyStreakMilestone(userId: string, streakDays: number): Promise<boolean> {
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];

  if (!milestones.includes(streakDays)) {
    return false; // Only notify on specific milestones
  }

  const title = streakDays >= 30
    ? `🔥 ${streakDays}-дневен streak! Невероятно!`
    : `🔥 ${streakDays}-дневен streak!`;

  const message = streakDays >= 30
    ? `Ти си истински войн! Постигна ${streakDays} последователни дни!`
    : `Честито! Продължаваш да посещаваш Врачка ${streakDays} дни подред!`;

  return createNotification({
    userId,
    type: 'streak_milestone',
    title,
    message,
    link: '/profile',
  });
}

/**
 * Create a referral notification
 */
export async function notifyReferral(userId: string, referredUserName?: string): Promise<boolean> {
  const userName = referredUserName || 'нов потребител';

  return createNotification({
    userId,
    type: 'referral',
    title: '🎁 Нов препоръчан потребител!',
    message: `${userName} се регистрира с твоя реферален код!`,
    link: '/profile/referrals',
  });
}

/**
 * Create a system notification
 */
export async function notifySystem(userId: string, title: string, message: string, link?: string): Promise<boolean> {
  return createNotification({
    userId,
    type: 'system',
    title,
    message,
    link,
  });
}

/**
 * Create an achievement notification
 */
export async function notifyAchievement(userId: string, achievementName: string, description: string): Promise<boolean> {
  return createNotification({
    userId,
    type: 'achievement',
    title: `🏆 ${achievementName}`,
    message: description,
    link: '/profile',
  });
}
