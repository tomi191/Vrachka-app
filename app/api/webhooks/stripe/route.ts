import { NextRequest, NextResponse } from "next/server";
import { stripe, ensureStripeConfigured } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Lazy initialize Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  ensureStripeConfigured();
  const supabase = getSupabaseAdmin();

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(supabase, session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Error handling webhook: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  const planType = session.metadata?.plan_type;

  if (!userId || !planType) {
    throw new Error("Missing metadata in checkout session");
  }

  // Get the subscription from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Update subscription in database
  await supabase
    .from("subscriptions")
    .update({
      stripe_subscription_id: stripeSubscription.id,
      stripe_customer_id: session.customer as string,
      plan_type: planType,
      status: "active",
      current_period_start: new Date(
        stripeSubscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        stripeSubscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq("user_id", userId);

  console.log(`Subscription activated for user ${userId}`);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Determine plan type from price ID
  let planType = "free";
  const priceId = subscription.items.data[0].price.id;

  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
    planType = "basic";
  } else if (priceId === process.env.STRIPE_ULTIMATE_PRICE_ID) {
    planType = "ultimate";
  }

  // Update subscription
  await supabase
    .from("subscriptions")
    .update({
      plan_type: planType,
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq("user_id", existingSubscription.user_id);

  console.log(`Subscription updated for customer ${customerId}`);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Downgrade to free plan
  await supabase
    .from("subscriptions")
    .update({
      plan_type: "free",
      status: "canceled",
      stripe_subscription_id: null,
    })
    .eq("user_id", existingSubscription.user_id);

  console.log(`Subscription canceled for customer ${customerId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // Optionally send confirmation email or update payment records
}

async function handleInvoicePaymentFailed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (existingSubscription) {
    // Update status to past_due
    await supabase
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("user_id", existingSubscription.user_id);

    console.log(`Payment failed for customer ${customerId}`);
  }
}
