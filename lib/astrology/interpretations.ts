/**
 * AI-powered Natal Chart Interpretations
 * Uses Claude Sonnet for deep astrological insights in Bulgarian
 */

import { createFeatureCompletion } from '../ai/openrouter';
import type { NatalChart } from './natal-chart';

export interface NatalChartInterpretation {
  overview: string; // Обща интерпретация
  sun_interpretation: string; // Слънце интерпретация
  moon_interpretation: string; // Луна интерпретация
  rising_interpretation: string; // Възходящ знак интерпретация
  major_aspects: string; // Важни аспекти
  life_path: string; // Жизнен път
  strengths: string[]; // Силни страни (4-5 bullet points)
  challenges: string[]; // Предизвикателства (4-5 bullet points)
  recommendations: string[]; // Препоръки (4-5 bullet points)
}

/**
 * Generate comprehensive natal chart interpretation using AI
 */
export async function generateNatalChartInterpretation(
  chart: NatalChart,
  userFirstName?: string
): Promise<NatalChartInterpretation> {
  try {
    const prompt = buildInterpretationPrompt(chart, userFirstName);

    // Use Claude Sonnet for premium quality interpretation
    const response = await createFeatureCompletion('natal_chart', [
      {
        role: 'system',
        content: `Ти си опитна астроложка която прави детайлни натални карти на български език.

ВАЖНО:
- Пиши на съвършен български език
- Използвай емпатичен, подкрепящ тон
- Фокусирай се върху личностното развитие и потенциала
- Избягвай негативизъм - представяй предизвикателствата като възможности
- Бъди конкретна и практична
- Използвай примери от реалния живот`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ], {
      temperature: 0.8,
      max_tokens: 3000,
    });

    const interpretation = response.choices[0].message.content;

    // Parse the structured response
    return parseInterpretation(interpretation);
  } catch (error) {
    console.error('[Natal Chart] AI interpretation error:', error);
    throw new Error('Failed to generate interpretation. Please try again.');
  }
}

/**
 * Build detailed prompt for AI interpretation
 */
function buildInterpretationPrompt(chart: NatalChart, firstName?: string): string {
  const name = firstName || 'човек';

  return `Моля, направи детайлна астрологична интерпретация на следната натална карта за ${name}:

**НАТАЛНА КАРТА:**

${chart.sun.emoji} **Слънце:** ${chart.sun.sign} ${chart.sun.degree}° (Дом ${chart.sun.house})
${chart.moon.emoji} **Луна:** ${chart.moon.sign} ${chart.moon.degree}° (Дом ${chart.moon.house})
⬆️ **Възходящ знак:** ${chart.rising.sign} ${chart.rising.degree}°

**Планети:**
${chart.mercury.emoji} Меркурий: ${chart.mercury.sign} ${chart.mercury.degree}° (Дом ${chart.mercury.house})
${chart.venus.emoji} Венера: ${chart.venus.sign} ${chart.venus.degree}° (Дом ${chart.venus.house})
${chart.mars.emoji} Марс: ${chart.mars.sign} ${chart.mars.degree}° (Дом ${chart.mars.house})
${chart.jupiter.emoji} Юпитер: ${chart.jupiter.sign} ${chart.jupiter.degree}° (Дом ${chart.jupiter.house})
${chart.saturn.emoji} Сатурн: ${chart.saturn.sign} ${chart.saturn.degree}° (Дом ${chart.saturn.house})
${chart.uranus.emoji} Уран: ${chart.uranus.sign} ${chart.uranus.degree}° (Дом ${chart.uranus.house})
${chart.neptune.emoji} Нептун: ${chart.neptune.sign} ${chart.neptune.degree}° (Дом ${chart.neptune.house})
${chart.pluto.emoji} Плутон: ${chart.pluto.sign} ${chart.pluto.degree}° (Дом ${chart.pluto.house})

**Важни аспекти:**
${chart.aspects.slice(0, 5).map(a => `- ${a.planet1} ${getAspectSymbol(a.type)} ${a.planet2} (${a.angle}°)`).join('\n')}

---

Моля, структурирай отговора си по следния начин:

## OVERVIEW
(2-3 параграфа обща интерпретация на картата)

## SUN_INTERPRETATION
(Детайлна интерпретация на Слънцето в този знак и дом - 2 параграфа)

## MOON_INTERPRETATION
(Детайлна интерпретация на Луната в този знак и дом - 2 параграфа)

## RISING_INTERPRETATION
(Детайлна интерпретация на Възходящия знак - 2 параграфа)

## MAJOR_ASPECTS
(Интерпретация на 3-5 най-важни аспекта - 2 параграфа)

## LIFE_PATH
(Препоръки за жизнен път и кариера - 2 параграфа)

## STRENGTHS
- (Силна страна 1)
- (Силна страна 2)
- (Силна страна 3)
- (Силна страна 4)

## CHALLENGES
- (Предизвикателство 1)
- (Предизвикателство 2)
- (Предизвикателство 3)
- (Предизвикателство 4)

## RECOMMENDATIONS
- (Практична препоръка 1)
- (Практична препоръка 2)
- (Практична препоръка 3)
- (Практична препоръка 4)`;
}

/**
 * Parse AI response into structured interpretation
 */
function parseInterpretation(response: string): NatalChartInterpretation {
  const sections: Record<string, string> = {};
  const lines = response.split('\n');

  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if it's a section header
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }

      // Start new section
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  // Extract bullet points from sections
  const extractBullets = (section: string): string[] => {
    const content = sections[section] || '';
    return content
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s*/, ''));
  };

  return {
    overview: sections['OVERVIEW'] || 'Интерпретация не е налична.',
    sun_interpretation: sections['SUN_INTERPRETATION'] || '',
    moon_interpretation: sections['MOON_INTERPRETATION'] || '',
    rising_interpretation: sections['RISING_INTERPRETATION'] || '',
    major_aspects: sections['MAJOR_ASPECTS'] || '',
    life_path: sections['LIFE_PATH'] || '',
    strengths: extractBullets('STRENGTHS'),
    challenges: extractBullets('CHALLENGES'),
    recommendations: extractBullets('RECOMMENDATIONS'),
  };
}

