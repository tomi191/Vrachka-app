import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    // Get request body
    const { userId, planType, durationDays } = await request.json();

    if (!userId || !planType) {
      return NextResponse.json(
        { error: "Missing userId or planType" },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans = ["basic", "ultimate"];
    if (!validPlans.includes(planType)) {
      return NextResponse.json(
        { error: "Invalid plan type. Must be: basic or ultimate" },
        { status: 400 }
      );
    }

    const days = durationDays || 30; // Default 30 days

    // Check if user exists
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate period dates
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Check if subscription exists
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          plan_type: planType,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          stripe_customer_id: null, // Mark as manual (no Stripe)
          stripe_subscription_id: null,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_type: planType,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          cancel_at_period_end: false,
        });

      if (insertError) throw insertError;
    }

    // Log the action
    console.log(
      `[ADMIN ACTION] ${user.email} granted ${planType} plan to ${targetUser.full_name} for ${days} days (manual)`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully granted ${planType} plan for ${days} days`,
      data: {
        userId,
        planType,
        durationDays: days,
        periodEnd: endDate.toISOString(),
        grantedBy: user.email,
      },
    });
  } catch (error) {
    console.error("Error creating manual subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
