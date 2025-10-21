/**
 * Stripe Revenue Analytics
 * Pull REAL data from Stripe API using server-side client
 */

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

/**
 * Map Stripe price IDs to plan types
 * These are the ACTUAL price IDs from your Stripe account
 */
const PRICE_ID_TO_PLAN: Record<string, 'basic' | 'ultimate'> = {
  'price_1SIFoDBAf9qNSiDWyp6je8Q6': 'basic',     // €5.00/month (500 cents)
  'price_1SIFpxBAf9qNSiDW6llWICdc': 'ultimate',  // €10.00/month (1000 cents)
  // OLD BGN prices (not actively used but kept for reference)
  'price_1SHqyUBAf9qNSiDWSJGENl44': 'basic',     // 9.99 BGN
  'price_1SHqzrBAf9qNSiDWZm1LDLfZ': 'ultimate',  // 19.99 BGN
};

export interface SubscriptionBreakdown {
  total: number;
  basic: number;
  ultimate: number;
  byPlan: {
    basic: {
      count: number;
      mrr: number; // in EUR
    };
    ultimate: {
      count: number;
      mrr: number; // in EUR
    };
  };
}

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue in EUR
  arr: number; // Annual Recurring Revenue in EUR
  totalActiveSubscriptions: number;
  subscriptionBreakdown: SubscriptionBreakdown;
  currency: 'eur';
}

/**
 * Get plan type from Stripe price ID
 */
function getPlanTypeFromPriceId(priceId: string): 'basic' | 'ultimate' | null {
  return PRICE_ID_TO_PLAN[priceId] || null;
}

/**
 * Get REAL subscription data from Stripe
 */
export async function getStripeRevenue(): Promise<RevenueMetrics> {
  try {
    // Fetch all active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100, // Adjust if you have more than 100 active subscriptions
    });

    let totalMRR = 0;
    let basicCount = 0;
    let ultimateCount = 0;
    let basicMRR = 0;
    let ultimateMRR = 0;

    // Process each subscription
    for (const sub of subscriptions.data) {
      // Get the price from the subscription items
      const priceId = sub.items.data[0]?.price?.id;
      if (!priceId) continue;

      const planType = getPlanTypeFromPriceId(priceId);
      if (!planType) {
        console.warn(`[Stripe Analytics] Unknown price ID: ${priceId}`);
        continue;
      }

      // Get the amount in cents and convert to EUR
      const amountCents = sub.items.data[0]?.price?.unit_amount || 0;
      const amountEUR = amountCents / 100;

      totalMRR += amountEUR;

      if (planType === 'basic') {
        basicCount++;
        basicMRR += amountEUR;
      } else if (planType === 'ultimate') {
        ultimateCount++;
        ultimateMRR += amountEUR;
      }
    }

    const arr = totalMRR * 12;

    return {
      mrr: Math.round(totalMRR * 100) / 100, // Round to 2 decimal places
      arr: Math.round(arr * 100) / 100,
      totalActiveSubscriptions: subscriptions.data.length,
      subscriptionBreakdown: {
        total: subscriptions.data.length,
        basic: basicCount,
        ultimate: ultimateCount,
        byPlan: {
          basic: {
            count: basicCount,
            mrr: Math.round(basicMRR * 100) / 100,
          },
          ultimate: {
            count: ultimateCount,
            mrr: Math.round(ultimateMRR * 100) / 100,
          },
        },
      },
      currency: 'eur',
    };
  } catch (error) {
    console.error('[Stripe Analytics] Error fetching revenue:', error);
    return {
      mrr: 0,
      arr: 0,
      totalActiveSubscriptions: 0,
      subscriptionBreakdown: {
        total: 0,
        basic: 0,
        ultimate: 0,
        byPlan: {
          basic: { count: 0, mrr: 0 },
          ultimate: { count: 0, mrr: 0 },
        },
      },
      currency: 'eur',
    };
  }
}

/**
 * Calculate churn rate (monthly)
 * Churn = (Canceled this month / Active at start of month) * 100
 */
export async function getChurnRate(): Promise<number> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get subscriptions canceled this month
    const canceledSubscriptions = await stripe.subscriptions.list({
      status: 'canceled',
      created: {
        gte: Math.floor(startOfMonth.getTime() / 1000),
        lt: Math.floor(endOfMonth.getTime() / 1000),
      },
      limit: 100,
    });

    // Get total active subscriptions
    const activeSubscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    });

    const totalActive = activeSubscriptions.data.length;
    const totalCanceled = canceledSubscriptions.data.length;

    if (totalActive === 0) return 0;

    const churnRate = (totalCanceled / (totalActive + totalCanceled)) * 100;
    return Math.round(churnRate * 100) / 100;
  } catch (error) {
    console.error('[Stripe Analytics] Error calculating churn:', error);
    return 0;
  }
}

/**
 * Get recent subscription events from database
 */
export async function getRecentSubscriptionEvents(limit: number = 10) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('subscription_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Stripe Analytics] Error fetching events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Stripe Analytics] Error:', error);
    return [];
  }
}

/**
 * Sync Stripe subscription to database analytics table
 */
export async function syncSubscriptionToAnalytics(
  subscription: Stripe.Subscription
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const priceId = subscription.items.data[0]?.price?.id;
    const planType = priceId ? getPlanTypeFromPriceId(priceId) : null;

    if (!planType) {
      console.warn('[Stripe Analytics] Unknown plan type for subscription:', subscription.id);
      return false;
    }

    const amountCents = subscription.items.data[0]?.price?.unit_amount || 0;
    const amountUSD = amountCents / 100; // Convert cents to EUR (stored as USD in DB)

    const { error } = await supabase
      .from('subscription_analytics')
      .upsert({
        subscription_id: subscription.id,
        user_id: subscription.metadata?.user_id || null,
        stripe_customer_id: subscription.customer as string,
        plan_type: planType,
        status: subscription.status,
        amount_usd: amountUSD,
        currency: subscription.currency,
        started_at: new Date(subscription.created * 1000).toISOString(),
        ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        metadata: subscription.metadata,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'subscription_id',
      });

    if (error) {
      console.error('[Stripe Analytics] Error syncing subscription:', error);
      return false;
    }

    console.log(`[Stripe Analytics] Synced subscription: ${subscription.id}`);
    return true;
  } catch (error) {
    console.error('[Stripe Analytics] Error:', error);
    return false;
  }
}
