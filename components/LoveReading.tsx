"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { playShuffleSound, playFlipSound, playRevealSound } from "@/lib/sounds";

interface TarotCard {
  id: number;
  name: string;
  name_bg: string;
  image_url: string;
  reversed: boolean;
  position: string;
  upright_meaning: string;
  reversed_meaning?: string;
  interpretation: string;
  advice: string;
}

interface LoveReadingData {
  spreadType: string;
  cards: TarotCard[];
  overall: string;
  conclusion: string;
  remaining: number;
  limit: number;
}

export function LoveReading({ hasAccess }: { hasAccess: boolean }) {
  const [reading, setReading] = useState<LoveReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  async function pullCards() {
    if (!hasAccess) {
      setError("Това четене е достъпно само за Ultimate абонати");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsShuffling(true);
      setRevealedCards([]);

      playShuffleSound();

      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadType: "love" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to pull cards");
      }

      const data = await response.json();

      setTimeout(() => {
        setIsShuffling(false);
        setReading(data);

        [0, 1, 2, 3, 4].forEach((index) => {
          setTimeout(() => {
            playFlipSound();
            setRevealedCards((prev) => [...prev, index]);

            if (index === 4) {
              setTimeout(() => playRevealSound(), 300);
            }
          }, index * 600);
        });
      }, 1500);
    } catch (err) {
      console.error("Love reading error:", err);
      setError(err instanceof Error ? err.message : "Грешка при теглене на карти");
      setIsShuffling(false);
    } finally {
      setLoading(false);
    }
  }

  if (reading && revealedCards.length === 5) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Link
          href="/tarot"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Link>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-zinc-50">
              Любовно четене
            </h2>
          </div>
          <p className="text-zinc-400 text-sm">
            Оставащи четения днес: {reading.remaining} / {reading.limit}
          </p>
        </div>

        {/* Five Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {reading.cards.map((card, index) => (
            <div key={index} className="space-y-2">
              <div
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image
                  src={card.image_url}
                  alt={card.name_bg}
                  fill
                  sizes="(max-width: 768px) 250px, 250px"
                  className={`object-cover ${
                    card.reversed ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-red-300">
                  {card.position}
                </p>
                <p className="text-xs text-zinc-400 mt-1">{card.name_bg}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Reading */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Общ анализ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/50">
              <p className="text-zinc-200 text-sm leading-relaxed">
                {reading.overall}
              </p>
            </div>

            {reading.cards.map((card, index) => (
              <div key={index} className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="relative flex-shrink-0 w-16 h-24 rounded overflow-hidden shadow-lg"
                    style={{ transform: card.reversed ? 'rotate(180deg)' : 'none' }}
                  >
                    <Image
                      src={card.image_url}
                      alt={card.name_bg}
                      fill
                      sizes="(max-width: 768px) 250px, 250px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-red-300 mb-1">
                      {card.position}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {card.name_bg} {card.reversed && <span className="text-red-400">(Обърната)</span>}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  {card.interpretation}
                </p>
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Съвет:</p>
                  <p className="text-zinc-400 text-sm">{card.advice}</p>
                </div>
              </div>
            ))}

            <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/50">
              <h4 className="text-sm font-semibold text-red-300 mb-2">
                Заключение
              </h4>
              <p className="text-zinc-200 text-sm leading-relaxed">
                {reading.conclusion}
              </p>
            </div>
          </CardContent>
        </Card>

        <button
          onClick={() => {
            setReading(null);
            setRevealedCards([]);
          }}
          className="w-full px-4 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800/50 transition-colors"
        >
          Ново четене
        </button>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-red-500/30">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                Ultimate Feature
              </h3>
              <p className="text-zinc-400 mb-6">
                Любовното четене е достъпно само за Ultimate абонати
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
              >
                Виж Ultimate плана
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Любовно четене
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isShuffling || (reading && revealedCards.length < 5) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map((index) => {
                  const isRevealed = revealedCards.includes(index);
                  const card = reading?.cards[index];

                  return (
                    <div key={index} className="relative aspect-[2/3]" style={{ height: "200px" }}>
                      {isShuffling ? (
                        <div className="absolute inset-0">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
                              style={{
                                animation: `shuffle-${i % 2} 1.5s ease-in-out infinite`,
                                animationDelay: `${(index * 0.15 + i * 0.1)}s`,
                                zIndex: 3 - i,
                              }}
                            >
                              <Image
                                src="/Tarot/back.webp"
                                alt="Shuffle"
                                fill
                                sizes="250px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          <style jsx>{`
                            @keyframes shuffle-0 {
                              0%, 100% { transform: translate(0, 0) rotate(0deg); }
                              25% { transform: translate(-15px, -10px) rotate(-8deg); }
                              50% { transform: translate(15px, 8px) rotate(6deg); }
                              75% { transform: translate(-10px, 10px) rotate(-5deg); }
                            }
                            @keyframes shuffle-1 {
                              0%, 100% { transform: translate(0, 0) rotate(0deg); }
                              25% { transform: translate(12px, -8px) rotate(7deg); }
                              50% { transform: translate(-18px, 6px) rotate(-6deg); }
                              75% { transform: translate(10px, 12px) rotate(4deg); }
                            }
                          `}</style>
                        </div>
                      ) : isRevealed && card ? (
                        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700">
                          <Image
                            src={card.image_url}
                            alt={card.name_bg}
                            fill
                            sizes="(max-width: 768px) 250px, 250px"
                            className={`object-cover ${
                              card.reversed ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-xl">
                          <Image
                            src="/Tarot/back.webp"
                            alt="Card back"
                            fill
                            sizes="250px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-sm text-zinc-400">
                {isShuffling
                  ? "Размесване на картите..."
                  : `Разкриване ${revealedCards.length + 1} / 5...`}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {["Ти", "Партньорът", "Връзката", "Предизвикателства", "Потенциал"].map((label, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                      <Image
                        src="/Tarot/back.webp"
                        alt={label}
                        fill
                        sizes="250px"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-center font-semibold text-red-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={pullCards}
                disabled={loading}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Тегли 5 карти...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Разкрий любовните карти
                  </>
                )}
              </button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
        <h4 className="text-sm font-semibold text-zinc-200 mb-2">
          Какво представлява Любовното четене?
        </h4>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li>• <strong>Ти:</strong> Твоите чувства и емоции</li>
          <li>• <strong>Партньорът:</strong> Чувствата на другия</li>
          <li>• <strong>Връзката:</strong> Текущата динамика между вас</li>
          <li>• <strong>Предизвикателства:</strong> Какво трябва да преодолеете</li>
          <li>• <strong>Потенциал:</strong> Накъде се насочва връзката</li>
        </ul>
      </div>
    </div>
  );
}
