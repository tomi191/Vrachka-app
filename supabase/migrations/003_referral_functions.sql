-- =============================================
-- REFERRAL SYSTEM FUNCTIONS
-- =============================================

-- Function to atomically increment referral code usage
CREATE OR REPLACE FUNCTION increment_referral_uses(referrer_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE referral_codes
  SET uses_count = uses_count + 1
  WHERE referrer_user_id = referrer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for referral code creation
CREATE POLICY "Users can insert own referral code"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "Users can update own referral code"
  ON referral_codes FOR UPDATE
  USING (auth.uid() = referrer_user_id);

-- Add policy for referral redemptions insert (authenticated users can insert)
CREATE POLICY "Authenticated users can create redemptions"
  ON referral_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referred_user_id);
