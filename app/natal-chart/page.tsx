import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, Sparkles, Moon, Sun, Zap, ChevronDown } from 'lucide-react';
import { StructuredData, getBreadcrumbSchema, getFAQSchema } from '@/components/StructuredData';
import { GradientText } from '@/components/ui/gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Navigation } from '@/components/Navigation';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import { BentoTestimonials } from '@/components/landing/BentoTestimonials';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription } from '@/lib/subscription';
import type { PlanType } from '@/lib/config/plans';

export const metadata: Metadata = {
  title: 'Твоята Натална Карта с AI Анализ | Врачка',
  description: 'Създай детайлна натална карта с AI интерпретация от Врачка. Открий позициите на планетите, домовете и аспектите в момента на раждането ти. Пълен астрологичен анализ на български език.',
  keywords: [
    'натална карта',
    'астрологична карта',
    'рождена карта',
    'натална карта онлайн',
    'vrachka натална карта',
    'врачка астрология',
    'астрология',
    'хороскоп',
    'планети',
    'домове',
    'аспекти',
    'асцендент',
    'AI астрология',
    'безплатна натална карта'
  ],
  openGraph: {
    title: 'Натална Карта с AI | Vrachka',
    description: 'Детайлна натална карта с AI интерпретация. Открий своя космически план.',
    images: ['/api/og?title=Натална Карта с AI&description=Открий своя космически план'],
  },
  alternates: {
    canonical: '/natal-chart',
  },
};

const faqData = [
  {
    question: 'Какво е натална карта?',
    answer: 'Натална карта (или астрологична карта) е космическа снимка на небето в точния момент и място на твоето раждане. Тя показва позициите на всички планети, слънцето, луната и астрологичните домове, които влияят на личността, талантите и жизнения ти път.',
  },
  {
    question: 'Защо ми трябва точния час на раждане?',
    answer: 'Точният час на раждане е критичен за изчисляването на асцендента (изгряващия знак) и позициите на 12-те астрологични дома. Тези елементи се променят на всеки 2 часа, така че дори малка грешка може да промени значително интерпретацията.',
  },
  {
    question: 'Какво включва AI интерпретацията?',
    answer: 'Нашата AI система анализира всички елементи на твоята натална карта - позиции на планетите, аспекти между тях, домове и знаци. Генерира се детайлен анализ на личността, силните страни, предизвикателствата, кариерни насоки и препоръки за отношения.',
  },
  {
    question: 'Колко точна е AI натална карта?',
    answer: 'Използваме Swiss Ephemeris - най-точната астрономическа библиотека за изчисляване на планетни позиции. AI интерпретацията е обучена с хиляди класически астрологични текстове и предоставя професионално ниво на анализ.',
  },
  {
    question: 'Какво е асцендент?',
    answer: 'Асцендентът (изгряващият знак) е зодиакалният знак, който се е издигал на източния хоризонт в момента на твоето раждане. Той представя маската, която носиш пред света, и как другите те възприемат.',
  },
  {
    question: 'Мога ли да създам натална карта за друг човек?',
    answer: 'Да! С Ultimate план можеш да създадеш неограничен брой натални карти - за себе си, партньор, деца или приятели. Просто въведи точните данни за раждането им.',
  },
  {
    question: 'Какво означават астрологичните домове?',
    answer: '12-те астрологични дома представляват различни области от живота - личност, финанси, комуникация, дом, творчество, здраве, партньорство, кариера и др. Планетите в тези домове показват къде се фокусира твоята енергия.',
  },
];

const breadcrumbData = getBreadcrumbSchema([
  { name: 'Начало', url: 'https://www.vrachka.eu' },
  { name: 'Натална Карта', url: 'https://www.vrachka.eu/natal-chart' },
]);

const faqSchema = getFAQSchema(faqData);

