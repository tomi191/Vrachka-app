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
    const { userId, isAdmin } = await request.json();

    if (!userId || typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Missing userId or isAdmin (boolean)" },
        { status: 400 }
      );
    }

    // Prevent admin from removing their own admin status
    if (userId === user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Cannot remove your own admin privileges" },
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

    // Update admin status
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_admin: isAdmin,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Log the action
    console.log(
      `[ADMIN ACTION] ${user.email} ${isAdmin ? "granted" : "removed"} admin access for ${targetUser.full_name}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ${isAdmin ? "granted" : "removed"} admin access`,
      data: {
        userId,
        isAdmin,
        updatedBy: user.email,
      },
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
