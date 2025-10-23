import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'
import { ZodiacIcon } from '@/components/icons/zodiac'
import { HoverCardWrapper } from '@/components/ui/hover-card-wrapper'
import { GradientText } from '@/components/ui/gradient-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'

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

export default function HoroscopePage() {
  return (
    <>
      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔮</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Дневен Хороскоп за Всички Зодии
              </GradientText>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Открийте какво ви носят звездите днес. Персонализирани астрологични прогнози за любов, кариера, здраве и духовно развитие.
            </p>
          </div>

          {/* Zodiac Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {zodiacSigns.map((zodiac) => (
              <Link key={zodiac.sign} href={`/horoscope/${zodiac.sign}`}>
                <HoverCardWrapper className="h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-500">
                    <CardHeader>
                      <div className="flex justify-center mb-2">
                        <ZodiacIcon
                          sign={zodiac.sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                          size={56}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <CardTitle className="text-center text-2xl">{zodiac.name}</CardTitle>
                      <CardDescription className="text-center font-medium">
                        {zodiac.dates}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="font-semibold">Стихия:</span> {zodiac.element}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">Планета:</span> {zodiac.planet}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {zodiac.traits}
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardWrapper>
              </Link>
            ))}
          </div>

          {/* SEO Content Section */}
          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Какво е Дневният Хороскоп?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-purple dark:prose-invert max-w-none">
                <p>
                  Дневният хороскоп е астрологична прогноза, базирана на позициите на планетите и звездите във вашата зодия за конкретния ден.
                  Той ви предоставя насоки за любовта, кариерата, здравето и личностното развитие.
                </p>
                <p>
                  С Vrachka получавате персонализирани хороскопи, генерирани от напреднала AI технология, която отчита не само вашата зодия,
                  но и множество други астрологични фактори за максимална точност.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Как Работи Астрологията?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-purple dark:prose-invert max-w-none">
                <p>
                  Астрологията изучава влиянието на небесните тела върху човешкия живот. Всяка от 12-те зодии се управлява от различна планета
                  и принадлежи към една от четирите стихии - Огън, Земя, Въздух или Вода.
                </p>
                <h3 className="text-xl font-semibold mt-4">Четирите Стихии:</h3>
                <ul>
                  <li><strong>Огън</strong> (Овен, Лъв, Стрелец) - Енергия, страст, инициативност</li>
                  <li><strong>Земя</strong> (Телец, Дева, Козирог) - Стабилност, практичност, реализъм</li>
                  <li><strong>Въздух</strong> (Близнаци, Везни, Водолей) - Интелект, комуникация, свобода</li>
                  <li><strong>Вода</strong> (Рак, Скорпион, Риби) - Емоции, интуиция, чувствителност</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Защо да Избера Vrachka?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-purple dark:prose-invert max-w-none">
                <ul>
                  <li><strong>AI Персонализация</strong> - Хороскопи, създадени специално за вас</li>
                  <li><strong>Дневни Актуализации</strong> - Нови прогнози всеки ден</li>
                  <li><strong>Български Език</strong> - Автентично съдържание на роден език</li>
                  <li><strong>Таро Четения</strong> - Допълнителни насоки с AI таро</li>
                  <li><strong>Духовен Оракул</strong> - Консултации с AI Врачката</li>
                  <li><strong>Нумерология</strong> - Анализ на вашите числа</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Готови за Персонализиран Хороскоп?
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Създайте безплатен акаунт и получете достъп до дневни хороскопи, таро четения и духовни консултации
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <ShimmerButton
                    className="text-lg px-8"
                    background="linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)"
                    shimmerColor="#9333ea"
                  >
                    Започни Сега - Безплатно
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                    Разгледай Плановете
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