/**
 * Get aspect symbol
 */
function getAspectSymbol(type: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌',
    opposition: '☍',
    trine: '△',
    square: '□',
    sextile: '⚹',
  };

  return symbols[type.toLowerCase()] || '∠';
}

/**
 * Generate brief interpretation (for preview)
 */
export function generateBriefInterpretation(chart: NatalChart): string {
  return `
Твоята натална карта разкрива уникална комбинация от енергии:

${chart.sun.emoji} Слънцето ти в ${chart.sun.sign} показва, че си ${getSunTraits(chart.sun.sign)}.

${chart.moon.emoji} Луната в ${chart.moon.sign} разкрива, че емоционално си ${getMoonTraits(chart.moon.sign)}.

⬆️ Възходящият ти знак ${chart.rising.sign} означава, че другите те виждат като ${getRisingTraits(chart.rising.sign)}.

За пълна детайлна интерпретация, генерирай AI анализ.
  `.trim();
}

// Helper functions for brief traits
function getSunTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Овен': 'динамичен, смел и независим',
    'Телец': 'стабилен, практичен и сензитивен',
    'Близнаци': 'любопитен, комуникативен и адаптивен',
    'Рак': 'грижовен, интуитивен и емоционален',
    'Лъв': 'креативен, уверен и щедър',
    'Дева': 'аналитичен, перфекционист и полезен',
    'Везни': 'балансиран, дипломатичен и справедлив',
    'Скорпион': 'интензивен, трансформиращ и дълбок',
    'Стрелец': 'оптимистичен, авантюристичен и философски',
    'Козирог': 'амбициозен, дисциплиниран и отговорен',
    'Водолей': 'независим, иновативен и хуманитарен',
    'Риби': 'съчувстващ, артистичен и мечтателен',
  };

  return traits[sign] || 'уникална личност';
}

function getMoonTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Овен': 'импулсивен и страстен',
    'Телец': 'стабилен и сигурен',
    'Близнаци': 'любознателен и променлив',
    'Рак': 'чувствителен и защитаващ',
    'Лъв': 'драматичен и топъл',
    'Дева': 'аналитичен и грижовен',
    'Везни': 'хармоничен и социален',
    'Скорпион': 'интензивен и дълбок',
    'Стрелец': 'оптимистичен и свободолюбив',
    'Козирог': 'сериозен и контролиран',
    'Водолей': 'независим и оригинален',
    'Риби': 'емпатичен и интуитивен',
  };

  return traits[sign] || 'уникален';
}

function getRisingTraits(sign: string): string {
  const traits: Record<string, string> = {
    'Овен': 'енергичен и смел лидер',
    'Телец': 'спокоен и надежден човек',
    'Близнаци': 'общителен и интелигентен приятел',
    'Рак': 'топъл и грижовен човек',
    'Лъв': 'харизматичен и уверен лидер',
    'Дева': 'организиран и полезен човек',
    'Везни': 'очарователен и дипломатичен',
    'Скорпион': 'мистериозен и магнетичен',
    'Стрелец': 'оптимистичен и забавен',
    'Козирог': 'сериозен и отговорен професионалист',
    'Водолей': 'оригинален и независим мислител',
    'Риби': 'съчувстващ и артистичен',
  };

  return traits[sign] || 'интересен човек';
}

/**
 * Generate Synastry interpretation prompt for AI
 */
export function getSynastryPrompt(
  synastryData: any,
  name1: string,
  name2: string
): string {
  return `Направи детайлна астрологична интерпретация на синастрията (съвместимостта) между ${name1} и ${name2}.

**СИНАСТРИЯ ДАННИ:**

**Compatibility Scores:**
- Обща съвместимост: ${synastryData.compatibility_score}%
- Любовна съвместимост: ${synastryData.love_score}%
- Комуникация: ${synastryData.communication_score}%
- Сексуална съвместимост: ${synastryData.sexual_score}%
- Дългосрочна връзка: ${synastryData.longevity_score}%

**Основни аспекти между картите:**
${synastryData.aspects.slice(0, 10).map((a: any) =>
  `- ${a.planet1} ${getAspectSymbol(a.type)} ${a.planet2} (${a.angle}°, ${a.nature}, ${a.strength})`
).join('\n')}

---

Моля, структурирай отговора по следния начин на БЪЛГАРСКИ ЕЗИК:

## OVERVIEW
(2-3 параграфа обща оценка на връзката - какво прави тази връзка уникална, основни силни страни и предизвикателства)

## LOVE_COMPATIBILITY
(2 параграфа за любовната съвместимост - романтика, емоционална връзка, привличане)

## COMMUNICATION
(2 параграфа за комуникацията - как се разбират, споделят ли ценности, интелектуална връзка)

## SEXUAL_CHEMISTRY
(2 параграфа за сексуалната химия - физическо привличане, сексуална съвместимост, страст)

## CHALLENGES
(2 параграфа за основните предизвикателства в тази връзка и как да ги преодолеят)

## LONGEVITY
(2 параграфа за дългосрочния потенциал - какво трябва да развиват, за да продължи връзката)

## ADVICE
(Кратки съвети - 5-6 bullet points за успешна връзка)

ВАЖНО: Пиши на БЪЛГАРСКИ език, естествено и топло. Използвай "ти" и "вие" форма. Бъди позитивен но реалистичен.`;
}

/**
 * Synastry System Prompt
 */
export const SYNASTRY_SYSTEM_PROMPT = `Ти си опитна астроложка специализирана в синастрия (анализ на съвместимост между партньори) на български език.

ВАЖНО:
- Пиши на съвършен български език
- Използвай топъл, подкрепящ тон
- Фокусирай се върху растежа на връзката
- Представяй предизвикателствата като възможности за развитие
- Бъди практична и конкретна
- Избягвай фатализъм - всяка връзка има потенциал`;

/**
 * Generate Personal Horoscope interpretation prompt for AI
 */
