/**
 * AI Cost Tracking System
 * Logs all AI API usage and calculates costs for financial monitoring
 *
 * HYBRID AI STRATEGY:
 * - FREE tier: Gemini 2.0 Flash ($0) - 90% cost reduction!
 * - PREMIUM tier: Claude 3.5 Sonnet ($3-15/1M tokens)
 * - FALLBACK: DeepSeek ($0.14-0.28/1M tokens)
 */

import { createClient } from "@/lib/supabase/server";

/**
 * OpenRouter Pricing (Updated 2025-10-25)
 * https://openrouter.ai/docs/models
 *
 * Current Models in Use:
 * - Gemini 2.0 Flash: FREE (horoscopes, tarot, basic oracle)
 * - Claude 3.5 Sonnet: $3 input, $15 output per 1M tokens (premium oracle, natal chart)
 * - DeepSeek Chat: $0.14 input, $0.28 output per 1M tokens (fallback)
 * - GPT-4: $30 input, $60 output per 1M tokens (emergency fallback)
 */

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "openai/gpt-5-mini": {
    input: 0.25 / 1_000_000,  // $0.25 per 1M tokens
    output: 2.00 / 1_000_000, // $2.00 per 1M tokens
  },
  "openai/gpt-4.1-mini": {
    input: 0.15 / 1_000_000,  // $0.15 per 1M tokens
    output: 0.60 / 1_000_000, // $0.60 per 1M tokens
  },
  "openai/gpt-4": {
    input: 30.0 / 1_000_000,  // $30 per 1M tokens
    output: 60.0 / 1_000_000, // $60 per 1M tokens
  },
  "openai/gpt-4-1106-preview": {
    input: 10.0 / 1_000_000,  // $10 per 1M tokens
    output: 30.0 / 1_000_000, // $30 per 1M tokens
  },

  // FREE MODELS (100% cost optimization!)
  "google/gemini-2.0-flash-exp:free": {
    input: 0,   // FREE
    output: 0,  // FREE
  },
  "google/gemini-flash-1.5": {
    input: 0,   // FREE (fallback name)
    output: 0,  // FREE
  },

  // CLAUDE MODELS (Premium quality)
  "anthropic/claude-3.5-sonnet": {
    input: 3.0 / 1_000_000,   // $3 per 1M tokens
    output: 15.0 / 1_000_000, // $15 per 1M tokens
  },
  "anthropic/claude-3-sonnet": {
    input: 3.0 / 1_000_000,   // $3 per 1M tokens
    output: 15.0 / 1_000_000, // $15 per 1M tokens
  },

  // DEEPSEEK (Budget alternative)
  "deepseek/deepseek-chat": {
    input: 0.14 / 1_000_000,  // $0.14 per 1M tokens
    output: 0.28 / 1_000_000, // $0.28 per 1M tokens
  },
};

export interface AIUsageLog {
  userId?: string;
  feature: 'tarot' | 'oracle' | 'horoscope' | 'daily_content';
  model: string;
  promptTokens: number;
  completionTokens: number;
  metadata?: Record<string, any>;
}

/**
 * Calculate cost for AI usage
 */
export function calculateAICost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    console.warn(`[AI Cost] Unknown model pricing: ${model}, using default`);
    // Fallback to GPT-4.1-mini pricing
    const fallback = MODEL_PRICING["openai/gpt-4.1-mini"];
    return (promptTokens * fallback.input) + (completionTokens * fallback.output);
  }

  const inputCost = promptTokens * pricing.input;
  const outputCost = completionTokens * pricing.output;
  return inputCost + outputCost;
}

/**
 * Log AI usage to database for cost tracking
 *
 * @example
 * await logAIUsage({
 *   userId: user.id,
 *   feature: 'tarot',
 *   model: 'openai/gpt-4.1-mini',
 *   promptTokens: 150,
 *   completionTokens: 500,
 *   metadata: { reading_type: '3-card', zodiac_sign: 'aries' }
 * });
 */
