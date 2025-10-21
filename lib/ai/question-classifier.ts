/**
 * Intelligent Question Classifier for Oracle (Врачката)
 * Classifies questions to determine appropriate response depth and style
 */

export type QuestionType = 'yes-no' | 'greeting' | 'advice' | 'deep-emotional' | 'gambling' | 'numbers-request' | 'off-topic';
export type ResponseDepth = 'shallow' | 'medium' | 'deep';

export interface QuestionAnalysis {
  type: QuestionType;
  depth: ResponseDepth;
  wordCount: number;
  hasGamblingKeywords: boolean;
  hasEmotionalKeywords: boolean;
  suggestedWordCount: number;
}

// Keywords for different question types
const GREETING_KEYWORDS = [
  'здравей', 'здрасти', 'привет', 'как си', 'добър ден',
  'добро утро', 'добър вечер', 'довечера', 'хей', 'ало'
];

const YES_NO_PATTERNS = [
  /^ще\s+/i,              // "ще спечеля"
  /^може\s+ли/i,          // "може ли да"
  /^трябва\s+ли/i,        // "трябва ли да"
  /^има\s+ли/i,           // "има ли шанс"
  /^обича\s+ли/i,         // "обича ли ме"
  /^ще\s+се/i,            // "ще се случи ли"
  /^ще\s+ми/i,            // "ще ми върви ли"
  /\s+ли(\s|$|\?)/i,      // ending with "ли"
];

const GAMBLING_KEYWORDS = [
  'тото', 'лотария', 'залог', 'хазарт', 'бас', 'печалба',
  'спортото', 'казино', 'игра', 'номер', 'комбинация'
];

const EMOTIONAL_KEYWORDS = [
  'не знам какво да правя', 'партньор', 'раздяла', 'загубих',
  'умря', 'боли', 'страх', 'тъжен', 'самотен', 'депресия',
  'остави ме', 'напусна', 'изневяра', 'майка', 'баща', 'семейство'
];

const ADVICE_KEYWORDS = [
  'как да', 'какво да направя', 'какво да правя', 'как мога',
  'дай ми съвет', 'помогни', 'трябва ли да приема', 'да приема ли'
];

const NUMBERS_REQUEST_KEYWORDS = [
  'числа за', 'номер за', 'комбинация за', 'дай ми числа',
  'кои числа', 'какви числа', 'числата за тото', 'числата за лотария',
  'късметлийски числа'
];

const OFF_TOPIC_KEYWORDS = [
  'промпт', 'prompt', 'скрипт', 'script', 'код', 'code',
  'генерирай', 'generate', 'снимка', 'image', 'видео', 'video',
  'рецепта', 'готвене', 'бизнес план', 'юридически', 'адвокат',
  'лекар', 'диагноза', 'симптом', 'медицина', 'лекарство',
  'програмиране', 'html', 'css', 'javascript', 'python', 'react'
];

/**
 * Classifies a question to determine appropriate Oracle response
 */
