-- Add trial fields to profiles table
-- This migration adds support for 3-day trial system

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_tier TEXT CHECK (trial_tier IN ('basic', 'ultimate')),
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- Add index for efficient trial expiration queries
CREATE INDEX IF NOT EXISTS idx_profiles_trial_end ON profiles (trial_end) WHERE trial_end IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.trial_tier IS 'The subscription tier granted during trial period (basic or ultimate)';
COMMENT ON COLUMN profiles.trial_end IS 'Timestamp when the trial period expires';

-- Update RLS policies to include trial logic
-- Users can see their own trial information
ALTER POLICY "Users can view own profile" ON profiles
USING (auth.uid() = id);

-- Admins can see all trial information
CREATE POLICY IF NOT EXISTS "Admins can view all trial info" ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
