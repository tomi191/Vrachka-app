'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SendToViberButtonProps {
  postId: string;
  postTitle: string;
  postStatus: string;
  className?: string;
}

export function SendToViberButton({
  postId,
  postTitle,
  postStatus,
  className = '',
}: SendToViberButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already-sent'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canForceResend, setCanForceResend] = useState(false);

  const sendToViber = async (forceResend = false) => {
    if (postStatus !== 'published') {
      setStatus('error');
      setErrorMessage('Само публикувани постове могат да се изпращат към Viber');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/viber/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogPostId: postId,
          forceResend,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        // Reset success state after 3 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        if (data.canForceResend) {
          setStatus('already-sent');
          setCanForceResend(true);
          setErrorMessage(data.error || 'Вече е изпратено към Viber');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Грешка при изпращане');
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Неизвестна грешка');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'already-sent' && canForceResend) {
      // Ask for confirmation to resend
      const confirmed = confirm(
        `"${postTitle}" вече е изпратена към Viber.\n\nСигурни ли сте че искате да я изпратите отново?`
      );
      if (confirmed) {
        await sendToViber(true);
      }
    } else {
      await sendToViber(false);
    }
  };

  // Don't show button for non-published posts
  if (postStatus !== 'published') {
    return null;
  }

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`p-2 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={
          status === 'success'
            ? 'Изпратено успешно!'
            : status === 'already-sent'
            ? 'Вече е изпратено (кликни за повторно изпращане)'
            : status === 'error'
            ? errorMessage
            : 'Изпрати към Viber канала'
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        ) : status === 'error' || status === 'already-sent' ? (
          <AlertCircle
            className={`w-4 h-4 ${
              status === 'already-sent' ? 'text-yellow-400' : 'text-red-400'
            }`}
          />
        ) : (
          <Send className="w-4 h-4 text-purple-400" />
        )}
      </button>

      {/* Tooltip with error message */}
      {(status === 'error' || status === 'already-sent') && errorMessage && (
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
          <div className="bg-zinc-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg border border-zinc-700 max-w-xs whitespace-normal">
            {errorMessage}
            {status === 'already-sent' && (
              <div className="mt-1 text-zinc-400">
                Кликни отново за повторно изпращане
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
