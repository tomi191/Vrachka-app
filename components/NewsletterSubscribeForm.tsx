'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterSubscribeFormProps {
  source?: string;
  className?: string;
}

export function NewsletterSubscribeForm({
  source = 'footer',
  className = ''
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setState('error');
      setMessage('Моля, въведете имейл адрес');
      return;
    }

    setState('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setState('error');
        setMessage(data.error || 'Възникна грешка при записването');
        return;
      }

      setState('success');
      setMessage(data.message || 'Успешно се записахте за нашия бюлетин!');
      setEmail('');

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setState('idle');
        setMessage('');
      }, 5000);

    } catch (err) {
      setState('error');
      setMessage('Възникна неочаквана грешка');
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <Input
              type="email"
              placeholder="Твоят имейл адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              className="pl-10 bg-zinc-900/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-accent-500 focus:ring-accent-500/20"
            />
          </div>
          <Button
            type="submit"
            disabled={state === 'loading' || state === 'success'}
            className="bg-accent-600 hover:bg-accent-700 text-white"
          >
            {state === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Абонирай се'
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {message && (
          <div className={`flex items-start gap-2 text-sm p-3 rounded-lg ${
            state === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {state === 'success' ? (
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <p className="leading-relaxed">{message}</p>
          </div>
        )}

        <p className="text-xs text-zinc-500 leading-relaxed">
          Абонирай се за дневни хороскопи и астрологични съвети директно в пощата ти.
          Можеш да се отпишеш по всяко време.
        </p>
      </form>
    </div>
  );
}
