import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'
import { ZodiacIcon } from '@/components/icons/zodiac'
import { PlanetIcon, ElementIcon, getElementColors, type PlanetName, type ElementName } from '@/components/icons/astrology'
import { HoverCardWrapper } from '@/components/ui/hover-card-wrapper'
import { GradientText } from '@/components/ui/gradient-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Navigation } from '@/components/Navigation'
import { TopHeader } from '@/components/layout/top-header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/Footer'
import { MysticBackground } from '@/components/background/MysticBackground'
import { BentoTestimonials } from '@/components/landing/BentoTestimonials'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Дневен Хороскоп за Всички Зодии',
  description: 'Безплатни дневни хороскопи за всички 12 зодии. Персонализирани астрологични прогнози, любовен хороскоп, кариерни съвети и духовни насоки от AI Врачката.',
  keywords: [
    'дневен хороскоп',
    'хороскоп днес',
    'астрология',
    'зодия',
    'хороскоп за деня',
    'любовен хороскоп',
    'седмичен хороскоп',
    'месечен хороскоп',
    'астрологична прогноза',
  ],
  openGraph: {
    title: 'Дневен Хороскоп за Всички Зодии | Vrachka',
    description: 'Персонализирани дневни хороскопи за всички 12 зодии. Любов, кариера, здраве и духовни насоки.',
    images: ['/api/og?title=Дневен Хороскоп за Всички Зодии&description=Безплатни хороскопи за всички 12 зодии'],
  },
  alternates: {
    canonical: '/horoscope',
  },
}

const zodiacSigns = [
  {
    sign: 'oven',
    name: 'Овен',
    dates: '21 март - 19 април',
    element: 'Огън',
    planet: 'Марс',
    traits: 'Смел, енергичен, лидер',
  },
  {
    sign: 'telec',
    name: 'Телец',
    dates: '20 април - 20 май',
    element: 'Земя',
    planet: 'Венера',
    traits: 'Стабилен, практичен, упорит',
  },
  {
    sign: 'bliznaci',
    name: 'Близнаци',
    dates: '21 май - 20 юни',
    element: 'Въздух',
    planet: 'Меркурий',
    traits: 'Общителен, любознателен, гъвкав',
  },
  {
    sign: 'rak',
    name: 'Рак',
    dates: '21 юни - 22 юли',
    element: 'Вода',
    planet: 'Луна',
    traits: 'Чувствителен, грижовен, интуитивен',
  },
  {
    sign: 'lav',
    name: 'Лъв',
    dates: '23 юли - 22 август',
    element: 'Огън',
    planet: 'Слънце',
    traits: 'Харизматичен, щедър, креативен',
  },
  {
    sign: 'deva',
    name: 'Дева',
    dates: '23 август - 22 септември',
    element: 'Земя',
    planet: 'Меркурий',
    traits: 'Аналитичен, перфекционист, услужлив',
  },
  {
    sign: 'vezni',
    name: 'Везни',
    dates: '23 септември - 22 октомври',
    element: 'Въздух',
    planet: 'Венера',
    traits: 'Балансиран, дипломатичен, артистичен',
  },
  {
    sign: 'skorpion',
    name: 'Скорпион',
    dates: '23 октомври - 21 ноември',
    element: 'Вода',
    planet: 'Плутон',
    traits: 'Интензивен, страстен, проницателен',
  },
  {
    sign: 'strelec',
    name: 'Стрелец',
    dates: '22 ноември - 21 декември',
    element: 'Огън',
    planet: 'Юпитер',
    traits: 'Оптимист, авантюрист, философ',
  },
  {
    sign: 'kozirog',
    name: 'Козирог',
    dates: '22 декември - 19 януари',
    element: 'Земя',
    planet: 'Сатурн',
    traits: 'Амбициозен, дисциплиниран, отговорен',
  },
  {
    sign: 'vodolej',
    name: 'Водолей',
    dates: '20 януари - 18 февруари',
    element: 'Въздух',
    planet: 'Уран',
    traits: 'Иноватор, независим, хуманитарен',
  },
  {
    sign: 'ribi',
    name: 'Риби',
    dates: '19 февруари - 20 март',
    element: 'Вода',
    planet: 'Нептун',
    traits: 'Състрадателен, артистичен, духовен',
  },
] as const

const breadcrumbData = getBreadcrumbSchema([
  { name: 'Начало', url: 'https://www.vrachka.eu' },
  { name: 'Хороскопи', url: 'https://www.vrachka.eu/horoscope' },
])

