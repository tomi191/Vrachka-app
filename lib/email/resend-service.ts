/**
 * Resend Email Service Wrapper
 *
 * Centralized service for sending emails via Resend API
 * Features:
 * - React Email template rendering
 * - Retry logic with exponential backoff
 * - Error tracking and logging
 * - Batch sending support
 * - Email logging to database
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';
import { createClient } from '@/lib/supabase/server';
import { ReactElement } from 'react';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Types
export type EmailType =
  | 'daily_horoscope'
  | 'renewal_reminder'
  | 'trial_expiring'
  | 'weekly_digest'
  | 'welcome'
  | 'verification'
  | 'payment_confirmation'
  | 'custom';

export interface SendEmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  template: ReactElement; // React Email template
  templateName?: string; // Template identifier for logging
  emailType: EmailType;
  subscriberId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  logId?: string;
}

export interface BatchEmailJob {
  to: string;
  subject: string;
  template: ReactElement;
  subscriberId?: string;
  metadata?: Record<string, any>;
}

// Default sender
const DEFAULT_FROM = 'Vrachka <noreply@vrachka.eu>';

/**
 * Send a single email with retry logic
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const {
    to,
    from = DEFAULT_FROM,
    subject,
    template,
    templateName,
    emailType,
    subscriberId,
    userId,
    metadata = {},
    replyTo,
  } = options;

  const supabase = await createClient();
  const recipients = Array.isArray(to) ? to : [to];
  const primaryRecipient = recipients[0];

  try {
    // Render React template to HTML
    const html = render(template);

    // Send email via Resend with retry logic
    const result = await sendWithRetry({
      from,
      to: recipients,
      subject,
      html,
      replyTo,
    });

    if (!result.id) {
      throw new Error('No message ID returned from Resend');
    }

    // Log successful send to database
    const { data: logData } = await supabase.rpc('log_email_sent', {
      p_email_type: emailType,
      p_recipient_email: primaryRecipient,
      p_recipient_name: null,
      p_subject: subject,
      p_template_used: templateName || emailType,
      p_subscriber_id: subscriberId || null,
      p_user_id: userId || null,
      p_metadata: metadata,
    });

    return {
      success: true,
      messageId: result.id,
      logId: logData,
    };

  } catch (error) {
    console.error(`[Resend Service] Failed to send ${emailType} email to ${primaryRecipient}:`, error);

    // Log failure to database
    try {
      await supabase.rpc('log_email_failure', {
        p_email_type: emailType,
        p_recipient_email: primaryRecipient,
        p_error_message: error instanceof Error ? error.message : 'Unknown error',
        p_subscriber_id: subscriberId || null,
      });
    } catch (logError) {
      console.error('[Resend Service] Failed to log email failure:', logError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send email with retry logic (exponential backoff)
 * Retries: 0ms, 1s, 2s, 4s
 */
async function sendWithRetry(
  emailData: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    replyTo?: string;
  },
  maxRetries = 3
): Promise<{ id: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await resend.emails.send(emailData);

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.data?.id) {
        throw new Error('No message ID in response');
      }

      return { id: result.data.id };

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on last attempt
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`[Resend Service] Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Failed to send email after retries');
}

/**
 * Send batch emails with rate limiting
 * Sends emails in batches with delays to avoid rate limits
 */
export async function sendBatchEmails(
  jobs: BatchEmailJob[],
  options: {
    emailType: EmailType;
    templateName?: string;
    from?: string;
    batchSize?: number; // Emails per batch
    delayBetweenBatches?: number; // ms delay between batches
  }
): Promise<{
  total: number;
  sent: number;
  failed: number;
  results: SendEmailResult[];
}> {
  const {
    emailType,
    templateName,
    from = DEFAULT_FROM,
    batchSize = 50, // Resend limit is 100/second for free tier
    delayBetweenBatches = 1100, // Just over 1 second to be safe
  } = options;

  const results: SendEmailResult[] = [];
  let sent = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);

    console.log(`[Resend Service] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(jobs.length / batchSize)}`);

    // Send batch emails in parallel
    const batchResults = await Promise.all(
      batch.map(job =>
        sendEmail({
          to: job.to,
          from,
          subject: job.subject,
          template: job.template,
          templateName,
          emailType,
          subscriberId: job.subscriberId,
          metadata: job.metadata,
        })
      )
    );

    // Track results
    for (const result of batchResults) {
      results.push(result);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    // Delay between batches (except for last batch)
    if (i + batchSize < jobs.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return {
    total: jobs.length,
    sent,
    failed,
    results,
  };
}

/**
 * Mark email as opened (for tracking pixels)
 */
export async function markEmailOpened(logId: string): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.rpc('mark_email_opened', {
      p_log_id: logId,
    });
  } catch (error) {
    console.error('[Resend Service] Failed to mark email as opened:', error);
  }
}

/**
 * Mark email as clicked
 */
export async function markEmailClicked(logId: string): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.rpc('mark_email_clicked', {
      p_log_id: logId,
    });
  } catch (error) {
    console.error('[Resend Service] Failed to mark email as clicked:', error);
  }
}

/**
 * Get email statistics for debugging
 */
export async function getEmailStats(subscriberId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('get_subscriber_email_stats', {
      p_subscriber_id: subscriberId,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('[Resend Service] Failed to get email stats:', error);
    return null;
  }
}
