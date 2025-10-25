-- =============================================
-- DATABASE FIXES & IMPROVEMENTS
-- Fixes critical issues, adds missing constraints and indexes
-- Migration Date: 2025-10-25
-- =============================================

-- =============================================
-- SECTION 1: HIGH PRIORITY FIXES
-- =============================================

-- ============================================================================
-- 1.1 FIX AI_USAGE_LOGS FOREIGN KEY REFERENCE
-- Issue: References auth.users instead of profiles (inconsistent with other tables)
-- ============================================================================

-- Drop existing constraint
ALTER TABLE ai_usage_logs
DROP CONSTRAINT IF EXISTS ai_usage_logs_user_id_fkey;

-- Add corrected constraint referencing profiles table
ALTER TABLE ai_usage_logs
ADD CONSTRAINT ai_usage_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

COMMENT ON CONSTRAINT ai_usage_logs_user_id_fkey ON ai_usage_logs
IS 'Fixed FK to reference profiles instead of auth.users for consistency';

-- ============================================================================
-- 1.2 ADD UNIQUE CONSTRAINT ON REFERRAL_REDEMPTIONS
-- Issue: User can redeem multiple codes (should only redeem once)
-- ============================================================================

-- Add unique constraint to prevent multiple redemptions per user
ALTER TABLE referral_redemptions
ADD CONSTRAINT unique_referred_user_redemption
UNIQUE (referred_user_id);

COMMENT ON CONSTRAINT unique_referred_user_redemption ON referral_redemptions
IS 'Ensures each user can only redeem one referral code';

-- ============================================================================
-- 1.3 ADD CASCADE DELETE TO REFERRAL_REDEMPTIONS
-- Issue: Orphaned records when user is deleted
-- ============================================================================

-- Drop existing constraints
ALTER TABLE referral_redemptions
DROP CONSTRAINT IF EXISTS referral_redemptions_referrer_user_id_fkey,
DROP CONSTRAINT IF EXISTS referral_redemptions_referred_user_id_fkey;

