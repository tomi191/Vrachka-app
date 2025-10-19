-- =============================================
-- FIX REFERRAL RLS POLICIES
-- =============================================
-- Allow authenticated users to read referral codes for validation
-- This is needed so new users can validate referral codes during signup

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view own referral code" ON referral_codes;

-- Create new policies that allow reading all codes but only managing own
CREATE POLICY "Authenticated users can view all referral codes"
  ON referral_codes FOR SELECT
  TO authenticated
  USING (true);

-- This policy was already created in 003_referral_functions.sql
-- But we ensure it exists
DROP POLICY IF EXISTS "Users can insert own referral code" ON referral_codes;
CREATE POLICY "Users can insert own referral code"
  ON referral_codes FOR INSERT
  WITH CHECK (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "Users can update own referral code" ON referral_codes;
CREATE POLICY "Users can update own referral code"
  ON referral_codes FOR UPDATE
  USING (auth.uid() = referrer_user_id);
