"use client";

import { useState } from "react";
import { Check, X, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { PLAN_CONFIGS } from "@/lib/config/plans";
import type { User } from "@supabase/supabase-js";

interface PricingCardsProps {
  user: User | null;
}

export function PricingCards({ user }: PricingCardsProps) {
  const [currency, setCurrency] = useState<'bgn' | 'eur'>('bgn');

  const currencySymbol = currency === 'bgn' ? 'лв' : '€';
  const basicPrice = PLAN_CONFIGS.basic.price[currency];
  const ultimatePrice = PLAN_CONFIGS.ultimate.price[currency];

  return (
    <>
      {/* Currency Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 glass-card p-1 rounded-lg">
          <button
            onClick={() => setCurrency('bgn')}
            className={`px-4 py-2 rounded-md transition-all font-medium ${
              currency === 'bgn'
                ? 'bg-accent-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            BGN (лв)
          </button>
          <button
            onClick={() => setCurrency('eur')}
            className={`px-4 py-2 rounded-md transition-all font-medium ${
              currency === 'eur'
                ? 'bg-accent-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            EUR (€)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="glass-card p-6">
          <div>
            <h3 className="text-2xl font-bold text-zinc-50">Free</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-100">0 {currencySymbol}</span>
              <span className="text-zinc-400">/месец</span>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <p className="text-zinc-400 text-sm">
              Перфектен за начинаещи
            </p>
            <ul className="space-y-3">
              <Feature text="Дневен хороскоп" included />
              <Feature text="Карта на деня" included />
              <Feature text="Таро четения" included={false} />
              <Feature text="Digital Oracle (AI)" included={false} />
              <Feature text="Седмични прогнози" included={false} />
            </ul>
            {user ? (
              <button
                disabled
                className="w-full px-4 py-3 bg-zinc-800 text-zinc-400 rounded-lg cursor-not-allowed"
              >
                Текущ план
              </button>
            ) : (
              <Link
                href="/auth/register"
                className="block w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-center"
              >
                Започни безплатно
              </Link>
            )}
          </div>
        </div>

        {/* Basic Plan */}
        <div className="glass-card border-blue-500/30 relative p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Популярен
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-50 flex items-center gap-2">
              <Crown className="w-5 h-5 text-blue-400" />
              Basic
            </h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-100">
                {basicPrice.toFixed(2)} {currencySymbol}
              </span>
              <span className="text-zinc-400">/месец</span>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <p className="text-zinc-400 text-sm">
              За редовни потребители
            </p>
            <ul className="space-y-3">
              <Feature text="Дневен хороскоп" included />
              <Feature text="Карта на деня" included />
              <Feature text="3 таро четения/ден" included />
              <Feature text="3 въпроса към Oracle/ден" included />
              <Feature text="Седмични прогнози" included />
              <Feature text="Приоритетна поддръжка" included />
            </ul>
            {user ? (
              <CheckoutButton
                priceId="basic"
                currency={currency}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              />
            ) : (
              <Link
                href="/auth/register"
                className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center font-semibold"
              >
                Започни сега
              </Link>
            )}
          </div>
        </div>

        {/* Ultimate Plan */}
        <div className="glass-card border-accent-500/30 relative p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs px-3 py-1 rounded-full">
              Най-добра стойност
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-50 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-400" />
              Ultimate
            </h3>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-100">
                {ultimatePrice.toFixed(2)} {currencySymbol}
              </span>
              <span className="text-zinc-400">/месец</span>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <p className="text-zinc-400 text-sm">
              Пълен духовен опит
            </p>
            <ul className="space-y-3">
              <Feature text="Дневен хороскоп" included />
              <Feature text="Карта на деня" included />
              <Feature text="Неограничени таро четения" included />
              <Feature text="10 въпроса към Oracle/ден" included />
              <Feature text="Седмични и месечни прогнози" included />
              <Feature text="Натална астрологична карта" included />
              <Feature text="Синастрия - съвместимост с партньор" included />
              <Feature text="VIP поддръжка" included />
            </ul>
            {user ? (
              <CheckoutButton
                priceId="ultimate"
                currency={currency}
                className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
              />
            ) : (
              <Link
                href="/auth/register"
                className="block w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-center font-semibold"
              >
                Започни сега
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Feature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
      )}
      <span className={included ? "text-zinc-200" : "text-zinc-500"}>
        {text}
      </span>
    </li>
  );
}
