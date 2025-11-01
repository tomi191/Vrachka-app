-- Fix daily_content RLS policy to allow public reads
--
-- Problem: The previous RLS policy restricted SELECT access to authenticated users only,
-- which prevented horoscope caching from working for unauthenticated visitors.
--
-- Solution: Remove the TO authenticated restriction to allow public reads of daily horoscopes.
-- This is safe because:
-- 1. Daily horoscopes are public content by design
-- 2. INSERT/UPDATE/DELETE operations still require proper authentication
-- 3. No sensitive user data is stored in daily_content table

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can read daily content" ON daily_content;

-- Create new policy that allows public reads
CREATE POLICY "Anyone can read daily content"
  ON daily_content FOR SELECT
  USING (true);

-- Verify the policy was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'daily_content'
    AND policyname = 'Anyone can read daily content'
  ) THEN
    RAISE EXCEPTION 'Failed to create RLS policy for daily_content';
  END IF;

  RAISE NOTICE 'Successfully updated daily_content RLS policy for public access';
END $$;
