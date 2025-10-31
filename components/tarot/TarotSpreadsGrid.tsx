"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Heart, Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { HoverCardWrapper } from "@/components/ui/hover-card-wrapper";
import { SignupPromptDialog } from "@/components/auth/SignupPromptDialog";
import type { User } from "@supabase/supabase-js";
import type { PlanType } from "@/lib/config/plans";

interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  imageUrl: string;
  plan: PlanType;
  planLabel: string;
  planBadge: string;
  features: string[];
  url: string; // URL to redirect to when accessing the spread
}

const tarotSpreads: TarotSpread[] = [
  {
    id: 'single',
    name: 'Карта на Деня',
    description: 'Изтегли една карта за насоки за деня',
    cardCount: 1,
    imageUrl: '/images/tarot/spreads/card-of-the-day.png',
    plan: 'free',
    planLabel: 'Безплатно',
    planBadge: '🆓 FREE',
    features: ['Основно тълкуване', 'Обърната/права позиция', 'Дневни съвети'],
    url: '/tarot-readings',
  },
  {
    id: 'three-card',
    name: 'Три Карти',
    description: 'Минало, Настояще, Бъдеще',
    cardCount: 3,
    imageUrl: '/images/tarot/spreads/three-cards.png',
    plan: 'basic',
    planLabel: 'Basic или Ultimate',
    planBadge: '💙 BASIC',
    features: ['Пълна времева линия', 'Детайлни тълкувания', 'Препоръки за действие'],
    url: '/tarot-readings/three-card',
  },
  {
    id: 'love',
    name: 'Любовна Подредба',
    description: 'Пет карти за любов и връзки',
    cardCount: 5,
    imageUrl: '/images/tarot/spreads/love-spread.png',
    plan: 'ultimate',
    planLabel: 'Само Ultimate',
    planBadge: '👑 ULTIMATE',
    features: ['Ти, партньорът, връзката', 'Предизвикателства и потенциал', 'Детайлен анализ'],
    url: '/tarot-readings/love',
  },
  {
    id: 'career',
    name: 'Кариерна Подредба',
    description: 'Пет карти за кариера и успех',
    cardCount: 5,
    imageUrl: '/images/tarot/spreads/career-spread.png',
    plan: 'ultimate',
    planLabel: 'Само Ultimate',
    planBadge: '👑 ULTIMATE',
    features: ['Текуща позиция и възможности', 'Предизвикателства и съвети', 'Очакван резултат'],
    url: '/tarot-readings/career',
  },
];

interface TarotSpreadsGridProps {
  user: User | null;
  userPlan: PlanType;
}

// Helper function to check if user has access to a spread
function hasAccess(userPlan: PlanType, requiredPlan: PlanType): boolean {
  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    basic: 1,
    ultimate: 2,
  };
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}

export function TarotSpreadsGrid({ user, userPlan }: TarotSpreadsGridProps) {
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  const handleFreeSpreadClick = () => {
    if (!user) {
      setShowSignupDialog(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tarotSpreads.map((spread) => {
          const Icon = spread.icon;
          const userHasAccess = user && hasAccess(userPlan, spread.plan);
          const isLocked = !userHasAccess;

          return (
            <HoverCardWrapper key={spread.id} className="h-full">
              <div className={`glass-card card-hover h-full p-6 ${
                spread.plan === 'free' ? 'border-2 border-green-500/30' :
                spread.plan === 'basic' ? 'border-2 border-blue-500/30' :
                'border-2 border-purple-500/30'
              }`}>
                {/* Plan Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                    {spread.planBadge}
                  </span>
                  {isLocked && <Lock className="w-4 h-4 text-zinc-500" />}
                </div>

                {/* Image */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={spread.imageUrl}
                    alt={spread.name}
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                {/* Title */}
                <h3 className="text-center text-xl font-bold text-zinc-50 mb-2">
                  {spread.name}
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-zinc-400 mb-4">
                  {spread.description}
                </p>

                {/* Card Count */}
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-zinc-950/50 rounded-full text-xs font-medium text-zinc-300">
                    {spread.cardCount} {spread.cardCount === 1 ? 'карта' : 'карти'}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {spread.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="w-1 h-1 rounded-full bg-accent-400"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {user && userHasAccess ? (
                  // User is logged in AND has access → redirect to spread
                  <Link href={spread.url} className="block">
                    <button className="w-full px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors">
                      Изтегли Карта
                    </button>
                  </Link>
                ) : spread.plan === 'free' && !user ? (
                  // Free spread but user is NOT logged in → show signup dialog
                  <button
                    onClick={handleFreeSpreadClick}
                    className="w-full px-4 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Изтегли Карта
                  </button>
                ) : user ? (
                  // User is logged in but NO access → redirect to pricing
                  <Link href="/pricing" className="block">
                    <button className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Отключи</span>
                    </button>
                  </Link>
                ) : (
                  // User is NOT logged in → redirect to registration
                  <Link href="/auth/register?redirect=tarot" className="block">
                    <button className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Отключи</span>
                    </button>
                  </Link>
                )}
              </div>
            </HoverCardWrapper>
          );
        })}
      </div>

      {/* Signup Prompt Dialog */}
      <SignupPromptDialog
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        title="Безплатна Таро Карта Всеки Ден"
        description="Регистрирай се за да получиш достъп до безплатни таро четения и още много функции"
        benefits={[
          "🎴 1 безплатна таро карта на ден",
          "⭐ Достъп до дневни хороскопи за всички зодии",
          "📜 История на твоите четения",
          "🔮 Персонализирани астрологични прогнози",
        ]}
        feature="tarot-readings"
      />
    </>
  );
}
