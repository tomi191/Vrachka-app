import { createOpenRouterCompletion } from '@/lib/ai/openrouter'
import { trackAICost } from '@/lib/ai/cost-tracker'
import { createClient } from '@/lib/supabase/server'

const zodiacSigns = [
  'oven', 'telec', 'bliznaci', 'rak', 'lav', 'deva',
  'vezni', 'skorpion', 'strelec', 'kozirog', 'vodolej', 'ribi'
] as const

const zodiacNames: Record<string, string> = {
  oven: 'Овен',
  telec: 'Телец',
  bliznaci: 'Близнаци',
  rak: 'Рак',
  lav: 'Лъв',
  deva: 'Дева',
  vezni: 'Везни',
  skorpion: 'Скорпион',
  strelec: 'Стрелец',
  kozirog: 'Козирог',
  vodolej: 'Водолей',
  ribi: 'Риби',
}

interface GeneratedHoroscope {
  title: string
  description: string
  content: string
  keywords: string[]
}

/**
 * Генерира дневен хороскоп за дадена зодия с AI
 */
export async function generateDailyHoroscope(zodiacSign: string): Promise<GeneratedHoroscope> {
  const zodiacName = zodiacNames[zodiacSign]
  const today = new Date().toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })

  const prompt = `Генерирай КАЧЕСТВЕН и УНИКАЛЕН дневен хороскоп на български език за зодия ${zodiacName} за ${today}.

ИЗИСКВАНИЯ:
1. Заглавие (title): Кратко, SEO-оптимизирано (напр. "Дневен Хороскоп ${zodiacName} - ${today}")
2. Описание (description): 1-2 изречения обобщение (150-160 символа)
3. Съдържание (content): Пълен хороскоп с 4 секции:
   - **Любов и Отношения**: Прогноза за любовния живот
   - **Кариера и Финанси**: Работни възможности и пари
   - **Здраве и Енергия**: Физическо и психическо състояние
   - **Съвет за Деня**: Конкретна препоръка

ТОНЪТ трябва да е:
- Положителен, но реалистичен
- Професионален, но топъл
- Конкретен (не общи фрази)
- Вдъхновяващ

ФОРМАТ:
Върни JSON с 4 полета:
{
  "title": "...",
  "description": "...",
  "content": "...",
  "keywords": ["keyword1", "keyword2", ...]
}

В content използвай markdown: ## за заглавия, **bold**, *italic*, - за списъци.
Keywords трябва да са 5-7 релевантни думи за SEO.`

  try {
    const response = await createOpenRouterCompletion({
      model: 'openai/gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'Ти си професионален астролог с 20 години опит. Пишеш качествени, уникални хороскопи на български език, които помагат на хората. Винаги отговаряш с валиден JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // По-висока температура за creativity
      max_tokens: 1500,
    })

    // Track AI cost
    await trackAICost({
      user_id: 'system',
      feature: 'blog_generation',
      model: 'openai/gpt-4-1106-preview',
      input_tokens: response.usage.prompt_tokens,
      output_tokens: response.usage.completion_tokens,
      total_cost: response.usage.total_cost,
      metadata: { zodiac_sign: zodiacSign },
    })

    // Parse JSON response
    const content = response.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content) as GeneratedHoroscope

    console.log(`[Blog Generator] Generated horoscope for ${zodiacName}`)

    return parsed
  } catch (error) {
    console.error(`[Blog Generator] Error generating horoscope for ${zodiacSign}:`, error)
    throw error
  }
}

/**
 * Генерира slug за blog post (SEO-friendly)
 */
export function generateSlug(zodiacSign: string, date: Date = new Date()): string {
  const zodiacName = zodiacNames[zodiacSign].toLowerCase()
  const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
  return `horoskop-${zodiacName}-${dateStr}`
}

/**
 * Създава blog post в базата данни
 */