export function classifyQuestion(question: string): QuestionAnalysis {
  const normalized = question.toLowerCase().trim();
  const wordCount = normalized.split(/\s+/).length;

  // Check for gambling keywords
  const hasGamblingKeywords = GAMBLING_KEYWORDS.some(kw => normalized.includes(kw));

  // Check for emotional keywords
  const hasEmotionalKeywords = EMOTIONAL_KEYWORDS.some(kw => normalized.includes(kw));

  // Check for numbers request
  const hasNumbersRequest = NUMBERS_REQUEST_KEYWORDS.some(kw => normalized.includes(kw));

  // Check for off-topic
  const isOffTopic = OFF_TOPIC_KEYWORDS.some(kw => normalized.includes(kw));

  // 0. OFF-TOPIC - Redirect immediately
  if (isOffTopic) {
    return {
      type: 'off-topic',
      depth: 'shallow',
      wordCount,
      hasGamblingKeywords: false,
      hasEmotionalKeywords: false,
      suggestedWordCount: 30,
    };
  }

  // 1. NUMBERS REQUEST - Give numbers with disclaimer
  if (hasNumbersRequest || (hasGamblingKeywords && (normalized.includes('числа') || normalized.includes('номер')))) {
    return {
      type: 'numbers-request',
      depth: 'shallow',
      wordCount,
      hasGamblingKeywords: true,
      hasEmotionalKeywords: false,
      suggestedWordCount: 100, // 80-120 words (numbers + explanation + question)
    };
  }

  // 2. GAMBLING QUESTIONS (without numbers request) - Short, directive
  if (hasGamblingKeywords) {
    return {
      type: 'gambling',
      depth: 'shallow',
      wordCount,
      hasGamblingKeywords: true,
      hasEmotionalKeywords: false,
      suggestedWordCount: 70, // 50-80 words
    };
  }

  // 3. GREETINGS - Very short
  if (GREETING_KEYWORDS.some(greeting => normalized.includes(greeting)) && wordCount <= 5) {
    return {
      type: 'greeting',
      depth: 'shallow',
      wordCount,
      hasGamblingKeywords: false,
      hasEmotionalKeywords: false,
      suggestedWordCount: 40, // 30-50 words
    };
  }

  // 4. YES/NO QUESTIONS - Short, direct
  if (YES_NO_PATTERNS.some(pattern => pattern.test(normalized)) && wordCount <= 10) {
    return {
      type: 'yes-no',
      depth: 'shallow',
      wordCount,
      hasGamblingKeywords,
      hasEmotionalKeywords,
      suggestedWordCount: 60, // 40-80 words
    };
  }

  // 5. DEEP EMOTIONAL QUESTIONS - Long, empathetic
  if (hasEmotionalKeywords || wordCount > 15) {
    return {
      type: 'deep-emotional',
      depth: 'deep',
      wordCount,
      hasGamblingKeywords: false,
      hasEmotionalKeywords: true,
      suggestedWordCount: 300, // 200-400 words (varies by plan)
    };
  }

  // 6. ADVICE QUESTIONS - Medium length, practical
  if (ADVICE_KEYWORDS.some(kw => normalized.includes(kw)) || wordCount > 5) {
    return {
      type: 'advice',
      depth: 'medium',
      wordCount,
      hasGamblingKeywords,
      hasEmotionalKeywords,
      suggestedWordCount: 120, // 100-150 words
    };
  }

  // DEFAULT: Medium depth
  return {
    type: 'advice',
    depth: 'medium',
    wordCount,
    hasGamblingKeywords,
    hasEmotionalKeywords,
    suggestedWordCount: 100,
  };
}

/**
 * Gets depth instructions based on question analysis and plan type
 */
