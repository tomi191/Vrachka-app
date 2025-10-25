import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Check if already verified
  if (user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL!));
  }

  // Resend verification email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
  });

  if (error) {
    console.error('[RESEND-VERIFICATION] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Redirect back to verify page with success message
  return NextResponse.redirect(
    new URL('/auth/verify-email?resent=true', process.env.NEXT_PUBLIC_APP_URL!)
  );
}
