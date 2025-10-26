/**
 * Synastry Analysis - Астрологична съвместимост между 2 натални карти
 */

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  emoji: string;
}

interface NatalChart {
  sun: Planet;
  moon: Planet;
  mercury: Planet;
  venus: Planet;
  mars: Planet;
  jupiter: Planet;
  saturn: Planet;
  uranus: Planet;
  neptune: Planet;
  pluto: Planet;
  rising: { sign: string; degree: number };
}

export interface SynastryAspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  orb: number;
  strength: 'strong' | 'moderate' | 'weak';
  nature: 'harmonious' | 'challenging' | 'neutral';
}

export interface SynastryResult {
  person1_name: string;
  person2_name: string;
  aspects: SynastryAspect[];
  compatibility_score: number;
  love_score: number;
  communication_score: number;
  sexual_score: number;
  longevity_score: number;
}

/**
 * Calculate the angular distance between two planets
 */
function calculateAngle(degree1: number, degree2: number): number {
  let angle = Math.abs(degree1 - degree2);
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
}

/**
 * Determine aspect type based on angle
 */
function getAspectType(angle: number): { type: SynastryAspect['type'] | null; orb: number } {
  const aspects = [
    { type: 'conjunction' as const, target: 0, orb: 8 },
    { type: 'opposition' as const, target: 180, orb: 8 },
    { type: 'trine' as const, target: 120, orb: 8 },
    { type: 'square' as const, target: 90, orb: 7 },
    { type: 'sextile' as const, target: 60, orb: 6 },
  ];

  for (const aspect of aspects) {
    const diff = Math.abs(angle - aspect.target);
    if (diff <= aspect.orb) {
      return { type: aspect.type, orb: diff };
    }
  }

  return { type: null, orb: 0 };
}

/**
 * Get aspect nature (harmonious/challenging/neutral)
 */
function getAspectNature(type: SynastryAspect['type']): SynastryAspect['nature'] {
  if (type === 'trine' || type === 'sextile') return 'harmonious';
  if (type === 'square' || type === 'opposition') return 'challenging';
  return 'neutral'; // conjunction
}

/**
 * Get aspect strength based on orb
 */
function getAspectStrength(orb: number): SynastryAspect['strength'] {
  if (orb <= 3) return 'strong';
  if (orb <= 6) return 'moderate';
  return 'weak';
}

/**
 * Convert chart data to absolute degrees (0-360)
 */
function getAbsoluteDegree(sign: string, degree: number): number {
  const signs = [
    'Овен', 'Телец', 'Близнаци', 'Рак', 'Лъв', 'Дева',
    'Везни', 'Скорпион', 'Стрелец', 'Козирог', 'Водолей', 'Риби'
  ];

  const signIndex = signs.indexOf(sign);
  if (signIndex === -1) return degree; // Fallback

  return signIndex * 30 + degree;
}

/**
 * Calculate synastry aspects between two natal charts
 */
export function calculateSynastryAspects(
  chart1: NatalChart,
  chart2: NatalChart
): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  // Important planets for synastry
  const planetsToCheck: (keyof Omit<NatalChart, 'rising'>)[] = [
    'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'
  ];

  // Check each planet from chart1 against each planet from chart2
  for (const p1Key of planetsToCheck) {
    const planet1 = chart1[p1Key];
    const deg1 = getAbsoluteDegree(planet1.sign, planet1.degree);

    for (const p2Key of planetsToCheck) {
      const planet2 = chart2[p2Key];
      const deg2 = getAbsoluteDegree(planet2.sign, planet2.degree);

      const angle = calculateAngle(deg1, deg2);
      const { type, orb } = getAspectType(angle);

      if (type) {
        aspects.push({
          planet1: `${planet1.emoji} ${planet1.name}`,
          planet2: `${planet2.emoji} ${planet2.name}`,
          angle: parseFloat(angle.toFixed(2)),
          type,
          orb: parseFloat(orb.toFixed(2)),
          strength: getAspectStrength(orb),
          nature: getAspectNature(type),
        });
      }
    }
  }

  // Sort by strength (strong first)
  aspects.sort((a, b) => {
    const strengthOrder = { strong: 0, moderate: 1, weak: 2 };
    return strengthOrder[a.strength] - strengthOrder[b.strength];
  });

  return aspects;
}

