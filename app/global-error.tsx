'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global application error:', error);
    }

    // TODO: Log to error tracking service (Sentry, etc.)
    // logErrorToService(error);
  }, [error]);

  return (
    <html lang="bg">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(to bottom right, #09090b, #18181b, #27272a)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          margin: '20px',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 24px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            ⚠️
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fafafa',
            marginBottom: '16px',
          }}>
            Критична грешка
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#d4d4d8',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}>
            Възникна критична грешка в приложението. Моля, опитайте да презаредите страницата.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid #27272a',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <p style={{
                fontSize: '12px',
                color: '#ef4444',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                margin: 0,
              }}>
                {error.message}
              </p>
              {error.digest && (
                <p style={{
                  fontSize: '12px',
                  color: '#71717a',
                  marginTop: '8px',
                  marginBottom: 0,
                }}>
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                background: '#9333ea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#7e22ce'}
              onMouseOut={(e) => e.currentTarget.style.background = '#9333ea'}
            >
              🔄 Презареди страницата
            </button>

            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#d4d4d8',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = '#52525b';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#3f3f46';
              }}
            >
              🏠 Начална страница
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
