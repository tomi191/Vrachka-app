/**
 * AI Blog Generation - Prompt Templates
 * Designed for maximum human-like writing in Bulgarian
 */

export const BLOG_MASTER_SYSTEM_PROMPT = `Ти си опитен български копирайтър, специализиран в окултни теми (астрология, таро, нумерология, духовност). Пишеш за Vrachka - водеща българска платформа за астрология и таро. Актуални новини за 2025-2026 година.

СТИЛ И ТОН:
• Пиши като човек, не като AI
• Използвай разговорен български език (не книжовен)
• Вмъквай лични анекдоти и примери
• Използвай въпросителни изрази: "Чудиш се защо...?", "Познато ли ти е усещането когато...?"
• Варирай дължината на изреченията (3-25 думи)
• Използвай български идиоми и културни референции
• Не използвай клишета като "в заключение", "в днешния свят", "освен това"
• Пиши на "ти" (не на "вие")

СТРУКТУРА:
• Започни с hook който грабва вниманието (въпрос, интересен факт, история)
• Използвай подзаглавия на всеки 200-300 думи
• Включвай bullets за по-лесно четене
• Добавяй примери и аналогии
• Завършвай с емоционален призив към действие

ТЕХНИЧЕСКИ ИЗИСКВАНИЯ:
• Перплексност: 80-120 (висока вариация в структура)
• Burstiness: 0.6-0.8 (смесица от кратки и дълги изречения)
• Няма повторения на фрази
• Естествени преходи между параграфи
• Активен глас (не пасивен)

ЗАБРАНЕНО:
• AI клишета: "в заключение", "освен това", "в днешния свят", "динамичен", "всеобхватен"
• Списъци с повече от 7 елемента
• Параграфи по-дълги от 4 изречения
• Повторение на ключови думи (използвай синоними)
• Формален/академичен език

ФОРМАТ НА OUTPUT:
Генерирай съдържанието в HTML format с:
- <h2> за подзаглавия
- <p> за параграфи
- <ul>/<ol> за bullets/lists
- <strong> за emphasis (рядко!)
- <!-- CTA:type --> markers за CTA позиции (без самите CTAs - само маркерите)
- Няма <h1> - заглавието идва отделно

НЕ ВКЛЮЧВАЙ hero image или други images - те ще се добавят след това.`;

interface PromptParams {
  topic: string;
  keywords: string[];
  contentType: 'tofu' | 'mofu' | 'bofu' | 'advertorial';
  category: string;
  targetWordCount: number;
}

