/**
 * Transits - анализ на текущи планетни позиции спрямо натална карта
 *
 * Транзитите са движението на планетите в момента спрямо тяхното положение в натална карта.
 * Те показват текущи влияния, възможности и предизвикателства.
 */

import type { NatalChart, PlanetPosition } from './calculations';

export interface Transit {
  transiting_planet: string;
  natal_planet: string;
  angle: number;
  aspect_type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  orb: number;
  strength: 'strong' | 'moderate' | 'weak';
  nature: 'harmonious' | 'challenging' | 'neutral';
  influence: string; // кратко описание на влиянието
}

export interface PersonalHoroscope {
  user_name: string;
  natal_chart: NatalChart;
  current_planets: Record<string, PlanetPosition>;
  forecast_type: 'monthly' | 'yearly';
  start_date: Date;
  end_date: Date;
  transits: Transit[];
  themes: {
    career: number; // 0-10 score
    love: number;
    health: number;
    finances: number;
    personal_growth: number;
  };
  highlights: string[]; // най-важните транзити
  challenges: string[]; // предизвикателства
  opportunities: string[]; // възможности
}

const ASPECT_ANGLES = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
} as const;

const ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 7,
  sextile: 6,
} as const;

/**
 * Симулирани текущи планетни позиции
 * В production тук ще се използва Swiss Ephemeris или Astronomy API
 */
export function getCurrentPlanetaryPositions(date: Date = new Date()): Record<string, PlanetPosition> {
  // За целите на демото, симулираме позиции базирани на датата
  // В production ще използваме реални епфемериди

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

  return {
    Sun: {
      sign: getZodiacSignForDay(dayOfYear),
      degree: (dayOfYear * 0.986) % 30, // Слънцето се движи ~1° на ден
      house: 1,
    },
    Moon: {
      sign: getZodiacSignForDay((dayOfYear * 13) % 365), // Луната се движи бързо
      degree: (dayOfYear * 13.176) % 30,
      house: 1,
    },
    Mercury: {
      sign: getZodiacSignForDay(dayOfYear + 15),
      degree: (dayOfYear * 1.6) % 30,
      house: 1,
    },
    Venus: {
      sign: getZodiacSignForDay(dayOfYear + 30),
      degree: (dayOfYear * 1.2) % 30,
      house: 1,
    },
    Mars: {
      sign: getZodiacSignForDay(dayOfYear + 45),
      degree: (dayOfYear * 0.524) % 30,
      house: 1,
    },
    Jupiter: {
      sign: getZodiacSignForDay(Math.floor(dayOfYear / 365 * 12)),
      degree: (dayOfYear * 0.083) % 30,
      house: 1,
    },
    Saturn: {
      sign: getZodiacSignForDay(Math.floor(dayOfYear / 365 * 12.4)),
      degree: (dayOfYear * 0.033) % 30,
      house: 1,
    },
    Uranus: {
      sign: getZodiacSignForDay(Math.floor(dayOfYear / 365 * 84)),
      degree: (dayOfYear * 0.012) % 30,
      house: 1,
    },
    Neptune: {
      sign: getZodiacSignForDay(Math.floor(dayOfYear / 365 * 165)),
      degree: (dayOfYear * 0.006) % 30,
      house: 1,
    },
    Pluto: {
      sign: getZodiacSignForDay(Math.floor(dayOfYear / 365 * 248)),
      degree: (dayOfYear * 0.004) % 30,
      house: 1,
    },
  };
}

function getZodiacSignForDay(dayOffset: number): string {
  const signs = [
    'Козирог', 'Водолей', 'Риби', 'Овен', 'Телец', 'Близнаци',
    'Рак', 'Лъв', 'Дева', 'Везни', 'Скорпион', 'Стрелец'
  ];

  const signIndex = Math.floor((dayOffset / 30.44) % 12);
  return signs[signIndex];
}

/**
 * Изчислява аспекта между две планети
 */
