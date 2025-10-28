import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Sparkles, Star, Crown, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StructuredData, organizationSchema, webApplicationSchema, faqSchema } from "@/components/StructuredData";
import { ZodiacIcon } from '@/components/icons/zodiac'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { HoverCardWrapper } from '@/components/ui/hover-card-wrapper'
import { GradientText } from '@/components/ui/gradient-text'
import { BentoHero } from '@/components/landing/BentoHero'
import { VrachkaStory } from '@/components/landing/VrachkaStory'
import { StatsBar } from '@/components/landing/StatsBar'
import { BentoFeatures } from '@/components/landing/BentoFeatures'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { BentoTestimonials } from '@/components/landing/BentoTestimonials'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { BlogSection } from '@/components/landing/BlogSection'
import { BlogSectionSkeleton } from '@/components/landing/BlogSectionSkeleton'
import { MysticBackground } from '@/components/background/MysticBackground'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ZODIAC_SIGNS } from '@/lib/constants/zodiac'
import { HOMEPAGE_FAQS } from '@/lib/constants/faqs'

// Revalidate every hour for fresh blog posts
export const revalidate = 3600

export default function LandingPage() {

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webApplicationSchema} />
      <StructuredData data={faqSchema} />

      <Navigation />
      <MysticBackground />

      <div className="min-h-screen bg-gradient-dark">

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
            <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight">
              <GradientText>
                Твоят личен астрологичен асистент
              </GradientText>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Персонализирани дневни хороскопи, таро четения и духовни насоки, генерирани от напреднала AI технология
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/horoscope">
                <ShimmerButton className="text-base">
                  Виж твоя хороскоп днес
                  <ArrowRight className="ml-2 w-5 h-5" />
                </ShimmerButton>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-900 px-8 h-12 text-base">
                  Научи повече
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-zinc-500 pt-4">
              Присъедини се към 5,000+ потребители в тяхното духовно пътуване
            </p>
          </div>

          {/* Bento Grid Hero */}
          <BentoHero />
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Vrachka Story Section */}
      <VrachkaStory />

      {/* Free Horoscopes Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Star className="w-4 h-4" />
              <span>100% Безплатно</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Изберете вашата зодия
            </h2>
            <p className="text-xl text-zinc-400">
              Дневни хороскопи за всички 12 зодиакални знака
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {ZODIAC_SIGNS.map((zodiac) => (
              <Link key={zodiac.sign} href={`/horoscope/${zodiac.sign}`}>
                <HoverCardWrapper className="h-full">
                  <div className="glass-card p-6 text-center card-hover group h-full">
                    <div className="mb-3 flex justify-center">
                      <ZodiacIcon
                        sign={zodiac.sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                        size={64}
                        className="text-accent-400 group-hover:text-accent-300 transition-colors"
                      />
                    </div>
                    <h3 className="font-semibold text-zinc-50 mb-1 text-lg">
                      {zodiac.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {zodiac.dates}
                    </p>
                  </div>
                </HoverCardWrapper>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/horoscope">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900">
                Виж всички хороскопи
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <BentoFeatures />

      {/* Blog Section - Async with Suspense */}
      <Suspense fallback={<BlogSectionSkeleton />}>
        <BlogSection />
      </Suspense>

      {/* Comparison Table */}
      <ComparisonTable />

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
            <div className="glass-card p-8 card-hover">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">0 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">Перфектен за начинаещи</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Таро четения</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Digital Oracle (AI)</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Седмични прогнози</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                  Започни безплатно
                </Button>
              </Link>
            </div>

            {/* Basic Plan */}
            <div className="glass-card p-8 card-hover border-blue-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Популярен
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-blue-400" />
                  Basic
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">9.99 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">За редовни потребители</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">3 таро четения/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">3 въпроса към Oracle/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Седмични прогнози</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Приоритетна поддръжка</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                  Започни сега
                </Button>
              </Link>
            </div>

            {/* Ultimate Plan */}
            <div className="glass-card p-8 card-hover border-accent-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs px-3 py-1 rounded-full">
                  Най-добра стойност
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  Ultimate
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">19.99 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">Пълен духовен опит</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Неограничени таро четения</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">10 въпроса към Oracle/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Седмични и месечни прогнози</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Персонализирани съвети</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">VIP поддръжка</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="w-full bg-accent-600 hover:bg-accent-700 font-semibold">
                  Започни сега
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Star className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Често задавани въпроси
            </h2>
            <p className="text-xl text-zinc-400">
              Отговори на най-честите въпроси
            </p>
          </div>

          <div className="space-y-4">
            {HOMEPAGE_FAQS.map((faq, index) => (
              <details key={index} className="glass-card group">
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                  <h3 className="text-lg font-semibold text-zinc-50 pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-accent-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-zinc-400 mb-4">Не намери отговор на въпроса си?</p>
            <Link href="/contact">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900">
                Свържи се с нас
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Bento Grid */}
      <BentoTestimonials />

      {/* Final CTA */}
      <FinalCTA />

      <Footer />
    </div>
    </>
  );
}
