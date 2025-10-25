import { SupabaseClient } from "@supabase/supabase-js";
import { sendReferralRewardEmail } from "@/lib/email/send";

/**
 * Generate a unique referral code from email
 */
export function generateReferralCode(email: string): string {
  const username = email.split("@")[0].toUpperCase();
  const randomNum = Math.floor(Math.random() * 10000);
  return `${username}${randomNum}`;
}

/**
 * Validate if a referral code exists and is valid
 */
export async function validateReferralCode(
  supabase: SupabaseClient,
  code: string
): Promise<{ valid: boolean; referrer_user_id?: string; error?: string }> {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Referral code is required" };
  }

  const { data: referralCode, error } = await supabase
    .from("referral_codes")
    .select("referrer_user_id")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (error || !referralCode) {
    return { valid: false, error: "Invalid referral code" };
  }

  return {
    valid: true,
    referrer_user_id: referralCode.referrer_user_id,
  };
}

/**
 * Redeem a referral code for a new user
 */
export async function redeemReferralCode(
  supabase: SupabaseClient,
  referrerUserId: string,
  referredUserId: string
): Promise<{ success: boolean; error?: string }> {
  // Check if user already redeemed a code
  const { data: existingRedemption } = await supabase
    .from("referral_redemptions")
    .select("id")
    .eq("referred_user_id", referredUserId)
    .single();

  if (existingRedemption) {
    return { success: false, error: "You have already used a referral code" };
  }

  // Check if user is trying to use their own code
  if (referrerUserId === referredUserId) {
    return { success: false, error: "Cannot use your own referral code" };
  }

  // Create redemption record
  const { error: redemptionError } = await supabase
    .from("referral_redemptions")
    .insert({
      referrer_user_id: referrerUserId,
      referred_user_id: referredUserId,
      reward_granted: false,
    });

  if (redemptionError) {
    console.error("Error creating redemption:", redemptionError);
    return { success: false, error: "Failed to redeem referral code" };
  }

  // Increment uses_count
  const { error: updateError } = await supabase.rpc(
    "increment_referral_uses",
    { referrer_id: referrerUserId }
  );

  // If RPC doesn't exist yet, update manually
  if (updateError) {
    const { data: codeData } = await supabase
      .from("referral_codes")
      .select("uses_count")
      .eq("referrer_user_id", referrerUserId)
      .single();

    if (codeData) {
      await supabase
        .from("referral_codes")
        .update({ uses_count: (codeData.uses_count || 0) + 1 })
        .eq("referrer_user_id", referrerUserId);
    }
  }

  return { success: true };
}

/**
 * Grant reward to referrer when referred user upgrades to premium
 * Grants 7 days of Ultimate plan
 */
export async function grantReferrerReward(
  supabase: SupabaseClient,
  referredUserId: string
): Promise<{ success: boolean; error?: string }> {
  // Find the redemption record
  const { data: redemption, error: redemptionError } = await supabase
    .from("referral_redemptions")
    .select("id, referrer_user_id, reward_granted")
    .eq("referred_user_id", referredUserId)
    .single();

  if (redemptionError || !redemption) {
    return { success: false, error: "No referral redemption found" };
  }

  // If reward already granted, skip
  if (redemption.reward_granted) {
    return { success: true };
  }

  // Get referrer's subscription
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", redemption.referrer_user_id)
    .single();

  if (subError || !subscription) {
    return { success: false, error: "Referrer subscription not found" };
  }

  // Calculate new period end (add 7 days)
  const now = new Date();
  const currentEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end)
    : now;

  // If current period has expired, start from now
  const newEndDate = currentEnd > now ? currentEnd : now;
  newEndDate.setDate(newEndDate.getDate() + 7);

  // Update subscription
  const { error: updateError } = await supabase
    .from("subscriptions")
    .update({
      plan_type: "ultimate",
      current_period_end: newEndDate.toISOString(),
      status: "active",
    })
    .eq("user_id", redemption.referrer_user_id);

  if (updateError) {
    console.error("Error updating subscription:", updateError);
    return { success: false, error: "Failed to grant reward" };
  }

  // Mark reward as granted
  const { error: markError } = await supabase
    .from("referral_redemptions")
    .update({ reward_granted: true })
    .eq("id", redemption.id);

  if (markError) {
    console.error("Error marking reward as granted:", markError);
  }

  // Send referral reward email to the referrer
  try {
    const { data: referrerUser } = await supabase.auth.admin.getUserById(redemption.referrer_user_id);
    const { data: referredUserProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", referredUserId)
      .single();

    const { data: referralCode } = await supabase
      .from("referral_codes")
      .select("code")
      .eq("referrer_user_id", redemption.referrer_user_id)
      .single();

    const { data: referrerProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", redemption.referrer_user_id)
      .single();

    if (referrerUser?.user?.email) {
      await sendReferralRewardEmail(referrerUser.user.email, {
        firstName: referrerProfile?.full_name?.split(' ')[0] || '',
        rewardDays: 7,
        referredUserName: referredUserProfile?.full_name || 'Един от приятелите ти',
      });
      console.log(`Referral reward email sent to ${referrerUser.user.email}`);
    }
  } catch (emailError) {
    console.error('Error sending referral reward email:', emailError);
    // Don't fail the reward grant if email fails
  }

  return { success: true };
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  code: string | null;
  totalReferrals: number;
  rewardsEarned: number;
}> {
  // Get referral code
  const { data: codeData } = await supabase
    .from("referral_codes")
    .select("code, uses_count")
    .eq("referrer_user_id", userId)
    .single();

  // Get total redemptions
  const { count: totalReferrals } = await supabase
    .from("referral_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("referrer_user_id", userId);

  // Get rewards earned
  const { count: rewardsEarned } = await supabase
    .from("referral_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("referrer_user_id", userId)
    .eq("reward_granted", true);

  return {
    code: codeData?.code || null,
    totalReferrals: totalReferrals || 0,
    rewardsEarned: rewardsEarned || 0,
  };
}
