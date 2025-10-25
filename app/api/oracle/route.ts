import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canAskOracle, incrementOracleUsage, isPremiumUser } from "@/lib/subscription";
import { createFeatureCompletion } from "@/lib/ai/openrouter";
import { ORACLE_SYSTEM_PROMPT, getOraclePrompt } from "@/lib/ai/prompts";
import { rateLimitAdaptive, RATE_LIMITS, getClientIp, getRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // IP-based rate limiting (protection against abuse)
    const clientIp = getClientIp(req);
    const ipRateLimit = await rateLimitAdaptive(
      `oracle:${clientIp}`,
      RATE_LIMITS.oracle
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
    const { question, conversation_id } = body;

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

    // Get subscription for plan type
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .single();

    const planType = subscription?.plan_type === 'ultimate' ? 'ultimate' : 'basic';

    // Load conversation context for memory (last 5-10 messages)
    let conversationContext = "";
    if (conversation_id) {
      const { data: previousMessages } = await supabase
        .from('oracle_conversations')
        .select('question, answer, asked_at')
        .eq('conversation_id', conversation_id)
        .eq('user_id', user.id)
        .order('asked_at', { ascending: false })
        .limit(5);

      if (previousMessages && previousMessages.length > 0) {
        conversationContext = "\n\nПредишен разговор:\n" + previousMessages
          .reverse() // Oldest first
          .map((msg, idx) => `${idx + 1}. Въпрос: ${msg.question}\nОтговор: ${msg.answer}`)
          .join("\n\n");
      }
    }

    // Generate AI response using OpenRouter with conversation context
    const oraclePrompt = getOraclePrompt(
      question.trim(),
      profile?.zodiac_sign || undefined,
      profile?.full_name || undefined,
      planType
    ) + conversationContext;

    console.log('[Oracle API] Generating response for user:', user.id, 'plan:', planType);

    // Determine AI feature type based on subscription plan
    // Ultimate users get Claude Sonnet (oracle_premium)
    // Basic users get Gemini Flash (oracle_basic)
    const featureType = planType === 'ultimate' ? 'oracle_premium' : 'oracle_basic';
    console.log('[Oracle API] Using AI feature:', featureType);

    let answer;
    try {
      const response = await createFeatureCompletion(
        featureType, // Dynamic: oracle_premium for Ultimate, oracle_basic for Basic
        [
          { role: 'system', content: ORACLE_SYSTEM_PROMPT },
          { role: 'user', content: oraclePrompt },
        ],
        {
          temperature: 0.8,
          // Ultimate gets more detailed answers
          max_tokens: planType === 'ultimate' ? 2500 : 2000,
        }
      );

      answer = response.choices[0]?.message?.content || '';
      console.log('[Oracle API] AI response received from', response.model_used, 'length:', answer?.length);

      // Verify Ultimate users received premium model
      if (planType === 'ultimate' && response.model_used && !response.model_used.includes('claude')) {
        console.warn('[Oracle API] ⚠️ Ultimate user did not receive Claude model! Got:', response.model_used);
        // This is okay if Claude failed and fallback was used, but should be monitored
      }
    } catch (aiError) {
      console.error('[Oracle API] AI generation error:', aiError);
      throw new Error(`AI generation failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`);
    }

    if (!answer || answer.trim().length === 0) {
      console.error('[Oracle API] Empty response received from AI');
      throw new Error('AI generated empty response');
    }
    console.log('[Oracle API] Response validated successfully');

    // Generate new conversation_id if not provided (start of new conversation)
    const finalConversationId = conversation_id || crypto.randomUUID();

    // Save conversation to database
    const { error: conversationError } = await supabase
      .from('oracle_conversations')
      .insert({
        user_id: user.id,
        conversation_id: finalConversationId,
        question: question.trim(),
        answer: answer.trim(),
        message_type: 'user_question', // Will store both question and answer in one row for now
        asked_at: new Date().toISOString(),
      });

    if (conversationError) {
      console.error('Error saving conversation:', conversationError);
      // Don't fail the request if saving fails
    }

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
      question: question.trim(),
      answer: answer.trim(),
      conversation_id: finalConversationId,
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
