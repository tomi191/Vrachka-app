'use client';

import { BookOpen, Brain, Users, Award, Target, Clock, Shield } from 'lucide-react';

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

/**
 * VrachkaExpertise Component
 * Shows AI training sources and technical capabilities
 */
export function VrachkaExpertise() {
  return (
    <div className="container mx-auto max-w-6xl mb-16">
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
  );
}
