/**
 * Viber Webhook Setup Endpoint
 *
 * Call this endpoint ONCE to configure the Viber webhook.
 * After running this, the /pa/post endpoint will work.
 *
 * Usage:
 * POST /api/viber/setup-webhook
 *
 * For security, this should only be called by admins.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getViberService } from '@/lib/viber/viber-service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get Viber service
    const viberService = getViberService();
    if (!viberService) {
      return NextResponse.json(
        { error: 'Viber service not configured - check VIBER_AUTH_TOKEN' },
        { status: 500 }
      );
    }

    // Construct webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vrachka.eu';
    const webhookUrl = `${baseUrl}/api/viber/webhook`;

    console.log('[Viber Setup] Setting webhook to:', webhookUrl);

    // Set the webhook
    const result = await viberService.setWebhook(webhookUrl);

    if (result.success) {
      // Get webhook info to confirm
      const info = await viberService.getWebhookInfo();

      return NextResponse.json({
        success: true,
        message: 'Webhook configured successfully',
        webhook: {
          url: info.webhookUrl,
          eventTypes: info.eventTypes,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Viber Setup] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to setup webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check current webhook status
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get Viber service
    const viberService = getViberService();
    if (!viberService) {
      return NextResponse.json(
        { error: 'Viber service not configured' },
        { status: 500 }
      );
    }

    // Get current webhook info
    const info = await viberService.getWebhookInfo();

    if (info.success) {
      return NextResponse.json({
        success: true,
        webhook: {
          url: info.webhookUrl || 'Not set',
          eventTypes: info.eventTypes || [],
          isConfigured: !!info.webhookUrl,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: info.error,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Viber Setup] Error checking webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to get webhook info',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
