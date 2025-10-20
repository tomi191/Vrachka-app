import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOpenAIConfigured, generateCompletion, parseAIJsonResponse } from "@/lib/ai/client";
import { HOROSCOPE_SYSTEM_PROMPT, getHoroscopePrompt } from "@/lib/ai/prompts";
import { checkFeatureAccess } from "@/lib/subscription";
import { rateLimit, RATE_LIMITS, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const ipRateLimit = rateLimit(
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

    ensureOpenAIConfigured();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
    const prompt = getHoroscopePrompt(zodiacSign, period);
    const aiResponse = await generateCompletion(
      HOROSCOPE_SYSTEM_PROMPT,
      prompt,
      {
        temperature: 0.8,
        maxTokens: period === 'daily' ? 800 : period === 'weekly' ? 1500 : 2500,
        responseFormat: 'json',
      }
    );

    const horoscope = parseAIJsonResponse<HoroscopeResponse>(aiResponse);

    if (!horoscope) {
      throw new Error('Failed to parse AI response');
    }

    // Save to database for caching
    await supabase.from('daily_content').insert({
      content_type: contentType,
      target_date: today,
      target_key: zodiacSign,
      content_body: horoscope,
    });

    return NextResponse.json({
      ...horoscope,
      cached: false,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Horoscope generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate horoscope" },
      { status: 500 }
    );
  }
}
