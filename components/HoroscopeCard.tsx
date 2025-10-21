"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Briefcase, Activity, Loader2 } from "lucide-react";

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
}

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

export function HoroscopeCard({ zodiacSign, zodiacEmoji, zodiacName }: HoroscopeCardProps) {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHoroscope() {
      try {
        setLoading(true);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `horoscope_${zodiacSign}_${today}`;

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
        const response = await fetch(`/api/horoscope?zodiac=${zodiacSign}&period=daily`);

        if (!response.ok) {
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
  }, [zodiacSign]);

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

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-zinc-50">
          <span className="text-3xl">{zodiacEmoji}</span>
          <div>
            <div>Твоят хороскоп за днес</div>
            <div className="text-sm font-normal text-zinc-400">
              {zodiacName}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