/**
 * Calculate compatibility scores
 */
export function calculateCompatibilityScores(aspects: SynastryAspect[]): {
  overall: number;
  love: number;
  communication: number;
  sexual: number;
  longevity: number;
} {
  let totalPoints = 0;
  let maxPoints = 0;

  let lovePoints = 0;
  let loveMax = 0;

  let commPoints = 0;
  let commMax = 0;

  let sexPoints = 0;
  let sexMax = 0;

  let longPoints = 0;
  let longMax = 0;

  // Love planets: Venus, Moon, Sun
  const lovePlanets = ['Венера', 'Луна', 'Слънце'];

  // Communication: Mercury, Moon
  const commPlanets = ['Меркурий', 'Луна'];

  // Sexual: Mars, Venus, Pluto
  const sexPlanets = ['Марс', 'Венера', 'Плутон'];

  // Longevity: Saturn, Jupiter, Sun
  const longPlanets = ['Сатурн', 'Юпитер', 'Слънце'];

  for (const aspect of aspects) {
    const p1Clean = aspect.planet1.split(' ')[1]; // Remove emoji
    const p2Clean = aspect.planet2.split(' ')[1];

    let points = 0;
    if (aspect.nature === 'harmonious') {
      points = aspect.strength === 'strong' ? 5 : aspect.strength === 'moderate' ? 3 : 1;
    } else if (aspect.nature === 'challenging') {
      points = aspect.strength === 'strong' ? -3 : aspect.strength === 'moderate' ? -2 : -1;
    } else {
      // Conjunction - depends on planets
      points = aspect.strength === 'strong' ? 4 : aspect.strength === 'moderate' ? 2 : 1;
    }

    totalPoints += points;
    maxPoints += 5; // Max possible per aspect

    // Love score
    if (lovePlanets.includes(p1Clean) || lovePlanets.includes(p2Clean)) {
      lovePoints += points;
      loveMax += 5;
    }

    // Communication score
    if (commPlanets.includes(p1Clean) || commPlanets.includes(p2Clean)) {
      commPoints += points;
      commMax += 5;
    }

    // Sexual score
    if (sexPlanets.includes(p1Clean) || sexPlanets.includes(p2Clean)) {
      sexPoints += points;
      sexMax += 5;
    }

    // Longevity score
    if (longPlanets.includes(p1Clean) || longPlanets.includes(p2Clean)) {
      longPoints += points;
      longMax += 5;
    }
  }

  // Normalize to 0-100
  const normalize = (points: number, max: number) => {
    if (max === 0) return 50; // Neutral if no aspects
    const percentage = ((points + max) / (max * 2)) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  };

  return {
    overall: normalize(totalPoints, maxPoints),
    love: normalize(lovePoints, loveMax),
    communication: normalize(commPoints, commMax),
    sexual: normalize(sexPoints, sexMax),
    longevity: normalize(longPoints, longMax),
  };
}

/**
 * Main synastry calculation function
 */
export function calculateSynastry(
  chart1: NatalChart,
  chart2: NatalChart,
  name1: string,
  name2: string
): SynastryResult {
  const aspects = calculateSynastryAspects(chart1, chart2);
  const scores = calculateCompatibilityScores(aspects);

  return {
    person1_name: name1,
    person2_name: name2,
    aspects,
    compatibility_score: scores.overall,
    love_score: scores.love,
    communication_score: scores.communication,
    sexual_score: scores.sexual,
    longevity_score: scores.longevity,
  };
}
