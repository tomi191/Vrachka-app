'use client';

import { Users, BookOpen, Star, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Активни потребители',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: BookOpen,
    value: '50,000+',
    label: 'Прочетени хороскопа',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: Star,
    value: '4.8★',
    label: 'Среден рейтинг',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10'
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Удовлетвореност',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
];

export function StatsBar() {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 text-center card-hover group"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