export default async function NatalChartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's subscription plan
  let userPlan: PlanType = 'free';
  let hasAccess = false;
  if (user) {
    const subscription = await getUserSubscription(user.id);
    userPlan = subscription.plan_type as PlanType;
    hasAccess = userPlan === 'ultimate';
  }

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <StructuredData data={faqSchema} />

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
              <Star className="w-4 h-4" />
              <span>Ultimate Feature</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Твоята Натална Карта от Врачка
              </GradientText>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Във Vrachka, ние ти помагаме да откриеш своя космически план и духовно предназначение чрез детайлна астрологична карта с AI интерпретация на български език
            </p>
          </div>

          {/* SEO Content Section */}
          <div className="max-w-6xl mx-auto space-y-24 mb-16">
            {/* Section 1: What is a Natal Chart? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <Image
                  src="/images/natal-chart/what-is-natal-chart.png"
                  alt="Светеща натална карта"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Какво е Натална Карта?</h2>
                <p>
                  Натална карта, позната още като астрологична карта или хороскоп на раждането, е уникална космическа снимка на небето в точния момент и място на твоето раждане. Тя представлява астрологичен blueprint на твоята личност, таланти и жизнен път.
                </p>
                <p>
                  Картата включва позициите на всички планети (Слънце, Луна, Меркурий, Венера, Марс, Юпитер, Сатурн, Уран, Нептун и Плутон), асцендента (изгряващия знак) и 12-те астрологични дома. Всеки от тези елементи носи специфично значение и влияние върху различни аспекти от живота ти. Във Vrachka, ние ти помагаме да разчетеш този космически план.
                </p>
              </div>
            </div>

            {/* Section 2: How AI Natal Chart Works? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="md:order-last">
                <Image
                  src="/images/natal-chart/how-ai-natal-chart-works.png"
                  alt="AI Натална Карта"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Как Работи AI Натална Карта?</h2>
                <p>
                  Системата на Vrachka използва Swiss Ephemeris - най-точната астрономическа библиотека за изчисляване на планетни позиции, използвана от професионални астролози по целия свят. Процесът включва:
                </p>
                <ol>
                  <li><strong>Астрономически изчисления</strong> - Точно изчисляване на позициите на всички планети за датата, часа и мястото на раждане</li>
                  <li><strong>Изчисляване на домове</strong> - Определяне на 12-те астрологични дома и асцендента според географската ширина и дължина</li>
                  <li><strong>Анализ на аспекти</strong> - Идентифициране на всички значими ъгли между планетите (трини, квадрати, конюнкции и др.)</li>
                  <li><strong>AI интерпретация</strong> - Генериране на детайлен психологичен профил и жизнени препоръки на български език</li>
                </ol>
                <p>
                  Резултатът е професионално ниво на астрологичен анализ, достъпен за всеки на разбираем български език.
                </p>
              </div>
            </div>

            {/* Section 3: Why Choose Vrachka Natal Chart? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <Image
                  src="/images/natal-chart/why-vrachka-natal-chart.png"
                  alt="Защо да избера Vrachka Натална Карта"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Защо да Избера Vrachka Натална Карта?</h2>
                <ul>
                  <li><strong>Астрономическа Точност</strong> - Swiss Ephemeris за професионални изчисления</li>
                  <li><strong>Български Език</strong> - Пълна интерпретация на роден език</li>
                  <li><strong>AI Технология</strong> - Обучена с класически астрологични текстове</li>
                  <li><strong>Пълен Анализ</strong> - Планети, домове, аспекти, елементи</li>
                  <li><strong>Визуализация</strong> - Красива визуална карта на небето</li>
                  <li><strong>Детайлни Препоръки</strong> - Кариера, отношения, личностно развитие</li>
                  <li><strong>Неограничени Карти</strong> - Създавай карти за себе си и близки</li>
                  <li><strong>Доверен Партньор:</strong> Vrachka е твоят доверен партньор в пътуването към себепознанието.</li>
                </ul>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:order-last">
                    <Image
                        src="/images/natal-chart/faq-natal-chart.png"
                        alt="Често задавани въпроси за натална карта"
                        width={1024}
                        height={512}
                        className="rounded-lg shadow-2xl"
                    />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-zinc-50 mb-8">Често Задавани Въпроси</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <details key={index} className="glass-card group p-4">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <h3 className="text-lg font-semibold text-zinc-50 pr-8">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown className="w-5 h-5 text-accent-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                                </summary>
                                <div className="pt-4">
                                    <p className="text-zinc-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
          </div>

        {/* Testimonials Section */}
        <BentoTestimonials />

        {/* Final CTA Section */}
        <div className="relative py-20">
          <div className="absolute inset-0">
            <Image
              src="/images/natal-chart/what-is-natal-chart.png"
              alt="Готови да Откриеш Своя Космически План?"
              fill
              className="opacity-30 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 to-transparent"></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-zinc-50">
              Готови да Откриеш Своя Космически План?
            </h2>
            <p className="text-xl mb-8 text-zinc-300 max-w-2xl mx-auto">
              {user && hasAccess
                ? 'Създай своята детайлна натална карта с AI интерпретация сега'
                : user
                ? 'Надградете до Ultimate и получете достъп до детайлна натална карта'
                : 'Създайте безплатен акаунт и надградете до Ultimate за достъп'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user && hasAccess ? (
                <Link href="/natal-chart-create">
                  <ShimmerButton className="text-lg px-8">
                    <Star className="w-5 h-5 mr-2" />
                    Създай Натална Карта
                  </ShimmerButton>
                </Link>
              ) : user ? (
                <>
                  <Link href="/pricing">
                    <ShimmerButton className="text-lg px-8">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Надградете до Ultimate
                    </ShimmerButton>
                  </Link>
                  <Link href="/pricing">
                    <button className="px-8 py-3 rounded-full glass text-zinc-50 font-medium card-hover">
                      Разгледай Плановете
                    </button>
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        </div>

        <Footer />
      </div>

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </>
  );
}
