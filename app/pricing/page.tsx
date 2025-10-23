import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";
import { Metadata } from "next";
import { StructuredData, getSubscriptionSchema } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/ui/gradient-text";

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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-zinc-50">Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-zinc-100">0 лв</span>
                <span className="text-zinc-400">/месец</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Basic Plan */}
          <Card className="glass-card border-blue-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                Популярен
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-400" />
                Basic
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-zinc-100">9.99 лв</span>
                <span className="text-zinc-400">/месец</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Ultimate Plan */}
          <Card className="glass-card border-accent-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs px-3 py-1 rounded-full">
                Най-добра стойност
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-400" />
                Ultimate
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-zinc-100">
                  19.99 лв
                </span>
                <span className="text-zinc-400">/месец</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-50 text-center mb-8">
            Често задавани въпроси
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Мога ли да сменя плана си?"
              answer="Да, можеш да смениш плана си по всяко време. Промените влизат в сила веднага."
            />
            <FAQItem
              question="Мога ли да откажа абонамента си?"
              answer="Да, можеш да откажеш абонамента си по всяко време. Ще запазиш достъп до края на текущия период."
            />
            <FAQItem
              question="Какви методи за плащане приемате?"
              answer="Приемаме всички основни кредитни/дебитни карти чрез Stripe."
            />
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-zinc-100 mb-2">{question}</h3>
        <p className="text-zinc-400 text-sm">{answer}</p>
      </CardContent>
    </Card>
  );
}
