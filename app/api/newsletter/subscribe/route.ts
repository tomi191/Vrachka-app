import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source = 'blog', interests = [] } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email е задължителен' },
        { status: 400 }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Невалиден имейл адрес' },
        { status: 400 }
      );
    }

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : null;

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        return NextResponse.json(
          { error: 'Този имейл вече е записан за нашия бюлетин' },
          { status: 409 }
        );
      } else if (existingSubscriber.status === 'pending') {
        return NextResponse.json(
          {
            success: true,
            message: 'Този имейл вече е регистриран. Моля, провери пощата си за потвърждение.',
            status: 'pending'
          },
          { status: 200 }
        );
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Resubscribe - update status back to pending
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'pending',
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('Error resubscribing:', updateError);
          return NextResponse.json(
            { error: 'Възникна грешка при записването' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: 'Успешно се записахте отново за бюлетина!',
            status: 'resubscribed'
          },
          { status: 200 }
        );
      }
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        status: 'pending', // Will be 'confirmed' after email verification
        source,
        interests: interests.length > 0 ? interests : null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select('id, confirmation_token')
      .single();

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return NextResponse.json(
        { error: 'Възникна грешка при записването' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email
    // For now, we'll auto-confirm since email service is not set up
    // In production, you would:
    // 1. Send email with confirmation link containing data.confirmation_token
    // 2. User clicks link -> calls /api/newsletter/confirm?token=...
    // 3. That endpoint updates status to 'confirmed'

    // Auto-confirm for now (remove this in production when email is set up)
    await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', data.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Благодарим ви! Успешно се записахте за нашия бюлетин.',
        status: 'confirmed',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Възникна неочаквана грешка' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status, confirmed_at, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        subscribed: data.status === 'confirmed',
        status: data.status,
        confirmed_at: data.confirmed_at,
        created_at: data.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
