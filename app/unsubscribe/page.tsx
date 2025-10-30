'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GradientText } from '@/components/ui/gradient-text';

type UnsubscribeState = 'loading' | 'confirm' | 'processing' | 'success' | 'error';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<UnsubscribeState>('loading');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setError('Липсва валиден токен за отписване');
      return;
    }

    // Validate token and get subscriber info
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
        const data = await response.json();

        if (!response.ok || !data.valid) {
          setState('error');
          setError(data.error || 'Невалиден или изтекъл токен');
          return;
        }

        setEmail(data.email);
        setState('confirm');
      } catch (err) {
        setState('error');
        setError('Възникна грешка при проверката на токена');
      }
    };

    validateToken();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setState('processing');

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setState('error');
        setError(data.error || 'Възникна грешка при отписването');
        return;
      }

      setState('success');
    } catch (err) {
      setState('error');
      setError('Възникна неочаквана грешка');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">
            <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
              Отписване от бюлетина
            </GradientText>
          </h1>
        </div>

        {/* Loading State */}
        {state === 'loading' && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-accent-400 animate-spin" />
              <p className="text-zinc-400">Зареждане...</p>
            </CardContent>
          </Card>
        )}

        {/* Confirmation State */}
        {state === 'confirm' && (
          <Card className="glass-card">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-500/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-accent-400" />
              </div>
              <CardTitle className="text-zinc-50 text-center">
                Потвърдете отписването
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-zinc-300">
                  Сигурни ли сте, че искате да се отпишете от дневния хороскоп?
                </p>
                <p className="text-sm text-zinc-500">
                  Email: <span className="text-accent-400">{email}</span>
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  След отписване няма да получавате повече дневни хороскопи и астрологични съвети от Vrachka.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUnsubscribe}
                  variant="destructive"
                  className="flex-1"
                >
                  Да, отпиши ме
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-zinc-700 hover:bg-zinc-800"
                >
                  <Link href="/horoscope">Откажи</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing State */}
        {state === 'processing' && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-accent-400 animate-spin" />
              <p className="text-zinc-400">Обработване...</p>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {state === 'success' && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-50">
                  Успешно отписване
                </h2>
                <p className="text-zinc-300">
                  Успешно се отписахте от нашия бюлетин.
                </p>
                <p className="text-sm text-zinc-500">
                  Няма да получавате повече имейли от нас.
                </p>
              </div>

              <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  💜 Ако промените решението си, винаги можете да се запишете отново за бюлетина от нашия сайт.
                </p>
              </div>

              <Button
                asChild
                className="bg-accent-600 hover:bg-accent-700"
              >
                <Link href="/">Към началната страница</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {state === 'error' && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-50">
                  Възникна грешка
                </h2>
                <p className="text-zinc-300">
                  {error || 'Нещо се обърка при отписването'}
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Ако проблемът продължава, свържете се с нас на{' '}
                  <a
                    href="mailto:support@vrachka.eu"
                    className="text-accent-400 hover:text-accent-300 underline"
                  >
                    support@vrachka.eu
                  </a>
                </p>
              </div>

              <Button
                asChild
                className="bg-accent-600 hover:bg-accent-700"
              >
                <Link href="/">Към началната страница</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-16">
          <Card className="glass-card">
            <CardContent className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-accent-400 animate-spin" />
              <p className="text-zinc-400">Зареждане...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
