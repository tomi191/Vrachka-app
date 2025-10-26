'use client';

import { Calendar, TrendingUp, Heart, Briefcase, Activity, DollarSign, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PersonalHoroscope {
  id: string;
  forecast_type: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  themes: {
    career: number;
    love: number;
    health: number;
    finances: number;
    personal_growth: number;
  };
  highlights: string[];
  challenges: string[];
  opportunities: string[];
  interpretation: {
    overview: string;
    career: string;
    love: string;
    health: string;
    finances: string;
    personal_growth: string;
    key_dates: string[];
    advice: string[];
  };
  generated_at: string;
}

interface PersonalHoroscopeViewProps {
  horoscope: PersonalHoroscope;
}

export function PersonalHoroscopeView({ horoscope }: PersonalHoroscopeViewProps) {
  const forecastLabel = horoscope.forecast_type === 'monthly' ? 'Месечен' : 'Годишен';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        href="/personal-horoscope"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад към личен хороскоп
      </Link>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50 mb-2">
              {forecastLabel} Хороскоп
            </h1>
            <p className="text-zinc-400">
              {new Date(horoscope.start_date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(horoscope.end_date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            Генериран на<br />
            {new Date(horoscope.generated_at).toLocaleDateString('bg-BG')}
          </div>
        </div>

        {/* Themes Bar */}
        <div className="grid grid-cols-5 gap-3 mt-6">
          <ThemeScore icon={<Briefcase />} label="Кариера" score={horoscope.themes.career} />
          <ThemeScore icon={<Heart />} label="Любов" score={horoscope.themes.love} />
          <ThemeScore icon={<Activity />} label="Здраве" score={horoscope.themes.health} />
          <ThemeScore icon={<DollarSign />} label="Финанси" score={horoscope.themes.finances} />
          <ThemeScore icon={<Sparkles />} label="Растеж" score={horoscope.themes.personal_growth} />
        </div>
      </div>

      {/* Overview */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-zinc-50 mb-4">
          Обща прогноза
        </h2>
        <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
          {horoscope.interpretation.overview}
        </div>
      </div>

      {/* Quick Highlights/Challenges/Opportunities */}
      <div className="grid md:grid-cols-3 gap-4">
        {horoscope.highlights.length > 0 && (
          <div className="glass-card p-5 border-green-500/30">
            <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Highlights
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              {horoscope.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {horoscope.challenges.length > 0 && (
          <div className="glass-card p-5 border-yellow-500/30">
            <h3 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Предизвикателства
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              {horoscope.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {horoscope.opportunities.length > 0 && (
          <div className="glass-card p-5 border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Възможности
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              {horoscope.opportunities.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Career */}
      {horoscope.interpretation.career && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-accent-400" />
            Кариера и професия
          </h2>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {horoscope.interpretation.career}
          </div>
        </div>
      )}

      {/* Love */}
      {horoscope.interpretation.love && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            Любов и отношения
          </h2>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {horoscope.interpretation.love}
          </div>
        </div>
      )}

      {/* Health */}
      {horoscope.interpretation.health && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Здраве и жизненост
          </h2>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {horoscope.interpretation.health}
          </div>
        </div>
      )}

      {/* Finances */}
      {horoscope.interpretation.finances && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-yellow-400" />
            Финанси
          </h2>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {horoscope.interpretation.finances}
          </div>
        </div>
      )}

      {/* Personal Growth */}
      {horoscope.interpretation.personal_growth && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Личностно развитие
          </h2>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {horoscope.interpretation.personal_growth}
          </div>
        </div>
      )}

      {/* Key Dates */}
      {horoscope.interpretation.key_dates && horoscope.interpretation.key_dates.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Важни дати
          </h2>
          <ul className="space-y-3">
            {horoscope.interpretation.key_dates.map((date, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg">
                <span className="text-blue-400 font-bold">{i + 1}.</span>
                <span className="text-zinc-300">{date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advice */}
      {horoscope.interpretation.advice && horoscope.interpretation.advice.length > 0 && (
        <div className="glass-card p-6 border-accent-500/30">
          <h2 className="text-2xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-400" />
            Съвети за {horoscope.forecast_type === 'monthly' ? 'месеца' : 'годината'}
          </h2>
          <ul className="space-y-3">
            {horoscope.interpretation.advice.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-accent-900/10 rounded-lg border border-accent-500/20">
                <span className="text-accent-400 font-bold flex-shrink-0">✓</span>
                <span className="text-zinc-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex gap-3">
        <Link
          href="/personal-horoscope"
          className="flex-1 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold text-center"
        >
          Генерирай нов хороскоп
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors font-semibold"
        >
          Към Dashboard
        </Link>
      </div>
    </div>
  );
}

function ThemeScore({ icon, label, score }: { icon: React.ReactNode; label: string; score: number }) {
  const percentage = (score / 10) * 100;

  let color = 'bg-zinc-600';
  if (score >= 7) color = 'bg-green-500';
  else if (score >= 5) color = 'bg-yellow-500';
  else if (score >= 3) color = 'bg-orange-500';
  else color = 'bg-red-500';

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2 text-zinc-400">
        {icon}
      </div>
      <div className="text-xs text-zinc-400 mb-2">{label}</div>
      <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm font-bold text-zinc-300 mt-1">
        {score.toFixed(1)}/10
      </div>
    </div>
  );
}
