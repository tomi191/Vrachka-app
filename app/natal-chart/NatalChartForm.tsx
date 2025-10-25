"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, Loader2, Sparkles } from 'lucide-react';

export function NatalChartForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Popular Bulgarian cities with coordinates
  const popularCities = [
    { name: 'София', country: 'България', lat: 42.6977, lng: 23.3219 },
    { name: 'Пловдив', country: 'България', lat: 42.1354, lng: 24.7453 },
    { name: 'Варна', country: 'България', lat: 43.2141, lng: 27.9147 },
    { name: 'Бургас', country: 'България', lat: 42.5048, lng: 27.4626 },
    { name: 'Русе', country: 'България', lat: 43.8564, lng: 25.9656 },
  ];

  const selectCity = (cityData: typeof popularCities[0]) => {
    setCity(cityData.name);
    setCountry(cityData.country);
    setLatitude(cityData.lat);
    setLongitude(cityData.lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!birthDate || !birthTime || !city || latitude === null || longitude === null) {
      setError('Моля попълнете всички полета');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/natal-chart/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
          location: {
            city,
            country,
            latitude,
            longitude,
            timezone: 'Europe/Sofia', // Default to Sofia timezone
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate natal chart');
      }

      // Redirect to chart view
      router.push(`/natal-chart/${data.chart_id}`);
    } catch (err) {
      console.error('Error creating natal chart:', err);
      setError(err instanceof Error ? err.message : 'Нещо се обърка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Дата на раждане
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>

      {/* Birth Time */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          <Clock className="w-4 h-4 inline mr-2" />
          Час на раждане
        </label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          required
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Ако не знаеш точния час, използвай 12:00
        </p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Място на раждане
        </label>

        {/* Popular cities quick select */}
        <div className="mb-3">
          <p className="text-xs text-zinc-500 mb-2">Популярни градове:</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((cityData) => (
              <button
                key={cityData.name}
                type="button"
                onClick={() => selectCity(cityData)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  city === cityData.name
                    ? 'bg-accent-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {cityData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Manual input */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Град"
            required
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Държава"
            required
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <input
            type="number"
            step="0.0001"
            value={latitude || ''}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            placeholder="Latitude"
            required
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <input
            type="number"
            step="0.0001"
            value={longitude || ''}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            placeholder="Longitude"
            required
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Изчисляване...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Създай Натална Карта
          </>
        )}
      </button>

      <p className="text-xs text-zinc-500 text-center">
        Изчислението отнема около 30 секунди
      </p>
    </form>
  );
}
