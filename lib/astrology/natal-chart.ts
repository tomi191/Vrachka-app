/**
 * Natal Chart Calculator
 * Uses circular-natal-horoscope-js for astronomical calculations
 */

import * as OriginModule from 'circular-natal-horoscope-js';
// Be resilient to different module export shapes: default, named Origin, or module itself
const OriginClass: any = (OriginModule as any).Origin || (OriginModule as any).default || (OriginModule as any);

export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24-hour)
  latitude: number;
  longitude: number;
  timezone?: string; // e.g., 'Europe/Sofia'
}

export interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
  emoji: string;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string; // conjunction, opposition, trine, square, sextile
  angle: number;
  orb: number;
}

export interface NatalChart {
  sun: Planet;
  moon: Planet;
  rising: Planet; // Ascendant
  mercury: Planet;
  venus: Planet;
  mars: Planet;
  jupiter: Planet;
  saturn: Planet;
  uranus: Planet;
  neptune: Planet;
  pluto: Planet;
  houses: House[];
  aspects: Aspect[];
  calculated_at: string;
}

/**
 * Calculate natal chart from birth data
 */
export async function calculateNatalChart(birthData: BirthData): Promise<NatalChart> {
  try {
    // Parse date and time
    const [year, month, day] = birthData.date.split('-').map(Number);
    const [hour, minute] = birthData.time.split(':').map(Number);

    // Create origin (birth data) — try 0-indexed month first, then 1-indexed as fallback
    let origin: any;
    let lastError: unknown;
    try {
      origin = new OriginClass({
        year,
        month: month - 1,
        date: day,
        hour,
        minute,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
      });
    } catch (e) {
      lastError = e;
      try {
        origin = new OriginClass({
          year,
          month, // some builds expect 1-12
          date: day,
          hour,
          minute,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
        });
      } catch (e2) {
        throw lastError || e2;
      }
    }

    // Get planetary positions
    const celestialBodies = origin.CelestialBodies;
    const houses = origin.Houses;
    const aspects = origin.Aspects;

    // Map planets with Bulgarian names and emojis
    const planetMap: Record<string, { emoji: string; bg: string }> = {
      sun: { emoji: '☀️', bg: 'Слънце' },
      moon: { emoji: '🌙', bg: 'Луна' },
      mercury: { emoji: '☿️', bg: 'Меркурий' },
      venus: { emoji: '♀️', bg: 'Венера' },
      mars: { emoji: '♂️', bg: 'Марс' },
      jupiter: { emoji: '♃', bg: 'Юпитер' },
      saturn: { emoji: '♄', bg: 'Сатурн' },
      uranus: { emoji: '♅', bg: 'Уран' },
      neptune: { emoji: '♆', bg: 'Нептун' },
      pluto: { emoji: '♇', bg: 'Плутон' },
    };

    // Zodiac signs in Bulgarian
    const zodiacMap: Record<string, string> = {
      aries: 'Овен',
      taurus: 'Телец',
      gemini: 'Близнаци',
      cancer: 'Рак',
      leo: 'Лъв',
      virgo: 'Дева',
      libra: 'Везни',
      scorpio: 'Скорпион',
      sagittarius: 'Стрелец',
      capricorn: 'Козирог',
      aquarius: 'Водолей',
      pisces: 'Риби',
    };

    // Extract planetary data
    const mapPlanet = (planetName: string, data: any): Planet => {
      const sign = data.Sign.key.toLowerCase();
      return {
        name: planetMap[planetName]?.bg || planetName,
        sign: zodiacMap[sign] || sign,
        degree: Math.round(data.ChartPosition.Ecliptic.DecimalDegrees * 100) / 100,
        house: data.House || 1,
        retrograde: data.isRetrograde || false,
        emoji: planetMap[planetName]?.emoji || '⭐',
      };
    };

    // Build natal chart
    const natalChart: NatalChart = {
      sun: mapPlanet('sun', celestialBodies.sun),
      moon: mapPlanet('moon', celestialBodies.moon),
      rising: {
        name: 'Възходящ знак',
        sign: zodiacMap[houses.Houses[0].Sign.key.toLowerCase()] || 'Unknown',
        degree: Math.round(houses.Houses[0].ChartPosition.StartPosition.Ecliptic.DecimalDegrees * 100) / 100,
        house: 1,
        retrograde: false,
        emoji: '⬆️',
      },
      mercury: mapPlanet('mercury', celestialBodies.mercury),
      venus: mapPlanet('venus', celestialBodies.venus),
      mars: mapPlanet('mars', celestialBodies.mars),
      jupiter: mapPlanet('jupiter', celestialBodies.jupiter),
      saturn: mapPlanet('saturn', celestialBodies.saturn),
      uranus: mapPlanet('uranus', celestialBodies.uranus),
      neptune: mapPlanet('neptune', celestialBodies.neptune),
      pluto: mapPlanet('pluto', celestialBodies.pluto),
      houses: houses.Houses.map((house: any, index: number) => ({
        number: index + 1,
        sign: zodiacMap[house.Sign.key.toLowerCase()] || 'Unknown',
        degree: Math.round(house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees * 100) / 100,
      })),
      aspects: aspects.all.map((aspect: any) => ({
        planet1: planetMap[aspect.firstPlanetName]?.bg || aspect.firstPlanetName,
        planet2: planetMap[aspect.secondPlanetName]?.bg || aspect.secondPlanetName,
        type: aspect.name.toLowerCase(),
        angle: Math.round(aspect.angle * 100) / 100,
        orb: Math.round(aspect.orb * 100) / 100,
      })),
      calculated_at: new Date().toISOString(),
    };

    return natalChart;
  } catch (error) {
    console.error('[Natal Chart] Calculation error:', error);
    // Preserve original error message in development for easier debugging
    const msg = process.env.NODE_ENV !== 'production'
      ? `Failed to calculate natal chart: ${error instanceof Error ? error.message : String(error)}`
      : 'Failed to calculate natal chart. Please check birth data.';
    throw new Error(msg);
  }
}

