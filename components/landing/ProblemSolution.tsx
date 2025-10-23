'use client';

import { X, ArrowRight, Check } from 'lucide-react';

const problems = [
  {
    problem: 'Скучни generic хороскопи?',
    solution: 'AI персонализация',
    description: 'Забрави стандартните хороскопи. Нашият AI анализира твоята натална карта и създава уникални прогнози само за теб.',
    before: 'Generic прогнози за милиони',
    after: 'Персонален AI асистент'
  },
  {
    problem: 'Не знаеш къде да потърсиш съвет?',
    solution: '24/7 Digital Oracle',
    description: 'Задай всякакъв въпрос на нашия AI Оракул. Получи мъдри насоки базирани на вековни духовни учения.',
    before: 'Чакане за терапевт/съветник',
    after: 'Моментални AI отговори'
  },
  {
    problem: 'Трудно е да разбереш себе си?',
    solution: 'Tarot + Numerology',
    description: 'Открий себе си чрез таро четения и нумерология. AI интерпретации ти помагат да разбереш пътя си.',
    before: 'Объркване и съмнения',
    after: 'Яснота и увереност'
  },
];

export function ProblemSolution() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
            <span>Защо Vrachka?</span>
          </div>
          <h2 className="text-4xl font-bold text-zinc-50 mb-4">
            Решение на твоите проблеми
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Превърнахме класическата астрология в модерно AI изживяване
          </p>
        </div>

        {/* Problem → Solution Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <div key={index} className="glass-card p-8 card-hover group">
              {/* Problem */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-200">
                    {item.problem}
                  </h3>
                </div>
                <div className="pl-9">
                  <p className="text-sm text-zinc-500 mb-4">{item.before}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 text-accent-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              {/* Solution */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-50">
                    {item.solution}
                  </h3>
                </div>
                <div className="pl-9">
                  <p className="text-sm text-green-400/80 mb-4">{item.after}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
