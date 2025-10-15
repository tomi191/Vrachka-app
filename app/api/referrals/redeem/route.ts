import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateReferralCode, redeemReferralCode } from "@/lib/referrals";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/referrals/redeem
 * Redeem a referral code for the current user
 */
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // Validate referral code
    const validation = await validateReferralCode(supabase, code);

    if (!validation.valid || !validation.referrer_user_id) {
      return NextResponse.json(
        { error: validation.error || "Invalid referral code" },
        { status: 400 }
      );
    }

    // Redeem the code
    const redemption = await redeemReferralCode(
      supabase,
      validation.referrer_user_id,
      user.id
    );

    if (!redemption.success) {
      return NextResponse.json(
        { error: redemption.error || "Failed to redeem code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral code redeemed successfully!",
    });
  } catch (error) {
    console.error("Referral redemption error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
