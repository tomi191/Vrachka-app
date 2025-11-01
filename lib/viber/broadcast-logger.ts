/**
 * Viber Broadcast Logger
 *
 * Logs daily horoscope broadcasts and other automated Viber messages
 * that are not tied to specific blog posts.
 */

import { createClient } from '@/lib/supabase/server';
import type { SendNotificationResult } from './types';

export interface BroadcastLogEntry {
  broadcast_type: string; // 'daily_horoscope', 'tarot_card', etc.
  broadcast_date: string; // YYYY-MM-DD format
  metadata?: Record<string, any>;
}

/**
 * Log a Viber broadcast to the database
 * Uses viber_notifications table with null blog_post_id
 */
export async function logViberBroadcast(
  entry: BroadcastLogEntry,
  result: SendNotificationResult
): Promise<void> {
  try {
    const supabase = await createClient();

    const logEntry = {
      blog_post_id: null, // Broadcasts don't have associated blog posts
      message_token: result.messageToken || null,
      status: result.success ? 'success' : 'failed',
      error_message: result.error || null,
      metadata: {
        broadcast_type: entry.broadcast_type,
        broadcast_date: entry.broadcast_date,
        ...entry.metadata,
        api_response: result.details,
      },
    };

    const { error } = await supabase
      .from('viber_notifications')
      .insert(logEntry);

    if (error) {
      console.error('[Viber Broadcast Logger] Failed to log broadcast:', error);
      // Don't throw - logging failure shouldn't break the workflow
    } else {
      console.log('[Viber Broadcast Logger] Broadcast logged successfully:', {
        type: entry.broadcast_type,
        date: entry.broadcast_date,
        status: logEntry.status,
      });
    }
  } catch (error) {
    console.error('[Viber Broadcast Logger] Error:', error);
    // Silent fail - don't disrupt the workflow
  }
}

/**
 * Get broadcast history for a specific date
 */
export async function getBroadcastHistory(
  broadcastType: string,
  date: string
): Promise<any[] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('viber_notifications')
      .select('*')
      .is('blog_post_id', null) // Only broadcasts
      .eq('metadata->>broadcast_type', broadcastType)
      .eq('metadata->>broadcast_date', date)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('[Viber Broadcast Logger] Failed to get history:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[Viber Broadcast Logger] Error getting history:', error);
    return null;
  }
}

/**
 * Check if broadcast was already sent today
 */
export async function wasBroadcastSentToday(
  broadcastType: string,
  date: string
): Promise<boolean> {
  const history = await getBroadcastHistory(broadcastType, date);

  if (!history) return false;

  // Check if any successful broadcast exists
  return history.some((entry) => entry.status === 'success');
}

/**
 * Get broadcast stats for analytics
 */
export async function getBroadcastStats(
  broadcastType: string,
  fromDate?: string,
  toDate?: string
): Promise<{
  total: number;
  successful: number;
  failed: number;
  successRate: number;
} | null> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('viber_notifications')
      .select('status')
      .is('blog_post_id', null)
      .eq('metadata->>broadcast_type', broadcastType);

    if (fromDate) {
      query = query.gte('metadata->>broadcast_date', fromDate);
    }

    if (toDate) {
      query = query.lte('metadata->>broadcast_date', toDate);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('[Viber Broadcast Logger] Failed to get stats:', error);
      return null;
    }

    const total = data.length;
    const successful = data.filter((entry) => entry.status === 'success').length;
    const failed = data.filter((entry) => entry.status === 'failed').length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total,
      successful,
      failed,
      successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal
    };
  } catch (error) {
    console.error('[Viber Broadcast Logger] Error getting stats:', error);
    return null;
  }
}
