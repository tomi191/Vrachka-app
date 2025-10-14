import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOpenAIConfigured, generateCompletion } from "@/lib/ai/client";
import { ORACLE_SYSTEM_PROMPT, getOraclePrompt } from "@/lib/ai/prompts";
import { canAskOracle, incrementOracleUsage, isPremiumUser } from "@/lib/subscription";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    // Check if user is premium
    const premium = await isPremiumUser(user.id);
    if (!premium) {
      return NextResponse.json(
        { error: "Oracle is available for Premium subscribers only", premium: true },
        { status: 403 }
      );
    }

    // Check rate limits
    const { allowed, remaining, limit } = await canAskOracle(user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily limit reached. You can ask ${limit} questions per day.`,
          limit_reached: true,
          limit,
          remaining: 0
        },
        { status: 429 }
      );
    }

    // Get request body
    const body = await req.json();
    const { question } = body;

    if (!question || question.trim().length < 5) {
      return NextResponse.json(
        { error: "Question must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "Question is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, zodiac_sign')
      .eq('id', user.id)
      .single();

    // Generate Oracle response with AI
    const prompt = getOraclePrompt(
      question,
      profile?.zodiac_sign,
      profile?.full_name
    );

    const answer = await generateCompletion(
      ORACLE_SYSTEM_PROMPT,
      prompt,
      {
        temperature: 0.9, // Higher temperature for more creative/varied responses
        maxTokens: 1000,
      }
    );

    if (!answer || answer.trim().length === 0) {
      throw new Error('AI generated empty response');
    }

    // Save conversation to database
    const { data: conversation } = await supabase
      .from('oracle_conversations')
      .insert({
        user_id: user.id,
        question: question.trim(),
        answer: answer.trim(),
        tokens_used: Math.ceil(answer.length / 4), // Rough estimate
      })
      .select()
      .single();

    // Increment usage
    await incrementOracleUsage(user.id);

    // Update profile total questions asked
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('total_oracle_questions_asked')
      .eq('id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({
        total_oracle_questions_asked: (currentProfile?.total_oracle_questions_asked || 0) + 1
      })
      .eq('id', user.id);

    return NextResponse.json({
      id: conversation?.id,
      question: question.trim(),
      answer: answer.trim(),
      remaining: remaining - 1,
      limit,
      asked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Oracle error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get Oracle response" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve conversation history
export async function GET(req: NextRequest) {
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

    // Check if user is premium
    const premium = await isPremiumUser(user.id);
    if (!premium) {
      return NextResponse.json(
        { error: "Oracle is available for Premium subscribers only", premium: true },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get conversation history
    const { data: conversations, error } = await supabase
      .from('oracle_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('asked_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Get usage stats
    const { allowed, remaining, limit: dailyLimit } = await canAskOracle(user.id);

    return NextResponse.json({
      conversations: conversations || [],
      usage: {
        remaining,
        limit: dailyLimit,
        allowed,
      },
    });
  } catch (error) {
    console.error("Oracle history error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get conversation history" },
      { status: 500 }
    );
  }
}
