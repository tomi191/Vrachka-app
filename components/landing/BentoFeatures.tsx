'use client';

import { Calendar, Sparkles, Shield, TrendingUp, Zap, Star } from 'lucide-react';

export function BentoFeatures() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-zinc-50 mb-4">
            Всичко необходимо за твоето духовно развитие
          </h2>
          <p className="text-xl text-zinc-400">
            Мощни функции за управление на твоето пътуване
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Feature - Daily Horoscopes (spans 2 columns) */}
          <div className="md:col-span-2 glass-card p-8 card-hover group">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-accent-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-zinc-50 mb-3">
                  Дневни хороскопи
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Персонализирани астрологични прогнози базирани на твоята натална карта. Актуализират се ежедневно с AI-генерирано съдържание в стил Susan Miller и Chani Nicholas.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-400">AI-генерирани</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-400">Персонализирани</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-400">Ежедневни</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarot Readings */}
          <div className="glass-card p-8 card-hover group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50 mb-3">
              Таро четения
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Изтегли карти и получи моментална интерпретация. Множество подредби налични за различни въпроси.
            </p>
          </div>

          {/* AI Oracle */}
          <div className="glass-card p-8 card-hover group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50 mb-3">
              AI Оракул
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Задай всякакъв духовен въпрос и получи обмислени насоки от нашия напреднал AI асистент.
            </p>
          </div>

          {/* Numerology (spans 2 columns) */}
          <div className="md:col-span-2 glass-card p-8 card-hover group">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-zinc-50 mb-3">
                  Нумерология
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Открий значението на числата в твоя живот. Детайлни анализи базирани на рождената ти дата и име.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-brand-900/50">
                    <div className="text-2xl font-bold text-orange-400 mb-1">7</div>
                    <div className="text-xs text-zinc-500">Life Path</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-brand-900/50">
                    <div className="text-2xl font-bold text-orange-400 mb-1">3</div>
                    <div className="text-xs text-zinc-500">Expression</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-brand-900/50">
                    <div className="text-2xl font-bold text-orange-400 mb-1">9</div>
                    <div className="text-xs text-zinc-500">Soul Urge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div className="glass-card p-8 card-hover group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50 mb-3">
              Съвместимост
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Анализирай връзките си с други хора. Любовна, приятелска и бизнес съвместимост.
            </p>
          </div>

          {/* Natal Chart */}
          <div className="md:col-span-3 glass-card p-8 card-hover group border border-accent-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-6 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-accent-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-semibold text-zinc-50">
                      Натална карта
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 font-medium">ULTIMATE ONLY</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Пълна астрологична карта с всички планети, домове и аспекти. Задълбочен анализ на личността ти.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
