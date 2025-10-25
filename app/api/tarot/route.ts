import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createFeatureCompletion } from "@/lib/ai/openrouter";
import { TAROT_SYSTEM_PROMPT, getTarotPrompt } from "@/lib/ai/prompts";
import { canReadTarot, incrementTarotUsage, checkFeatureAccess } from "@/lib/subscription";
import { rateLimit, RATE_LIMITS, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Service client to bypass RLS for reading public tarot cards
function getSupabaseService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type SpreadType = 'single' | 'three-card' | 'love' | 'career';

interface TarotCard {
  id: number;
  name: string;
  name_bg: string;
  card_type: string;
  suit?: string;
  image_url: string;
  upright_meaning: string;
  reversed_meaning?: string;
  reversed?: boolean;
  position?: string;
}

interface TarotReading {
  overall: string;
  cards: Array<{
    name: string;
    interpretation: string;
    advice: string;
  }>;
  conclusion: string;
}

const SPREAD_CONFIGS = {
  single: {
    cardCount: 1,
    positions: ['Карта на деня'],
    featureKey: null, // Free for everyone
  },
  'three-card': {
    cardCount: 3,
    positions: ['Минало', 'Настояще', 'Бъдеще'],
    featureKey: 'canAccessThreeCardSpread' as const,
  },
  love: {
    cardCount: 5,
    positions: ['Ти', 'Партньорът', 'Връзката', 'Предизвикателства', 'Потенциал'],
    featureKey: 'canAccessLoveReading' as const,
  },
  career: {
    cardCount: 5,
    positions: ['Настояща позиция', 'Възможности', 'Предизвикателства', 'Съвет', 'Резултат'],
    featureKey: 'canAccessCareerReading' as const,
  },
};

export async function POST(req: NextRequest) {
  try {
    // IP-based rate limiting (protection against abuse)
    const clientIp = getClientIp(req);
    const ipRateLimit = rateLimit(
      `tarot:${clientIp}`,
      RATE_LIMITS.tarot
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { spreadType = 'single', question } = body;

    if (!SPREAD_CONFIGS[spreadType as SpreadType]) {
      return NextResponse.json(
        { error: "Invalid spread type" },
        { status: 400 }
      );
    }

    const config = SPREAD_CONFIGS[spreadType as SpreadType];

    // Check feature access for premium spreads
    if (config.featureKey) {
      const canAccess = await checkFeatureAccess(user.id, config.featureKey);
      if (!canAccess) {
        return NextResponse.json(
          { error: `This spread is available for Premium subscribers only`, premium: true },
          { status: 403 }
        );
      }
    }

    // Check rate limits
    const { allowed, remaining, limit } = await canReadTarot(user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily limit reached. You can perform ${limit} readings per day.`,
          limit_reached: true,
          limit,
          remaining: 0
        },
        { status: 429 }
      );
    }

    // Get random tarot cards (use service client to bypass RLS)
    const supabaseService = getSupabaseService();
    const { data: allCards, error: cardsError } = await supabaseService
      .from('tarot_cards')
      .select('*');

    if (cardsError || !allCards || allCards.length === 0) {
      console.error("Tarot cards error:", cardsError);
      return NextResponse.json(
        { error: "Failed to load tarot cards. Please ensure cards are seeded in the database." },
        { status: 500 }
      );
    }

    // Shuffle and select cards
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, config.cardCount).map((card, index) => ({
      ...card,
      reversed: Math.random() > 0.7, // 30% chance of reversed
      position: config.positions[index],
    })) as TarotCard[];

    // Generate reading with AI
    console.log('[Tarot API] Generating reading for user:', user.id, 'spread:', spreadType, 'cards:', selectedCards.length);
    const prompt = getTarotPrompt(selectedCards, spreadType as SpreadType, question);

    let aiResponse;
    let reading: TarotReading;
    try {
      console.log('[Tarot API] Calling AI completion with Gemini Free...');
      const response = await createFeatureCompletion(
        'tarot',
        [
          { role: 'system', content: TAROT_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        {
          temperature: 0.85,
          // 3-card spread gets more tokens for detailed interpretation
          max_tokens: spreadType === 'single' ? 1800 : 2500,
        }
      );

      aiResponse = response.choices[0]?.message?.content || '';
      console.log('[Tarot API] AI response received from', response.model_used, 'length:', aiResponse?.length);

      // Parse JSON response
      console.log('[Tarot API] Parsing AI JSON response...');
      reading = JSON.parse(aiResponse) as TarotReading;

      if (!reading) {
        console.error('[Tarot API] Failed to parse AI response:', aiResponse?.substring(0, 200));
        throw new Error('Failed to parse AI tarot reading - invalid JSON');
      }
      console.log('[Tarot API] Successfully parsed tarot reading');
    } catch (error) {
      console.error('[Tarot API] AI generation/parse error:', error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Increment usage
    await incrementTarotUsage(user.id);

    // Save reading to history (only for single card readings for now)
    if (spreadType === 'single' && selectedCards.length > 0) {
      const card = selectedCards[0];
      try {
        await supabase.from('tarot_readings').insert({
          user_id: user.id,
          card_id: card.id,
          card_name: card.name,
          card_name_bg: card.name_bg,
          card_image_url: card.image_url,
          is_reversed: card.reversed,
          interpretation: reading.cards[0]?.interpretation || '',
          advice: reading.cards[0]?.advice || '',
        });
      } catch (historyError) {
        // Don't fail the request if history saving fails
        console.error('Failed to save reading history:', historyError);
      }
    }

    // Prepare response
    const cardsWithInterpretations = selectedCards.map((card, index) => ({
      id: card.id,
      name: card.name,
      name_bg: card.name_bg,
      image_url: card.image_url,
      reversed: card.reversed,
      position: card.position,
      upright_meaning: card.upright_meaning,
      reversed_meaning: card.reversed_meaning,
      interpretation: reading.cards[index]?.interpretation || '',
      advice: reading.cards[index]?.advice || '',
    }));

    return NextResponse.json({
      spreadType,
      question,
      cards: cardsWithInterpretations,
      overall: reading.overall,
      conclusion: reading.conclusion,
      remaining: remaining - 1,
      limit,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Tarot reading error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate tarot reading" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available spreads and limits
export async function GET() {
  try {
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

    // Get usage stats
    const { allowed, remaining, limit } = await canReadTarot(user.id);

    // Check which spreads are available
    const availableSpreads: Record<string, boolean> = {
      single: true, // Always available
    };

    for (const [spreadType, config] of Object.entries(SPREAD_CONFIGS)) {
      if (config.featureKey) {
        availableSpreads[spreadType] = await checkFeatureAccess(user.id, config.featureKey);
      }
    }

    return NextResponse.json({
      usage: {
        remaining,
        limit,
        allowed,
      },
      availableSpreads,
      spreadTypes: Object.keys(SPREAD_CONFIGS).map(type => ({
        type,
        cardCount: SPREAD_CONFIGS[type as SpreadType].cardCount,
        positions: SPREAD_CONFIGS[type as SpreadType].positions,
        premium: !!SPREAD_CONFIGS[type as SpreadType].featureKey,
        available: availableSpreads[type] || false,
      })),
    });
  } catch (error) {
    console.error("Tarot info error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get tarot info" },
      { status: 500 }
    );
  }
}