function calculateAspect(
  planet1Degree: number,
  planet2Degree: number
): { type: keyof typeof ASPECT_ANGLES; orb: number; strength: 'strong' | 'moderate' | 'weak' } | null {
  // Конвертираме зодиакални знаци + градуси в абсолютни градуси (0-360)
  let angleDiff = Math.abs(planet1Degree - planet2Degree);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;

  for (const [aspectType, targetAngle] of Object.entries(ASPECT_ANGLES)) {
    const orb = Math.abs(angleDiff - targetAngle);
    const maxOrb = ASPECT_ORBS[aspectType as keyof typeof ASPECT_ORBS];

    if (orb <= maxOrb) {
      let strength: 'strong' | 'moderate' | 'weak';
      if (orb <= maxOrb * 0.3) strength = 'strong';
      else if (orb <= maxOrb * 0.6) strength = 'moderate';
      else strength = 'weak';

      return {
        type: aspectType as keyof typeof ASPECT_ANGLES,
        orb,
        strength,
      };
    }
  }

  return null;
}

/**
 * Конвертира позиция на планета в абсолютни градуси (0-360)
 */
function getAbsoluteDegree(planet: PlanetPosition): number {
  const signOrder = [
    'Овен', 'Телец', 'Близнаци', 'Рак', 'Лъв', 'Дева',
    'Везни', 'Скорпион', 'Стрелец', 'Козирог', 'Водолей', 'Риби'
  ];

  const signIndex = signOrder.indexOf(planet.sign);
  return signIndex * 30 + planet.degree;
}

/**
 * Определя природата на аспекта
 */
function getAspectNature(aspectType: string): 'harmonious' | 'challenging' | 'neutral' {
  if (aspectType === 'trine' || aspectType === 'sextile') return 'harmonious';
  if (aspectType === 'square' || aspectType === 'opposition') return 'challenging';
  return 'neutral';
}

/**
 * Генерира кратко описание на транзита
 */
function getTransitInfluence(transitingPlanet: string, natalPlanet: string, aspectType: string): string {
  const influences: Record<string, Record<string, Record<string, string>>> = {
    Sun: {
      Sun: {
        conjunction: 'Ново начало, витализиране на личността',
        trine: 'Хармония, увереност, лека реализация на цели',
        square: 'Предизвикателства с авторитети, его конфликти',
        opposition: 'Напрежение в партньорства, баланс между "аз" и другите',
        sextile: 'Възможности за израстване, творчески импулси',
      },
      Moon: {
        conjunction: 'Емоционална интензивност, нови чувства',
        trine: 'Емоционален комфорт, хармония в дома',
        square: 'Емоционално напрежение, стрес',
        opposition: 'Конфликт между логика и емоции',
        sextile: 'Интуиция, емоционална яснота',
      },
    },
    Jupiter: {
      Sun: {
        conjunction: 'Разширяване, късмет, оптимизъм',
        trine: 'Растеж, щастливи възможности',
        square: 'Прекомерност, нереалистични очаквания',
        opposition: 'Баланс между растеж и реалност',
        sextile: 'Лесни възможности за успех',
      },
      Venus: {
        conjunction: 'Любовен късмет, финансов растеж',
        trine: 'Хармония в отношенията, щедрост',
        square: 'Прекалено разточителство, излишества',
        opposition: 'Баланс между желания и реалност',
        sextile: 'Социални възможности, удоволствия',
      },
    },
    Saturn: {
      Sun: {
        conjunction: 'Сериозност, отговорности, структура',
        trine: 'Дисциплина, дългосрочен успех',
        square: 'Ограничения, предизвикателства с авторитети',
        opposition: 'Тежест, отговорности в отношенията',
        sextile: 'Практичност, стабилност',
      },
      Moon: {
        conjunction: 'Емоционална зрялост, меланхолия',
        trine: 'Емоционална стабилност, сигурност',
        square: 'Емоционални ограничения, самота',
        opposition: 'Баланс между емоции и отговорности',
        sextile: 'Емоционална дисциплина',
      },
    },
  };

  return influences[transitingPlanet]?.[natalPlanet]?.[aspectType] ||
         `${transitingPlanet} ${aspectType} ${natalPlanet}`;
}

/**
 * Изчислява всички транзити между текущи и натални планети
 */
export function calculateTransits(
  natalChart: NatalChart,
  currentPlanets: Record<string, PlanetPosition>
): Transit[] {
  const transits: Transit[] = [];

  for (const [transitingPlanetName, transitingPos] of Object.entries(currentPlanets)) {
    for (const [natalPlanetName, natalPos] of Object.entries(natalChart.planets)) {
      const transitingDegree = getAbsoluteDegree(transitingPos);
      const natalDegree = getAbsoluteDegree(natalPos);

      const aspect = calculateAspect(transitingDegree, natalDegree);

      if (aspect) {
        transits.push({
          transiting_planet: transitingPlanetName,
          natal_planet: natalPlanetName,
          angle: ASPECT_ANGLES[aspect.type],
          aspect_type: aspect.type,
          orb: aspect.orb,
          strength: aspect.strength,
          nature: getAspectNature(aspect.type),
          influence: getTransitInfluence(transitingPlanetName, natalPlanetName, aspect.type),
        });
      }
    }
  }

  // Сортираме по сила
  return transits.sort((a, b) => {
    const strengthOrder = { strong: 0, moderate: 1, weak: 2 };
    return strengthOrder[a.strength] - strengthOrder[b.strength];
  });
}

