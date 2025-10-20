"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ArrowLeft, Heart, Briefcase, Crown, Sparkles } from "lucide-react";
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

interface ThreeCardReadingData {
  spreadType: string;
  cards: TarotCard[];
  overall: string;
  conclusion: string;
  remaining: number;
  limit: number;
}

type PlanType = 'free' | 'basic' | 'ultimate';

export function ThreeCardSpread({ isPremium, planType }: { isPremium: boolean; planType: PlanType }) {
  const [reading, setReading] = useState<ThreeCardReadingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  async function pullCards() {
    if (!isPremium) {
      setError("Това четене е достъпно само за Premium абонати");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsShuffling(true);
      setRevealedCards([]);

      // Play shuffle sound
      playShuffleSound();

      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadType: "three-card" }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.premium) {
          throw new Error("Това четене е достъпно само за Premium абонати");
        }
        throw new Error(data.error || "Failed to pull cards");
      }

      const data = await response.json();

      // Shuffle animation duration
      setTimeout(() => {
        setIsShuffling(false);
        setReading(data);

        // Reveal cards one by one
        [0, 1, 2].forEach((index) => {
          setTimeout(() => {
            playFlipSound();
            setRevealedCards((prev) => [...prev, index]);

            // Play reveal sound on last card
            if (index === 2) {
              setTimeout(() => playRevealSound(), 300);
            }
          }, index * 800);
        });
      }, 1500);
    } catch (err) {
      console.error("Three card error:", err);
      setError(err instanceof Error ? err.message : "Грешка при теглене на карти");
      setIsShuffling(false);
    } finally {
      setLoading(false);
    }
  }

  if (reading && revealedCards.length === 3) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Link
          href="/tarot"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Link>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">
            Три Карти - Минало, Настояще, Бъдеще
          </h2>
          <p className="text-zinc-400 text-sm">
            Оставащи четения днес: {reading.remaining} / {reading.limit}
          </p>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-3 gap-4">
          {reading.cards.map((card, index) => (
            <div key={index} className="space-y-2">
              <div
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
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
                <p className="text-sm font-semibold text-accent-300">
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
            <div className="p-4 bg-accent-950/30 rounded-lg border border-accent-800/50">
              <p className="text-zinc-200 text-sm leading-relaxed">
                {reading.overall}
              </p>
            </div>

            {reading.cards.map((card, index) => (
              <div key={index} className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                <div className="flex items-start gap-3 mb-3">
                  {/* Card thumbnail */}
                  <div
                    className="relative flex-shrink-0 w-16 h-24 rounded overflow-hidden shadow-lg"
                    style={{
                      transform: card.reversed ? 'rotate(180deg)' : 'none'
                    }}
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
                    <h4 className="text-sm font-semibold text-accent-300 mb-1">
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

            <div className="p-4 bg-accent-950/30 rounded-lg border border-accent-800/50">
              <h4 className="text-sm font-semibold text-accent-300 mb-2">
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

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-accent-500/30">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-accent-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                Premium Feature
              </h3>
              <p className="text-zinc-400 mb-6">
                Три Карти четенето е достъпно само за Premium абонати
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
              >
                Виж Premium плановете
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
          <CardTitle className="text-zinc-50">Три Карти</CardTitle>
        </CardHeader>
        <CardContent>
          {isShuffling || (reading && revealedCards.length < 3) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => {
                  const isRevealed = revealedCards.includes(index);
                  const card = reading?.cards[index];

                  return (
                    <div
                      key={index}
                      className="relative aspect-[2/3]"
                      style={{ height: "250px" }}
                    >
                      {isShuffling ? (
                        // Shuffle animation
                        <div className="absolute inset-0">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
                              style={{
                                animation: `shuffle-${i % 2} 1.5s ease-in-out infinite`,
                                animationDelay: `${(index * 0.2 + i * 0.1)}s`,
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
                              25% { transform: translate(-20px, -15px) rotate(-10deg); }
                              50% { transform: translate(20px, 10px) rotate(8deg); }
                              75% { transform: translate(-15px, 12px) rotate(-6deg); }
                            }
                            @keyframes shuffle-1 {
                              0%, 100% { transform: translate(0, 0) rotate(0deg); }
                              25% { transform: translate(18px, -12px) rotate(9deg); }
                              50% { transform: translate(-22px, 8px) rotate(-8deg); }
                              75% { transform: translate(12px, 15px) rotate(5deg); }
                            }
                          `}</style>
                        </div>
                      ) : isRevealed && card ? (
                        // Revealed card
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
                        // Face down card
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
                  : `Разкриване ${revealedCards.length + 1} / 3...`}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {["Минало", "Настояще", "Бъдеще"].map((label, index) => (
                  <div key={index}>
                    <div
                      className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform"
                    >
                      <Image
                        src="/Tarot/back.webp"
                        alt={label}
                        fill
                        sizes="250px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-sm font-semibold text-accent-300">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={pullCards}
                disabled={loading}
                className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Тегли 3 карти...
                  </>
                ) : (
                  "Разкрий 3-те карти"
                )}
              </button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
        <h4 className="text-sm font-semibold text-zinc-200 mb-2">
          Какво представлява 3-Card Spread?
        </h4>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li>• <strong>Минало:</strong> Какво те доведе до този момент</li>
          <li>• <strong>Настояще:</strong> Текущата ти ситуация</li>
          <li>• <strong>Бъдеще:</strong> Какво те очаква напред</li>
        </ul>
      </div>

      {/* Other reading types */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-zinc-200">Други видове четене</h3>
        <PremiumFeatureCard
          title="Любовно четене"
          description="5 карти за твоята връзка и любовен живот"
          icon={<Heart className="w-8 h-8 text-red-400" />}
          planType={planType}
          requiredPlan="ultimate"
          href="/tarot/love"
        />
        <PremiumFeatureCard
          title="Кариерно четене"
          description="5 карти за професионалното ти развитие"
          icon={<Briefcase className="w-8 h-8 text-blue-400" />}
          planType={planType}
          requiredPlan="ultimate"
          href="/tarot/career"
        />
      </div>
    </div>
  );
}

function PremiumFeatureCard({
  title,
  description,
  icon,
  planType,
  requiredPlan,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  planType: PlanType;
  requiredPlan: PlanType;
  href: string;
}) {
  const hasAccess =
    (requiredPlan === 'basic' && (planType === 'basic' || planType === 'ultimate')) ||
    (requiredPlan === 'ultimate' && planType === 'ultimate');

  const getBadge = () => {
    if (requiredPlan === 'ultimate') {
      return (
        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-accent-600/20 text-accent-300 rounded-full border border-accent-500/30">
          <Sparkles className="w-3 h-3" />
          Ultimate
        </div>
      );
    }
    if (requiredPlan === 'basic') {
      return (
        <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30">
          <Crown className="w-3 h-3" />
          Basic
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card relative overflow-hidden">
      {!hasAccess && (
        <div className="absolute top-3 right-3">
          <Lock className="w-5 h-5 text-zinc-500" />
        </div>
      )}
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-zinc-100">{title}</h3>
              {getBadge()}
            </div>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>
        </div>
        {hasAccess ? (
          <Link
            href={href}
            className="block mt-4 w-full px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-sm text-center font-semibold"
          >
            Започни четене
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="block mt-4 w-full px-4 py-2 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors text-sm text-center"
          >
            {requiredPlan === 'ultimate' ? 'Upgrade до Ultimate' : 'Upgrade до Basic'}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
