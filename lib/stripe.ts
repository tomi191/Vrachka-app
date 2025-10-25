import Stripe from "stripe";
import { PLAN_CONFIGS, validateStripePriceIds, type PlanType } from "@/lib/config/plans";

// Use placeholder for build time, but will check at runtime in API routes
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build";

export const stripe = new Stripe(stripeKey, {
  // Use latest stable API version
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Ensure Stripe is configured properly
 */
export function ensureStripeConfigured(): void {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
  }

  // Validate price IDs are configured
  const { valid, missing } = validateStripePriceIds();
  if (!valid) {
    console.warn(`Warning: Missing Stripe price IDs: ${missing.join(', ')}`);
  }
}

/**
 * Get Stripe price IDs (deprecated - use PLAN_CONFIGS from plans.ts instead)
 * @deprecated Use `import { PLAN_CONFIGS } from "@/lib/config/plans"` instead
 */
export const STRIPE_PRICES = {
  BASIC_MONTHLY: PLAN_CONFIGS.basic.stripePriceIds.bgn,
  ULTIMATE_MONTHLY: PLAN_CONFIGS.ultimate.stripePriceIds.bgn,
};

/**
 * Get Stripe price ID for a plan type (defaults to BGN currency)
 */
export function getStripePriceIdForPlan(planType: Exclude<PlanType, 'free'>, currency: 'bgn' | 'eur' = 'bgn'): string {
  return PLAN_CONFIGS[planType].stripePriceIds[currency];
}
