-- =====================================================
-- REMOVE NEWSLETTER USER_ID FOREIGN KEY CONSTRAINT
-- Created: 2025-11-01
-- Purpose: Remove foreign key constraint that conflicts with RLS
-- =====================================================

-- Problem:
-- The foreign key constraint on newsletter_subscribers.user_id references
-- profiles(id), but profiles table has RLS enabled. When inserting a
-- newsletter subscriber with user_id, PostgreSQL validates the foreign key
-- by checking if the user exists in profiles table. However, due to RLS
-- on profiles (users can only see their own profile), the validation fails
-- even though the user exists, causing the INSERT to be rejected.

-- Solution:
-- Remove the foreign key constraint. The user_id field is used only for
-- tracking and analytics purposes, not for enforcing referential integrity,
-- so the constraint is not critical for data consistency.

-- Alternative considered:
-- Using NOT VALID constraint, but this still causes issues with RLS context.

-- Remove foreign key constraint
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_user_id_fkey;

-- Update comment to clarify that user_id is for tracking only
COMMENT ON COLUMN newsletter_subscribers.user_id IS 'User ID for tracking purposes (not enforced by foreign key due to RLS conflicts)';
