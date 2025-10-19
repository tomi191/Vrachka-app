import { NextRequest, NextResponse } from "next/server";
import { stripe, ensureStripeConfigured } from "@/lib/stripe";
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Stripe customer ID
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, plan_type")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription) {
      console.error("Subscription query error:", subError);
      return NextResponse.json(
        { error: "Нямате активен абонамент" },
        { status: 404 }
      );
    }

    if (!subscription.stripe_customer_id) {
      console.error("Missing Stripe customer ID for user:", user.id);
      return NextResponse.json(
        { error: "Абонаментът не е свързан със Stripe. Моля, свържете се с поддръжката." },
        { status: 404 }
      );
    }

    // Get base URL for return redirect
    const baseUrl = getBaseUrl(req);

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${baseUrl}/profile`,
    });

    console.log("Created billing portal session for customer:", subscription.stripe_customer_id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Customer portal error:", error);

    // Check if it's a Stripe configuration error
    const errorMessage = error instanceof Error ? error.message : "Неуспешно създаване на портала";

    if (errorMessage.includes("No configuration provided") || errorMessage.includes("test mode default is disabled")) {
      return NextResponse.json({
        error: "Customer Portal не е конфигуриран в Stripe. Моля, активирайте го в Stripe Dashboard → Settings → Customer Portal.",
        userMessage: "Портала за управление на абонамента временно не е наличен. Моля, свържете се с поддръжката.",
      }, { status: 503 });
    }

    return NextResponse.json({
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
