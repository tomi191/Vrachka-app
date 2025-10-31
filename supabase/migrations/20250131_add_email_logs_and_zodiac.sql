-- =====================================================
-- EMAIL AUTOMATION ENHANCEMENTS
-- Created: 2025-01-31
-- Purpose: Add email_logs table and zodiac_sign column for daily horoscope automation
-- =====================================================

-- =====================================================
-- 1. CREATE EMAIL_LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email Details
  email_type TEXT NOT NULL CHECK (email_type IN (
    'daily_horoscope',
    'renewal_reminder',
    'trial_expiring',
    'weekly_digest',
    'welcome',
    'verification',
    'payment_confirmation',
    'custom'
  )),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,

  -- Tracking
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked')),
  error_message TEXT, -- If failed

  -- Content
  subject TEXT,
  template_used TEXT, -- Template name/ID

  -- Relations
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}', -- Additional data (e.g., zodiac sign sent, campaign ID)

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for email_logs
-- =====================================================

CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_subscriber_id ON email_logs(subscriber_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);

-- =====================================================
-- RLS POLICIES for email_logs
-- =====================================================

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read all email logs
CREATE POLICY "Admin can read all email logs" ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Service role can insert logs (for cron jobs)
CREATE POLICY "Service role can insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 2. ADD ZODIAC_SIGN TO NEWSLETTER_SUBSCRIBERS
-- =====================================================

-- Add zodiac_sign column (optional, for personalized daily horoscopes)
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS zodiac_sign TEXT CHECK (zodiac_sign IN (
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ));

-- Add email_frequency_preference (more granular than just frequency)
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{"daily_horoscope": true, "weekly_digest": true, "blog_updates": false}'::jsonb;

-- Add index for zodiac_sign lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_zodiac_sign ON newsletter_subscribers(zodiac_sign);

-- =====================================================
-- 3. HELPER FUNCTIONS
-- =====================================================

-- Function to log email sent
CREATE OR REPLACE FUNCTION log_email_sent(
  p_email_type TEXT,
  p_recipient_email TEXT,
  p_recipient_name TEXT DEFAULT NULL,
  p_subject TEXT DEFAULT NULL,
  p_template_used TEXT DEFAULT NULL,
  p_subscriber_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO email_logs (
    email_type,
    recipient_email,
    recipient_name,
    subject,
    template_used,
    subscriber_id,
    user_id,
    metadata,
    status
  ) VALUES (
    p_email_type,
    p_recipient_email,
    p_recipient_name,
    p_subject,
    p_template_used,
    p_subscriber_id,
    p_user_id,
    p_metadata,
    'sent'
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as opened
CREATE OR REPLACE FUNCTION mark_email_opened(
  p_log_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE email_logs
  SET
    opened_at = NOW(),
    status = 'opened'
  WHERE id = p_log_id
    AND opened_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark email as clicked
CREATE OR REPLACE FUNCTION mark_email_clicked(
  p_log_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE email_logs
  SET
    clicked_at = NOW(),
    status = 'clicked'
  WHERE id = p_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log email failure
CREATE OR REPLACE FUNCTION log_email_failure(
  p_email_type TEXT,
  p_recipient_email TEXT,
  p_error_message TEXT,
  p_subscriber_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO email_logs (
    email_type,
    recipient_email,
    status,
    error_message,
    subscriber_id
  ) VALUES (
    p_email_type,
    p_recipient_email,
    'failed',
    p_error_message,
    p_subscriber_id
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get email stats for a subscriber
CREATE OR REPLACE FUNCTION get_subscriber_email_stats(
  p_subscriber_id UUID
)
RETURNS TABLE (
  total_sent BIGINT,
  total_opened BIGINT,
  total_clicked BIGINT,
  open_rate NUMERIC,
  click_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_sent,
    COUNT(opened_at)::BIGINT AS total_opened,
    COUNT(clicked_at)::BIGINT AS total_clicked,
    CASE
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(opened_at)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS open_rate,
    CASE
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(clicked_at)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS click_rate
  FROM email_logs
  WHERE subscriber_id = p_subscriber_id
    AND status IN ('sent', 'opened', 'clicked');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE email_logs IS 'Comprehensive logging of all emails sent from the platform';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email sent (horoscope, reminder, digest, etc.)';
COMMENT ON COLUMN email_logs.metadata IS 'Additional data like zodiac sign, campaign ID, or custom params';
COMMENT ON COLUMN newsletter_subscribers.zodiac_sign IS 'User primary zodiac sign for personalized daily horoscopes';
COMMENT ON COLUMN newsletter_subscribers.email_preferences IS 'Granular email type preferences';
