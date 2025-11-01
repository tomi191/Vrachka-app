import type { Metadata } from "next";
import { Sparkles, Calculator, Heart, Briefcase, Star } from "lucide-react";
import LifePathCalculator from "@/components/numerology/LifePathCalculator";
import LifePathCard from "@/components/numerology/LifePathCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllLifePathNumbers, getLifePathMeaning } from "@/lib/numerology";

export const metadata: Metadata = {
  title: "Калкулатор за Лично Число | Нумерология | Vrachka",
  description:
    "Открий своето лично число безплатно! Изчисли жизнения си път според датата на раждане и разбери какво те прави уникален. Пълен нумерологичен анализ, съвместимост и кариерни препоръки.",
  keywords: [
    "лично число",
    "калкулатор лично число",
    "нумерология",
    "жизнен път",
    "нумерологичен анализ",
    "личен номер",
    "числата на съдбата",
    "дата на раждане",
    "безплатен калкулатор",
  ],
  openGraph: {
    title: "Калкулатор за Лично Число | Безплатна Нумерология",
    description:
      "Открий своето лично число и разбери какво те прави уникален. Пълен нумерологичен анализ според датата на раждане.",
    type: "website",
    url: "https://vrachka.eu/life-path-number",
    images: [
      {
        url: "/og-numerology.jpg",
        width: 1200,
        height: 630,
        alt: "Калкулатор за Лично Число - Vrachka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Калкулатор за Лично Число | Нумерология",
    description:
      "Открий своето лично число безплатно! Пълен нумерологичен анализ според датата на раждане.",
    images: ["/og-numerology.jpg"],
  },
  alternates: {
    canonical: "https://vrachka.eu/life-path-number",
  },
};

export default function LifePathNumberPage() {
  const allNumbers = getAllLifePathNumbers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-zinc-800/50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          {/* Badge */}
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Безплатен Нумерологичен Калкулатор
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 leading-tight">
            Открий своето
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Лично Число
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Изчисли жизнения си път според датата на раждане и разбери какво те прави уникален.
            Пълен нумерологичен анализ, съвместимост и кариерни препоръки.
          </p>

          {/* Quick Features */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: Calculator, text: "Безплатно изчисление" },
              { icon: Heart, text: "Съвместимост" },
              { icon: Briefcase, text: "Кариера" },
              { icon: Star, text: "Силни страни" },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full"
              >
                <feature.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 px-4">
        <LifePathCalculator />
      </section>

      {/* What is Life Path Number */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Какво е Лично Число?
            </h2>
            <p className="text-lg text-zinc-400">
              Личното число (Life Path Number) е най-важното число в нумерологията
            </p>
          </div>

          <div className="glass-card p-8 md:p-10 space-y-6">
            <p className="text-zinc-300 leading-relaxed">
              Личното число се изчислява от пълната дата на раждане и представлява жизнения ти път
              - твоята мисия, таланти и предизвикателства в този живот. То разкрива твоята
              истинска природа, силните ти страни и уроците, които трябва да научиш.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Твоята Мисия</h3>
                <p className="text-sm text-zinc-400">
                  Разкрива целта и посоката на живота ти
                </p>
              </div>

              <div className="p-6 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Твоите Таланти</h3>
                <p className="text-sm text-zinc-400">
                  Показва естествените ти способности и сили
                </p>
              </div>

              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Твоят Растеж</h3>
                <p className="text-sm text-zinc-400">
                  Посочва предизвикателствата, които ще те развият
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Numbers Grid */}
      <section className="py-16 px-4 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Всички Лични Числа
            </h2>
            <p className="text-lg text-zinc-400">
              Открий значението на всяко лично число от 1 до 9, включително майсторските числа 11, 22 и 33
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allNumbers.map((num) => {
              const meaning = getLifePathMeaning(num);
              if (!meaning) return null;
              return <LifePathCard key={num} data={meaning} />;
            })}
          </div>
        </div>
      </section>

      {/* How to Calculate */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Как се изчислява?
            </h2>
            <p className="text-lg text-zinc-400">
              Прост метод за изчисляване на личното число от дата на раждане
            </p>
          </div>

          <div className="glass-card p-8 md:p-10 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Запиши пълната дата на раждане
                  </h3>
                  <p className="text-zinc-400">
                    Например: 15 март 1990 (15/03/1990)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Сумирай всички цифри
                  </h3>
                  <p className="text-zinc-400">
                    1+5+0+3+1+9+9+0 = 28
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Редуцирай до единична цифра
                  </h3>
                  <p className="text-zinc-400">
                    28 → 2+8 = 10 → 1+0 = <strong className="text-purple-400">1</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-200/80 flex items-start gap-2">
                <span className="text-xl">⚡</span>
                <span>
                  <strong>Важно:</strong> Майсторските числа 11, 22 и 33 НЕ се редуцират!
                  Ако в междинното изчисление получиш 11, 22 или 33, това е твоето лично число.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Често Задавани Въпроси
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Колко е точна нумерологията?",
                a: "Нумерологията е древна метафизична наука, която изследва връзката между числата и живота. Много хора намират нумерологичните анализи за изключително точни и полезни за самопознание.",
              },
              {
                q: "Какво е майсторско число?",
                a: "Майсторските числа са 11, 22 и 33 - те носят специална духовна енергия и по-високи вибрации. Хората с майсторски числа често имат уникални таланти и предизвикателства.",
              },
              {
                q: "Може ли личното число да се промени?",
                a: "Не, личното число е постоянно и се изчислява от датата на раждане. То представлява твоята основна енергия и жизнен път през целия живот.",
              },
              {
                q: "Как да използвам информацията за личното си число?",
                a: "Използвай я за по-добро самопознание, разбиране на силните си страни и предизвикателствата, избор на кариера и партньор, както и за личностно развитие.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="glass-card p-6 group"
              >
                <summary className="text-lg font-semibold text-zinc-100 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-purple-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-zinc-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
                Готов за пълния анализ?
              </h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
                Регистрирай се безплатно и получи достъп до пълен нумерологичен анализ,
                детайлна съвместимост с други числа, кариерни препоръки и много повече!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
                >
                  <Link href="/auth/register">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Регистрирай се безплатно
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 hover:border-zinc-600"
                >
                  <Link href="/auth/login">Вече имам акаунт</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