export function getPersonalHoroscopePrompt(
  horoscopeData: any,
  userName: string,
  forecastType: 'monthly' | 'yearly'
): string {
  const period = forecastType === 'monthly' ? 'месец' : 'година';
  const periodCaps = forecastType === 'monthly' ? 'МЕСЕЧЕН' : 'ГОДИШЕН';

  return `Направи детайлна астрологична интерпретация на ${period}ната прогноза за ${userName} базирана на натална карта и текущи транзити.

**${periodCaps} ХОРОСКОП:**

**Период:** ${new Date(horoscopeData.start_date).toLocaleDateString('bg-BG')} - ${new Date(horoscopeData.end_date).toLocaleDateString('bg-BG')}

**Натална Карта:**
- Слънце: ${horoscopeData.natal_chart.sun.sign} ${horoscopeData.natal_chart.sun.degree}°
- Луна: ${horoscopeData.natal_chart.moon.sign} ${horoscopeData.natal_chart.moon.degree}°
- Асцендент: ${horoscopeData.natal_chart.rising.sign} ${horoscopeData.natal_chart.rising.degree}°

**Текущи Планетни Позиции:**
${Object.entries(horoscopeData.current_planets).map(([planet, pos]: [string, any]) =>
  `- ${planet}: ${pos.sign} ${pos.degree.toFixed(1)}°`
).join('\n')}

**Важни Транзити (${horoscopeData.transits.length} активни):**
${horoscopeData.transits.slice(0, 8).map((t: any) =>
  `- ${t.transiting_planet} ${getAspectSymbol(t.aspect_type)} натален ${t.natal_planet} (${t.strength}, ${t.nature}): ${t.influence}`
).join('\n')}

**Оценки на Теми:**
- Кариера: ${horoscopeData.themes.career.toFixed(1)}/10
- Любов: ${horoscopeData.themes.love.toFixed(1)}/10
- Здраве: ${horoscopeData.themes.health.toFixed(1)}/10
- Финанси: ${horoscopeData.themes.finances.toFixed(1)}/10
- Личностен растеж: ${horoscopeData.themes.personal_growth.toFixed(1)}/10

**Highlights:**
${horoscopeData.highlights.map((h: string) => `- ${h}`).join('\n')}

**Challenges:**
${horoscopeData.challenges.map((c: string) => `- ${c}`).join('\n')}

---

Моля, структурирай отговора по следния начин на БЪЛГАРСКИ ЕЗИК:

## OVERVIEW
(2-3 параграфа обща оценка на ${period}а - главни теми, енергия, какво да очаква ${userName})

## CAREER
(2 параграфа за кариера и професионален живот - възможности, предизвикателства, съвети)

## LOVE
(2 параграфа за любовен живот - връзки, романтика, социални отношения)

## HEALTH
(1-2 параграфа за здраве и жизненост - на какво да обърне внимание, как да се грижи за себе си)

## FINANCES
(1-2 параграфа за финанси и материален живот - разходи, приходи, инвестиции)

## PERSONAL_GROWTH
(2 параграфа за личностно развитие - духовен растеж, трансформация, саморазвитие)

## KEY_DATES
(3-5 важни дати или периоди през ${period}а - когато транзитите са най-силни)

## ADVICE
(Практични съвети - 5-6 bullet points за успешен ${period})

ВАЖНО: Пиши на БЪЛГАРСКИ език, директно и лично към ${userName}. Използвай "ти" форма. Бъди позитивен, вдъхновяващ и практичен.`;
}

/**
 * Personal Horoscope System Prompt
 */
export const PERSONAL_HOROSCOPE_SYSTEM_PROMPT = `Ти си опитна астроложка специализирана в транзити и лични прогнози на български език.

ВАЖНО:
- Пиши на съвършен български език
- Използвай топъл, вдъхновяващ тон
- Фокусирай се върху личностното развитие и възможности
- Представяй транзитите като космически "weather" - нещо което можем да навигираме
- Бъди конкретна с дати и съвети
- Избягвай страх - дори "трудните" транзити са възможности за растеж`;
