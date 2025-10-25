import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Email verification enforcement
  const isVerifyEmailRoute = request.nextUrl.pathname.startsWith('/auth/verify-email');
  const isResendVerificationRoute = request.nextUrl.pathname.startsWith('/api/auth/resend-verification');
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback');
  const isLogoutRoute = request.nextUrl.pathname.startsWith('/auth/logout');

  // If user is logged in but email is not verified
  if (user && !user.email_confirmed_at && !isVerifyEmailRoute && !isResendVerificationRoute && !isAuthCallback && !isLogoutRoute) {
    console.log('[MIDDLEWARE] Email not verified, redirecting to /auth/verify-email');
    return NextResponse.redirect(new URL('/auth/verify-email', request.url));
  }

  // Admin routes - check for admin role
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check if user is admin
    const { data: profile, error: adminCheckError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    console.log('[MIDDLEWARE] Admin access check:', {
      userId: user.id,
      email: user.email,
      pathname: request.nextUrl.pathname,
      profile,
      adminCheckError,
      is_admin: profile?.is_admin,
    });

    if (!profile?.is_admin) {
      // Not an admin - redirect to dashboard with error
      console.log('[MIDDLEWARE] Access denied - not admin, redirecting to /dashboard');
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }

    console.log('[MIDDLEWARE] Admin access granted');
  }

  // Protected routes
  const protectedRoutes = ['/dashboard', '/tarot', '/oracle', '/profile', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // If user is not logged in and trying to access protected route
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is logged in but hasn't completed onboarding
  // Skip onboarding check for admin routes - admins can access admin panel directly
  if (user && isProtectedRoute && !isAdminRoute && request.nextUrl.pathname !== '/onboarding') {
    // Check if onboarding is completed
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    console.log('[MIDDLEWARE] Onboarding check:', {
      userId: user.id,
      email: user.email,
      pathname: request.nextUrl.pathname,
      profile,
      profileError,
      onboarding_completed: profile?.onboarding_completed,
    });

    if (!profile || !profile.onboarding_completed) {
      console.log('[MIDDLEWARE] Redirecting to /onboarding');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // If user is logged in and completed onboarding, redirect from auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
