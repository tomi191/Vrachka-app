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

export interface PlanPrice {
  bgn: number;
  eur: number;
}

export interface PlanConfig {
  name: string;
  price: PlanPrice;
  stripePriceIds: {
    bgn: string;
    eur: string;
  };
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
    price: {
      bgn: 0,
      eur: 0,
    },
    stripePriceIds: {
      bgn: '',
      eur: '',
    },
    limits: PLAN_LIMITS.free,
    features: [
      'Безплатна регистрация',
      'Карта на деня (1 дневно)',
      'Ограничени публични хороскопи',
    ],
  },
  basic: {
    name: 'Basic',
    price: {
      bgn: 9.99,
      eur: 4.99,
    },
    stripePriceIds: {
      bgn: process.env.STRIPE_BASIC_PRICE_ID_BGN || process.env.STRIPE_BASIC_PRICE_ID || '',
      eur: process.env.STRIPE_BASIC_PRICE_ID_EUR || process.env.STRIPE_BASIC_PRICE_ID || '',
    },
    limits: PLAN_LIMITS.basic,
    features: [
      'Всичко от Free',
      '3 AI въпроса/ден (Оракул)',
      '3 таро четения/ден',
      'Седмични хороскопи',
      'Месечни хороскопи',
      'История до 3 дни',
    ],
  },
  ultimate: {
    name: 'Ultimate',
    price: {
      bgn: 19.99,
      eur: 9.99,
    },
    stripePriceIds: {
      bgn: process.env.STRIPE_ULTIMATE_PRICE_ID_BGN || process.env.STRIPE_ULTIMATE_PRICE_ID || '',
      eur: process.env.STRIPE_ULTIMATE_PRICE_ID_EUR || process.env.STRIPE_ULTIMATE_PRICE_ID || '',
    },
    limits: PLAN_LIMITS.ultimate,
    features: [
      'Всичко от Basic',
      'Неограничени таро четения',
      '10 AI въпроса/ден (Оракул)',
      'Любовни разтвори (5/ден)',
      'Кариерни разтвори (5/ден)',
      'Натална карта (включена)',
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
 * Get Stripe price ID for a plan and currency
 */
export function getStripePriceId(planType: PlanType, currency: 'bgn' | 'eur' = 'bgn'): string {
  return PLAN_CONFIGS[planType].stripePriceIds[currency];
}

/**
 * Get formatted price for a plan in a specific currency
 */
export function getFormattedPrice(planType: PlanType, currency: 'bgn' | 'eur' = 'bgn'): string {
  const price = PLAN_CONFIGS[planType].price[currency];
  const symbol = currency === 'bgn' ? 'лв' : '€';
  return `${price.toFixed(2)} ${symbol}`;
}

/**
 * Validate Stripe price IDs are configured for both currencies
 */
export function validateStripePriceIds(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!PLAN_CONFIGS.basic.stripePriceIds.bgn) {
    missing.push('STRIPE_BASIC_PRICE_ID_BGN');
  }

  if (!PLAN_CONFIGS.basic.stripePriceIds.eur) {
    missing.push('STRIPE_BASIC_PRICE_ID_EUR');
  }

  if (!PLAN_CONFIGS.ultimate.stripePriceIds.bgn) {
    missing.push('STRIPE_ULTIMATE_PRICE_ID_BGN');
  }

  if (!PLAN_CONFIGS.ultimate.stripePriceIds.eur) {
    missing.push('STRIPE_ULTIMATE_PRICE_ID_EUR');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Export types for use in other files
export type { PlanLimits as SubscriptionLimits };