/**
 * Анализира теми в живота базирани на транзитите
 */
function analyzeLifeThemes(transits: Transit[]): PersonalHoroscope['themes'] {
  const themes = {
    career: 5, // базова оценка
    love: 5,
    health: 5,
    finances: 5,
    personal_growth: 5,
  };

  for (const transit of transits) {
    const weight = transit.strength === 'strong' ? 1.5 : transit.strength === 'moderate' ? 1 : 0.5;
    const modifier = transit.nature === 'harmonious' ? 1 : transit.nature === 'challenging' ? -1 : 0;

    // Кариера: Слънце, Сатурн, Марс, Юпитер към 10-ти дом или MC
    if (['Sun', 'Saturn', 'Mars', 'Jupiter'].includes(transit.transiting_planet)) {
      themes.career += weight * modifier * 0.5;
    }

    // Любов: Венера, Марс към Слънце, Луна, Венера
    if (['Venus', 'Mars'].includes(transit.transiting_planet) &&
        ['Sun', 'Moon', 'Venus'].includes(transit.natal_planet)) {
      themes.love += weight * modifier * 0.5;
    }

    // Здраве: Сатурн, Марс, Плутон
    if (['Saturn', 'Mars', 'Pluto'].includes(transit.transiting_planet)) {
      themes.health += weight * modifier * 0.3;
    }

    // Финанси: Юпитер, Сатурн към Венера, Юпитер
    if (['Jupiter', 'Saturn'].includes(transit.transiting_planet) &&
        ['Venus', 'Jupiter'].includes(transit.natal_planet)) {
      themes.finances += weight * modifier * 0.5;
    }

    // Личностен растеж: Юпитер, Уран, Нептун, Плутон
    if (['Jupiter', 'Uranus', 'Neptune', 'Pluto'].includes(transit.transiting_planet)) {
      themes.personal_growth += weight * modifier * 0.4;
    }
  }

  // Нормализираме до 0-10
  for (const key of Object.keys(themes) as Array<keyof typeof themes>) {
    themes[key] = Math.max(0, Math.min(10, themes[key]));
  }

  return themes;
}

/**
 * Генерира личен хороскоп базиран на натална карта и транзити
 */
export function generatePersonalHoroscope(
  userName: string,
  natalChart: NatalChart,
  forecastType: 'monthly' | 'yearly',
  startDate: Date = new Date()
): PersonalHoroscope {
  // За месечен - гледаме текущите позиции
  // За годишен - Solar Return (слънцето се връща на натална позиция)
  const currentPlanets = getCurrentPlanetaryPositions(startDate);

  const endDate = new Date(startDate);
  if (forecastType === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  const transits = calculateTransits(natalChart, currentPlanets);
  const themes = analyzeLifeThemes(transits);

  // Извличаме highlights, challenges, opportunities
  const highlights = transits
    .filter(t => t.strength === 'strong' && t.nature === 'harmonious')
    .slice(0, 3)
    .map(t => `${t.transiting_planet} ${t.aspect_type} ${t.natal_planet}: ${t.influence}`);

  const challenges = transits
    .filter(t => t.strength === 'strong' && t.nature === 'challenging')
    .slice(0, 3)
    .map(t => `${t.transiting_planet} ${t.aspect_type} ${t.natal_planet}: ${t.influence}`);

  const opportunities = transits
    .filter(t => (t.strength === 'strong' || t.strength === 'moderate') && t.nature === 'harmonious')
    .slice(0, 5)
    .map(t => `${t.transiting_planet} ${t.aspect_type} ${t.natal_planet}: ${t.influence}`);

  return {
    user_name: userName,
    natal_chart: natalChart,
    current_planets: currentPlanets,
    forecast_type: forecastType,
    start_date: startDate,
    end_date: endDate,
    transits,
    themes,
    highlights,
    challenges,
    opportunities,
  };
}
