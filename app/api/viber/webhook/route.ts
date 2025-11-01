/**
 * Viber Webhook Endpoint
 *
 * This endpoint is required by Viber API to enable the /pa/post endpoint
 * for posting to the channel feed.
 *
 * Note: According to Viber docs, "posting to the Channel using the API will
 * NOT generate callbacks to the webhook" - so this is mainly for API activation.
 *
 * Viber will send callbacks for events like:
 * - subscribed: When a user subscribes to the channel
 * - unsubscribed: When a user unsubscribes
 * - conversation_started: When a user starts a conversation
 */

import { NextRequest, NextResponse } from 'next/server';

interface ViberWebhookEvent {
  event: string;
  timestamp: number;
  message_token?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    country?: string;
    language?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ViberWebhookEvent;

    console.log('[Viber Webhook] Received event:', {
      event: body.event,
      timestamp: body.timestamp,
      userId: body.user?.id,
    });

    // Handle different event types (optional - for future use)
    switch (body.event) {
      case 'webhook':
        // Webhook verification callback from Viber
        console.log('[Viber Webhook] Webhook verification successful');
        break;

      case 'subscribed':
        console.log('[Viber Webhook] New subscriber:', body.user?.id);
        // TODO: You can store subscriber info in database here
        break;

      case 'unsubscribed':
        console.log('[Viber Webhook] User unsubscribed:', body.user?.id);
        // TODO: You can remove subscriber from database here
        break;

      case 'conversation_started':
        console.log('[Viber Webhook] Conversation started:', body.user?.id);
        break;

      default:
        console.log('[Viber Webhook] Unknown event type:', body.event);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 0 }, { status: 200 });

  } catch (error) {
    console.error('[Viber Webhook] Error processing webhook:', error);

    // Still return 200 to prevent Viber from retrying
    return NextResponse.json(
      { status: 0, message: 'Error processed' },
      { status: 200 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Viber Webhook Endpoint',
    status: 'active',
  });
}