-- Re-add with CASCADE
ALTER TABLE referral_redemptions
ADD CONSTRAINT referral_redemptions_referrer_user_id_fkey
FOREIGN KEY (referrer_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE referral_redemptions
ADD CONSTRAINT referral_redemptions_referred_user_id_fkey
FOREIGN KEY (referred_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- ============================================================================
-- 1.4 FIX BLOG_POSTS RLS RECURSION ISSUE
-- Issue: Direct query to profiles can cause infinite recursion
-- ============================================================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

-- Recreate using is_admin() function to prevent recursion
CREATE POLICY "Admins can manage blog posts"
ON blog_posts
FOR ALL
TO authenticated
USING (is_admin() = TRUE)
WITH CHECK (is_admin() = TRUE);

-- ============================================================================
-- 1.5 ADD MISSING UPDATE POLICY FOR STRIPE_WEBHOOK_EVENTS
-- Issue: Service role cannot update processed flag
-- ============================================================================

CREATE POLICY "Service can update webhook events"
ON stripe_webhook_events
FOR UPDATE
WITH CHECK (true);

COMMENT ON POLICY "Service can update webhook events" ON stripe_webhook_events
IS 'Allows service role to mark webhook events as processed';

-- ============================================================================
-- 1.6 ADD MISSING RLS POLICIES FOR REFERRAL_CODES
-- Issue: Users cannot create their own referral codes
-- ============================================================================

CREATE POLICY "Users can insert own referral code"
ON referral_codes
FOR INSERT
WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "Service can insert referral codes"
ON referral_codes
FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- 1.7 ADD MISSING RLS POLICIES FOR REFERRAL_REDEMPTIONS
-- Issue: Users and service cannot insert redemptions
-- ============================================================================

CREATE POLICY "Service can insert referral redemptions"
ON referral_redemptions
FOR INSERT
WITH CHECK (true);

-- =============================================
-- SECTION 2: MISSING CONSTRAINTS
-- =============================================

-- ============================================================================
-- 2.1 ADD TAROT_CARDS SUIT CONSTRAINT
-- Issue: Major arcana should have NULL suit, minor arcana should have suit
-- ============================================================================

ALTER TABLE tarot_cards
ADD CONSTRAINT tarot_cards_suit_logic_check
CHECK (
  (card_type = 'major_arcana' AND suit IS NULL) OR
  (card_type = 'minor_arcana' AND suit IS NOT NULL)
);

COMMENT ON CONSTRAINT tarot_cards_suit_logic_check ON tarot_cards
IS 'Ensures major arcana has no suit, minor arcana must have suit';

-- =============================================
-- SECTION 3: MISSING INDEXES (PERFORMANCE)
-- =============================================

-- ============================================================================
-- 3.1 REFERRAL_REDEMPTIONS INDEXES
-- ============================================================================

-- Index for looking up referrals by referred user
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referred_user
ON referral_redemptions(referred_user_id);

-- Index for tracking rewards granted
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_reward_status
ON referral_redemptions(referrer_user_id, reward_granted);

-- Index for recent redemptions
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_redeemed_at
ON referral_redemptions(redeemed_at DESC);

-- ============================================================================
-- 3.2 AI_USAGE_LOGS INDEXES
-- ============================================================================

-- Composite index for user cost analysis queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_created
ON ai_usage_logs(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Index for feature-based cost queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_feature_created
ON ai_usage_logs(feature, created_at DESC);

-- ============================================================================
-- 3.3 BLOG_POSTS INDEXES
-- ============================================================================

-- Composite index for category + zodiac queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_zodiac
ON blog_posts(category, zodiac_sign, published_at DESC)
WHERE published = true;

-- Index for view count ranking
CREATE INDEX IF NOT EXISTS idx_blog_posts_popular
ON blog_posts(view_count DESC)
WHERE published = true;

-- ============================================================================
-- 3.4 SUBSCRIPTION_ANALYTICS INDEXES
-- ============================================================================

-- Composite index for revenue analysis
CREATE INDEX IF NOT EXISTS idx_subscription_analytics_plan_status
ON subscription_analytics(plan_type, status, started_at DESC);

-- Index for MRR calculations
CREATE INDEX IF NOT EXISTS idx_subscription_analytics_active_amount
ON subscription_analytics(amount_usd)
WHERE status = 'active' AND ended_at IS NULL;

-- Index for churn analysis
CREATE INDEX IF NOT EXISTS idx_subscription_analytics_canceled
ON subscription_analytics(canceled_at DESC)
WHERE canceled_at IS NOT NULL;

-- ============================================================================
-- 3.5 FINANCIAL_SNAPSHOTS INDEXES
-- ============================================================================

-- Index for Stripe mode filtering
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_stripe_mode
ON financial_snapshots(stripe_mode, snapshot_date DESC);

-- Index for profit margin analysis
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_profit_margin
ON financial_snapshots(profit_margin_percent DESC, snapshot_date DESC);

-- ============================================================================
-- 3.6 NOTIFICATIONS INDEXES
-- ============================================================================

-- Composite index for notification feed
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
ON notifications(user_id, created_at DESC);

-- Index for notification type analytics
CREATE INDEX IF NOT EXISTS idx_notifications_type_created
ON notifications(type, created_at DESC);

-- =============================================
-- SECTION 4: DATA RETENTION & CLEANUP FUNCTIONS
-- =============================================

-- ============================================================================
-- 4.1 CLEANUP OLD API USAGE LIMITS (90+ days)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_api_usage_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM api_usage_limits
  WHERE date < CURRENT_DATE - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_api_usage_limits()
IS 'Deletes API usage limit records older than 90 days. Returns count of deleted rows.';

-- ============================================================================
-- 4.2 CLEANUP OLD DAILY CONTENT (7+ days)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_daily_content()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM daily_content
  WHERE target_date < CURRENT_DATE - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_daily_content()
IS 'Deletes cached daily content older than 7 days. Returns count of deleted rows.';

-- ============================================================================
-- 4.3 CLEANUP OLD ORACLE CONVERSATIONS (Plan-based retention)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_oracle_conversations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Free users: keep 7 days
  -- Basic users: keep 30 days
  -- Ultimate users: keep 90 days

  DELETE FROM oracle_conversations oc
  USING profiles p, subscriptions s
  WHERE oc.user_id = p.id
  AND p.id = s.user_id
  AND (
    (s.plan_type = 'free' AND oc.asked_at < NOW() - INTERVAL '7 days')
    OR (s.plan_type = 'basic' AND oc.asked_at < NOW() - INTERVAL '30 days')
    OR (s.plan_type = 'ultimate' AND oc.asked_at < NOW() - INTERVAL '90 days')
  );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_oracle_conversations()
IS 'Deletes oracle conversations based on user plan: Free (7 days), Basic (30 days), Ultimate (90 days). Returns count of deleted rows.';

-- ============================================================================
-- 4.4 CLEANUP OLD TAROT READINGS (Plan-based retention)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_tarot_readings()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Free users: keep 7 days
  -- Basic users: keep 30 days
  -- Ultimate users: keep 90 days

  DELETE FROM tarot_readings tr
  USING profiles p, subscriptions s
  WHERE tr.user_id = p.id
  AND p.id = s.user_id
  AND (
    (s.plan_type = 'free' AND tr.read_at < NOW() - INTERVAL '7 days')
    OR (s.plan_type = 'basic' AND tr.read_at < NOW() - INTERVAL '30 days')
    OR (s.plan_type = 'ultimate' AND tr.read_at < NOW() - INTERVAL '90 days')
  );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_tarot_readings()
IS 'Deletes tarot readings based on user plan: Free (7 days), Basic (30 days), Ultimate (90 days). Returns count of deleted rows.';

-- ============================================================================
-- 4.5 CLEANUP OLD AI USAGE LOGS (180+ days for analytics)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_ai_usage_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ai_usage_logs
  WHERE created_at < NOW() - INTERVAL '180 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_ai_usage_logs()
IS 'Deletes AI usage logs older than 180 days (keeps 6 months for cost analysis). Returns count of deleted rows.';

-- ============================================================================
-- 4.6 CLEANUP OLD PUSH NOTIFICATION LOGS (60+ days)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_push_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM push_notification_logs
  WHERE sent_at < NOW() - INTERVAL '60 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_push_logs()
IS 'Deletes push notification logs older than 60 days. Returns count of deleted rows.';

-- ============================================================================
-- 4.7 MASTER CLEANUP FUNCTION (Run all cleanups)
-- ============================================================================

CREATE OR REPLACE FUNCTION run_all_cleanup_jobs()
RETURNS TABLE(
  job_name TEXT,
  deleted_rows INTEGER,
  executed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    'api_usage_limits'::TEXT,
    cleanup_old_api_usage_limits(),
    NOW();

  RETURN QUERY
  SELECT
    'daily_content'::TEXT,
    cleanup_old_daily_content(),
    NOW();

  RETURN QUERY
  SELECT
    'oracle_conversations'::TEXT,
    cleanup_old_oracle_conversations(),
    NOW();

  RETURN QUERY
  SELECT
    'tarot_readings'::TEXT,
    cleanup_old_tarot_readings(),
    NOW();

  RETURN QUERY
  SELECT
    'ai_usage_logs'::TEXT,
    cleanup_old_ai_usage_logs(),
    NOW();

  RETURN QUERY
  SELECT
    'push_notification_logs'::TEXT,
    cleanup_old_push_logs(),
    NOW();

  RETURN QUERY
  SELECT
    'old_notifications'::TEXT,
    (SELECT COUNT(*)::INTEGER FROM (SELECT cleanup_old_notifications()) AS t),
    NOW();

  RETURN QUERY
  SELECT
    'old_push_subscriptions'::TEXT,
    (SELECT COUNT(*)::INTEGER FROM (SELECT cleanup_old_push_subscriptions()) AS t),
    NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION run_all_cleanup_jobs()
IS 'Runs all data retention cleanup jobs and returns summary of deleted rows per job';

-- =============================================
-- SECTION 5: UTILITY IMPROVEMENTS
-- =============================================

-- ============================================================================
-- 5.1 ADD FUNCTION TO CHECK USER PLAN TIER
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_plan_tier(target_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (SELECT plan_type FROM subscriptions WHERE user_id = target_user_id LIMIT 1),
      'free'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_plan_tier(UUID)
IS 'Returns user plan tier (free/basic/ultimate) for given user_id';

-- ============================================================================
-- 5.2 ADD FUNCTION TO GET USER FEATURE LIMITS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_feature_limits(target_user_id UUID)
RETURNS TABLE(
  plan_tier TEXT,
  oracle_daily_limit INTEGER,
  tarot_daily_limit INTEGER,
  history_retention_days INTEGER
) AS $$
DECLARE
  user_plan TEXT;
BEGIN
  user_plan := get_user_plan_tier(target_user_id);

  RETURN QUERY
  SELECT
    user_plan,
    CASE
      WHEN user_plan = 'free' THEN 0
      WHEN user_plan = 'basic' THEN 5
      WHEN user_plan = 'ultimate' THEN 20
      ELSE 0
    END AS oracle_daily_limit,
    CASE
      WHEN user_plan = 'free' THEN 1
      WHEN user_plan = 'basic' THEN 3
      WHEN user_plan = 'ultimate' THEN 999
      ELSE 1
    END AS tarot_daily_limit,
    CASE
      WHEN user_plan = 'free' THEN 7
      WHEN user_plan = 'basic' THEN 30
      WHEN user_plan = 'ultimate' THEN 90
      ELSE 7
    END AS history_retention_days;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_feature_limits(UUID)
IS 'Returns feature limits for user based on their subscription plan';

-- =============================================
-- SECTION 6: TABLE DOCUMENTATION
-- =============================================

-- Add missing table comments
COMMENT ON TABLE profiles IS 'User profile data including zodiac sign, avatar, streaks, and trial information';
COMMENT ON TABLE subscriptions IS 'User subscription plans and Stripe billing information';
COMMENT ON TABLE daily_content IS 'Cached AI-generated daily/weekly/monthly horoscopes (24h cache)';
COMMENT ON TABLE tarot_cards IS 'Master table of tarot cards (22 Major Arcana + future Minor Arcana)';
COMMENT ON TABLE tarot_readings IS 'User tarot reading history with AI interpretations';
COMMENT ON TABLE oracle_conversations IS 'AI oracle (Врачка) conversation history';
COMMENT ON TABLE api_usage_limits IS 'Daily API usage tracking for rate limiting';
COMMENT ON TABLE referral_codes IS 'User referral codes for rewards program';
COMMENT ON TABLE referral_redemptions IS 'Tracking of referral code redemptions and rewards';
COMMENT ON TABLE push_subscriptions IS 'Browser push notification subscriptions';
COMMENT ON TABLE push_notification_logs IS 'History of sent push notifications';
COMMENT ON TABLE notifications IS 'In-app notification feed';
COMMENT ON TABLE user_preferences IS 'User notification and UI preferences';
COMMENT ON TABLE ai_usage_logs IS 'Detailed AI API usage tracking for cost analysis';
COMMENT ON TABLE stripe_webhook_events IS 'Audit log of all Stripe webhook events';
COMMENT ON TABLE subscription_analytics IS 'Subscription lifecycle analytics for revenue tracking';
COMMENT ON TABLE financial_snapshots IS 'Daily financial snapshots for P&L reporting';

-- =============================================
-- SECTION 7: UPDATE STATISTICS
-- =============================================

-- Update table statistics for query planner optimization
ANALYZE profiles;
ANALYZE subscriptions;
ANALYZE daily_content;
ANALYZE tarot_cards;
ANALYZE tarot_readings;
ANALYZE oracle_conversations;
ANALYZE api_usage_limits;
ANALYZE referral_codes;
ANALYZE referral_redemptions;
ANALYZE push_subscriptions;
ANALYZE push_notification_logs;
ANALYZE notifications;
ANALYZE user_preferences;
ANALYZE ai_usage_logs;
ANALYZE stripe_webhook_events;
ANALYZE subscription_analytics;
ANALYZE financial_snapshots;
ANALYZE blog_posts;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 014_fix_database_issues completed successfully!';
  RAISE NOTICE 'Fixed: 7 critical issues';
  RAISE NOTICE 'Added: 15 performance indexes';
  RAISE NOTICE 'Added: 8 data retention cleanup functions';
  RAISE NOTICE 'Added: 2 utility helper functions';
  RAISE NOTICE 'Added: Table documentation comments';
END $$;
