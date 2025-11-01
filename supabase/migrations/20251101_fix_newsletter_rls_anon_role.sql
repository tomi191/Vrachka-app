-- =====================================================
-- FIX NEWSLETTER RLS POLICY FOR ANON ROLE
-- Created: 2025-11-01
-- Purpose: Allow both anon and authenticated users to subscribe to newsletter
-- =====================================================

-- Problem:
-- The RLS policy "Public can subscribe to newsletter" used role "public"
-- which is a PostgreSQL role, not a Supabase role. The API uses Supabase
-- client with "anon" or "authenticated" role, so the INSERT was being
-- rejected by RLS even though the policy seemed to allow it.

-- Solution:
-- Replace the policy to explicitly allow both "anon" and "authenticated"
-- Supabase roles to INSERT into newsletter_subscribers.

-- Drop old policy (uses "public" role)
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON newsletter_subscribers;

-- Create new policy that allows both anon and authenticated users
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Comment
COMMENT ON POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  IS 'Allows both anonymous and authenticated users to subscribe to the newsletter';
