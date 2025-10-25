import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Mail, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Потвърди Email',
  description: 'Провери имейла си за да продължиш',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { resent?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/auth/login');
  }

  // If email is already verified, redirect to dashboard
  if (user.email_confirmed_at) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-500/20 mb-6">
            <Mail className="w-10 h-10 text-accent-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-zinc-50 mb-4">
            Потвърди Email Адреса
          </h1>

          {/* Email */}
          <p className="text-zinc-400 mb-6">
            Изпратихме потвърждаващо писмо на:
          </p>
          <p className="text-lg font-medium text-accent-400 mb-8">
            {user.email}
          </p>

          {/* Success Message */}
          {searchParams.resent === 'true' && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-medium">
                  Изпратихме ново потвърждаващо писмо!
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-left bg-zinc-900/50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm text-zinc-300">
                Отвори имейла си и намери писмото от Врачка
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm text-zinc-300">
                Кликни на линка за потвърждение
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm text-zinc-300">
                Ще бъдеш пренасочен обратно към приложението
              </p>
            </div>
          </div>

          {/* Resend Button */}
          <form action="/api/auth/resend-verification" method="POST" className="mb-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Изпрати отново
            </button>
          </form>

          {/* Help Text */}
          <p className="text-sm text-zinc-500 mb-4">
            Не получи писмото? Провери спам папката или изпрати отново.
          </p>

          {/* Logout Link */}
          <Link
            href="/auth/logout"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Излез от профила
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Имаш проблем? Свържи се с{' '}
          <a
            href="mailto:support@vrachka.com"
            className="text-accent-400 hover:text-accent-300 transition-colors"
          >
            support@vrachka.com
          </a>
        </p>
      </div>
    </div>
  );
}
