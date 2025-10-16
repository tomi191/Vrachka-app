import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, Calendar, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StructuredData, organizationSchema, webApplicationSchema, faqSchema } from "@/components/StructuredData";

export default function LandingPage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webApplicationSchema} />
      <StructuredData data={faqSchema} />
      <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-brand-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-zinc-50">Vrachka</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Функции
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Цени
            </Link>
            <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Вход
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-accent-600 hover:bg-accent-700">
                Започни сега
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-zinc-300">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>AI-базирана астрологична платформа</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold gradient-text max-w-4xl mx-auto leading-tight">
              Твоят личен астрологичен асистент
            </h1>

            {/* Subheading */}
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Персонализирани дневни хороскопи, таро четения и духовни насоки, генерирани от напреднала AI технология
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-accent-600 hover:bg-accent-700 text-white px-8 h-12 text-base">
                  Безплатен пробен период
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-900 px-8 h-12 text-base">
                  Научи повече
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-zinc-500 pt-4">
              Присъедини се към 10,000+ потребители в тяхното духовно пътуване
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="glass-card p-2 max-w-5xl mx-auto card-hover">
              <div className="bg-brand-900 rounded-xl h-[500px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-accent-500/10 flex items-center justify-center">
                    <Star className="w-10 h-10 text-accent-400" />
                  </div>
                  <p className="text-zinc-600 text-lg">Dashboard Preview</p>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-accent-500/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Всичко необходимо за твоето духовно развитие
            </h2>
            <p className="text-xl text-zinc-400">
              Мощни функции за управление на твоето пътуване
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Дневни хороскопи
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Персонализирани астрологични прогнози базирани на твоята натална карта. Актуализират се ежедневно с AI-генерирано съдържание.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Таро четения
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Изтегли карти и получи моментална интерпретация. Множество подредби налични за различни въпроси.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                AI Оракул
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Задай всякакъв духовен въпрос и получи обмислени насоки от нашия напреднал AI асистент.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Нумерология
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Открий значението на числата в твоя живот. Детайлни анализи базирани на рождената ти дата и име.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Съвместимост
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Анализирай връзките си с други хора. Любовна, приятелска и бизнес съвместимост.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Натална карта
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Пълна астрологична карта с всички планети, къщи и аспекти. Задълбочен анализ на личността ти.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Прости и прозрачни цени
            </h2>
            <p className="text-xl text-zinc-400">
              Избери плана, който работи най-добре за теб
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">Безплатен</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-zinc-50">0</span>
                  <span className="text-zinc-500">лв/месец</span>
                </div>
                <p className="text-sm text-zinc-500">Перфектен за начинаещи</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Дневен хороскоп</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Карта на деня</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-500">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Таро четения</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-500">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>AI Оракул</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-900">
                Започни безплатно
              </Button>
            </div>

            {/* Basic Plan */}
            <div className="glass-card p-8 border-accent-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-600 text-white text-xs font-medium rounded-full">
                Популярен
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Basic</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-zinc-50">9.99</span>
                  <span className="text-zinc-500">лв/месец</span>
                </div>
                <p className="text-sm text-zinc-500">За редовни потребители</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Всичко от Безплатен</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Таро четения (3/ден)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI Оракул (3 въпроса/ден)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Седмични хороскопи</span>
                </li>
              </ul>

              <Button className="w-full bg-accent-600 hover:bg-accent-700">
                Избери Basic
              </Button>
            </div>

            {/* Ultimate Plan */}
            <div className="glass-card p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">Ultimate</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-zinc-50">16.99</span>
                  <span className="text-zinc-500">лв/месец</span>
                </div>
                <p className="text-sm text-zinc-500">За power потребители</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Всичко от Basic</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Неограничени таро четения</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10 въпроса/ден към Оракула</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Детайлна натална карта</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-900">
                Избери Ultimate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6 mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-zinc-50">Vrachka</span>
            </div>

            <div className="flex gap-8">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Поверителност
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Условия
              </Link>
              <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Контакт
              </Link>
            </div>

            <p className="text-sm text-zinc-600">
              © 2025 Vrachka. Всички права запазени.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