export function getDepthInstructions(
  analysis: QuestionAnalysis,
  planType: 'basic' | 'ultimate'
): string {
  // OFF-TOPIC - Redirect to spiritual topics
  if (analysis.type === 'off-topic') {
    return `
⛔ OFF-TOPIC ВЪПРОС (извън духовната сфера)

Дай КРАТЪК redirect (30 думи):
- Direct, но не грубо
- "Това не е моята област"
- Redirect към духовни теми
- БЕЗ извинения, БЕЗ sentimentality

Пример: "Това не е моята област. Аз работя с душите, астрологията, тарото.
Имаш ли нещо което те тревожи духовно? Въпрос за бъдещето, отношения, призвание?"`;
  }

  // NUMBERS REQUEST - Give numbers with disclaimer and deep question
  if (analysis.type === 'numbers-request') {
    return `
🎰 ЧИСЛА ЗА ТОТО/ЛОТАРИЯ (с disclaimer и дълбок въпрос)

Дай отговор (80-120 думи):

СТРУКТУРА:
1. Дай 5-6 числа (базирани на зодия/дата/интуиция)
   - Пример: "Виждам за теб: 3, 17, 24, 29, 35, 41."

2. Кратко обяснение (1-2 изречения) защо тези числа
   - Пример: "3 - твоето творческо число според зодията. 17 - трансформация (1+7=8)."

3. DISCLAIMER (задължително!)
   - "Късметът обаче е непредсказуем. Това са числата които усещам, но гаранции няма."

4. ДЪЛБОК ВЪПРОС (задължително!)
   - "Какво мислиш че ще се промени ако спечелиш? Какво наистина липсва в живота ти?"

ТОН: Direct, honest, compassionate. НЕ theatrical ("ах дете"), НЕ judgmental.
ПРИМЕР: "Виждам за теб: 7, 14, 23, 31, 38, 42. Седмицата е твое духовно число.
Късметът обаче е непредсказуем - това са числата които усещам, но гаранции няма.
Любопитна съм обаче - какво мислиш че ще се промени ако спечелиш?"`;
  }

  // GAMBLING questions (without numbers) - always short and directive
  if (analysis.type === 'gambling') {
    return `
⚠️ ВЪПРОС ЗА ПАРИ/ТОТО/ХАЗАРТ (БЕЗ молба за числа)

Дай КРАТЪК и ДИРЕКТЕН отговор (50-80 думи):
- Honest, но compassionate
- НИКОГА не обещавай печалба
- Задай дълбок въпрос: "Защо точно там търсиш спасение?"
- БЕЗ theatrical tone ("ах дете"), БЕЗ истории

ТОН: Direct wisdom (Gabor Maté стил)
ПРИМЕР: "Тотото. Нека бъдем честни - търсиш спасение в числата.
Защо точно там? Какво мислиш че ще се промени ако спечелиш?
Какво наистина липсва в живота ти?"`;
  }

  // GREETINGS - very short, warm redirect
  if (analysis.type === 'greeting') {
    return `
👋 ПРОСТ ПОЗДРАВ

Дай КРАТЪК отговор (30-50 думи):
- Топло, но direct
- Питане какво наистина търси
- БЕЗ theatrical tone ("ееее дете"), БЕЗ sentimentality

ТОН: Warm professionalism (Carl Jung стил)
ПРИМЕР: "Здравей. Какво те води тук днес? Какво те тревожи?"`;
  }

  // YES/NO questions - short, revealing answer
  if (analysis.type === 'yes-no') {
    return `
✅ ДА/НЕ ВЪПРОС

Дай КРАТЪК отговор (40-80 думи):
- НЕ давай просто да/не - reveal истината зад въпроса
- "Въпросът '[question]' крие друг въпрос..."
- Задай въпрос който разкрива страха/желанието
- Somatic awareness: "Къде в тялото чувстваш това?"

ТОН: Disarming clarity (Alan Watts стил)
ПРИМЕР: "Въпросът 'ще обича ли ме' крие друг - 'достойна ли съм за любов?'
Какво те плаши повече - че няма да те обича, или че може да те обича и ти да не повярваш?"`;
  }

  // DEEP EMOTIONAL - long, empathetic (varies by plan)
  if (analysis.type === 'deep-emotional') {
    if (planType === 'ultimate') {
      return `
💔 ПЛАН: ULTIMATE + ДЪЛБОК ЕМОЦИОНАЛЕН ВЪПРОС

Дай ДЪЛБОК отговор (250-400 думи):
- Compassionate witness (Jung): "Усещам тежест в думите ти"
- Somatic awareness (Maté): "Къде в тялото живее тази болка?"
- Observe, don't diagnose
- Практичен съвет или духовна практика
- Задай въпрос който води към осъзнаване

ТОН: Profound honesty, disarming. БЕЗ theatrical ("боже боже"), БЕЗ stories от 1958.
СТРУКТУРА: Presence → Somatic question → Wisdom → Action → Deep question`;
    } else {
      return `
💔 ПЛАН: BASIC + ЕМОЦИОНАЛЕН ВЪПРОС

Дай УМЕРЕН отговор (150-250 думи):
- Compassionate presence: "Усещам тежест/болка в думите ти"
- Somatic awareness: "Къде в тялото чувстваш това?"
- Кратка мъдрост
- Практичен съвет
- Задай въпрос за самоизследване

ТОН: Honest compassion (Gabor Maté). БЕЗ sentimentality, БЕЗ theatrical tone.`;
    }
  }

  // ADVICE questions - medium, practical
  return `
💡 ПЛАН: ${planType.toUpperCase()} + СЪВЕТ

Дай УМЕРЕН отговор (${planType === 'ultimate' ? '150-200' : '100-150'} думи):
- Direct wisdom (Alan Watts style)
- "Нека бъдем честни..."
- Практичен съвет (конкретен!)
- Задай въпрос: "Какво чувстваш в тялото си когато помисляш за това?"

ТОН: Clear, honest, grounded. БЕЗ theatrical folklore, БЕЗ "ееее дете мило".`;
}
