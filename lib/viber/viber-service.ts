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
   * Post a message to the Viber channel using Broadcast API
   * (doesn't require webhook setup)
   */
  async postToChannel(
    message: Omit<ViberPostRequest, 'from'>
  ): Promise<SendNotificationResult> {
    try {
      // Get channel subscribers
      const subscribers = await this.getChannelSubscribers();

      if (subscribers.length === 0) {
        return {
          success: false,
          error: 'No subscribers found in the channel',
        };
      }

      // Use broadcast API instead of post (doesn't require webhook)
      const broadcastRequest = {
        broadcast_list: subscribers,
        type: message.type,
        text: message.text,
        media: message.media,
        rich_media: message.rich_media,
        keyboard: message.keyboard,
        tracking_data: message.tracking_data,
        min_api_version: 7, // Minimum API version for rich media
      };

      const response = await this.makeRequestWithRetry<ViberAPIResponse>(
        'broadcast_message',
        broadcastRequest
      );

      if (response.status === 0) {
        console.log('[Viber Service] Broadcast sent successfully:', {
          messageToken: response.message_token,
          subscriberCount: subscribers.length,
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

      return {
        success: false,
        error,
        details: response,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[Viber Service] Failed to broadcast to channel:', errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all channel subscribers (needed for broadcast)
   */
  private async getChannelSubscribers(): Promise<string[]> {
    try {
      const channelId = await this.ensureChannelId();

      // Get account info which includes subscribers
      const accountInfo = await this.getAccountInfo();

      // For channels, we need to get subscribers via the API
      // Note: Viber doesn't provide a direct way to get all subscriber IDs
      // We'll use the channel members as a fallback
      const members = accountInfo.members || [];
      const subscriberIds = members.map((member) => member.id);

      console.log('[Viber Service] Found subscribers:', subscriberIds.length);

      return subscriberIds;
    } catch (error) {
      console.error('[Viber Service] Failed to get subscribers:', error);
      return [];
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
