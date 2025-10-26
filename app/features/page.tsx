import type { Metadata } from 'next';
import { Sparkles, Heart, Brain, TrendingUp, Zap, Lock, Smartphone, Crown, Star } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import { GradientText } from '@/components/ui/gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BentoTestimonials } from '@/components/landing/BentoTestimonials';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Функции - AI Астрология, Таро и Нумерология',
  description: 'Открий силата на AI астрология с Vrachka. Персонализирани хороскопи, таро четения, нумерологични анализи и 24/7 AI оракул за духовно развитие.',
  keywords: [
    'AI астрология',
    'дигитална врачка',
    'таро четене',
    'нумерология',
    'персонализиран хороскоп',
    'AI оракул',
    'духовно развитие',
  ],
  openGraph: {
    title: 'Функции - AI Астрология и Духовност | Vrachka',
    description: 'Персонализирани хороскопи, таро четения и AI оракул за твоето духовно пътуване.',
    url: '/features',
  },
};

const features = [
  {
    icon: Sparkles,
    title: 'AI Персонализирани Хороскопи',
    description: 'Забрави generic хороскопите за милиони хора. Нашият AI анализира твоята натална карта и създава уникални прогнози само за теб.',
    details: [
      'Дневни, седмични и месечни хороскопи',
      'Анализ на любов, кариера и здраве',
      'Късметлийски числа и съвети',
      'Базирани на реална астрологична наука',
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Heart,
    title: '24/7 Digital Oracle',
    description: 'Задай всякакъв въпрос на нашия AI Оракул. Получи мъдри насоки базирани на вековни духовни учения и модерна психология.',
    details: [
      'Неограничени въпроси (Ultimate план)',
      'Отговори за любов, кариера, здраве',
      'Духовни насоки и прозрения',
      'Моментални AI-генерирани съвети',
    ],
    color: 'from-pink-500/20 to-red-500/20',
    borderColor: 'border-pink-500/30',
  },
  {
    icon: Brain,
    title: 'Tarot Четения с AI',
    description: 'Открий себе си чрез таро четения интерпретирани от AI. Избери измежду различни разклади за различни житейски ситуации.',
    details: [
      '3-картов, 5-картов и Celtic Cross разклади',
      'Детайлни интерпретации на всяка карта',
      'Връзка между картите и твоята ситуация',
      'История на всички твои четения',
    ],
    color: 'from-blue-500/20 to-purple-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Star,
    title: 'Натална Астрологична Карта',
    description: 'Изчисли своята натална карта базирана на точната ти дата, час и място на раждане. AI анализира планетарните позиции и техните влияния.',
    details: [
      'Точни позиции на Слънце, Луна и Асцендент',
      'Анализ на планетите в астрологичните домове',
      'Важни аспекти между планетите',
      'Детайлна AI интерпретация на картата',
    ],
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Нумерологичен Анализ',
    description: 'Разбери скритите послания в числата на твоя живот. Анализ на твоето име, дата на раждане и житейски път.',
    details: [
      'Life Path Number калкулация',
      'Personality Number анализ',
      'Destiny Number значение',
      'Ежемесечни нумерологични прогнози',
    ],
    color: 'from-green-500/20 to-teal-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Zap,
    title: 'Бързи и Точни',
    description: 'AI моделите ни генерират отговори за секунди, без да чакаш дни за консултация с астролог.',
    details: [
      'Резултати за под 5 секунди',
      'Винаги актуални астрологични данни',
      'Базирани на най-новите AI модели',
      '99.9% uptime гаранция',
    ],
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
  },
  {
    icon: Lock,
    title: 'Приватност и Сигурност',
    description: 'Всичките ти данни са криптирани и защитени. Никога не споделяме информация с трети страни.',
    details: [
      'End-to-end encryption',
      'GDPR compliant',
      'Анонимни четения (по избор)',
      'Изтриване на данни по всяко време',
    ],
    color: 'from-zinc-500/20 to-slate-500/20',
    borderColor: 'border-zinc-500/30',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First PWA',
    description: 'Инсталирай Vrachka като приложение на телефона си. Работи офлайн и изглежда като native app.',
    details: [
      'Работи на всички устройства',
      'Офлайн функционалност',
      'Push нотификации за твоя хороскоп',
      'Бърз като native приложение',
    ],
    color: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/30',
  },
  {
    icon: Crown,
    title: 'Premium Преживяване',
    description: 'Ultimate планът отключва неограничени четения, седмични/месечни хороскопи и приоритетна поддръжка.',
    details: [
      'Неограничени таро четения',
      'Седмични и месечни хороскопи',
      'Неограничени Oracle въпроси',
      'VIP поддръжка в рамките на 24ч',
    ],
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/30',
  },
];

const faqs = [
  {
    question: 'Как AI генерира толкова точни хороскопи?',
    answer: 'Нашият AI е обучен на хиляди астрологични текстове, натални карти и психологически профили. Той комбинира традиционна астрологична мъдрост с модерна персонализация за максимална точност.',
  },
  {
    question: 'Разликата между Basic и Ultimate план?',
    answer: 'Basic планът дава седмични хороскопи и 10 таро четения/месец. Ultimate отключва неограничени четения, месечни хороскопи, и неограничени Oracle въпроси.',
  },
  {
    question: 'Мога ли да използвам Vrachka офлайн?',
    answer: 'Да! След като инсталираш PWA приложението, можеш да достъпваш предишни четения и хороскопи дори без интернет. Новите генерации обаче изискват връзка.',
  },
  {
    question: 'Защитени ли са моите данни?',
    answer: 'Абсолютно. Всичките ти данни са криптирани и съхранени сигурно. Спазваме GDPR стандартите и никога не споделяме лична информация.',
  },
  {
    question: 'Мога ли да анулирам абонамента си по всяко време?',
    answer: 'Да, можеш да анулираш когато пожелаеш от твоя dashboard. Няма скрити такси или задължения.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <MysticBackground />

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Духовност</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <GradientText>
                Модерна Астрология
              </GradientText>
              <br />
              <span className="text-zinc-50">за Дигиталната Епоха</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Открий силата на AI астрология с Vrachka. Персонализирани хороскопи, таро четения,
              нумерологични анализи и 24/7 дигитален оракул за твоето духовно пътуване.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <ShimmerButton>
                  Започни Безплатно
                </ShimmerButton>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-3 rounded-full glass-card card-hover text-zinc-50 font-medium">
                  Виж Цените
                </button>
              </Link>
            </div>
          </div>

          {/* Features Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-card p-8 card-hover group ${
                  index === 0 || index === features.length - 1 ? 'lg:col-span-2' : ''
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} border-2 ${feature.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-zinc-50" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { value: '10K+', label: 'Активни Потребители' },
              { value: '50K+', label: 'Хороскопни Четения' },
              { value: '25K+', label: 'Таро Разклади' },
              { value: '4.9/5', label: 'Рейтинг' },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center card-hover">
                <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <BentoTestimonials />

        {/* FAQ Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Sparkles className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Често Задавани Въпроси
            </h2>
            <p className="text-xl text-zinc-400">
              Отговори на най-честите въпроси за Vrachka
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="glass-card group overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-semibold text-zinc-50">
                    {faq.question}
                  </span>
                  <Sparkles className="w-5 h-5 text-accent-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="container mx-auto px-6 pb-20">
          <div className="glass-card p-12 text-center max-w-4xl mx-auto card-hover">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 mb-8">
              <Crown className="w-10 h-10 text-accent-400" />
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Готов за Духовното си Пътуване?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Присъедини се към хиляди потребители които вече открили силата на AI астрология.
            </p>
            <Link href="/sign-up">
              <ShimmerButton>
                Започни Безплатно Днес
              </ShimmerButton>
            </Link>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Без кредитна карта</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>100% сигурно</span>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
