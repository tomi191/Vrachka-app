import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createFeatureCompletion } from "@/lib/ai/openrouter";
import { HOROSCOPE_SYSTEM_PROMPT, getHoroscopePrompt } from "@/lib/ai/prompts";
import { checkFeatureAccess } from "@/lib/subscription";
import { rateLimitAdaptive, RATE_LIMITS, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";
import { parseAIJsonResponse } from "@/lib/ai/client";

// Create admin client for database writes (bypasses RLS)
function getSupabaseAdmin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Zodiac slug to Bulgarian name mapping
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

export async function GET(req: NextRequest) {
  try {
    // IP-based rate limiting (protection against abuse)
    const clientIp = getClientIp(req);
    const ipRateLimit = await rateLimitAdaptive(
      `horoscope:${clientIp}`,
      RATE_LIMITS.horoscope
    );

    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          rate_limit_exceeded: true,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(ipRateLimit.remaining, ipRateLimit.resetAt),
        }
      );
    }

    // AI configuration checked automatically by openrouter

    const supabase = await createClient();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const zodiacSign = searchParams.get('zodiac');
    const period = (searchParams.get('period') || 'daily') as 'daily' | 'weekly' | 'monthly';

    if (!zodiacSign) {
      return NextResponse.json(
        { error: "Zodiac sign is required" },
        { status: 400 }
      );
    }

    // Check authentication only for premium features (weekly/monthly)
    if (period === 'weekly' || period === 'monthly') {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Authentication required for weekly/monthly horoscopes", premium: true },
          { status: 401 }
        );
      }

      // Check access for weekly/monthly horoscopes
      if (period === 'weekly') {
        const canAccess = await checkFeatureAccess(user.id, 'canAccessWeeklyHoroscope');
        if (!canAccess) {
          return NextResponse.json(
            { error: "Weekly horoscopes are available for Basic and Ultimate subscribers only", premium: true },
            { status: 403 }
          );
        }
      }

      if (period === 'monthly') {
        const canAccess = await checkFeatureAccess(user.id, 'canAccessMonthlyHoroscope');
        if (!canAccess) {
          return NextResponse.json(
            { error: "Monthly horoscopes are available for Basic and Ultimate subscribers only", premium: true },
            { status: 403 }
          );
        }
      }
    }

    // Check if horoscope already exists for today (caching)
    const today = new Date().toISOString().split('T')[0];
    const contentType = period === 'daily' ? 'horoscope' :
                       period === 'weekly' ? 'weekly_horoscope' :
                       'monthly_horoscope';

    const { data: existingContent } = await supabase
      .from('daily_content')
      .select('*')
      .eq('content_type', contentType)
      .eq('target_date', today)
      .eq('target_key', zodiacSign)
      .single();

    if (existingContent) {
      return NextResponse.json({
        ...existingContent.content_body,
        cached: true,
        generated_at: existingContent.generated_at,
      });
    }

    // Generate new horoscope with AI
    console.log('[Horoscope API] Generating new horoscope for:', zodiacSign, period);
    // Use Bulgarian zodiac name for better AI understanding
    const zodiacNameBG = zodiacNames[zodiacSign] || zodiacSign;
    const prompt = getHoroscopePrompt(zodiacNameBG, period);

    let aiResponse;
    let horoscope: HoroscopeResponse;
    try {
      console.log('[Horoscope API] Calling AI completion with Gemini Free...');
      const response = await createFeatureCompletion(
        'horoscope',
        [
          { role: 'system', content: HOROSCOPE_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        {
          temperature: 0.8,
          max_tokens: period === 'daily' ? 2000 : period === 'weekly' ? 2500 : 3500,
        }
      );

      aiResponse = response.choices[0]?.message?.content || '';
      console.log('[Horoscope API] AI response received from', response.model_used, 'length:', aiResponse?.length);

      // Parse JSON response (handles markdown code blocks from AI)
      console.log('[Horoscope API] Parsing AI JSON response...');
      const parsedHoroscope = parseAIJsonResponse<HoroscopeResponse>(aiResponse);

      if (!parsedHoroscope) {
        console.error('[Horoscope API] Failed to parse AI response:', aiResponse?.substring(0, 200));
        throw new Error('Failed to parse AI response - invalid JSON');
      }

      horoscope = parsedHoroscope;
      console.log('[Horoscope API] Successfully parsed horoscope');
    } catch (error) {
      console.error('[Horoscope API] AI generation/parse error:', error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Save to database for caching (use admin client to bypass RLS)
    try {
      console.log('[Horoscope API] Saving to database...');
      const supabaseAdmin = getSupabaseAdmin();
      const { error: dbError } = await supabaseAdmin.from('daily_content').insert({
        content_type: contentType,
        target_date: today,
        target_key: zodiacSign,
        content_body: horoscope,
      });

      if (dbError) {
        console.error('[Horoscope API] Database save error:', dbError);
        // Don't fail the request if caching fails
      } else {
        console.log('[Horoscope API] Successfully saved to database');
      }
    } catch (dbError) {
      console.error('[Horoscope API] Database error:', dbError);
      // Don't fail the request if caching fails
    }

    console.log('[Horoscope API] Returning response');
    return NextResponse.json({
      ...horoscope,
      cached: false,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Horoscope API] Fatal error:", error);
    console.error("[Horoscope API] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate horoscope" },
      { status: 500 }
    );
  }
}
