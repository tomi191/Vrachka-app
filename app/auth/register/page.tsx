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
