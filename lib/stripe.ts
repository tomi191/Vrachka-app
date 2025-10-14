import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

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
