import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token е задължителен' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Use the built-in unsubscribe function from migration
    const { data, error } = await supabase.rpc('unsubscribe_from_newsletter', {
      token
    });

    if (error) {
      console.error('Unsubscribe error:', error);
      return NextResponse.json(
        { error: 'Възникна грешка при отписването' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Невалиден token или вече сте отписан' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Успешно се отписахте от нашия бюлетин.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Възникна неочаквана грешка' },
      { status: 500 }
    );
  }
}

// GET endpoint to check token validity
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, status')
      .eq('unsubscribe_token', token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false, error: 'Невалиден token' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        email: data.email,
        status: data.status
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