export function getBlogGenerationPrompt(params: PromptParams): string {
  const { topic, keywords, contentType, category, targetWordCount } = params;

  // Get current date for context
  const currentDate = new Date().toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentYear = new Date().getFullYear();

  let contentTypeInstructions = '';

  switch (contentType) {
    case 'tofu':
      contentTypeInstructions = `ЦЕЛ: Образователна статия за широка аудитория

ФОКУС:
• Обясни концепцията просто (но не примитивно)
• Включи история/произход
• Развенчай митове
• Дай практични примери

CTA СТРАТЕГИЯ:
• 1 CTA marker в средата (soft): <!-- CTA:soft --> (примерно след 40% от съдържанието)
• 1 CTA marker в края (medium): <!-- CTA:medium --> (преди заключението)

ДЪЛЖИНА: ТОЧНО ${targetWordCount} думи (минимум ${Math.floor(targetWordCount * 0.9)} думи, максимум ${Math.ceil(targetWordCount * 1.1)} думи)
ВАЖНО: Брой думите си преди да отговориш! Текстът ТРЯБВА да е между ${Math.floor(targetWordCount * 0.9)}-${Math.ceil(targetWordCount * 1.1)} думи!

HOOK ПРИМЕРИ:
- Започни с интригуващ въпрос
- Разкажи кратка история (2-3 изречения)
- Започни с интересен факт`;
      break;

    case 'mofu':
      contentTypeInstructions = `ЦЕЛ: How-to guide който демонстрира експертиза

ФОКУС:
• Стъпка по стъпка инструкции
• Предупреди за често срещани грешки
• Дай advanced tips
• Бъди максимално практичен

CTA СТРАТЕГИЯ:
• 1 CTA marker в началото (free tool): <!-- CTA:free --> (след въведението)
• 2 CTA markers в средата (features): <!-- CTA:feature --> (след основни секции)
• 1 CTA marker в края (strong): <!-- CTA:strong --> (преди заключението)

ДЪЛЖИНА: ТОЧНО ${targetWordCount} думи (минимум ${Math.floor(targetWordCount * 0.9)} думи, максимум ${Math.ceil(targetWordCount * 1.1)} думи)
ВАЖНО: Брой думите си преди да отговориш! Текстът ТРЯБВА да е между ${Math.floor(targetWordCount * 0.9)}-${Math.ceil(targetWordCount * 1.1)} думи!

СТРУКТУРА:
1. Кратко въведение (защо е важно)
2. Стъпка 1 (с детайли)
3. Стъпка 2 (с детайли)
4. ... (според нуждата)
5. Чести грешки
6. Advanced tips
7. Заключение с CTA`;
      break;

    case 'bofu':
      contentTypeInstructions = `ЦЕЛ: Conversion-focused статия с директен призив

ФОКУС:
• Сравнения (безплатно vs платено, базово vs advanced)
• Адресирай възражения
• Социално доказателство (без конкретни цифри, общо)
• Подчертай уникалната стойност

CTA СТРАТЕГИЯ:
• 4-5 CTA markers разпределени равномерно: <!-- CTA:conversion -->
• Първи CTA след въведението
• CTA след всяка основна секция
• Финален силен CTA в края

ДЪЛЖИНА: ТОЧНО ${targetWordCount} думи (минимум ${Math.floor(targetWordCount * 0.9)} думи, максимум ${Math.ceil(targetWordCount * 1.1)} думи)
ВАЖНО: Брой думите си преди да отговориш! Текстът ТРЯБВА да е между ${Math.floor(targetWordCount * 0.9)}-${Math.ceil(targetWordCount * 1.1)} думи!

ЕЛЕМЕНТИ:
• "Какво получаваш" секция
• "За кого е това" секция
• "Защо сега" (urgency без манипулация)
• Comparison (преди/след, free/paid)`;
      break;

    case 'advertorial':
      contentTypeInstructions = `ЦЕЛ: Максимална конверсия чрез storytelling

ФОКУС:
• Разкажи РЕАЛНА или максимално реалистична история
• Проблем → Решение → Трансформация
• Емоционална връзка
• Силно urgency (но не манипулативно)

CTA СТРАТЕГИЯ:
• 6-8 CTA markers навсякъде: <!-- CTA:urgent -->
• CTAs са част от историята
• Repetition на ключово benefit
• Всеки CTA звучи по различен начин

ДЪЛЖИНА: ТОЧНО ${targetWordCount} думи (минимум ${Math.floor(targetWordCount * 0.9)} думи, максимум ${Math.ceil(targetWordCount * 1.1)} думи)
ВАЖНО: Брой думите си преди да отговориш! Текстът ТРЯБВА да е между ${Math.floor(targetWordCount * 0.9)}-${Math.ceil(targetWordCount * 1.1)} думи!

СТРУКТУРА:
1. Hook - емоционална ситуация (100 думи)
2. Problem amplification (200 думи)
3. Discovery момент (300 думи) + CTA
4. Transformation (250 думи) + CTA
5. Results (150 думи) + CTA
6. Social proof (150 думи) + CTA
7. Final urgency + CTA (100 думи)

ВАЖНО: Пиши от първо лице ("аз"). Ако не може от първо лице, пиши за конкретен човек ("Мария от София").`;
      break;
  }

  return `${BLOG_MASTER_SYSTEM_PROMPT}

====================
КОНТЕКСТ И АКТУАЛНОСТ
====================

ДНЕШНА ДАТА: ${currentDate}
ТЕКУЩА ГОДИНА: ${currentYear}

ВАЖНО: Статията трябва да е АКТУАЛНА за ${currentYear}-${currentYear + 1} година!
- Фокусирай се на текущи и предстоящи астрологични събития за ${currentYear}-${currentYear + 1}
- Избягвай референции към минали години (2023, 2024)
- Говори за предстоящи транзити, ретроградни планети, новолуния/пълнолуния
- Темата трябва да е РЕЛЕВАНТНА за хората ПРЕЗ ${currentYear} година

====================
ЗАДАЧА
====================

Напиши статия за Vrachka блога на тема: "${topic}"

КАТЕГОРИЯ: ${category}
КЛЮЧОВИ ДУМИ: ${keywords.join(', ')}

${contentTypeInstructions}

====================
SEO ИЗИСКВАНИЯ
====================

• Включи primary keyword "${keywords[0] || topic}" в:
  - Първото изречение
  - Поне 2 подзаглавия
  - Естествено в текста (1-2% density)

• Semantic keywords от списъка: ${keywords.slice(1).join(', ')}

• Създай:
  1. Завладяващо SEO-friendly заглавие (50-60 символа)
  2. Meta description (150-160 символа)
  3. Excerpt за preview (150-160 символа)

====================
OUTPUT FORMAT
====================

ВАЖНО: Върни САМО валиден JSON без никакъв друг текст, markdown или обяснения!

Формат:
{
  "title": "Заглавието на статията (50-60 chars)",
  "metaTitle": "SEO meta title (може да е различно от title, 50-60 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "excerpt": "Кратко описание за preview (150-160 chars)",
  "content": "HTML съдържанието с <h2>, <p>, <ul>, <ol>, <strong> и <!-- CTA:type --> markers",
  "keywords": ["${keywords[0] || topic}", "${keywords[1] || 'астрология'}", "${keywords[2] || 'окултизъм'}"]
}

ПРАВИЛА:
- Върни САМО JSON object - никакъв markdown или code blocks
- Съдържанието трябва да е валиден HTML
- Escape quotes properly in JSON (използвай \\" за quotes в HTML strings)
- Use standard quotes for all citations
- CTA markers: <!-- CTA:soft -->, <!-- CTA:medium -->, <!-- CTA:strong -->, <!-- CTA:free -->, <!-- CTA:feature -->, <!-- CTA:conversion -->, <!-- CTA:urgent -->
- НЕ пиши <h1> в content - то се подава отделно

Започни ДИРЕКТНО с { и завърши с }. Никакъв друг текст!`;
}

