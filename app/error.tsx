'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }

    // TODO: Log to error tracking service (Sentry, etc.)
    // logErrorToService(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="glass-card border-red-500/30 max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <CardTitle className="text-zinc-50 text-2xl">
              Нещо се обърка
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-zinc-300 mb-2">
              Извиняваме се за неудобството. Възникна неочаквана грешка.
            </p>
            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-xs text-red-400 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-zinc-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 bg-accent-600 hover:bg-accent-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Опитай отново
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Начална страница
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Ако проблемът продължава, свържете се с поддръжката
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
