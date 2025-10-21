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

const MIN_QUESTION_LENGTH = 5;
const MAX_QUESTION_LENGTH = 500;

export function OracleChat({ isPremium }: OracleChatProps) {
  const [messages, setMessages] = useState<OracleMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<OracleUsage | null>(null);

  useEffect(() => {
    if (isPremium) {
      loadConversations();
    }
  }, [isPremium]);

  async function loadConversations() {
    try {
      setLoadingUsage(true);
      const response = await fetch('/api/oracle?limit=5');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversations || []);
        setUsage(data.usage);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingUsage(false);
    }
  }

  async function askOracle(e: React.FormEvent) {
    e.preventDefault();

    if (!question.trim() || loading) return;

    // Validate minimum length
    if (question.trim().length < MIN_QUESTION_LENGTH) {
      setError(`Въпросът трябва да е поне ${MIN_QUESTION_LENGTH} символа`);
      return;
    }

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
            🔮 Врачката
          </h1>
          <p className="text-zinc-400">
            Старата Мъдрост Познава Твоята Душа
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
                  Мъдра Българска Врачка
                </h2>
                <p className="text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Дете, виждам че душата ти търси отговори. Това е добре.
                  <br /><br />
                  Врачката отваря врати само на тези, които са готови да влязат.
                  Безплатното пътешествие показва само пътя - да видиш дали искаш да вървиш.
                </p>
              </div>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                <p className="text-sm text-zinc-400 font-semibold mb-3">
                  Какво питат хората:
                </p>
                {[
                  "Да приема ли новата работа?",
                  "Обича ли ме наистина?",
                  "Какво трябва да променя в живота си?",
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
                <span className="text-sm font-semibold">Само за готовите</span>
              </div>

              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-all font-semibold text-lg shadow-lg text-center"
                >
                  Влез при Врачката
                </Link>
                <p className="text-xs text-zinc-500">
                  Basic: 3 въпроса/ден • Ultimate: 10 въпроса/ден + дълбоки прозрения
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
          🔮 Врачката
        </h1>
        <p className="text-zinc-400">
          Старата Мъдрост Познава Твоята Душа
        </p>
        {usage && usage.allowed && (
          <p className="text-sm text-zinc-500">
            Днес можеш да питаш още {usage.remaining} {usage.remaining === 1 ? 'път' : 'пъти'}
          </p>
        )}
        {usage && !usage.allowed && (
          <div className="inline-block px-4 py-2 bg-accent-950/30 border border-accent-600/50 rounded-lg">
            <p className="text-sm text-accent-300">
              🌙 Днес говорихме достатъчно, дете
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Compassionate closure when no questions left */}
      {usage && !usage.allowed && (
        <Card className="glass-card border-accent-500/30">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="text-6xl">🌙</div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-zinc-100">
                  Днес говорихме достатъчно, дете
                </h3>
                <p className="text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Дадох ти {usage.limit} {usage.limit === 1 ? 'отговор' : 'отговора'}. Сега е време да
                  ги преживееш, не да търсиш още думи.
                  <br /><br />
                  Утре, когато се събудиш, ще те чакам с нови прозрения.
                </p>
              </div>

              <div className="space-y-3">
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      const historySection = document.getElementById('oracle-history');
                      historySection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-6 py-3 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors"
                  >
                    Прегледай днешните разговори
                  </button>
                )}
                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-3">
                    ~ За неограничена мъдрост ~
                  </p>
                  <Link
                    href="/pricing"
                    className="block w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    {usage.limit === 3 ? 'Ultimate планът отваря вратата' : 'Виж Premium плановете'}
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state while fetching usage */}
      {loadingUsage && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
              <span className="text-zinc-400">Зареждане...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question form - only show if has remaining questions */}
      {!loadingUsage && usage && usage.allowed && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent-400" />
              Задай въпрос на Врачката
            </CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={askOracle} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Какво те тревожи? Задай въпроса си към Врачката..."
              rows={4}
              maxLength={MAX_QUESTION_LENGTH}
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-600 resize-none disabled:opacity-50"
            />
            <div className="flex items-center justify-between">
              <div className="text-xs">
                {question.trim().length > 0 && question.trim().length < MIN_QUESTION_LENGTH ? (
                  <span className="text-red-400">
                    Минимум {MIN_QUESTION_LENGTH} символа (още {MIN_QUESTION_LENGTH - question.trim().length})
                  </span>
                ) : (
                  <span className="text-zinc-500">{question.length} / {MAX_QUESTION_LENGTH}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || question.trim().length < MIN_QUESTION_LENGTH}
                className="px-6 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Питам Врачката...
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
      )}

      {messages.length > 0 && (
        <div id="oracle-history" className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-200">Твоите разговори с Врачката</h2>
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
                    Врачката казва:
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

      {messages.length === 0 && !loading && usage && usage.allowed && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-zinc-400">Още нямаш разговори с Врачката</p>
            <p className="text-sm text-zinc-500 mt-2">Задай първия си въпрос горе и тя ще ти отговори</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
