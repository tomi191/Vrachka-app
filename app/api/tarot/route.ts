import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOpenAIConfigured, generateCompletion, parseAIJsonResponse } from "@/lib/ai/client";
import { TAROT_SYSTEM_PROMPT, getTarotPrompt } from "@/lib/ai/prompts";
import { canReadTarot, incrementTarotUsage, checkFeatureAccess } from "@/lib/subscription";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    // Get random tarot cards
    const { data: allCards, error: cardsError } = await supabase
      .from('tarot_cards')
      .select('*');

    if (cardsError || !allCards || allCards.length === 0) {
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
    const prompt = getTarotPrompt(selectedCards, spreadType as SpreadType, question);
    const aiResponse = await generateCompletion(
      TAROT_SYSTEM_PROMPT,
      prompt,
      {
        temperature: 0.85,
        maxTokens: spreadType === 'single' ? 600 : 1500,
        responseFormat: 'json',
      }
    );

    const reading = parseAIJsonResponse<TarotReading>(aiResponse);

    if (!reading) {
      throw new Error('Failed to parse AI tarot reading');
    }

    // Increment usage
    await incrementTarotUsage(user.id);

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
