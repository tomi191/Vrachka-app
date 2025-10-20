-- Performance Indexes Migration
-- Adds indexes on frequently queried columns for better query performance

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

-- Index for looking up subscriptions by user_id (most common query)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
ON subscriptions(user_id);

-- Index for active subscriptions queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_status
ON subscriptions(status)
WHERE status = 'active';

-- Composite index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
ON subscriptions(stripe_customer_id)
WHERE stripe_customer_id IS NOT NULL;

-- ============================================================================
-- API USAGE LIMITS TABLE
-- ============================================================================

-- Composite index for daily usage queries (user_id + date)
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date
ON api_usage_limits(user_id, date);

-- Index for cleanup queries (find old records)
CREATE INDEX IF NOT EXISTS idx_api_usage_date
ON api_usage_limits(date);

-- ============================================================================
-- ORACLE CONVERSATIONS TABLE
-- ============================================================================

-- Composite index for user conversation history (user_id + asked_at DESC)
CREATE INDEX IF NOT EXISTS idx_oracle_conversations_user_asked
ON oracle_conversations(user_id, asked_at DESC);

-- Index for recent conversations cleanup
CREATE INDEX IF NOT EXISTS idx_oracle_conversations_asked_at
ON oracle_conversations(asked_at);

-- ============================================================================
-- TAROT READINGS TABLE
-- ============================================================================

-- Composite index for user reading history (user_id + read_at DESC)
CREATE INDEX IF NOT EXISTS idx_tarot_readings_user_read
ON tarot_readings(user_id, read_at DESC);

-- Index for recent readings cleanup
CREATE INDEX IF NOT EXISTS idx_tarot_readings_read_at
ON tarot_readings(read_at);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Index for zodiac sign queries (horoscope features)
CREATE INDEX IF NOT EXISTS idx_profiles_zodiac_sign
ON profiles(zodiac_sign)
WHERE zodiac_sign IS NOT NULL;

-- ============================================================================
-- REFERRAL CODES TABLE
-- ============================================================================

-- Index for code validation (most critical query)
CREATE INDEX IF NOT EXISTS idx_referral_codes_code
ON referral_codes(code);

-- Index for user referral lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_user
ON referral_codes(referrer_user_id);

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================

-- Index for user preferences lookup (should already be unique, but explicit index helps)
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id
ON user_preferences(user_id);

-- ============================================================================
-- DAILY CONTENT TABLE
-- ============================================================================

-- Composite index for content retrieval (content_type + target_date + target_key)
CREATE INDEX IF NOT EXISTS idx_daily_content_type_date_key
ON daily_content(content_type, target_date, target_key);

-- Index for content cleanup (old dates)
CREATE INDEX IF NOT EXISTS idx_daily_content_target_date
ON daily_content(target_date);

-- ============================================================================
-- ANALYZE TABLES
-- ============================================================================

-- Update table statistics for query planner
ANALYZE subscriptions;
ANALYZE api_usage_limits;
ANALYZE oracle_conversations;
ANALYZE tarot_readings;
ANALYZE profiles;
ANALYZE referral_codes;
ANALYZE user_preferences;
ANALYZE daily_content;

-- ============================================================================
-- PERFORMANCE NOTES
-- ============================================================================

-- Expected improvements:
-- 1. Subscriptions lookup by user_id: ~10x faster
-- 2. API usage daily check: ~50x faster (composite index)
-- 3. Conversation/reading history: ~20x faster (composite index with DESC)
-- 4. Referral code validation: ~100x faster (critical for signup)
-- 5. Daily content cache hits: ~30x faster (composite index)
--
-- Index maintenance:
-- - PostgreSQL automatically maintains indexes on INSERT/UPDATE/DELETE
-- - ANALYZE should be run weekly via cron job for optimal performance
-- - Consider VACUUM ANALYZE for production after large data changes
