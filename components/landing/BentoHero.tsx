'use client';

import { Star, Sparkles, Zap, Heart } from 'lucide-react';
import { ZodiacIcon } from '@/components/icons/zodiac';

export function BentoHero() {
  return (
    <div className="mt-20 max-w-7xl mx-auto">
      {/* Bento Grid Container - Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[500px]">

        {/* Large Card - Horoscope Preview (spans 2x2) */}
        <div className="md:col-span-2 md:row-span-2 glass-card p-8 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent-400" />
              <span className="text-sm text-accent-400 font-medium">Дневен Хороскоп</span>
            </div>
            <h3 className="text-2xl font-bold text-zinc-50 mb-3">
              Персонализирани прогнози
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
              AI-генерирани хороскопи базирани на твоята натална карта. Актуализират се ежедневно с детайлни насоки за любов, кариера и здраве.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['oven', 'lav', 'skorpion'].map((sign) => (
                  <div key={sign} className="w-12 h-12 rounded-full bg-brand-900 border-2 border-brand-800 flex items-center justify-center">
                    <ZodiacIcon sign={sign as any} size={24} className="text-accent-400" />
                  </div>
                ))}
              </div>
              <span className="text-sm text-zinc-500">12 зодии</span>
            </div>
          </div>
        </div>

        {/* Tarot Card - Interactive (spans 1x2) */}
        <div className="md:col-span-1 md:row-span-2 glass-card p-6 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Таро</span>
            </div>
            <div className="flex-1 flex items-center justify-center mb-4">
              <div className="w-32 h-48 rounded-xl bg-gradient-to-br from-purple-600/20 to-accent-600/20 border-2 border-purple-500/30 flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                <Star className="w-16 h-16 text-purple-300" />
              </div>
            </div>
            <p className="text-sm text-zinc-400 text-center">78 карти с AI интерпретации</p>
          </div>
        </div>

        {/* Oracle Chat Preview (spans 1x2) */}
        <div className="md:col-span-1 md:row-span-2 glass-card p-6 card-hover group">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">AI Оракул</span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="bg-brand-900/50 rounded-lg p-3 text-sm text-zinc-300">
              &ldquo;Как мога да подобря връзката си?&rdquo;
            </div>
            <div className="bg-accent-500/10 rounded-lg p-3 text-sm text-zinc-300 border border-accent-500/20">
              &ldquo;Започни с честен разговор за очакванията...&rdquo;
            </div>
          </div>
          <p className="text-xs text-zinc-500">24/7 духовни консултации</p>
        </div>

        {/* Compatibility Checker (spans full width in row 3) */}
        <div className="md:col-span-4 md:row-span-1 glass-card p-6 card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-pink-400 font-medium">Съвместимост</span>
              </div>
              <p className="text-sm text-zinc-400">Анализ на отношения между зодии</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/20 to-accent-500/20 flex items-center justify-center">
                <ZodiacIcon sign="lav" size={28} className="text-pink-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-50">+</div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <ZodiacIcon sign="vezni" size={28} className="text-purple-400" />
              </div>
              <div className="text-xl font-bold text-green-400">=</div>
              <div className="text-2xl font-bold text-green-400">85%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
