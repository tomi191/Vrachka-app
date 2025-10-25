'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при изпращане на имейл');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : 'Нещо се обърка');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="glass-card p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-zinc-50 mb-4">
              Провери Имейла Си
            </h1>

            {/* Message */}
            <p className="text-zinc-400 mb-6">
              Изпратихме инструкции за нулиране на паролата на:
            </p>
            <p className="text-lg font-medium text-accent-400 mb-8">
              {email}
            </p>

            {/* Instructions */}
            <div className="text-left bg-zinc-900/50 rounded-lg p-6 mb-6">
              <p className="text-sm text-zinc-300 mb-3">
                Кликни на линка в имейла за да нулираш паролата си.
              </p>
              <p className="text-sm text-zinc-500">
                Не получи имейл? Провери спам папката или опитай отново след няколко минути.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Обратно към вход
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Обратно към вход
        </Link>

        <div className="glass-card p-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-6">
            <Mail className="w-8 h-8 text-accent-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">
            Забравена Парола
          </h1>
          <p className="text-zinc-400 mb-8">
            Въведи имейл адреса си и ще ти изпратим инструкции за нулиране на паролата.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Имейл адрес
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="твоят@имейл.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Изпращане...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Изпрати Инструкции
                </>
              )}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Спомняш си паролата си?{' '}
          <Link
            href="/auth/login"
            className="text-accent-400 hover:text-accent-300 transition-colors"
          >
            Влез
          </Link>
        </p>
      </div>
    </div>
  );
}
