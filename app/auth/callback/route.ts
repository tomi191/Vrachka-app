import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check if user has completed onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      // If onboarding is completed, redirect to dashboard
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  // Default: Redirect to onboarding for new users or incomplete onboarding
  return NextResponse.redirect(`${origin}/onboarding`);
}
