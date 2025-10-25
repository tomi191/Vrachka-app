import { NextRequest, NextResponse } from "next/server";
import { stripe, ensureStripeConfigured } from "@/lib/stripe";
import { getStripePriceIdForPlan } from "@/lib/stripe";
import type { PlanType } from "@/lib/config/plans";
import { createClient } from "@/lib/supabase/server";

// Get base URL with fallback
function getBaseUrl(req: NextRequest): string {
  // Try NEXT_PUBLIC_APP_URL first
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Try NEXT_PUBLIC_URL
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // Fallback to request origin
  const origin = req.headers.get('origin') || req.headers.get('referer');
  if (origin) {
    return origin.replace(/\/$/, ''); // Remove trailing slash
  }

  // Last resort - construct from host header
  const host = req.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    ensureStripeConfigured();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const plan = (formData.get("priceId") as string) as Exclude<PlanType, 'free'>; // 'basic' | 'ultimate'
    const currency = ((formData.get("currency") as string) || 'bgn') as 'bgn' | 'eur';

    // Validate currency
    if (currency !== 'bgn' && currency !== 'eur') {
      return NextResponse.json(
        { error: "Invalid currency" },
        { status: 400 }
      );
    }

    if (plan !== 'basic' && plan !== 'ultimate') {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
        name: profile?.full_name,
      });

      customerId = customer.id;

      // Update subscription with Stripe customer ID
      await supabase
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    // Get Stripe price ID from centralized plan config
    const stripePriceId = getStripePriceIdForPlan(plan, currency);

    if (!stripePriceId) {
      return NextResponse.json(
        { error: "Invalid plan or currency" },
        { status: 400 }
      );
    }

    // Get base URL for redirects
    const baseUrl = getBaseUrl(req);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        user_id: user.id,
        plan_type: plan,
        currency,
      },
    });

    // Return JSON with checkout URL instead of server-side redirect
    // Client-side will handle the redirect to Stripe Checkout
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
