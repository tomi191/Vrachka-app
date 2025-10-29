'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSubscribeProps {
  source?: string;
  interests?: string[];
}

export default function NewsletterSubscribe({
  source = 'blog',
  interests = []
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Моля, въведи имейл адрес');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source,
          interests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Благодарим ви! Успешно се записахте.');
        setEmail('');
        setName('');

        // Reset to idle after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Възникна грешка. Моля, опитай отново.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Възникна грешка при свързването. Моля, опитай отново.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-accent-500/10 to-purple-500/10 backdrop-blur-sm border border-accent-500/20 rounded-lg p-6">
      <h3 className="text-lg font-bold text-zinc-50 mb-2">
        📬 Абонирай се
      </h3>
      <p className="text-sm text-zinc-400 mb-4">
        Получавай нови статии директно на имейла си
      </p>

      {status === 'success' ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-400 font-medium mb-1">Успешно!</p>
            <p className="text-xs text-zinc-400">{message}</p>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="твоя@имейл.bg"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Записване...
                </>
              ) : (
                'Абонирай се'
              )}
            </button>
          </form>

          {status === 'error' && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{message}</p>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-zinc-500 mt-3">
        Без спам. Може да се отпишеш по всяко време.
      </p>
    </div>
  );
}
