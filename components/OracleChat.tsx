"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Sparkles, Send, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";

interface OracleMessage {
  id?: number;
  question: string;
  answer: string;
  asked_at?: string;
}

interface OracleUsage {
  remaining: number;
  limit: number;
  allowed: boolean;
}

interface OracleChatProps {
  isPremium: boolean;
}

export function OracleChat({ isPremium }: OracleChatProps) {
  const [messages, setMessages] = useState<OracleMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<OracleUsage | null>(null);

  useEffect(() => {
    if (isPremium) {
      loadConversations();
    }
  }, [isPremium]);

  async function loadConversations() {
    try {
      const response = await fetch('/api/oracle?limit=5');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversations || []);
        setUsage(data.usage);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }

  async function askOracle(e: React.FormEvent) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Oracle response');
      }

      setMessages(prev => [data, ...prev]);
      setQuestion("");
      setUsage({ remaining: data.remaining, limit: data.limit, allowed: data.remaining > 0 });
    } catch (err) {
      console.error('Oracle error:', err);
      setError(err instanceof Error ? err.message : 'Грешка при свързване с Оракула');
    } finally {
      setLoading(false);
    }
  }

  if (!isPremium) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Дигитален Оракул
          </h1>
          <p className="text-zinc-400">
            Задай въпрос и получи духовен съвет
          </p>
        </div>

        <Card className="glass-card border-accent-500/30">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="inline-flex p-6 bg-accent-900/20 rounded-full border border-accent-500/30">
                <Sparkles className="w-12 h-12 text-accent-400" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-zinc-100">
                  AI Асистент за Духовни Въпроси
                </h2>
                <p className="text-zinc-300 max-w-md mx-auto">
                  Попитай Дигиталния Оракул за любов, кариера, здраве или личностно
                  развитие. Получи мъдри съвети, базирани на твоята зодия и енергия.
                </p>
              </div>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                <p className="text-sm text-zinc-400 font-semibold mb-3">
                  Примерни въпроси:
                </p>
                {[
                  "Да приема ли новата работа?",
                  "Какво ме очаква в любовта?",
                  "Как да подобря енергията си?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300"
                  >
                    {q}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-accent-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold">Премиум функция</span>
              </div>

              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-all font-semibold text-lg shadow-lg text-center"
                >
                  Отключи за 9.99 лв./месец
                </Link>
                <p className="text-xs text-zinc-500">
                  Basic: 3 въпроса/ден • Ultimate: 10 въпроса/ден
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-accent-400" />
          Дигитален Оракул
        </h1>
        <p className="text-zinc-400">
          Задай въпрос и получи мъдър отговор
        </p>
        {usage && (
          <p className="text-sm text-zinc-500">
            Днес можеш да зададеш още {usage.remaining} от {usage.limit} въпроса
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent-400" />
            Задай въпрос
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={askOracle} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Какво те тревожи? Задай въпроса си..."
              rows={4}
              maxLength={500}
              disabled={loading || (usage ? !usage.allowed : false)}
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none disabled:opacity-50"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{question.length} / 500</span>
              <button
                type="submit"
                disabled={loading || !question.trim() || (usage ? !usage.allowed : false)}
                className="px-6 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Питам Оракула...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Задай въпрос
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-200">Твоите разговори</h2>
          {messages.map((msg, index) => (
            <Card key={msg.id || index} className="glass-card">
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-zinc-950/50 rounded-lg border-l-4 border-accent-600">
                  <p className="text-sm text-zinc-400 mb-1">Твоят въпрос:</p>
                  <p className="text-zinc-200">{msg.question}</p>
                </div>
                <div className="p-4 bg-accent-950/30 rounded-lg border-l-4 border-accent-400">
                  <p className="text-sm text-accent-300 mb-2 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Мъдростта на Оракула:
                  </p>
                  <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
                </div>
                {msg.asked_at && (
                  <p className="text-xs text-zinc-600 text-right">
                    {new Date(msg.asked_at).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {messages.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8 text-center">
            <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">Още нямаш разговори с Оракула</p>
            <p className="text-sm text-zinc-500 mt-2">Задай първия си въпрос горе</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
