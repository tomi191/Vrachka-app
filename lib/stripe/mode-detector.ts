/**
 * Stripe Mode Detector
 * Detect whether we're in TEST or LIVE mode based on API key
 */

export type StripeMode = 'test' | 'live';

/**
 * Detect Stripe mode from API key
 *
 * Stripe API keys format:
 * - Test mode: sk_test_...
 * - Live mode: sk_live_...
 *
 * @returns 'test' or 'live'
 */
export function getStripeMode(): StripeMode {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    console.warn('[Stripe Mode] No API key found, defaulting to test mode');
    return 'test';
  }

  if (apiKey.startsWith('sk_live_')) {
    return 'live';
  }

  if (apiKey.startsWith('sk_test_')) {
    return 'test';
  }

  console.warn('[Stripe Mode] Unknown API key format, defaulting to test mode');
  return 'test';
}

/**
 * Check if currently in test mode
 */
export function isTestMode(): boolean {
  return getStripeMode() === 'test';
}

/**
 * Check if currently in live mode
 */
export function isLiveMode(): boolean {
  return getStripeMode() === 'live';
}

/**
 * Get mode display name
 */
export function getModeName(): string {
  return getStripeMode().toUpperCase();
}

/**
 * Get mode emoji/badge
 */
export function getModeEmoji(): string {
  return isTestMode() ? '🧪' : '✅';
}

/**
 * Get mode color class (Tailwind)
 */
export function getModeColorClass(): string {
  return isTestMode()
    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    : 'bg-green-500/20 text-green-300 border-green-500/30';
}
