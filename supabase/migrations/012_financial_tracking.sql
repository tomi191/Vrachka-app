-- =============================================
-- FINANCIAL TRACKING SYSTEM
-- Complete cost tracking, revenue analytics, and P&L monitoring
-- =============================================

-- =============================================
-- AI USAGE LOGS TABLE
-- Track every AI API call for cost calculation
-- =============================================
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feature TEXT NOT NULL, -- 'tarot', 'oracle', 'horoscope', 'daily_content'
  model TEXT NOT NULL, -- e.g., 'openai/gpt-4.1-mini'
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  estimated_cost_usd DECIMAL(10, 6) NOT NULL, -- Cost in USD
  metadata JSONB, -- Additional data (reading_type, zodiac_sign, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for AI usage queries
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_feature ON ai_usage_logs(feature);
CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs(created_at DESC);
CREATE INDEX idx_ai_usage_logs_cost ON ai_usage_logs(estimated_cost_usd);

-- =============================================
-- STRIPE WEBHOOK EVENTS TABLE
-- Log all Stripe webhook events for auditing
-- =============================================
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL, -- Stripe event ID (evt_...)
  event_type TEXT NOT NULL, -- checkout.session.completed, etc.
  data JSONB NOT NULL, -- Full event payload
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error TEXT, -- Error message if processing failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for webhook events
CREATE INDEX idx_stripe_webhook_events_event_type ON stripe_webhook_events(event_type);
CREATE INDEX idx_stripe_webhook_events_processed ON stripe_webhook_events(processed);
CREATE INDEX idx_stripe_webhook_events_created_at ON stripe_webhook_events(created_at DESC);

-- =============================================
-- SUBSCRIPTION ANALYTICS TABLE
-- Detailed subscription history tracking
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL, -- Stripe subscription ID
  stripe_customer_id TEXT NOT NULL,
  plan_type TEXT NOT NULL, -- 'basic' or 'ultimate'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', etc.
  amount_usd DECIMAL(10, 2) NOT NULL, -- Monthly amount in USD
  currency TEXT DEFAULT 'eur',
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ, -- NULL if still active
  canceled_at TIMESTAMPTZ,
  cancel_reason TEXT, -- Churn analysis
  trial_end TIMESTAMPTZ,
  metadata JSONB, -- Additional Stripe metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for subscription analytics
CREATE INDEX idx_subscription_analytics_user_id ON subscription_analytics(user_id);
CREATE INDEX idx_subscription_analytics_status ON subscription_analytics(status);
CREATE INDEX idx_subscription_analytics_plan_type ON subscription_analytics(plan_type);
CREATE INDEX idx_subscription_analytics_started_at ON subscription_analytics(started_at DESC);
CREATE INDEX idx_subscription_analytics_ended_at ON subscription_analytics(ended_at) WHERE ended_at IS NOT NULL;

-- =============================================
-- FINANCIAL SNAPSHOTS TABLE
-- Daily financial snapshots for historical tracking
-- =============================================
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE UNIQUE NOT NULL,

  -- Revenue metrics
  total_revenue_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  basic_plan_revenue_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ultimate_plan_revenue_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,

  -- Cost metrics
  total_ai_costs_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tarot_costs_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  oracle_costs_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  horoscope_costs_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,

  -- Infrastructure costs (manual entry)
  supabase_cost_usd DECIMAL(10, 2) DEFAULT 0,
  vercel_cost_usd DECIMAL(10, 2) DEFAULT 0,
  other_costs_usd DECIMAL(10, 2) DEFAULT 0,

  -- Calculated metrics
  total_costs_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  profit_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  profit_margin_percent DECIMAL(5, 2) DEFAULT 0, -- Percentage

  -- Subscription metrics
  active_subscriptions INTEGER NOT NULL DEFAULT 0,
  basic_plan_count INTEGER NOT NULL DEFAULT 0,
  ultimate_plan_count INTEGER NOT NULL DEFAULT 0,
  new_subscriptions_today INTEGER NOT NULL DEFAULT 0,
  canceled_subscriptions_today INTEGER NOT NULL DEFAULT 0,

  -- MRR/ARR
  mrr_usd DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Monthly Recurring Revenue
  arr_usd DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Annual Recurring Revenue

  -- Stripe mode
  stripe_mode TEXT CHECK (stripe_mode IN ('test', 'live')) DEFAULT 'test',

  -- User metrics
  total_users INTEGER NOT NULL DEFAULT 0,
  dau INTEGER DEFAULT 0, -- Daily Active Users
  mau INTEGER DEFAULT 0, -- Monthly Active Users

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for financial snapshots
CREATE INDEX idx_financial_snapshots_date ON financial_snapshots(snapshot_date DESC);

-- =============================================
-- RLS POLICIES
-- Only admins can access financial data
-- =============================================

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;

-- Admins can view all financial data
CREATE POLICY "Admins can view all AI usage logs"
  ON ai_usage_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all webhook events"
  ON stripe_webhook_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all subscription analytics"
  ON subscription_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all financial snapshots"
  ON financial_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Service role can insert data
CREATE POLICY "Service can insert AI usage logs"
  ON ai_usage_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can insert webhook events"
  ON stripe_webhook_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can manage subscription analytics"
  ON subscription_analytics FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage financial snapshots"
  ON financial_snapshots FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to calculate total AI costs for a date range
CREATE OR REPLACE FUNCTION calculate_ai_costs(
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(estimated_cost_usd), 0)
    FROM ai_usage_logs
    WHERE created_at >= start_date
    AND created_at < end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate MRR (Monthly Recurring Revenue)
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount_usd), 0)
    FROM subscription_analytics
    WHERE status = 'active'
    AND ended_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get active subscription count by plan
CREATE OR REPLACE FUNCTION get_active_subscription_count(plan TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM subscription_analytics
    WHERE status = 'active'
    AND plan_type = plan
    AND ended_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE ai_usage_logs IS 'Tracks every AI API call for cost analysis';
COMMENT ON TABLE stripe_webhook_events IS 'Logs all Stripe webhook events for auditing';
COMMENT ON TABLE subscription_analytics IS 'Detailed subscription lifecycle tracking';
COMMENT ON TABLE financial_snapshots IS 'Daily financial snapshots for historical reporting';
