"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CreditCard, Sparkles, Heart, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";

interface TarotCard {
  id: number;
  name: string;
  name_bg: string;
  image_url: string;
  reversed: boolean;
  position?: string;
  upright_meaning: string;
  reversed_meaning?: string;
  interpretation: string;
  advice: string;
}

interface TarotReadingData {
  spreadType: string;
  cards: TarotCard[];
  overall: string;
  conclusion: string;
  remaining: number;
  limit: number;
}

export function TarotReading() {
  const [reading, setReading] = useState<TarotReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pullCard() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadType: 'single' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to pull card');
      }

      const data = await response.json();
      setReading(data);
    } catch (err) {
      console.error('Tarot error:', err);
      setError(err instanceof Error ? err.message : 'Грешка при теглене на карта');
    } finally {
      setLoading(false);
    }
  }

  if (reading) {
    const card = reading.cards[0];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">Карта на деня</h2>
          <p className="text-zinc-400 text-sm">
            Оставащи четения днес: {reading.remaining} / {reading.limit}
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="aspect-[2/3] max-w-[250px] mx-auto mb-6 bg-gradient-to-br from-accent-900 to-accent-950 border-2 border-accent-500/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/tarot-pattern.png')] opacity-10"></div>
              <div className="text-center z-10 p-6">
                <CreditCard className="w-20 h-20 text-accent-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-100 mb-2">
                  {card.name_bg}
                </h3>
                <p className="text-sm text-zinc-400">
                  {card.name}
                </p>
                {card.reversed && (
                  <p className="text-xs text-red-400 mt-2 font-semibold">REVERSED</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <h4 className="text-sm font-semibold text-accent-300 mb-2">Значение</h4>
                <p className="text-zinc-200 text-sm leading-relaxed">
                  {card.upright_meaning}
                </p>
              </div>

              <div className="p-4 bg-accent-950/30 rounded-lg border border-accent-800/50">
                <h4 className="text-sm font-semibold text-accent-300 mb-2">Послание за теб</h4>
                <p className="text-zinc-200 text-sm leading-relaxed">
                  {card.interpretation}
                </p>
              </div>

              <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <h4 className="text-sm font-semibold text-accent-300 mb-2">Съвет</h4>
                <p className="text-zinc-200 text-sm leading-relaxed">
                  {card.advice}
                </p>
              </div>
            </div>

            <button
              onClick={() => setReading(null)}
              className="w-full mt-6 px-4 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              Затвори
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          Таро Оракул
        </h1>
        <p className="text-zinc-400">
          Открий мъдростта на древните карти
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50">Карта на деня</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/3] max-w-[200px] mx-auto mb-4 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
            <CreditCard className="w-16 h-16 text-accent-400" />
          </div>
          <button
            onClick={pullCard}
            disabled={loading}
            className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Тегли карта...
              </>
            ) : (
              'Разкрий картата'
            )}
          </button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <PremiumFeatureCard
          title="Гадане с 3 карти"
          description="Минало, настояще, бъдеще"
          icon={<Sparkles className="w-8 h-8 text-accent-400" />}
        />
        <PremiumFeatureCard
          title="Любовно четене"
          description="5 карти за твоята връзка"
          icon={<Heart className="w-8 h-8 text-red-400" />}
        />
        <PremiumFeatureCard
          title="Кариерно четене"
          description="5 карти за професионалното ти развитие"
          icon={<Briefcase className="w-8 h-8 text-blue-400" />}
        />
      </div>
    </div>
  );
}

function PremiumFeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="glass-card relative overflow-hidden">
      <div className="absolute top-3 right-3">
        <Lock className="w-5 h-5 text-zinc-500" />
      </div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div>{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="block mt-4 w-full px-4 py-2 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors text-sm text-center"
        >
          Отключи Премиум
        </Link>
      </CardContent>
    </Card>
  );
}