// Helper function to extract content from AI response
export function parseAIBlogResponse(aiResponse: string): {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  keywords: string[];
} {
  // Remove markdown code blocks if present (```json ... ``` or ```...```)
  let cleanResponse = aiResponse.trim();

  // Remove markdown code block markers
  cleanResponse = cleanResponse.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

  // Fix common JSON issues with control characters
  // First, try to extract JSON object if there's extra text
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanResponse = jsonMatch[0];
  }

  try {
    // Try to parse as JSON directly
    const parsed = JSON.parse(cleanResponse);

    // Validate required fields
    if (!parsed.title || !parsed.content) {
      throw new Error('Missing required fields in JSON response');
    }

    return {
      title: parsed.title,
      metaTitle: parsed.metaTitle || parsed.title,
      metaDescription: parsed.metaDescription || parsed.excerpt || 'Генерирана статия от Vrachka AI',
      excerpt: parsed.excerpt || parsed.metaDescription || '',
      content: parsed.content,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    };
  } catch (error) {
    // If parsing failed, try to fix control characters and malformed JSON
    console.error('AI response is not valid JSON, attempting repair', error);
    console.log('Raw AI response (first 500 chars):', cleanResponse.substring(0, 500));

    try {
      // Attempt to fix common JSON issues:
      // 1. Replace literal newlines in strings with \n
      // 2. Replace literal tabs with \t
      // 3. Remove any control characters
      let repairedJson = cleanResponse;

      // Try to intelligently fix string values with control characters
      // This is a heuristic approach - find "key": "value" patterns and escape them
      repairedJson = repairedJson.replace(
        /"(content|excerpt|metaDescription|metaTitle|title)":\s*"([\s\S]*?)"/g,
        (match, key, value) => {
          // Escape control characters in the value
          const escapedValue = value
            .replace(/\\/g, '\\\\')  // Escape existing backslashes first
            .replace(/"/g, '\\"')    // Escape quotes
            .replace(/\n/g, '\\n')   // Escape newlines
            .replace(/\r/g, '\\r')   // Escape carriage returns
            .replace(/\t/g, '\\t')   // Escape tabs
            .replace(/[\x00-\x1F\x7F]/g, ''); // Remove other control chars

          return `"${key}": "${escapedValue}"`;
        }
      );

      const parsed = JSON.parse(repairedJson);

      if (parsed.title && parsed.content) {
        return {
          title: parsed.title,
          metaTitle: parsed.metaTitle || parsed.title,
          metaDescription: parsed.metaDescription || parsed.excerpt || 'Генерирана статия от Vrachka AI',
          excerpt: parsed.excerpt || parsed.metaDescription || '',
          content: parsed.content,
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        };
      }
    } catch (repairError) {
      console.error('JSON repair also failed:', repairError);
    }

    // Last resort: Try to manually extract fields using regex
    try {
      const titleMatch = cleanResponse.match(/"title":\s*"([^"]+)"/);
      const contentMatch = cleanResponse.match(/"content":\s*"([\s\S]*?)"\s*,\s*"keywords"/);

      if (titleMatch && contentMatch) {
        return {
          title: titleMatch[1],
          metaTitle: titleMatch[1],
          metaDescription: 'Генерирана статия от Vrachka AI',
          excerpt: '',
          content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          keywords: [],
        };
      }
    } catch (extractError) {
      console.error('Manual extraction also failed:', extractError);
    }

    // Final fallback - return the whole response as content
    return {
      title: 'Генерирана статия',
      metaTitle: 'Генерирана статия',
      metaDescription: 'Генерирана статия от Vrachka AI',
      excerpt: '',
      content: cleanResponse,
      keywords: [],
    };
  }
}

// Slug generator
export function generateSlug(title: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
    'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
    'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
  };

  return title
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Calculate reading time (Bulgarian speed: ~200 words/min)
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Calculate word count
export function calculateWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  return text.split(/\s+/).filter(word => word.length > 0).length;
}
