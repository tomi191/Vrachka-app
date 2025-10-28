'use client';

import { Sparkles, Target, Users } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';

/**
 * VrachkaIntro Component
 * Introduces Vrachka platform with mission and target audience
 */
export function VrachkaIntro() {
  return (
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
    </div>
  );
}
