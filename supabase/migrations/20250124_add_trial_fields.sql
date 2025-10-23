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

-- RLS policies are already set up on profiles table
-- Users can already see their own trial information via existing policies
-- No need to modify existing policies
