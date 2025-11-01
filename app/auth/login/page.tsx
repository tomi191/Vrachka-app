"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MysticBackground } from "@/components/background/MysticBackground";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Грешка при влизане");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 relative flex items-center justify-center p-4">
      <MysticBackground />
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Vrachka</h1>
          <p className="text-zinc-400">Влез в своя профил</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-zinc-50">
              Вход
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-zinc-300">
                    Парола
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-accent-400 hover:text-accent-300 transition-colors"
                  >
                    Забравена парола?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="w-full"
              >
                {loading ? "Влизане..." : "Влез"}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="text-center text-sm text-zinc-400">
              Нямаш акаунт?{" "}
              <Link
                href="/auth/register"
                className="text-accent-400 hover:text-accent-300 underline"
              >
                Регистрирай се
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
