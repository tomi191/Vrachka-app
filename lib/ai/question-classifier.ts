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
 * Version 4.0 - Simplified, flexible guidelines (no formulas!)
 */
export function getDepthInstructions(
  analysis: QuestionAnalysis,
  planType: 'basic' | 'ultimate'
): string {
  // OFF-TOPIC - Quick redirect
  if (analysis.type === 'off-topic') {
    return `
⛔ OFF-TOPIC: Кратък redirect (30-50 думи)
Кажи direct че това не е твоята област. Питай за духовни теми.`;
  }

  // NUMBERS REQUEST - Give numbers + disclaimer + question
  if (analysis.type === 'numbers-request') {
    return `
🎰 ЧИСЛА: Дай 5-6 числа + disclaimer + дълбок въпрос (80-120 думи)
Пример: "Виждам: 3, 17, 24... Късметът е непредсказуем, гаранции няма. Какво наистина липсва в живота ти?"`;
  }

  // GAMBLING - Short question
  if (analysis.type === 'gambling') {
    return `
⚠️ ХАЗАРТ: Кратък отговор (50-80 думи)
Задай въпрос за корена. Защо търси спасение там?`;
  }

  // GREETINGS - Very short
  if (analysis.type === 'greeting') {
    return `
👋 ПОЗДРАВ: Много кратък (30-50 думи)
Топло welcome. Питай какво го тревожи.`;
  }

  // YES/NO - Reveal what's behind the question
  if (analysis.type === 'yes-no') {
    return `
✅ ДА/НЕ: Кратък, но разкриващ (40-80 думи)
Покажи какво крие въпросът. НЕ давай просто да/не.`;
  }

  // DEEP EMOTIONAL - Long, empathetic
  if (analysis.type === 'deep-emotional') {
    const wordCount = planType === 'ultimate' ? '250-400' : '150-250';
    return `
💔 ЕМОЦИОНАЛЕН: Дълбок отговор (${wordCount} думи)
Слушай. Задавай въпроси. Води човека към неговата истина.`;
  }

  // ADVICE - Medium length
  const wordCount = planType === 'ultimate' ? '150-200' : '100-150';
  return `
💡 СЪВЕТ: Умерен отговор (${wordCount} думи)
Direct мъдрост. Конкретен съвет. Разнообразен подход.`;
}
