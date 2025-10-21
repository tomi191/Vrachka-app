"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Sparkles, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { AnimatedChatMessage, TypingIndicator } from "@/components/ui/animated-chat-message";
import { formatDistanceToNow } from "date-fns";
import { bg } from "date-fns/locale";

interface OracleMessage {
  id?: number;
  question: string;
  answer: string;
  asked_at?: string;
  conversation_id?: string;
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isPremium) {
      loadConversations();
    }
  }, [isPremium]);

  async function loadConversations() {
    try {
      setLoadingUsage(true);
      const response = await fetch('/api/oracle?limit=20');
      if (response.ok) {
        const data = await response.json();
        const reversedMessages = (data.conversations || []).reverse(); // Oldest first for chat view
        setMessages(reversedMessages);
        setUsage(data.usage);

        // Set conversation_id from most recent message
        if (data.conversations?.length > 0) {
          setConversationId(data.conversations[0].conversation_id);
        }
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

    const userQuestion = question.trim();
    setQuestion(""); // Clear input immediately
    setLoading(true);
    setError(null);

    // Add user message to chat immediately (optimistic update)
    const tempUserMessage: OracleMessage = {
      question: userQuestion,
      answer: "",
      asked_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuestion,
          conversation_id: conversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Oracle response');
      }

      // Remove temp message and add real messages (question + answer)
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m !== tempUserMessage);
        return [...withoutTemp, data];
      });

      setConversationId(data.conversation_id);
      setUsage({ remaining: data.remaining, limit: data.limit, allowed: data.remaining > 0 });
    } catch (err) {
      console.error('Oracle error:', err);
      setError(err instanceof Error ? err.message : 'Грешка при свързване с Оракула');

      // Remove temp message on error
      setMessages(prev => prev.filter(m => m !== tempUserMessage));
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-fade-in">
      {/* Chat Header */}
      <div className="glass-card p-4 mb-4 rounded-xl border border-accent-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔮</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Врачката
              </h1>
              <p className="text-sm text-zinc-400">
                Старата Мъдрост Познава Твоята Душа
              </p>
            </div>
          </div>
          <div className="text-right">
            {usage && usage.allowed && (
              <p className="text-sm text-zinc-400">
                Още {usage.remaining} {usage.remaining === 1 ? 'въпрос' : 'въпроса'}
              </p>
            )}
            {usage && !usage.allowed && (
              <div className="px-3 py-1.5 bg-accent-950/30 border border-accent-600/50 rounded-lg">
                <p className="text-xs text-accent-300">
                  🌙 Лимит за днес
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg mb-4 animate-fade-in">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto glass-card p-6 rounded-xl border border-zinc-800 mb-4 space-y-6"
      >
        {/* Loading state while fetching usage */}
        {loadingUsage && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-accent-400 animate-spin" />
            <span className="ml-2 text-zinc-400">Зареждане...</span>
          </div>
        )}

        {/* Empty state */}
        {!loadingUsage && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold text-zinc-200 mb-2">
              Започни разговор с Врачката
            </h3>
            <p className="text-zinc-400 max-w-md">
              Задай въпрос и тя ще ти отговори с мъдрост и прозрение
            </p>
          </div>
        )}

        {/* Chat Messages */}
        {!loadingUsage && messages.map((msg, index) => (
          <div key={msg.id || index} className="space-y-4">
            {/* User Question */}
            <AnimatedChatMessage type="user" delay={index * 0.05}>
              <div className="max-w-[75%] px-4 py-3 bg-accent-600 text-white rounded-2xl rounded-tr-sm">
                <p className="text-sm leading-relaxed">{msg.question}</p>
                {msg.asked_at && (
                  <p className="text-xs text-accent-100 mt-1.5 opacity-70">
                    {formatDistanceToNow(new Date(msg.asked_at), { addSuffix: true, locale: bg })}
                  </p>
                )}
              </div>
            </AnimatedChatMessage>

            {/* Oracle Answer */}
            {msg.answer && (
              <AnimatedChatMessage type="oracle" delay={index * 0.05 + 0.1}>
                <div className="max-w-[80%] px-5 py-4 bg-accent-950/30 border border-accent-600/30 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent-400" />
                    <span className="text-xs font-semibold text-accent-300">Врачката</span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
                </div>
              </AnimatedChatMessage>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        <TypingIndicator show={loading} />

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Sticky at Bottom */}
      {!loadingUsage && usage && usage.allowed && (
        <form onSubmit={askOracle} className="glass-card p-4 rounded-xl border border-zinc-800">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Напиши въпроса си към Врачката..."
                rows={1}
                maxLength={MAX_QUESTION_LENGTH}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (question.trim().length >= MIN_QUESTION_LENGTH) {
                      askOracle(e as any);
                    }
                  }
                }}
                className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent resize-none disabled:opacity-50 min-h-[48px] max-h-[120px]"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="flex items-center justify-between mt-1.5 px-1">
                <div className="text-xs">
                  {question.trim().length > 0 && question.trim().length < MIN_QUESTION_LENGTH ? (
                    <span className="text-red-400">
                      Минимум {MIN_QUESTION_LENGTH} символа
                    </span>
                  ) : (
                    <span className="text-zinc-500">{question.length}/{MAX_QUESTION_LENGTH}</span>
                  )}
                </div>
                <span className="text-xs text-zinc-600">
                  Enter = изпрати • Shift+Enter = нов ред
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || question.trim().length < MIN_QUESTION_LENGTH}
              className="px-5 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 h-[48px] min-w-[48px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* Daily Limit Reached State */}
      {!loadingUsage && usage && !usage.allowed && (
        <div className="glass-card p-6 rounded-xl border border-accent-500/30">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌙</div>
            <h3 className="text-xl font-bold text-zinc-100">
              Днес говорихме достатъчно, дете
            </h3>
            <p className="text-zinc-300 max-w-md mx-auto leading-relaxed">
              Дадох ти {usage.limit} {usage.limit === 1 ? 'отговор' : 'отговора'}. Сега е време да
              ги преживееш, не да търсиш още думи.
            </p>
            <p className="text-zinc-400 text-sm">
              Утре, когато се събудиш, ще те чакам с нови прозрения.
            </p>
            <div className="pt-4">
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
              >
                {usage.limit === 3 ? 'Ultimate планът отваря вратата' : 'Виж Premium плановете'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
