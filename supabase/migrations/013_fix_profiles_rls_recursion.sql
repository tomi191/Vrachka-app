-- =============================================
-- FIX INFINITE RECURSION IN PROFILES RLS
-- The "Admins can view all profiles" policy creates infinite recursion
-- because it checks the profiles table from within a profiles policy
-- =============================================

-- First, drop all policies that depend on is_admin() function
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all tarot readings" ON tarot_readings;
DROP POLICY IF EXISTS "Admins can view all oracle conversations" ON oracle_conversations;
DROP POLICY IF EXISTS "Admins can view all push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications for anyone" ON notifications;

-- Now drop and recreate is_admin function
DROP FUNCTION IF EXISTS is_admin();

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    FALSE
  );
$$;

-- Create new admin policy that doesn't cause recursion
-- Use the is_admin() function which bypasses RLS with SECURITY DEFINER
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = id);

-- Recreate other admin policies to use the same pattern
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = user_id);

CREATE POLICY "Admins can view all tarot readings"
  ON tarot_readings
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = user_id);

CREATE POLICY "Admins can view all oracle conversations"
  ON oracle_conversations
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = user_id);

CREATE POLICY "Admins can view all push subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
  ON notifications
  FOR SELECT
  USING (is_admin() = TRUE OR auth.uid() = user_id);

CREATE POLICY "Admins can create notifications for anyone"
  ON notifications
  FOR INSERT
  WITH CHECK (is_admin() = TRUE OR auth.uid() = user_id);

-- Add helpful comment
COMMENT ON FUNCTION is_admin() IS 'Returns true if current authenticated user is an admin. Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion.';
