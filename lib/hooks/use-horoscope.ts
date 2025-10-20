import { useQuery } from "@tanstack/react-query";

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

interface UseHoroscopeOptions {
  zodiacSign: string;
  period?: 'daily' | 'weekly' | 'monthly';
  enabled?: boolean;
}

export function useHoroscope({
  zodiacSign,
  period = 'daily',
  enabled = true
}: UseHoroscopeOptions) {
  return useQuery({
    queryKey: ['horoscope', zodiacSign, period],
    queryFn: async () => {
      const response = await fetch(
        `/api/horoscope?zodiac=${encodeURIComponent(zodiacSign)}&period=${period}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch horoscope');
      }

      return response.json() as Promise<HoroscopeData>;
    },
    enabled: enabled && !!zodiacSign,
    staleTime: period === 'daily' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // Daily: 1h, Weekly/Monthly: 24h
    gcTime: period === 'daily' ? 2 * 60 * 60 * 1000 : 48 * 60 * 60 * 1000, // Daily: 2h, Weekly/Monthly: 48h
  });
}
