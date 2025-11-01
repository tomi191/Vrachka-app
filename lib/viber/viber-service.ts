/**
 * Viber Bot API Service
 *
 * Handles communication with Viber API for sending blog post notifications
 * to the Vrachka Viber channel.
 *
 * Features:
 * - Get account info and channel ID
 * - Send rich media messages to channel
 * - Retry logic with exponential backoff
 * - Rate limit handling
 * - Error logging
 */

import type {
  ViberAPIResponse,
  ViberAccountInfo,
  ViberPostRequest,
  ViberServiceConfig,
  SendNotificationResult,
} from './types';

const VIBER_API_URL = 'https://chatapi.viber.com/pa';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export class ViberService {
  private authToken: string;
  private channelId: string | null = null;
  private apiUrl: string;

  constructor(config: ViberServiceConfig) {
    this.authToken = config.authToken;
    this.channelId = config.channelId || null;
    this.apiUrl = config.apiUrl || VIBER_API_URL;

    if (!this.authToken) {
      throw new Error('[Viber Service] Auth token is required');
    }
  }

  /**
   * Get account information and channel ID
   */
  async getAccountInfo(): Promise<ViberAccountInfo> {
    try {
      const response = await this.makeRequest<ViberAccountInfo>(
        'get_account_info',
        {}
      );

      if (response.status === 0) {
        // Success - cache the channel ID
        this.channelId = response.id;
        console.log('[Viber Service] Account info retrieved:', {
          id: response.id,
          name: response.name,
          subscribers: response.subscribers_count,
        });
        return response;
      }

      throw new Error(
        `Failed to get account info: ${response.status_message}`
      );
    } catch (error) {
      console.error('[Viber Service] Failed to get account info:', error);
      throw error;
    }
  }

  /**
   * Ensure channel ID is available
   */
  private async ensureChannelId(): Promise<string> {
    if (this.channelId) {
      return this.channelId;
    }

    // Fetch channel ID
    const accountInfo = await this.getAccountInfo();
    return accountInfo.id;
  }

  /**
   * Get superadmin user ID from account info
   * This is required for the 'from' parameter in /pa/post API
   */
  private async getSuperadminUserId(): Promise<string | null> {
    try {
      const accountInfo = await this.getAccountInfo();

      // Find the superadmin member
      const superadmin = accountInfo.members?.find(
        (member) => member.role === 'superadmin'
      );

      if (!superadmin) {
        console.error('[Viber Service] No superadmin found in account members');
        return null;
      }

      console.log('[Viber Service] Superadmin user ID:', superadmin.id);
      return superadmin.id;
    } catch (error) {
      console.error('[Viber Service] Failed to get superadmin user ID:', error);
      return null;
    }
  }

  /**
   * Post a message to the Viber channel feed
   * Requires webhook setup (use setWebhook() first if not configured)
   */
  async postToChannel(
    message: Omit<ViberPostRequest, 'from'>
  ): Promise<SendNotificationResult> {
    try {
      // Get superadmin user ID (required for 'from' parameter)
      const superadminUserId = await this.getSuperadminUserId();

      if (!superadminUserId) {
        return {
          success: false,
          error: 'Failed to get superadmin user ID from account info',
        };
      }

      // Use /pa/post endpoint to post to channel feed
      const postRequest = {
        from: superadminUserId, // Use superadmin user ID, NOT channel ID
        type: message.type,
        text: message.text,
        media: message.media,
        rich_media: message.rich_media,
        keyboard: message.keyboard,
        tracking_data: message.tracking_data,
        alt_text: message.alt_text,
        min_api_version: 7, // Minimum API version for rich media
      };

      const response = await this.makeRequestWithRetry<ViberAPIResponse>(
        'post',
        postRequest
      );

      if (response.status === 0) {
        console.log('[Viber Service] Post published to channel successfully:', {
          messageToken: response.message_token,
          superadminUserId,
        });

        return {
          success: true,
          messageToken: response.message_token,
          details: response,
        };
      }

      // Non-zero status = error
      const error = `Viber API error ${response.status}: ${response.status_message}`;
      console.error('[Viber Service]', error);

      // Provide helpful message for webhook error
      if (response.status === 10) {
        console.error('[Viber Service] Webhook not set. Please run setWebhook() first.');
        return {
          success: false,
          error: `${error} - Webhook not configured. Please set up webhook first.`,
          details: response,
        };
      }

      return {
        success: false,
        error,
        details: response,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[Viber Service] Failed to post to channel:', errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Set webhook URL for Viber API
   * This is required to enable the /pa/post endpoint
   *
   * @param webhookUrl - Full HTTPS URL to your webhook endpoint
   * @param eventTypes - Array of event types to subscribe to (default: ['subscribed', 'unsubscribed'])
   */
  async setWebhook(
    webhookUrl: string,
    eventTypes: string[] = ['subscribed', 'unsubscribed']
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!webhookUrl.startsWith('https://')) {
        return {
          success: false,
          error: 'Webhook URL must use HTTPS with a valid SSL certificate',
        };
      }

      const response = await this.makeRequest<ViberAPIResponse>(
        'set_webhook',
        {
          url: webhookUrl,
          event_types: eventTypes,
          send_name: true,
          send_photo: true,
        }
      );

      if (response.status === 0) {
        console.log('[Viber Service] Webhook set successfully:', webhookUrl);
        return { success: true };
      }

      const error = `Failed to set webhook: ${response.status_message}`;
      console.error('[Viber Service]', error);
      return { success: false, error };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Viber Service] Failed to set webhook:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get current webhook info
   */
  async getWebhookInfo(): Promise<{
    success: boolean;
    webhookUrl?: string;
    eventTypes?: string[];
    error?: string;
  }> {
    try {
      const accountInfo = await this.getAccountInfo();

      return {
        success: true,
        webhookUrl: accountInfo.webhook,
        eventTypes: accountInfo.event_types,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Make a request to Viber API with retry logic
   */
  private async makeRequestWithRetry<T extends ViberAPIResponse>(
    endpoint: string,
    data: object,
    retries = MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.makeRequest<T>(endpoint, data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on authentication errors
        if (
          lastError.message.includes('authentication') ||
          lastError.message.includes('status: 2')
        ) {
          throw lastError;
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          break;
        }

        // Exponential backoff
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.warn(
          `[Viber Service] Retry ${attempt + 1}/${retries} after ${delay}ms:`,
          lastError.message
        );
        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Make a single request to Viber API
   */
  private async makeRequest<T extends ViberAPIResponse>(
    endpoint: string,
    data: object
  ): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Viber-Auth-Token': this.authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`
        );
      }

      const result = (await response.json()) as T;

      // Viber uses status codes in the response body
      if (result.status === 2) {
        throw new Error('Invalid authentication token (status: 2)');
      }

      if (result.status === 12) {
        throw new Error('Rate limit exceeded (status: 12)');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error during API request');
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Validate message size (max 30KB)
   */
  static validateMessageSize(message: object): boolean {
    const size = JSON.stringify(message).length;
    const maxSize = 30 * 1024; // 30KB

    if (size > maxSize) {
      console.warn(
        `[Viber Service] Message size (${size} bytes) exceeds limit (${maxSize} bytes)`
      );
      return false;
    }

    return true;
  }
}

// ========== Singleton Instance ==========

let viberService: ViberService | null = null;

/**
 * Get or create Viber service instance
 */
export function getViberService(): ViberService | null {
  const authToken = process.env.VIBER_AUTH_TOKEN;

  if (!authToken) {
    console.warn(
      '[Viber Service] VIBER_AUTH_TOKEN not configured - Viber notifications disabled'
    );
    return null;
  }

  if (!viberService) {
    viberService = new ViberService({
      authToken,
      channelId: process.env.VIBER_CHANNEL_ID,
    });
  }

  return viberService;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetViberService(): void {
  viberService = null;
}
