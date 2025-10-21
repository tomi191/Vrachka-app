/**
 * Intelligent Question Classifier for Oracle (Врачката)
 * Classifies questions to determine appropriate response depth and style
 */

export type QuestionType = 'yes-no' | 'greeting' | 'advice' | 'deep-emotional' | 'gambling';
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

  // 1. GAMBLING QUESTIONS - Special handling (always short, directive)
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

  // 2. GREETINGS - Very short
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

  // 3. YES/NO QUESTIONS - Short, direct
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

  // 4. DEEP EMOTIONAL QUESTIONS - Long, empathetic
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

  // 5. ADVICE QUESTIONS - Medium length, practical
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
  // GAMBLING questions - always short and directive
  if (analysis.type === 'gambling') {
    return `
⚠️ ВЪПРОС ЗА ПАРИ/ТОТО/ХАЗАРТ!

Дай КРАТЪК и ДИРЕКТЕН отговор (50-80 думи):
- НИКОГА не обещавай печалба
- Насочи към труд и мъдрост
- ЕДИН конкретен съвет
- БЕЗ истории! БЕЗ философия!

Пример тон: "Еее, синко... тотото? Гледала съм хиляди хора да чакат късмет от числа.
Малко печелят, повечето губят. Ти си [зодия] - твоят късмет е в действие, не в чакане.
Създай нещо свое. Парите идват след труд, не преди. Разбра ли ме?"`;
  }

  // GREETINGS - very short, warm redirect
  if (analysis.type === 'greeting') {
    return `
⚠️ ПРОСТ ПОЗДРАВ!

Дай МНОГО КРАТЪК отговор (30-50 думи):
- Топло поздрав като баба
- Питане какво наистина търси
- БЕЗ истории! БЕЗ дълги разкази!

Пример: "Ееее, здравей, дете! Радвам се да те видя. Седни, седни...
Я ми кажи - с какво мога да ти помогна? Какво те тревожи?"`;
  }

  // YES/NO questions - short, direct answer
  if (analysis.type === 'yes-no') {
    return `
⚠️ ДА/НЕ ВЪПРОС!

Дай КРАТЪК и ЯСЕН отговор (40-80 думи):
- Започни с ДА/НЕ/МОЖЕ БИ (ясно position)
- ЕДН0 изречение защо
- ЕДИН конкретен съвет
- БЕЗ дълги истории!

Пример структура:
1. "Хм... [reaction]"
2. "Не/Да/Може би... [clear answer]"
3. "Защото [reason in 1 sentence]"
4. "Направи [concrete action]"`;
  }

  // DEEP EMOTIONAL - long, empathetic (varies by plan)
  if (analysis.type === 'deep-emotional') {
    if (planType === 'ultimate') {
      return `
📊 ПЛАН: ULTIMATE + ДЪЛБОК ЕМОЦИОНАЛЕН ВЪПРОС

Дай ДЪЛБОК отговор (250-400 думи):
- Емоционална реакция (покажи че усещаш болката)
- Лична история от твоя живот (конкретна, с имена и години)
- Астрологична/духовна перспектива
- Практичен ритуал или действие
- Затваряне с питане или утешение

Говори като баба която има ВРЕМЕ и ЖЕЛАНИЕ да сподели мъдрост.`;
    } else {
      return `
📊 ПЛАН: BASIC + ЕМОЦИОНАЛЕН ВЪПРОС

Дай УМЕРЕН отговор (150-250 думи):
- Емоционална реакция (покажи емпатия)
- КРАТКА мъдрост или принцип
- Практичен съвет
- Топло затваряне

Говори като баба която има 5-10 минути - казва най-важното с топлина.`;
    }
  }

  // ADVICE questions - medium, practical
  return `
📊 ПЛАН: ${planType.toUpperCase()} + СЪВЕТ

Дай УМЕРЕН отговор (${planType === 'ultimate' ? '150-200' : '100-150'} думи):
- Кратка реакция
- Мъдрост или принцип
- Практичен съвет (конкретен!)
- Кратко затваряне

Говори като баба която дава ЯСЕН съвет, не философия.`;
}
