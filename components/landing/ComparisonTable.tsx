'use client';

import { Check, X } from 'lucide-react';

const comparisons = [
  {
    feature: 'Персонализация',
    traditional: false,
    vrachka: true,
    description: 'AI анализ на натална карта'
  },
  {
    feature: '24/7 Достъпност',
    traditional: false,
    vrachka: true,
    description: 'Винаги на линия'
  },
  {
    feature: 'Интерактивни четения',
    traditional: false,
    vrachka: true,
    description: 'Таро + Oracle чат'
  },
  {
    feature: 'Streak gamification',
    traditional: false,
    vrachka: true,
    description: 'Мотивация за ежедневна практика'
  },
  {
    feature: 'Съвременен дизайн',
    traditional: false,
    vrachka: true,
    description: 'Mobile-first PWA'
  },
];

export function ComparisonTable() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
            <span>Сравнение</span>
          </div>
          <h2 className="text-4xl font-bold text-zinc-50 mb-4">
            Защо Vrachka е по-добра
          </h2>
          <p className="text-xl text-zinc-400">
            Съвременна AI технология vs традиционни сайтове
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-card overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-zinc-800/50">
            <div className="text-sm font-medium text-zinc-500">Функция</div>
            <div className="text-center">
              <div className="text-sm font-medium text-zinc-500 mb-1">Традиционни сайтове</div>
              <div className="text-xs text-zinc-600">Generic хороскопи</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-accent-400 mb-1">Vrachka</div>
              <div className="text-xs text-accent-500/70">AI-powered Platform</div>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 p-6 border-b border-zinc-800/30 last:border-b-0 hover:bg-zinc-900/20 transition-colors"
            >
              <div>
                <div className="font-medium text-zinc-200 mb-1">{item.feature}</div>
                <div className="text-xs text-zinc-500">{item.description}</div>
              </div>
              <div className="flex items-center justify-center">
                {item.traditional ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                {item.vrachka ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
