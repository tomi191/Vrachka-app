"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Lock, Loader2, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NatalChart {
  id: string;
  birth_date: string;
  birth_time: string;
  birth_location: any;
}

interface SynastryFormProps {
  hasUltimatePlan: boolean;
  natalCharts: NatalChart[];
  userName: string;
}

export function SynastryForm({ hasUltimatePlan, natalCharts, userName }: SynastryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedChart, setSelectedChart] = useState(natalCharts[0]?.id || '');
  const [partnerName, setPartnerName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('България');
  const [latitude, setLatitude] = useState('42.6977');
  const [longitude, setLongitude] = useState('23.3219');

  if (!hasUltimatePlan) {
    return (
      <Card className="glass-card border-accent-500/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent-950/50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">
              Premium Функция
            </h3>
            <p className="text-zinc-300 max-w-md mx-auto">
              Синастрията е достъпна само за Ultimate план потребители. Открий астрологичната ви съвместимост с партньор.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold transition-colors"
              >
                Upgrade към Ultimate
              </Link>
              <Link
                href="/features"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-semibold transition-colors"
              >
                Виж всички функции
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (natalCharts.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Heart className="w-12 h-12 text-accent-400 mx-auto" />
            <h3 className="text-xl font-bold text-zinc-100">
              Първо създай своята натална карта
            </h3>
            <p className="text-zinc-300">
              За да анализираме съвместимостта ти с партньор, първо трябва да имаш своя натална карта.
            </p>
            <Link
              href="/natal-chart"
              className="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold transition-colors"
            >
              Създай натална карта
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/synastry/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1_natal_chart_id: selectedChart,
          person2_name: partnerName,
          person2_birth_data: {
            date: birthDate,
            time: birthTime,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timezone: 'Europe/Sofia',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate synastry');
      }

      // Redirect to synastry result page
      router.push(`/synastry/${data.synastry_id}`);
    } catch (err) {
      console.error('Synastry error:', err);
      setError(err instanceof Error ? err.message : 'Грешка при изчисляване на синастрията');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Your Natal Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-400" />
            Твоята натална карта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block text-sm text-zinc-300 mb-2">
            Избери твоята натална карта
          </label>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
            required
          >
            {natalCharts.map((chart) => (
              <option key={chart.id} value={chart.id}>
                {chart.birth_date} {chart.birth_time} - {chart.birth_location?.city || 'Unknown'}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 mt-2">
            Това е твоята карта. Ще я сравним с картата на партньора.
          </p>
        </CardContent>
      </Card>

      {/* Partner's Data */}
      <Card className="glass-card border-accent-500/30">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Данни на партньора
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Partner Name */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Име на партньора
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Иван, Мария..."
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Дата на раждане
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Час на раждане
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              Точният час е важен за прецизна синастрия
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Място на раждане
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Град"
                className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Държава"
                className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
            </div>
          </div>

          {/* Coordinates (optional advanced) */}
          <details className="text-sm">
            <summary className="text-zinc-400 cursor-pointer hover:text-zinc-300">
              Разширени настройки (координати)
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Изчисляване на съвместимостта...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            Анализирай съвместимостта
          </>
        )}
      </button>
    </form>
  );
}
