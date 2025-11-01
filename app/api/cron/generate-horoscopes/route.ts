import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createFeatureCompletion } from "@/lib/ai/openrouter";
import { HOROSCOPE_SYSTEM_PROMPT, getHoroscopePrompt } from "@/lib/ai/prompts";
import { parseAIJsonResponse } from "@/lib/ai/client";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

interface HoroscopeResponse {
  general: string;
  love: string;
  career: string;
  health: string;
  advice: string;
  luckyNumbers: number[];
  loveStars: number;
  careerStars: number;
  healthStars: number;
}

export async function POST(req: NextRequest) {
  try {
    // Security check: Verify cron secret key
    const cronSecret = req.headers.get("x-cron-secret");
    const expectedSecret = process.env.CRON_SECRET || process.env.CRON_SECRET_KEY;

    if (!expectedSecret) {
      console.error("[Cron] CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (cronSecret !== expectedSecret) {
      console.error("[Cron] Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Starting daily horoscope generation...");
    console.log(`[Cron] Date: ${new Date().toISOString()}`);

    // AI configuration checked automatically by openrouter

    // Initialize Supabase admin client (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

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
            name: zodiacNames[zodiac],
            status: 'skipped',
            reason: 'already_exists',
          });
          continue;
        }

        // Generate horoscope with AI (Gemini Free)
        // Use Bulgarian zodiac name for better AI understanding
        const prompt = getHoroscopePrompt(zodiacNames[zodiac], 'daily');
        const response = await createFeatureCompletion(
          'horoscope',
          [
            { role: 'system', content: HOROSCOPE_SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          {
            temperature: 0.8,
            max_tokens: 2000,
          }
        );

        const aiResponse = response.choices[0]?.message?.content || '';
        const horoscope = parseAIJsonResponse<HoroscopeResponse>(aiResponse);

        if (!horoscope) {
          throw new Error("Failed to parse AI response - invalid JSON");
        }

        console.log(`[Cron] Generated with ${response.model_used}`);

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

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("[Cron] Fatal error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
