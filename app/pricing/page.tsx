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
import { PricingCards } from "./PricingCards";

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

        {/* Pricing Cards with Currency Selector */}
        <PricingCards user={user} />

        {/* Testimonials */}
        <BentoTestimonials />

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto px-4">
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
                  Каква е политиката за възстановяване на средства?
                </span>
                <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                Имаш 14-дневен период за връщане на средства според EU закона (ако не си използвал услугите). За повече детайли вижте нашата{" "}
                <Link href="/refund-policy" className="text-accent-400 hover:text-accent-300 underline">
                  Политика за възстановяване
                </Link>.
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

        <Footer />
      </div>
    </div>
    </>
  );
}
