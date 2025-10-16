-- Push Notification Subscriptions Table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint)
);

-- Indexes for faster queries
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_is_active ON push_subscriptions(is_active);
CREATE INDEX idx_push_subscriptions_last_used ON push_subscriptions(last_used_at);

-- Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscriptions
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can create own push subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Push Notification Logs (for tracking what was sent)
CREATE TABLE IF NOT EXISTS push_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'daily_horoscope', 'streak_reminder', 'special_event', etc.
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,

  CONSTRAINT valid_notification_type CHECK (
    type IN ('daily_horoscope', 'streak_reminder', 'special_event', 'payment_reminder', 'weekly_digest', 'custom')
  )
);

-- Index for querying logs
CREATE INDEX idx_push_logs_user_id ON push_notification_logs(user_id);
CREATE INDEX idx_push_logs_type ON push_notification_logs(type);
CREATE INDEX idx_push_logs_sent_at ON push_notification_logs(sent_at);

-- RLS for logs
ALTER TABLE push_notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notification logs
CREATE POLICY "Users can view own notification logs"
  ON push_notification_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Function to clean up old inactive subscriptions (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_push_subscriptions()
RETURNS void AS $$
BEGIN
  DELETE FROM push_subscriptions
  WHERE is_active = FALSE
  AND last_used_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Function to mark subscription as inactive (called when push fails)
CREATE OR REPLACE FUNCTION mark_subscription_inactive(subscription_endpoint TEXT)
RETURNS void AS $$
BEGIN
  UPDATE push_subscriptions
  SET is_active = FALSE
  WHERE endpoint = subscription_endpoint;
END;
$$ LANGUAGE plpgsql;