export default async function HoroscopePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <StructuredData data={breadcrumbData} />

      {/* Desktop: Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
      <div className="lg:hidden">
        {user ? <TopHeader /> : <Navigation />}
      </div>

      <MysticBackground />

      <div className="min-h-screen bg-gradient-dark">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Дневни Хороскопи</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Дневен Хороскоп за Всички Зодии
              </GradientText>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Открийте какво ви носят звездите днес. Персонализирани астрологични прогнози за любов, кариера, здраве и духовно развитие.
            </p>
          </div>

          {/* Zodiac Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {zodiacSigns.map((zodiac) => {
              const elementColors = getElementColors(zodiac.element)
              return (
                <Link key={zodiac.sign} href={`/horoscope/${zodiac.sign}`}>
                  <HoverCardWrapper className="h-full">
                    <div className={`glass-card card-hover h-full cursor-pointer p-6 border-2 ${elementColors.border}`}>
                      <div className="flex justify-center mb-4">
                        <ZodiacIcon
                          sign={zodiac.sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                          size={56}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <h3 className="text-center text-2xl font-bold text-zinc-50 mb-2">
                        {zodiac.name}
                      </h3>
                      <p className="text-center font-medium text-zinc-400 mb-4">
                        {zodiac.dates}
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm text-zinc-300 flex items-center gap-2">
                          <span className="font-semibold">Стихия:</span>
                          <ElementIcon element={zodiac.element as ElementName} size={16} className="inline-block" />
                          <span>{zodiac.element}</span>
                        </div>
                        <div className="text-sm text-zinc-300 flex items-center gap-2">
                          <span className="font-semibold">Планета:</span>
                          <PlanetIcon planet={zodiac.planet as PlanetName} size={16} className="inline-block" />
                          <span>{zodiac.planet}</span>
                        </div>
                        <div className="text-sm text-zinc-400">
                          {zodiac.traits}
                        </div>
                      </div>
                    </div>
                  </HoverCardWrapper>
                </Link>
              )
            })}
          </div>

          {/* SEO Content Section */}
          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Какво е Дневният Хороскоп?</h2>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <p>
                  Дневният хороскоп е астрологична прогноза, базирана на позициите на планетите и звездите във вашата зодия за конкретния ден.
                  Той ви предоставя насоки за любовта, кариерата, здравето и личностното развитие.
                </p>
                <p>
                  С Vrachka получавате персонализирани хороскопи, генерирани от напреднала AI технология, която отчита не само вашата зодия,
                  но и множество други астрологични фактори за максимална точност.
                </p>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Как Работи Астрологията?</h2>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <p>
                  Астрологията изучава влиянието на небесните тела върху човешкия живот. Всяка от 12-те зодии се управлява от различна планета
                  и принадлежи към една от четирите стихии - Огън, Земя, Въздух или Вода.
                </p>
                <h3 className="text-xl font-semibold mt-4 text-zinc-200">Четирите Стихии:</h3>
                <ul>
                  <li><strong>Огън</strong> (Овен, Лъв, Стрелец) - Енергия, страст, инициативност</li>
                  <li><strong>Земя</strong> (Телец, Дева, Козирог) - Стабилност, практичност, реализъм</li>
                  <li><strong>Въздух</strong> (Близнаци, Везни, Водолей) - Интелект, комуникация, свобода</li>
                  <li><strong>Вода</strong> (Рак, Скорпион, Риби) - Емоции, интуиция, чувствителност</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Защо да Избера Vrachka?</h2>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <ul>
                  <li><strong>AI Персонализация</strong> - Хороскопи, създадени специално за вас</li>
                  <li><strong>Дневни Актуализации</strong> - Нови прогнози всеки ден</li>
                  <li><strong>Седмични и Месечни Хороскопи</strong> - Разширени прогнози за Premium потребители</li>
                  <li><strong>Български Език</strong> - Автентично съдържание на роден език</li>
                  <li><strong>Таро Четения</strong> - Допълнителни насоки с AI таро</li>
                  <li><strong>Духовен Оракул</strong> - Консултации с AI Врачката</li>
                  <li><strong>Натална Карта</strong> - Пълен астрологичен анализ на раждането ти</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <BentoTestimonials />

        <div className="container mx-auto px-4 pb-16">
          {/* CTA Section */}
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 -z-10"></div>
            <h2 className="text-3xl font-bold mb-4 text-zinc-50">
              Готови за Персонализиран Хороскоп?
            </h2>
            <p className="text-xl mb-8 text-zinc-300">
              Създайте безплатен акаунт и получете достъп до дневни хороскопи, таро четения и духовни консултации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <ShimmerButton className="text-lg px-8">
                  Започни Сега - Безплатно
                </ShimmerButton>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-3 rounded-full glass text-zinc-50 font-medium card-hover">
                  Разгледай Плановете
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </>
  )
}
