"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Briefcase, Activity, Loader2, Lock } from "lucide-react";

interface HoroscopeData {
  general: string;
  love: string;
  career: string;
  health: string;
  advice: string;
  luckyNumbers: number[];
  loveStars: number;
  careerStars: number;
  healthStars: number;
}

interface HoroscopeCardProps {
  zodiacSign: string;
  zodiacEmoji: string;
  zodiacName: string;
  userPlan?: 'free' | 'basic' | 'ultimate';
}

type Period = 'daily' | 'weekly' | 'monthly';

/**
 * Helper function to clean up old horoscope caches from previous days
 * Keeps localStorage clean by removing outdated horoscopes
 */
function cleanupOldHoroscopeCache(zodiacSign: string, currentDate: string) {
  try {
    const prefix = `horoscope_${zodiacSign}_`;
    const keysToRemove: string[] = [];

    // Find all horoscope cache keys for this zodiac sign
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && !key.endsWith(currentDate)) {
        keysToRemove.push(key);
      }
    }

    // Remove old cache entries
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
}

export function HoroscopeCard({ zodiacSign, zodiacEmoji, zodiacName, userPlan = 'free' }: HoroscopeCardProps) {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('daily');
  const [premiumError, setPremiumError] = useState(false);

  useEffect(() => {
    async function fetchHoroscope() {
      try {
        setLoading(true);
        setError(null);
        setPremiumError(false);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `horoscope_${zodiacSign}_${period}_${today}`;

        // Check localStorage cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            setHoroscope(cachedData);
            setLoading(false);

            // Clean up old cache entries from previous days
            cleanupOldHoroscopeCache(zodiacSign, today);
            return; // Skip API call - use cached data
          } catch (parseError) {
            console.error('Cache parse error:', parseError);
            // If cache is corrupted, continue to fetch from API
          }
        }

        // Fetch from API if no cache or cache invalid
        const response = await fetch(`/api/horoscope?zodiac=${zodiacSign}&period=${period}`);

        if (!response.ok) {
          if (response.status === 403) {
            const errorData = await response.json();
            if (errorData.premium) {
              setPremiumError(true);
              setLoading(false);
              return;
            }
          }
          throw new Error('Failed to fetch horoscope');
        }

        const data = await response.json();
        setHoroscope(data);

        // Save to localStorage for future visits today
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (storageError) {
          console.error('localStorage save error:', storageError);
          // Continue even if cache save fails
        }

        // Clean up old cache entries
        cleanupOldHoroscopeCache(zodiacSign, today);

      } catch (err) {
        console.error('Horoscope fetch error:', err);
        setError('Не успяхме да заредим хороскопа. Опитай отново.');
      } finally {
        setLoading(false);
      }
    }

    fetchHoroscope();
  }, [zodiacSign, period]);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-20 pb-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
            <p className="text-zinc-400 text-sm">Зареждаме твоя хороскоп...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !horoscope) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-red-400 text-center">{error || 'Грешка при зареждане'}</p>
        </CardContent>
      </Card>
    );
  }

  // Period labels
  const getPeriodLabel = () => {
    if (period === 'daily') return 'за днес';
    if (period === 'weekly') return 'за седмицата';
    return 'за месеца';
  };

  // Check if user can access period
  const canAccessPeriod = (p: Period) => {
    if (p === 'daily') return true;
    if (p === 'weekly') return userPlan === 'basic' || userPlan === 'ultimate';
    if (p === 'monthly') return userPlan === 'basic' || userPlan === 'ultimate';
    return false;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-zinc-50">
          <span className="text-3xl">{zodiacEmoji}</span>
          <div className="flex-1">
            <div>Твоят хороскоп {getPeriodLabel()}</div>
            <div className="text-sm font-normal text-zinc-400">
              {zodiacName}
            </div>
          </div>
        </CardTitle>

        {/* Period Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setPeriod('daily')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'daily'
                ? 'bg-accent-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Днес
          </button>
          <button
            onClick={() => canAccessPeriod('weekly') && setPeriod('weekly')}
            disabled={!canAccessPeriod('weekly')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              period === 'weekly'
                ? 'bg-accent-600 text-white'
                : canAccessPeriod('weekly')
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Седмица
            {!canAccessPeriod('weekly') && (
              <Lock className="w-3 h-3 inline-block ml-1" />
            )}
          </button>
          <button
            onClick={() => canAccessPeriod('monthly') && setPeriod('monthly')}
            disabled={!canAccessPeriod('monthly')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              period === 'monthly'
                ? 'bg-accent-600 text-white'
                : canAccessPeriod('monthly')
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Месец
            {!canAccessPeriod('monthly') && (
              <Lock className="w-3 h-3 inline-block ml-1" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Premium Error Message */}
        {premiumError && (
          <div className="p-4 bg-accent-950/30 border border-accent-800/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-accent-300 mb-2">
              <Lock className="w-4 h-4" />
              <span className="font-semibold">Premium функция</span>
            </div>
            <p className="text-zinc-300 text-sm">
              {period === 'weekly' && 'Седмичните хороскопи са достъпни за Basic и Ultimate абонати.'}
              {period === 'monthly' && 'Месечните хороскопи са достъпни за Basic и Ultimate абонати.'}
            </p>
            <a
              href="/pricing"
              className="inline-block mt-3 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Виж плановете
            </a>
          </div>
        )}

        {!premiumError && horoscope && (
          <>

        <p className="text-zinc-200 leading-relaxed mb-6">
          {horoscope.general}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-zinc-400">Любов</div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${
                    i < horoscope.loveStars
                      ? 'text-red-400 fill-red-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-zinc-400">Кариера</div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Briefcase
                  key={i}
                  className={`w-5 h-5 ${
                    i < horoscope.careerStars
                      ? 'text-blue-400 fill-blue-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-zinc-400">Здраве</div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Activity
                  key={i}
                  className={`w-5 h-5 ${
                    i < horoscope.healthStars
                      ? 'text-green-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Любов</div>
            <div className="text-zinc-200 text-sm">{horoscope.love}</div>
          </div>

          <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Кариера</div>
            <div className="text-zinc-200 text-sm">{horoscope.career}</div>
          </div>

          <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Здраве</div>
            <div className="text-zinc-200 text-sm">{horoscope.health}</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent-950/30 rounded-lg border border-accent-800/50">
          <div className="text-sm text-accent-300 mb-2 font-semibold">Съвет на деня</div>
          <div className="text-zinc-200 text-sm">{horoscope.advice}</div>
        </div>

        <div className="mt-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-400 mb-2">Късметлийски числа</div>
          <div className="flex gap-2">
            {horoscope.luckyNumbers.map((num) => (
              <div
                key={num}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-100 font-semibold"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
