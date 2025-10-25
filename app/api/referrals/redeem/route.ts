import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateReferralCode, redeemReferralCode } from "@/lib/referrals";
import { sendReferralRedeemedEmail } from "@/lib/email/send";

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

    // Send referral redeemed confirmation email to the referred user
    try {
      const { data: referredUserProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data: referrerProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", validation.referrer_user_id)
        .single();

      if (user.email) {
        await sendReferralRedeemedEmail(user.email, {
          firstName: referredUserProfile?.full_name?.split(' ')[0] || '',
          referrerName: referrerProfile?.full_name || 'Приятел',
          rewardAmount: 3,
        });
        console.log(`Referral redeemed email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error('Error sending referral redeemed email:', emailError);
      // Don't fail the redemption if email fails
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