export async function createBlogPost(
  zodiacSign: string,
  horoscope: GeneratedHoroscope,
  publish: boolean = true
): Promise<string | null> {
  try {
    const supabase = await createClient()
    const slug = generateSlug(zodiacSign)

    // Check if post already exists (avoid duplicates)
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`[Blog Generator] Post ${slug} already exists, skipping`)
      return existing.id
    }

    // Create new post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title: horoscope.title,
        description: horoscope.description,
        content: horoscope.content,
        category: 'daily-horoscope',
        zodiac_sign: zodiacSign,
        keywords: horoscope.keywords,
        meta_title: horoscope.title,
        meta_description: horoscope.description,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
        generated_by_ai: true,
        ai_model: 'gpt-4-1106-preview',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Blog Generator] Error creating blog post:', error)
      return null
    }

    console.log(`[Blog Generator] Created blog post ${slug} (ID: ${data.id})`)
    return data.id
  } catch (error) {
    console.error('[Blog Generator] Unexpected error:', error)
    return null
  }
}

/**
 * Генерира дневни хороскопи за всички 12 зодии
 */
export async function generateAllDailyHoroscopes(): Promise<{
  success: number
  failed: number
  total: number
}> {
  console.log('[Blog Generator] Starting daily horoscope generation for all zodiac signs...')

  let success = 0
  let failed = 0

  for (const zodiacSign of zodiacSigns) {
    try {
      const horoscope = await generateDailyHoroscope(zodiacSign)
      const postId = await createBlogPost(zodiacSign, horoscope, true)

      if (postId) {
        success++
      } else {
        failed++
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`[Blog Generator] Failed to generate horoscope for ${zodiacSign}:`, error)
      failed++
    }
  }

  const result = {
    success,
    failed,
    total: zodiacSigns.length,
  }

  console.log(`[Blog Generator] Completed: ${success}/${zodiacSigns.length} successful, ${failed} failed`)

  return result
}

/**
 * Генерира evergreen (вечнозелена) статия с AI
 */
export async function generateEvergreenArticle(
  topic: string,
  category: string,
  zodiacSign?: string
): Promise<GeneratedHoroscope> {
  const prompt = `Генерирай КАЧЕСТВЕНА и УНИКАЛНА статия на български език за тема: "${topic}".

ИЗИСКВАНИЯ:
1. Заглавие (title): SEO-оптимизирано, привлекателно
2. Описание (description): 1-2 изречения обобщение (150-160 символа)
3. Съдържание (content): Пълна статия (800-1200 думи) с:
   - Въведение
   - 3-4 основни секции с подзаглавия
   - Практични съвети
   - Заключение

${zodiacSign ? `Статията е фокусирана върху зодия ${zodiacNames[zodiacSign]}.` : ''}

ТОНЪТ трябва да е:
- Образователен
- Ангажиращ
- Авторитетен, но достъпен
- SEO-оптимизиран

ФОРМАТ:
Върни JSON с 4 полета:
{
  "title": "...",
  "description": "...",
  "content": "...",
  "keywords": ["keyword1", "keyword2", ...]
}

В content използвай markdown: ## за заглавия, **bold**, *italic*, - за списъци.
Keywords трябва да са 7-10 релевантни думи за SEO.`

  try {
    const response = await createOpenRouterCompletion({
      model: 'openai/gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'Ти си експерт астролог и писател с дълбоки познания по астрология, таро, нумерология и духовност. Пишеш качествени образователни статии на български език. Винаги отговаряш с валиден JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })

    // Track AI cost
    await trackAICost({
      user_id: 'system',
      feature: 'blog_generation',
      model: 'openai/gpt-4-1106-preview',
      input_tokens: response.usage.prompt_tokens,
      output_tokens: response.usage.completion_tokens,
      total_cost: response.usage.total_cost,
      metadata: { topic, category },
    })

    const content = response.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content) as GeneratedHoroscope

    console.log(`[Blog Generator] Generated evergreen article: ${topic}`)

    return parsed
  } catch (error) {
    console.error('[Blog Generator] Error generating evergreen article:', error)
    throw error
  }
}
