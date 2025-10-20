/**
 * Centralized Subscription Plans Configuration
 * Single source of truth for all plan limits and features
 */

export type PlanType = 'free' | 'basic' | 'ultimate';

export interface PlanLimits {
  // Daily limits
  dailyOracleQuestions: number;
  dailyTarotReadings: number;

  // Feature access
  canAccessWeeklyHoroscope: boolean;
  canAccessMonthlyHoroscope: boolean;
  canAccessThreeCardSpread: boolean;
  canAccessLoveReading: boolean;
  canAccessCareerReading: boolean;
  canAccessNatalChart: boolean;
}

export interface PlanConfig {
  name: string;
  price: number; // in EUR
  currency: string;
  stripePriceId: string;
  limits: PlanLimits;
  features: string[]; // Human-readable features list
}

// Define limits for each plan
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
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
    dailyOracleQuestions: 3, // 3 questions per day
    dailyTarotReadings: 3, // 3 readings per day
    canAccessWeeklyHoroscope: true,
    canAccessMonthlyHoroscope: true,
    canAccessThreeCardSpread: true,
    canAccessLoveReading: false,
    canAccessCareerReading: false,
    canAccessNatalChart: false,
  },
  ultimate: {
    dailyOracleQuestions: 10, // 10 questions per day
    dailyTarotReadings: 999, // Unlimited tarot readings (practical limit)
    canAccessWeeklyHoroscope: true,
    canAccessMonthlyHoroscope: true,
    canAccessThreeCardSpread: true,
    canAccessLoveReading: true,
    canAccessCareerReading: true,
    canAccessNatalChart: true,
  },
};

// Full plan configurations with pricing
export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'EUR',
    stripePriceId: '',
    limits: PLAN_LIMITS.free,
    features: [
      'Дневен хороскоп',
      'Карта на деня (1 четене)',
      'Базова нумерология',
    ],
  },
  basic: {
    name: 'Basic',
    price: 4.99,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    limits: PLAN_LIMITS.basic,
    features: [
      'Всичко от Free',
      '3 таро четения/ден',
      '3 въпроса към Врачката/ден',
      'Седмичен хороскоп',
      'Месечен хороскоп',
      'Четене с 3 карти',
    ],
  },
  ultimate: {
    name: 'Ultimate',
    price: 9.99,
    currency: 'EUR',
    stripePriceId: process.env.STRIPE_ULTIMATE_PRICE_ID || '',
    limits: PLAN_LIMITS.ultimate,
    features: [
      'Всичко от Basic',
      'Неограничени таро четения',
      '10 въпроса към Врачката/ден',
      'Любовно четене (5 карти)',
      'Кариерно четене (5 карти)',
      'Натална карта (скоро)',
      'Приоритетна поддръжка',
    ],
  },
};

/**
 * Get plan limits for a specific plan type
 */
export function getPlanLimits(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType];
}

/**
 * Get full plan configuration
 */
export function getPlanConfig(planType: PlanType): PlanConfig {
  return PLAN_CONFIGS[planType];
}

/**
 * Check if a plan has access to a specific feature
 */
export function hasPlanAccess(
  planType: PlanType,
  feature: keyof Omit<PlanLimits, 'dailyOracleQuestions' | 'dailyTarotReadings'>
): boolean {
  return PLAN_LIMITS[planType][feature];
}

/**
 * Get Stripe price ID for a plan
 */
export function getStripePriceId(planType: PlanType): string {
  return PLAN_CONFIGS[planType].stripePriceId;
}

/**
 * Validate Stripe price IDs are configured
 */
export function validateStripePriceIds(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!PLAN_CONFIGS.basic.stripePriceId) {
    missing.push('STRIPE_BASIC_PRICE_ID');
  }

  if (!PLAN_CONFIGS.ultimate.stripePriceId) {
    missing.push('STRIPE_ULTIMATE_PRICE_ID');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Export types for use in other files
export type { PlanLimits as SubscriptionLimits };
