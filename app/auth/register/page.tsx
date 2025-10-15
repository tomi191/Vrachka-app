"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Capture referral code from URL and store in sessionStorage
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      sessionStorage.setItem('referral_code', refCode);
      setReferralCode(refCode);
    }
  }, [searchParams]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Паролите не съвпадат");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Паролата трябва да е поне 6 символа");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Success - redirect to onboarding
      router.push("/onboarding");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Грешка при регистрация");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Грешка при регистрация с Google");
      setLoading(false);
    }
  };

  const handleFacebookRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Грешка при регистрация с Facebook");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Vrachka</h1>
          <p className="text-zinc-400">Създай своя профил</p>
        </div>

        {/* Referral Code Indicator */}
        {referralCode && (
          <div className="p-4 bg-accent-900/20 border border-accent-600/50 rounded-lg text-center space-y-1">
            <p className="text-sm text-accent-300">
              🎁 Използваш референтен код
            </p>
            <p className="text-lg font-bold text-accent-400">{referralCode}</p>
            <p className="text-xs text-zinc-400">
              Ще получиш специална награда при регистрация!
            </p>
          </div>
        )}

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-zinc-50">
              Регистрация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleRegister}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Регистрирай се с Google
              </Button>

              <Button
                onClick={handleFacebookRegister}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Регистрирай се с Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Или</span>
              </div>
            </div>

            {/* Email Register Form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="твоят@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Парола
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="Поне 6 символа"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Потвърди парола
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="Повтори паролата"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="w-full"
              >
                {loading ? "Регистрация..." : "Регистрирай се"}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-center text-zinc-500">
              С регистрацията приемаш нашите{" "}
              <Link href="/terms" className="underline hover:text-zinc-400">
                Условия
              </Link>{" "}
              и{" "}
              <Link href="/privacy" className="underline hover:text-zinc-400">
                Политика за поверителност
              </Link>
            </p>

            {/* Footer Links */}
            <div className="text-center text-sm text-zinc-400">
              Вече имаш акаунт?{" "}
              <Link
                href="/auth/login"
                className="text-accent-400 hover:text-accent-300 underline"
              >
                Влез
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-400"
          >
            ← Обратно към началото
          </Link>
        </div>
      </div>
    </div>
  );
}
