/**
 * AI Cost Tracking System
 * Logs all AI API usage and calculates costs for financial monitoring
 */

import { createClient } from "@/lib/supabase/server";

/**
 * OpenRouter Pricing (as of 2025)
 * https://openrouter.ai/models/openai/gpt-4-mini
 *
 * GPT-4.1-mini (openai/gpt-4.1-mini):
 * - Input:  $0.15 per 1M tokens
 * - Output: $0.60 per 1M tokens
 */

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "openai/gpt-4.1-mini": {
    input: 0.15 / 1_000_000,  // $0.15 per 1M tokens
    output: 0.60 / 1_000_000, // $0.60 per 1M tokens
  },
  "openai/gpt-4": {
    input: 30.0 / 1_000_000,  // $30 per 1M tokens
    output: 60.0 / 1_000_000, // $60 per 1M tokens
  },
  // Add more models as needed
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
