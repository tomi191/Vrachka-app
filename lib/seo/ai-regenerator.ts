import { createOpenRouterCompletion } from '@/lib/ai/openrouter';
import { parseAIJsonResponse } from '@/lib/ai/client';
import { parseKeywordLibrary, getKeywordsForPage } from './keyword-library';
import { PageMetadata } from './score-calculator';

export interface RegeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImagePrompt?: string; // Suggestion for OG image
  reasoning?: string; // Why these were chosen
}

/**
 * Generate optimized SEO metadata using Google Gemini 2.5 Pro
 */
export async function regenerateMetadataWithAI(
  pagePath: string,
  currentMetadata: PageMetadata,
  pageContext?: string
): Promise<RegeneratedMetadata> {
  // Get relevant keywords from library
  const relevantKeywords = getKeywordsForPage(pagePath);
  const keywordLibrary = parseKeywordLibrary();

  // Build comprehensive prompt
  const prompt = buildMetadataPrompt(
    pagePath,
    currentMetadata,
    relevantKeywords.map(k => k.keyword),
    keywordLibrary.allKeywords,
    pageContext
  );

  console.log('[SEO AI Regenerator] Generating metadata for:', pagePath);

  // Call Gemini 2.5 Pro via OpenRouter
  const response = await createOpenRouterCompletion({
    model: 'google/gemini-2.5-pro-exp-1206',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  if (!response || !response.choices || !response.choices[0]?.message?.content) {
    throw new Error('AI response was empty or invalid');
  }

  const aiResponse = response.choices[0].message.content;
  console.log('[SEO AI Regenerator] Raw AI response length:', aiResponse.length);

  // Parse JSON response
  const result = parseAIJsonResponse<RegeneratedMetadata>(aiResponse);

  if (!result) {
    throw new Error('Failed to parse AI response as JSON');
  }

  // Validate and sanitize
  return {
    title: result.title.slice(0, 70), // Enforce max length
    description: result.description.slice(0, 200),
    keywords: result.keywords.slice(0, 15), // Max 15 keywords
    ogImagePrompt: result.ogImagePrompt,
    reasoning: result.reasoning,
  };
}

/**
 * Build comprehensive metadata generation prompt
 */
function buildMetadataPrompt(
  pagePath: string,
  currentMetadata: PageMetadata,
  relevantKeywords: string[],
  allKeywords: string[],
  pageContext?: string
): string {
  const pageDescriptions: Record<string, string> = {
    '/': 'Начална страница на Vrachka.eu - AI-powered платформа за астрология, таро и духовност',
    '/horoscope': 'Дневен хороскоп за всички 12 зодии с AI анализ',
    '/natal-chart': 'Безплатен калкулатор за натална карта с детайлен AI анализ',
    '/tarot': 'Безплатно онлайн таро гадаене с AI интерпретация',
    '/moon-phase': 'Лунен календар 2025 - фази на луната и астрологични прогнози',
    '/features': 'Функции и възможности на Vrachka платформата',
    '/pricing': 'Ценоразпис - Free, Premium и Ultimate планове',
    '/about': 'За Vrachka - мисия, екип и технология',
    '/blog': 'Блог за астрология, таро, нумерология и духовност',
    '/contact': 'Контакт с екипа на Vrachka',
  };

  const pageDescription = pageDescriptions[pagePath] || pageContext || `Страница: ${pagePath}`;

  return `Ти си SEO експерт специализиран в български език и е-commerce/SaaS платформи.

ЗАДАЧА: Генерирай оптимизирани SEO метаданни за следната страница на Vrachka.eu

ИНФОРМАЦИЯ ЗА СТРАНИЦАТА:
Path: ${pagePath}
Описание: ${pageDescription}

ТЕКУЩИ МЕТАДАННИ (за референция):
Title: ${currentMetadata.title || 'няма'}
Description: ${currentMetadata.description || 'няма'}
Keywords: ${currentMetadata.keywords?.join(', ') || 'няма'}

SEO KEYWORD LIBRARY - РЕЛЕВАНТНИ KEYWORDS ЗА ТАЗИ СТРАНИЦА:
${relevantKeywords.length > 0 ? relevantKeywords.join(', ') : 'няма специфични'}

ДОСТЪПНИ KEYWORDS ОТ БИБЛИОТЕКАТА (използвай най-релевантните):
${allKeywords.slice(0, 50).join(', ')}

ИЗИСКВАНИЯ:

1. **Meta Title** (50-60 символа):
   - Започни с primary keyword
   - Включи brand name "Vrachka" в края (след |)
   - Бъди конкретен и привлекателен
   - Формат: "Primary Keyword - Benefit | Vrachka"
   - ВАЖНО: Използвай български език

2. **Meta Description** (150-160 символа):
   - Включи 2-3 важни keywords естествено
   - Включи call-to-action
   - Покажи уникална стойност
   - Бъди убедителен и конкретен
   - ВАЖНО: Използвай български език

3. **Keywords** (5-12 keywords):
   - Започни с primary keywords от library-то
   - Включи long-tail variations
   - Избягвай keyword stuffing
   - Приоритизирай P0 и P1 keywords
   - Само релевантни към страницата

4. **OG Image Prompt** (опционално):
   - Опиши какво трябва да съдържа OG image
   - Кратки 1-2 изречения

5. **Reasoning** (опционално):
   - Кратко обяснение защо избра тези keywords и формулировки

OUTPUT FORMAT (JSON):
\`\`\`json
{
  "title": "Точно 50-60 символа title тук",
  "description": "Точно 150-160 символа description тук с естествено вплетени keywords",
  "keywords": ["keyword1", "keyword2", "keyword3", "..."],
  "ogImagePrompt": "OG image description",
  "reasoning": "Кратко обяснение на избора"
}
\`\`\`

ВАЖНИ ПРАВИЛА:
✅ Използвай САМО български език
✅ Спазвай character limits стриктно
✅ Използвай keywords от предоставения списък
✅ Бъди конкретен - не generic фрази
✅ Включи "Vrachka" в title-а
✅ Включи year (2025) където е релевантно
❌ НЕ използвай английски думи (освен brand names)
❌ НЕ превишавай character limits
❌ НЕ използвай keywords които не са в library-то

Генерирай metadata СЕГА:`;
}

/**
 * Batch regenerate metadata for multiple pages
 */
export async function batchRegenerateMetadata(
  pages: Array<{ path: string; metadata: PageMetadata }>
): Promise<Array<{ path: string; result: RegeneratedMetadata | null; error?: string }>> {
  const results: Array<{ path: string; result: RegeneratedMetadata | null; error?: string }> = [];

  for (const page of pages) {
    try {
      const result = await regenerateMetadataWithAI(page.path, page.metadata);
      results.push({ path: page.path, result });

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error regenerating metadata for ${page.path}:`, error);
      results.push({
        path: page.path,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
