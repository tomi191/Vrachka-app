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
    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*, profiles(full_name)")
      .eq("user_id", userId)
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found for this user" },
        { status: 404 }
      );
    }

    // Update subscription to canceled
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        plan_type: "free",
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Log the action
    console.log(
      `[ADMIN ACTION] ${user.email} canceled subscription for ${subscription.profiles?.full_name}. Reason: ${reason || "N/A"}`
    );

    return NextResponse.json({
      success: true,
      message: "Successfully canceled subscription",
      data: {
        userId,
        reason: reason || null,
        canceledBy: user.email,
        previousPlan: subscription.plan_type,
      },
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
