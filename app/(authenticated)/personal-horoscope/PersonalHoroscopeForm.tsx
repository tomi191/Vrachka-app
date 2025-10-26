'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';

interface NatalChart {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  created_at: string;
}

interface PersonalHoroscopeFormProps {
  userName: string;
  natalCharts: NatalChart[];
}

export function PersonalHoroscopeForm({ userName, natalCharts }: PersonalHoroscopeFormProps) {
  const router = useRouter();

  const [selectedChart, setSelectedChart] = useState(natalCharts[0]?.id || '');
  const [forecastType, setForecastType] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/personal-horoscope/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natal_chart_id: selectedChart,
          forecast_type: forecastType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Възникна грешка');
      }

      // Redirect to the generated horoscope
      router.push(`/personal-horoscope/${data.horoscope_id}`);
    } catch (err: any) {
      console.error('[Personal Horoscope Form] Error:', err);
      setError(err.message || 'Възникна грешка при генерирането на хороскопа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-zinc-50 mb-6">
        Генерирай Нов Хороскоп
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Natal Chart Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Избери натална карта
          </label>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-accent-500"
            required
          >
            {natalCharts.map((chart) => (
              <option key={chart.id} value={chart.id}>
                {new Date(chart.birth_date).toLocaleDateString('bg-BG')} в {chart.birth_time} - {chart.birth_location}
              </option>
            ))}
          </select>
        </div>

        {/* Forecast Type Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Тип прогноза
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForecastType('monthly')}
              className={`p-4 rounded-lg border-2 transition-all ${
                forecastType === 'monthly'
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-accent-400" />
                <span className="font-semibold text-zinc-100">Месечен</span>
              </div>
              <p className="text-sm text-zinc-400 text-left">
                Прогноза за следващите 30 дни
              </p>
            </button>

            <button
              type="button"
              onClick={() => setForecastType('yearly')}
              className={`p-4 rounded-lg border-2 transition-all ${
                forecastType === 'yearly'
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-400" />
                <span className="font-semibold text-zinc-100">Годишен</span>
              </div>
              <p className="text-sm text-zinc-400 text-left">
                Прогноза за следващата година
              </p>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-300">
              <p className="mb-2">
                <strong>Месечен хороскоп:</strong> Детайлна прогноза за следващите 30 дни с фокус върху текущи транзити и ежедневни влияния.
              </p>
              <p>
                <strong>Годишен хороскоп:</strong> Широка перспектива на следващата година с акцент върху дългосрочни цикли и важни периоди.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedChart}
          className="w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Генериране...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Генерирай {forecastType === 'monthly' ? 'Месечен' : 'Годишен'} Хороскоп
            </>
          )}
        </button>

        <p className="text-xs text-zinc-500 text-center">
          Генерирането на хороскопа може да отнеме 10-15 секунди
        </p>
      </form>
    </div>
  );
}