export async function logAIUsage(usage: AIUsageLog): Promise<boolean> {
  try {
    const totalTokens = usage.promptTokens + usage.completionTokens;
    const estimatedCost = calculateAICost(
      usage.model,
      usage.promptTokens,
      usage.completionTokens
    );

    const supabase = await createClient();

    const { error } = await supabase
      .from('ai_usage_logs')
      .insert({
        user_id: usage.userId || null,
        feature: usage.feature,
        model: usage.model,
        prompt_tokens: usage.promptTokens,
        completion_tokens: usage.completionTokens,
        total_tokens: totalTokens,
        estimated_cost_usd: estimatedCost,
        metadata: usage.metadata || null,
      });

    if (error) {
      console.error('[AI Cost Tracker] Failed to log usage:', error);
      return false;
    }

    console.log(
      `[AI Cost Tracker] Logged: ${usage.feature} | ` +
      `${totalTokens} tokens | $${estimatedCost.toFixed(6)}`
    );

    return true;
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return false;
  }
}

/**
 * Get total AI costs for a date range
 */
export async function getAICosts(
  startDate: Date,
  endDate: Date
): Promise<number> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('estimated_cost_usd')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      console.error('[AI Cost Tracker] Failed to get costs:', error);
      return 0;
    }

    return data.reduce((sum, log) => sum + Number(log.estimated_cost_usd), 0);
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return 0;
  }
}

/**
 * Get AI costs breakdown by feature
 */
export async function getAICostsByFeature(
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('feature, estimated_cost_usd')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      console.error('[AI Cost Tracker] Failed to get costs by feature:', error);
      return {};
    }

    return data.reduce((acc, log) => {
      acc[log.feature] = (acc[log.feature] || 0) + Number(log.estimated_cost_usd);
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return {};
  }
}

/**
 * Get today's AI costs
 */
export async function getTodayAICosts(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getAICosts(today, tomorrow);
}

/**
 * Get this month's AI costs
 */
export async function getMonthAICosts(): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return getAICosts(startOfMonth, endOfMonth);
}

/**
 * Get AI costs breakdown by model
 */
export async function getAICostsByModel(
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('model, estimated_cost_usd')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      console.error('[AI Cost Tracker] Failed to get costs by model:', error);
      return {};
    }

    return data.reduce((acc, log) => {
      acc[log.model] = (acc[log.model] || 0) + Number(log.estimated_cost_usd);
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return {};
  }
}

/**
 * Get top users by AI costs
 */
export async function getTopUsersByAICosts(
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<Array<{ userId: string | null; totalCost: number; callCount: number }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('user_id, estimated_cost_usd')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) {
      console.error('[AI Cost Tracker] Failed to get top users:', error);
      return [];
    }

    const userCosts = data.reduce((acc, log) => {
      const userId = log.user_id || 'system';
      if (!acc[userId]) {
        acc[userId] = { totalCost: 0, callCount: 0 };
      }
      acc[userId].totalCost += Number(log.estimated_cost_usd);
      acc[userId].callCount += 1;
      return acc;
    }, {} as Record<string, { totalCost: number; callCount: number }>);

    return Object.entries(userCosts)
      .map(([userId, stats]) => ({
        userId: userId === 'system' ? null : userId,
        totalCost: stats.totalCost,
        callCount: stats.callCount,
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, limit);
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return [];
  }
}

/**
 * Get AI costs timeline (daily breakdown)
 */
export async function getAICostsTimeline(
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; cost: number; calls: number }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('created_at, estimated_cost_usd')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[AI Cost Tracker] Failed to get timeline:', error);
      return [];
    }

    // Group by date
    const dailyData = data.reduce((acc, log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { cost: 0, calls: 0 };
      }
      acc[date].cost += Number(log.estimated_cost_usd);
      acc[date].calls += 1;
      return acc;
    }, {} as Record<string, { cost: number; calls: number }>);

    return Object.entries(dailyData)
      .map(([date, stats]) => ({
        date,
        cost: stats.cost,
        calls: stats.calls,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('[AI Cost Tracker] Error:', error);
    return [];
  }
}
