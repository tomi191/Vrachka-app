'use client';

import { X, TrendingUp, MessageCircle, BookOpen } from 'lucide-react';

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

/**
 * ProblemsWeSolve Component
 * Displays common problems and Vrachka's solutions
 */
export function ProblemsWeSolve() {
  return (
    <div className="container mx-auto max-w-6xl">
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
  );
}
