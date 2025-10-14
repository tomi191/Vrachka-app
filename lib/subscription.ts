/**
 * Subscription utilities and access control
 */

import { createClient } from "@/lib/supabase/server";

export type PlanType = 'free' | 'basic' | 'ultimate';

export interface SubscriptionLimits {
  dailyOracleQuestions: number;
  dailyTarotReadings: number;
  canAccessWeeklyHoroscope: boolean;
  canAccessMonthlyHoroscope: boolean;
  canAccessThreeCardSpread: boolean;
  canAccessLoveReading: boolean;
  canAccessCareerReading: boolean;
  canAccessNatalChart: boolean;
}

// Define limits for each plan
export const PLAN_LIMITS: Record<PlanType, SubscriptionLimits> = {
  free: {
    dailyOracleQuestions: 0, // Oracle is premium only
    dailyTarotReadings: 1, // Card of the day only
    canAccessWeeklyHoroscope: false,
    canAccessMonthlyHoroscope: false,
    canAccessThreeCardSpread: false,
    canAccessLoveReading: false,
    canAccessCareerReading: false,
    canAccessNatalChart: false,
  },
  basic: {
    dailyOracleQuestions: 3,
    dailyTarotReadings: 5,
    canAccessWeeklyHoroscope: true,
    canAccessMonthlyHoroscope: true,
    canAccessThreeCardSpread: true,
    canAccessLoveReading: false,
    canAccessCareerReading: false,
    canAccessNatalChart: false,
  },
  ultimate: {
    dailyOracleQuestions: 10,
    dailyTarotReadings: 20,
    canAccessWeeklyHoroscope: true,
    canAccessMonthlyHoroscope: true,
    canAccessThreeCardSpread: true,
    canAccessLoveReading: true,
    canAccessCareerReading: true,
    canAccessNatalChart: true,
  },
};

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !subscription) {
    return { plan_type: 'free' as PlanType, status: 'active' };
  }

  return subscription;
}

/**
 * Get subscription limits for a user
 */
export async function getUserLimits(userId: string): Promise<SubscriptionLimits> {
  const subscription = await getUserSubscription(userId);
  return PLAN_LIMITS[subscription.plan_type as PlanType];
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(
  userId: string,
  feature: keyof Omit<SubscriptionLimits, 'dailyOracleQuestions' | 'dailyTarotReadings'>
): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits[feature];
}

/**
 * Get and update API usage for today
 */
export async function getApiUsage(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: usage, error } = await supabase
    .from('api_usage_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error || !usage) {
    // Create new usage record for today
    const { data: newUsage } = await supabase
      .from('api_usage_limits')
      .insert({
        user_id: userId,
        date: today,
        oracle_questions_count: 0,
        tarot_readings_count: 0,
      })
      .select()
      .single();

    return newUsage || { oracle_questions_count: 0, tarot_readings_count: 0 };
  }

  return usage;
}

/**
 * Check if user can make an Oracle question
 */
export async function canAskOracle(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limits = await getUserLimits(userId);
  const usage = await getApiUsage(userId);

  const limit = limits.dailyOracleQuestions;
  const used = usage.oracle_questions_count || 0;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * Check if user can make a Tarot reading
 */
export async function canReadTarot(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limits = await getUserLimits(userId);
  const usage = await getApiUsage(userId);

  const limit = limits.dailyTarotReadings;
  const used = usage.tarot_readings_count || 0;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * Increment Oracle usage
 */
export async function incrementOracleUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Ensure usage record exists
  await getApiUsage(userId);

  // Increment
  await supabase.rpc('increment_oracle_usage', {
    p_user_id: userId,
    p_date: today,
  });

  // Fallback if RPC doesn't exist - direct update
  const { data: current } = await supabase
    .from('api_usage_limits')
    .select('oracle_questions_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  await supabase
    .from('api_usage_limits')
    .update({
      oracle_questions_count: (current?.oracle_questions_count || 0) + 1
    })
    .eq('user_id', userId)
    .eq('date', today);
}

/**
 * Increment Tarot usage
 */
export async function incrementTarotUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Ensure usage record exists
  await getApiUsage(userId);

  // Direct update
  const { data: current } = await supabase
    .from('api_usage_limits')
    .select('tarot_readings_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  await supabase
    .from('api_usage_limits')
    .update({
      tarot_readings_count: (current?.tarot_readings_count || 0) + 1
    })
    .eq('user_id', userId)
    .eq('date', today);
}

/**
 * Check if user is premium (basic or ultimate)
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription.plan_type !== 'free' && subscription.status === 'active';
}
