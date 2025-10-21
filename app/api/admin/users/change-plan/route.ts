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
    const { userId, newPlan } = await request.json();

    if (!userId || !newPlan) {
      return NextResponse.json(
        { error: "Missing userId or newPlan" },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans = ["free", "basic", "ultimate"];
    if (!validPlans.includes(newPlan)) {
      return NextResponse.json(
        { error: "Invalid plan type. Must be: free, basic, or ultimate" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update or create subscription
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
          plan_type: newPlan,
          status: "active",
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
          plan_type: newPlan,
          status: "active",
        });

      if (insertError) throw insertError;
    }

    // Log the action (optional - for audit trail)
    console.log(
      `[ADMIN ACTION] ${user.email} changed ${targetUser.full_name}'s plan to ${newPlan}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully changed plan to ${newPlan}`,
      data: {
        userId,
        newPlan,
        updatedBy: user.email,
      },
    });
  } catch (error) {
    console.error("Error changing user plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
