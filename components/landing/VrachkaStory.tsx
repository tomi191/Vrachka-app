'use client';

import Link from 'next/link';
import { BookOpen, Brain, Users, Award, Sparkles, Target, Clock, Shield, X, TrendingUp, MessageCircle } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';

const expertise = [
  {
    icon: BookOpen,
    title: 'Susan Miller Стил',
    description: 'Хороскопи в стила на най-известната астроложка в света',
    color: 'text-purple-400'
  },
  {
    icon: Brain,
    title: 'Rachel Pollack Таро',
    description: 'Психологически интерпретации от майсторката на таро',
    color: 'text-blue-400'
  },
  {
    icon: Users,
    title: 'Carl Jung Философия',
    description: 'Дълбока психология и архетипи за Oracle отговори',
    color: 'text-green-400'
  },
  {
    icon: Award,
    title: 'Chani Nicholas Вдъхновение',
    description: 'Социална справедливост и инклузивна астрология',
    color: 'text-pink-400'
  }
];

const problems = [
  {
    problem: 'Скучни и неточни хороскопи',
    solution: 'AI персонализация за ТЕБ',
    description: 'Забрави generic прогнози за милиони. Получи персонализирани насоки базирани на твоята уникална ситуация.',
    icon: X,
    color: 'text-red-400'
  },
  {
    problem: 'Скъпи астрологични консултации',
    solution: 'Достъпни цени от 0 лв/месец',
    description: 'Професионални астрологични услуги на цена на кафе. Без чакане, без високи такси.',
    icon: TrendingUp,
    color: 'text-orange-400'
  },
  {
    problem: 'Липса на духовна подкрепа',
    solution: '24/7 AI духовен асистент',
    description: 'Задай всякакъв въпрос по всяко време. Получи мъдри насоки когато имаш най-голяма нужда.',
    icon: MessageCircle,
    color: 'text-blue-400'
  },
  {
    problem: 'Трудно разбиране на астрологията',
    solution: 'Просто и ясно обяснение',
    description: 'Комплексни астрологични концепции обяснени на прост български език с практически примери.',
    icon: BookOpen,
    color: 'text-green-400'
  }
];

const aiTraining = [
  {
    icon: Brain,
    title: 'GPT-4 Fine-tuning',
    description: 'Обучен на хиляди астрологични текстове и психологически анализи',
    detail: 'Custom fine-tuned модел за максимална точност'
  },
  {
    icon: Target,
    title: 'Българска Адаптация',
    description: 'Специално оптимизиран за български език и култура',
    detail: 'Разбира български идиоми и културни особености'
  },
  {
    icon: Clock,
    title: 'Реално Време Анализ',
    description: 'Използва актуални планетарни позиции и транзити',
    detail: 'Винаги актуални астрологични данни'
  },
  {
    icon: Shield,
    title: '99.9% Uptime',
    description: 'Високодостъпна инфраструктура с резервни системи',
    detail: 'Гарантирана наличност 24/7'
  }
];

export function VrachkaStory() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Историята на Врачка</span>
          </div>
          <h2 className="text-4xl font-bold text-zinc-50 mb-4">
            <GradientText>
              Първата AI Астрологична Платформа в България
            </GradientText>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Врачка не е просто приложение - тя е революция в духовното развитие.
            Създадена от българи за българи с най-новите AI технологии.
          </p>
        </div>

        {/* What is Vrachka */}
        <div className="glass-card p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-zinc-50 mb-4">
              🔮 Какво е Врачка?
            </h3>
            <p className="text-lg text-zinc-400 max-w-4xl mx-auto leading-relaxed">
              Врачка е първата в България AI-базирана платформа за астрология, таро четения и духовно развитие.
              Комбинираме вековни астрологични традиции с най-новите изкуствен интелект технологии,
              за да предоставим персонализирани и точни духовни насоки на всеки българин.
            </p>
          </div>

          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-400" />
                Нашата Мисия
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                Да направим астрологията достъпна, точна и персонализирана за всеки българин.
                Вярваме, че всеки заслужава достъп до духовни насоки, независимо от бюджета или местоположението си.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-zinc-50 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                За кого е Врачка?
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                За всички - от любопитни начинаещи до опитни астролози.
                Независимо дали търсиш ежедневни насоки или дълбоки духовни прозрения.
              </p>
            </div>
          </div>
        </div>

        {/* AI Training Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-zinc-50 mb-4">
              🤖 Как работи нашият AI?
            </h3>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Не използваме обикновени AI модели. Врачка е специално обучена върху най-добрите астрологични източници в света.
            </p>
          </div>

          {/* Expertise Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {expertise.map((item, index) => (
              <div key={index} className="glass-card p-6 text-center card-hover group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h4 className="font-semibold text-zinc-50 mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Technical Details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTraining.map((item, index) => (
              <div key={index} className="glass-card p-6 card-hover group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <h4 className="font-semibold text-zinc-50">{item.title}</h4>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{item.description}</p>
                <p className="text-xs text-accent-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Problems We Solve */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-zinc-50 mb-4">
              🎯 Проблемите, които решаваме
            </h3>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Разбрахме болковите точки на българските потребители и създадохме решения, които наистина работят.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {problems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="glass-card p-6 card-hover group">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-red-400 font-medium">{item.problem}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-green-400 font-medium">{item.solution}</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-zinc-50 mb-4">
              Готов да започнеш своето духовно пътуване?
            </h3>
            <p className="text-zinc-400 mb-6">
              Присъедини се към хиляди българи, които вече откриха силата на AI астрологията.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/horoscope" className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold text-center">
                Виж своя хороскоп днес
              </Link>
              <Link href="/features" className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors text-center">
                Научи повече
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
