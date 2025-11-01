/**
 * Manual Viber Notification Endpoint
 *
 * Allows admins to manually send existing blog posts to Viber channel.
 * Useful for:
 * - Re-sending posts that failed
 * - Sending old posts that were created before Viber integration
 * - Testing the integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getViberService } from '@/lib/viber/viber-service';
import { createBlogNotificationMessage } from '@/lib/viber/templates/blog-notification';
import { logViberNotification, hasExistingNotification } from '@/lib/viber/viber-logger';

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

    // Get blog post ID from request
    const { blogPostId, forceResend } = await request.json();

    if (!blogPostId) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Check if already sent (unless force resend)
    if (!forceResend) {
      const alreadySent = await hasExistingNotification(blogPostId);
      if (alreadySent) {
        return NextResponse.json(
          {
            error: 'Notification already sent for this post',
            canForceResend: true,
          },
          { status: 400 }
        );
      }
    }

    // Get blog post
    const { data: blogPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, category, status')
      .eq('id', blogPostId)
      .single();

    if (fetchError || !blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if post is published
    if (blogPost.status !== 'published') {
      return NextResponse.json(
        { error: 'Only published posts can be sent to Viber' },
        { status: 400 }
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

    console.log('[Manual Viber Send] Sending notification for post:', blogPost.id);

    // Create notification message
    const message = createBlogNotificationMessage({
      id: blogPost.id,
      title: blogPost.title,
      excerpt: blogPost.excerpt || '',
      slug: blogPost.slug,
      featured_image_url: blogPost.featured_image_url,
      category: blogPost.category || 'general',
    });

    // Send to channel
    const result = await viberService.postToChannel(message);

    // Log the result
    await logViberNotification(
      {
        id: blogPost.id,
        title: blogPost.title,
        excerpt: blogPost.excerpt || '',
        slug: blogPost.slug,
        featured_image_url: blogPost.featured_image_url,
        category: blogPost.category || 'general',
      },
      result
    );

    if (result.success) {
      console.log('[Manual Viber Send] Success:', result.messageToken);
      return NextResponse.json({
        success: true,
        message: 'Notification sent successfully',
        messageToken: result.messageToken,
      });
    } else {
      console.error('[Manual Viber Send] Failed:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Manual Viber Send] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
