import Stripe from "stripe";

// Use placeholder for build time, but will check at runtime in API routes
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export function ensureStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
  }
}

// Price IDs - ще ги добавиш след като създадеш products в Stripe
export const STRIPE_PRICES = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_PRICE_ID || "",
  ULTIMATE_MONTHLY: process.env.STRIPE_ULTIMATE_PRICE_ID || "",
};

export const PLAN_LIMITS = {
  free: {
    dailyHoroscope: true,
    cardOfDay: true,
    tarotReadings: 0,
    oracleQuestions: 0,
  },
  basic: {
    dailyHoroscope: true,
    cardOfDay: true,
    tarotReadings: 3,
    oracleQuestions: 3,
  },
  ultimate: {
    dailyHoroscope: true,
    cardOfDay: true,
    tarotReadings: 999,
    oracleQuestions: 10,
  },
};
