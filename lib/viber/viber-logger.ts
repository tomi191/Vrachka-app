/**
 * Viber Notification Logger
 *
 * Logs all Viber notification sends to the database for:
 * - Analytics (success rate, timing)
 * - Debugging (error tracking)
 * - Preventing duplicates
 */

import { createClient } from '@/lib/supabase/server';
import type {
  ViberNotificationInsert,
  BlogPostNotificationData,
  SendNotificationResult,
} from './types';

/**
 * Log a Viber notification send attempt to the database
 */
export async function logViberNotification(
  blogPost: BlogPostNotificationData,
  result: SendNotificationResult
): Promise<void> {
  try {
    const supabase = await createClient();

    const notification: ViberNotificationInsert = {
      blog_post_id: blogPost.id,
      message_token: result.messageToken,
      status: result.success ? 'success' : 'failed',
      error_message: result.error,
      metadata: {
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        slug: blogPost.slug,
        featured_image: blogPost.featured_image_url,
        category: blogPost.category,
        response: result.details,
      },
    };

    const { error } = await supabase
      .from('viber_notifications')
      .insert(notification);

    if (error) {
      console.error('[Viber Logger] Failed to log notification:', error);
      // Don't throw - logging failure shouldn't break the app
    } else {
      console.log('[Viber Logger] Notification logged successfully:', {
        blog_post_id: blogPost.id,
        status: notification.status,
      });
    }
  } catch (error) {
    console.error('[Viber Logger] Error logging notification:', error);
    // Don't throw - logging failure shouldn't break the app
  }
}

/**
 * Check if a blog post already has a successful Viber notification
 */
export async function hasExistingNotification(
  blogPostId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('viber_notifications')
      .select('id')
      .eq('blog_post_id', blogPostId)
      .eq('status', 'success')
      .limit(1);

    if (error) {
      console.error(
        '[Viber Logger] Error checking existing notification:',
        error
      );
      return false; // Assume no notification to avoid blocking
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('[Viber Logger] Error checking existing notification:', error);
    return false; // Assume no notification to avoid blocking
  }
}

/**
 * Get notification history for a blog post
 */
export async function getNotificationHistory(blogPostId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('viber_notifications')
      .select('*')
      .eq('blog_post_id', blogPostId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('[Viber Logger] Error getting notification history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Viber Logger] Error getting notification history:', error);
    return [];
  }
}

/**
 * Get recent failed notifications for debugging
 */
export async function getRecentFailedNotifications(limit = 10) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('viber_notifications')
      .select('*')
      .eq('status', 'failed')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        '[Viber Logger] Error getting failed notifications:',
        error
      );
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Viber Logger] Error getting failed notifications:', error);
    return [];
  }
}

/**
 * Get Viber notification stats
 */
export async function getNotificationStats(): Promise<{
  total: number;
  successful: number;
  failed: number;
  successRate: number;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('viber_notifications')
      .select('status');

    if (error) {
      console.error('[Viber Logger] Error getting notification stats:', error);
      return { total: 0, successful: 0, failed: 0, successRate: 0 };
    }

    const total = data?.length || 0;
    const successful = data?.filter((n) => n.status === 'success').length || 0;
    const failed = data?.filter((n) => n.status === 'failed').length || 0;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total,
      successful,
      failed,
      successRate: Math.round(successRate * 100) / 100,
    };
  } catch (error) {
    console.error('[Viber Logger] Error getting notification stats:', error);
    return { total: 0, successful: 0, failed: 0, successRate: 0 };
  }
}
