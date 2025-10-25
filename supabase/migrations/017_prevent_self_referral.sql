-- =============================================
-- PREVENT SELF-REFERRAL AT DATABASE LEVEL
-- =============================================
-- Add CHECK constraint to prevent users from referring themselves
-- This provides defense-in-depth alongside application-level validation

-- Add constraint to referral_redemptions table
ALTER TABLE referral_redemptions
ADD CONSTRAINT no_self_referral CHECK (referrer_user_id != referred_user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referred_user
ON referral_redemptions(referred_user_id);

-- Add comment to document the constraint
COMMENT ON CONSTRAINT no_self_referral ON referral_redemptions IS
'Prevents users from redeeming their own referral codes';