/**
 * Get simplified birth chart summary (for display)
 */
export function getChartSummary(chart: NatalChart): string {
  return `
${chart.sun.emoji} Слънце в ${chart.sun.sign} (${chart.sun.degree}°)
${chart.moon.emoji} Луна в ${chart.moon.sign} (${chart.moon.degree}°)
⬆️ Възходящ знак: ${chart.rising.sign} (${chart.rising.degree}°)

Планети:
${chart.mercury.emoji} ${chart.mercury.name}: ${chart.mercury.sign} (${chart.mercury.degree}°)
${chart.venus.emoji} ${chart.venus.name}: ${chart.venus.sign} (${chart.venus.degree}°)
${chart.mars.emoji} ${chart.mars.name}: ${chart.mars.sign} (${chart.mars.degree}°)
${chart.jupiter.emoji} ${chart.jupiter.name}: ${chart.jupiter.sign} (${chart.jupiter.degree}°)
${chart.saturn.emoji} ${chart.saturn.name}: ${chart.saturn.sign} (${chart.saturn.degree}°)
  `.trim();
}

/**
 * Validate birth data
 */
export function validateBirthData(birthData: Partial<BirthData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate date
  if (!birthData.date || !/^\d{4}-\d{2}-\d{2}$/.test(birthData.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }

  // Validate time
  if (!birthData.time || !/^\d{2}:\d{2}$/.test(birthData.time)) {
    errors.push('Invalid time format. Use HH:MM');
  }

  // Validate coordinates
  if (birthData.latitude === undefined || birthData.latitude < -90 || birthData.latitude > 90) {
    errors.push('Invalid latitude. Must be between -90 and 90');
  }

  if (birthData.longitude === undefined || birthData.longitude < -180 || birthData.longitude > 180) {
    errors.push('Invalid longitude. Must be between -180 and 180');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
