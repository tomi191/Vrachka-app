import { createClient } from "@/lib/supabase/server";
import { Check, X, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { Metadata } from "next";
import { StructuredData, getSubscriptionSchema } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MysticBackground } from "@/components/background/MysticBackground";
import { GradientText } from "@/components/ui/gradient-text";
import { BentoTestimonials } from "@/components/landing/BentoTestimonials";
import { ComparisonTable } from "@/components/landing/ComparisonTable";

export const metadata: Metadata = {
  title: 'Цени',
  description: 'Избери най-подходящия план за теб. Безплатен план, Basic (9.99 лв/месец) или Ultimate (19.99 лв/месец). Дневни хороскопи, таро четения и AI оракул за духовно развитие.',
  openGraph: {
    title: 'Цени | Vrachka',
    description: 'Избери най-подходящия план за теб. От безплатен до Ultimate план с неограничени таро четения и AI консултации.',
    url: '/pricing',
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <StructuredData data={getSubscriptionSchema('basic')} />
      <StructuredData data={getSubscriptionSchema('ultimate')} />
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <MysticBackground />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Избери своя план
              </GradientText>
            </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Отключи пълния потенциал на Vrachka с Premium функции
          </p>
        </div>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="glass-card p-6">
            <div>
              <h3 className="text-2xl font-bold text-zinc-50">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-zinc-100">0 лв</span>
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
                <span className="text-4xl font-bold text-zinc-100">9.99 лв</span>
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
                  19.99 лв
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
                <Feature text="Персонализирани съвети" included />
                <Feature text="VIP поддръжка" included />
              </ul>
              {user ? (
                <CheckoutButton
                  priceId="ultimate"
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

        {/* Testimonials */}
        <BentoTestimonials />

        <div className="max-w-7xl mx-auto px-4">
        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Sparkles className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Често задавани въпроси
            </h2>
            <p className="text-xl text-zinc-400">
              Отговори на най-честите въпроси за цените
            </p>
          </div>

          <div className="space-y-4">
            <details className="glass-card group overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-semibold text-zinc-50">
                  Мога ли да сменя плана си?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Да, можеш да смениш плана си по всяко време. Промените влизат в сила веднага и ще бъдеш таксуван пропорционално на новия план.
              </div>
            </details>

            <details className="glass-card group overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-semibold text-zinc-50">
                  Мога ли да откажа абонамента си?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Да, можеш да откажеш абонамента си по всяко време от твоя dashboard. Ще запазиш достъп до края на текущия платен период. Няма скрити такси или задължения.
              </div>
            </details>

            <details className="glass-card group overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-semibold text-zinc-50">
                  Какви методи за плащане приемате?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Приемаме всички основни кредитни и дебитни карти (Visa, Mastercard, American Express) чрез сигурната платформа Stripe. Всички плащания са криптирани и защитени.
              </div>
            </details>

            <details className="glass-card group overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-semibold text-zinc-50">
                  Има ли безплатен пробен период?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Безплатният план е винаги достъпен без лимит на време! Можеш да го използваш колкото искаш и да upgrade-неш към Premium когато си готов за повече функции.
              </div>
            </details>

            <details className="glass-card group overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-semibold text-zinc-50">
                  Защитени ли са моите данни?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Абсолютно. Всички твои лични данни и плащания са криптирани с индустриални стандарти. Спазваме GDPR регулациите и никога не споделяме информация с трети страни.
              </div>
            </details>
          </div>
        </div>

        </div>
        <Footer />
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
