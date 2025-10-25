import { NextRequest, NextResponse } from "next/server";
import { stripe, ensureStripeConfigured } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail, sendSubscriptionCancelledEmail } from "@/lib/email/send";
import { grantReferrerReward } from "@/lib/referrals";
import { syncSubscriptionToAnalytics } from "@/lib/stripe/analytics";

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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Log the event to database for auditing
  try {
    await supabase
      .from('stripe_webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.type,
        data: event.data.object as any,
        processed: false,
      });
  } catch (logError) {
    console.error('Failed to log webhook event:', logError);
    // Continue processing even if logging fails
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
        // Sync to analytics table
        await syncSubscriptionToAnalytics(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        // Sync to analytics table
        await syncSubscriptionToAnalytics(subscription);
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error handling webhook: ${message}`);
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
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

  // Sync subscription to analytics table
  await syncSubscriptionToAnalytics(stripeSubscription);

  // Send payment confirmation email
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    const { data: user } = await supabase.auth.admin.getUserById(userId);

    if (user?.user?.email) {
      const planName = planType === 'basic' ? 'Basic' : 'Ultimate';
      const amount = planType === 'basic' ? '9.99' : '19.99';
      const nextBillingDate = new Date(stripeSubscription.current_period_end * 1000).toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      await sendPaymentConfirmationEmail(user.user.email, {
        firstName: profile?.full_name?.split(' ')[0] || '',
        plan: planName as 'Basic' | 'Ultimate',
        amount,
        nextBillingDate,
      });

      console.log(`Payment confirmation email sent to ${user.user.email}`);
    }
  } catch (emailError) {
    console.error('Error sending payment confirmation email:', emailError);
    // Don't fail the webhook if email fails
  }

  // Grant referral reward if this user was referred
  try {
    const rewardResult = await grantReferrerReward(supabase, userId);
    if (rewardResult.success) {
      console.log(`Referral reward granted for user ${userId}`);
    }
  } catch (referralError) {
    console.error('Error granting referral reward:', referralError);
    // Don't fail the webhook if referral reward fails
  }
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

  // Determine plan type from price ID (supports both BGN and EUR)
  let planType = "free";
  const priceId = subscription.items.data[0].price.id;

  const basicPriceIds = [
    process.env.STRIPE_BASIC_PRICE_ID_BGN,
    process.env.STRIPE_BASIC_PRICE_ID_EUR,
    process.env.STRIPE_BASIC_PRICE_ID, // Legacy
  ];

  const ultimatePriceIds = [
    process.env.STRIPE_ULTIMATE_PRICE_ID_BGN,
    process.env.STRIPE_ULTIMATE_PRICE_ID_EUR,
    process.env.STRIPE_ULTIMATE_PRICE_ID, // Legacy
  ];

  if (basicPriceIds.includes(priceId)) {
    planType = "basic";
  } else if (ultimatePriceIds.includes(priceId)) {
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
    .select("user_id, plan_type")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existingSubscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  const previousPlan = existingSubscription.plan_type;

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

  // Send subscription cancelled email
  try {
    const { data: user } = await supabase.auth.admin.getUserById(existingSubscription.user_id);
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", existingSubscription.user_id)
      .single();

    if (user?.user?.email) {
      const planName = previousPlan === 'basic' ? 'Basic' : 'Ultimate';
      const cancelDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      await sendSubscriptionCancelledEmail(user.user.email, {
        firstName: profile?.full_name?.split(' ')[0] || '',
        planType: planName,
        endDate: cancelDate,
      });

      console.log(`Subscription cancelled email sent to ${user.user.email}`);
    }
  } catch (emailError) {
    console.error('Error sending subscription cancelled email:', emailError);
    // Don't fail the webhook if email fails
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // This handles recurring payments (renewal)
  // First payment is handled in checkout.session.completed
}

async function handleInvoicePaymentFailed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("user_id, plan_type")
    .eq("stripe_customer_id", customerId)
    .single();

  if (existingSubscription) {
    // Update status to past_due
    await supabase
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("user_id", existingSubscription.user_id);

    console.log(`Payment failed for customer ${customerId}`);

    // Send payment failed email
    try {
      const { data: user } = await supabase.auth.admin.getUserById(existingSubscription.user_id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", existingSubscription.user_id)
        .single();

      if (user?.user?.email) {
        const planName = existingSubscription.plan_type === 'basic' ? 'Basic' : 'Ultimate';
        const amount = existingSubscription.plan_type === 'basic' ? '9.99 BGN' : '19.99 BGN';

        // Calculate retry date (typically 3-7 days after first failure)
        const retryDate = new Date();
        retryDate.setDate(retryDate.getDate() + 3);
        const retryDateFormatted = retryDate.toLocaleDateString('bg-BG', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        await sendPaymentFailedEmail(user.user.email, {
          firstName: profile?.full_name?.split(' ')[0] || '',
          planType: planName,
          nextRetry: retryDateFormatted,
        });

        console.log(`Payment failed email sent to ${user.user.email}`);
      }
    } catch (emailError) {
      console.error('Error sending payment failed email:', emailError);
      // Don't fail the webhook if email fails
    }
  }
}
