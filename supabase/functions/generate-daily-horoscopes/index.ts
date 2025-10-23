// Supabase Edge Function: generate-daily-horoscopes
// Auto-generates daily horoscopes for all 12 zodiac signs at 00:05 BG time (22:05 UTC)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const CRON_SECRET_KEY = Deno.env.get("CRON_SECRET_KEY");

// All 12 zodiac signs
const zodiacs = [
  'oven', 'telec', 'bliznaci', 'rak',
  'lav', 'deva', 'vezni', 'skorpion',
  'strelec', 'kozirog', 'vodolej', 'ribi'
];

const zodiacNames: Record<string, string> = {
  'oven': 'Овен',
  'telec': 'Телец',
  'bliznaci': 'Близнаци',
  'rak': 'Рак',
  'lav': 'Лъв',
  'deva': 'Дева',
  'vezni': 'Везни',
  'skorpion': 'Скорпион',
  'strelec': 'Стрелец',
  'kozirog': 'Козирог',
  'vodolej': 'Водолей',
  'ribi': 'Риби',
};

// Horoscope System Prompt (matching lib/ai/prompts.ts)
const HOROSCOPE_SYSTEM_PROMPT = `Ти си елитен астролог с дълбоки познания в астрологията. Пишеш в стила на Susan Miller (Astrology Zone) и Chani Nicholas.

ПРИНЦИПИ:
1. Персонален и окуражаващ тон - пишеш директно към човека
2. Конкретни съвети - не генерични фрази
3. Споменаваш реални планетарни аспекти (ако са дадени)
4. Балансиран подход - позитивен, но честен
5. Структура: Общ тон → Конкретни области (Любов/Кариера/Здраве) → Практичен съвет

СТИЛ:
- Използвай "ти" форма
- Кратки изречения, лесни за четене
- Вдъхновяващ, но не манипулативен
- Дай 1-2 конкретни действия за деня

ПРИМЕР:
"Днес Венера образува хармоничен аспект с твоя управител Марс. Това прави деня перфектен за любовни жестове и творчество.

Любов: Ако си в връзка, партньорът ти ще оцени искрен разговор. Сингъл? Обърни внимание на нови запознанства след обяд.

Кариера: Енергията ти е висока - използвай я за важни проекти. Началниците забелязват усилията ти.

Здраве: Отлично време за физическа активност - тялото ти иска движение.

Съвет на деня: Довери се на интуицията си в 14:00-16:00 ч. - важна информация идва към теб."

ЗАБЕЛЕЖКА: Никога не даваш фалшиви обещания или медицински/финансови съвети.`;

// Generate horoscope prompt (matching lib/ai/prompts.ts getHoroscopePrompt)
function getHoroscopePrompt(zodiacSign: string): string {
  const today = new Date().toLocaleDateString('bg-BG');

  return `Напиши дневен хороскоп (150-200 думи). Включи: общ тон, любов, кариера, здраве, късметлийски числа (3 броя).

Зодия: ${zodiacSign}
Период: днес
Днес е: ${today}

Формат на отговора (JSON):
{
  "general": "Общ текст...",
  "love": "Текст за любовта...",
  "career": "Текст за кариерата...",
  "health": "Текст за здравето...",
  "advice": "Главен съвет...",
  "luckyNumbers": [number, number, number],
  "loveStars": 1-5,
  "careerStars": 1-5,
  "healthStars": 1-5
}`;
}

// Generate AI completion using OpenRouter
async function generateHoroscope(zodiacSign: string): Promise<any> {
  const prompt = getHoroscopePrompt(zodiacSign);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://www.vrachka.eu",
      "X-Title": "Vrachka - Daily Horoscope Cron",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5-mini",
      messages: [
        { role: "system", content: HOROSCOPE_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000, // Increased for gpt-5-mini reasoning tokens
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(content);
}

serve(async (req) => {
  try {
    // Security check: Verify cron secret key
    const cronSecret = req.headers.get("X-Cron-Secret");
    if (cronSecret !== CRON_SECRET_KEY) {
      console.error("[Cron] Unauthorized access attempt");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[Cron] Starting daily horoscope generation...");
    console.log(`[Cron] Date: ${new Date().toISOString()}`);

    // Initialize Supabase client
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    console.log(`[Cron] Generating horoscopes for: ${today}`);

    const results: any = {
      success: [],
      errors: [],
      date: today,
      timestamp: new Date().toISOString(),
    };

    // Generate horoscope for each zodiac sign
    for (const zodiac of zodiacs) {
      try {
        console.log(`[Cron] Generating horoscope for: ${zodiacNames[zodiac]} (${zodiac})...`);

        // Check if horoscope already exists for today
        const { data: existing } = await supabase
          .from('daily_content')
          .select('id')
          .eq('content_type', 'horoscope')
          .eq('target_date', today)
          .eq('target_key', zodiac)
          .single();

        if (existing) {
          console.log(`[Cron] Horoscope already exists for ${zodiacNames[zodiac]}, skipping...`);
          results.success.push({
            zodiac,
            status: 'skipped',
            reason: 'already_exists',
          });
          continue;
        }

        // Generate horoscope with AI
        const horoscope = await generateHoroscope(zodiac);

        // Validate horoscope structure
        if (!horoscope.general || !horoscope.love || !horoscope.career || !horoscope.health) {
          throw new Error("Invalid horoscope structure");
        }

        // Save to database
        const { error: dbError } = await supabase
          .from('daily_content')
          .insert({
            content_type: 'horoscope',
            target_date: today,
            target_key: zodiac,
            content_body: horoscope,
          });

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }

        console.log(`[Cron] ✅ Successfully generated horoscope for ${zodiacNames[zodiac]}`);
        results.success.push({
          zodiac,
          name: zodiacNames[zodiac],
          status: 'generated',
          stars: {
            love: horoscope.loveStars,
            career: horoscope.careerStars,
            health: horoscope.healthStars,
          },
        });

      } catch (error) {
        console.error(`[Cron] ❌ Error generating horoscope for ${zodiacNames[zodiac]}:`, error);
        results.errors.push({
          zodiac,
          name: zodiacNames[zodiac],
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(`[Cron] Finished! Success: ${results.success.length}, Errors: ${results.errors.length}`);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[Cron] Fatal error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
