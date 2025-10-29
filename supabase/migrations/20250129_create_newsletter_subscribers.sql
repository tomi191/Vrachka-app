-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- Created: 2025-01-29
-- Purpose: Store email newsletter subscribers
-- =====================================================

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Subscriber Info
  email TEXT NOT NULL UNIQUE,
  name TEXT, -- Optional name if collected

  -- Subscription Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,

  -- Preferences
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  interests TEXT[], -- Array of interests: ['astrology', 'tarot', 'numerology']

  -- Tracking
  confirmation_token TEXT UNIQUE, -- Token for email confirmation
  unsubscribe_token TEXT UNIQUE, -- Token for unsubscribe link
  source TEXT, -- Where they subscribed from: 'blog', 'homepage', 'popup'
  ip_address INET, -- IP address at subscription
  user_agent TEXT, -- Browser user agent

  -- Engagement
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMPTZ,
  last_email_opened_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);
CREATE INDEX idx_newsletter_subscribers_confirmation_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX idx_newsletter_subscribers_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX idx_newsletter_subscribers_interests ON newsletter_subscribers USING GIN(interests);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert (subscribe)
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Admin can read all subscribers
CREATE POLICY "Admin can read all newsletter subscribers" ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin can update subscribers
CREATE POLICY "Admin can update newsletter subscribers" ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Subscribers can unsubscribe themselves via token
CREATE POLICY "Anyone can unsubscribe with valid token" ON newsletter_subscribers
  FOR UPDATE
  USING (unsubscribe_token IS NOT NULL)
  WITH CHECK (status = 'unsubscribed');

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at on modification
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate tokens on insert
CREATE OR REPLACE FUNCTION generate_newsletter_tokens()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_token IS NULL THEN
    NEW.confirmation_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  IF NEW.unsubscribe_token IS NULL THEN
    NEW.unsubscribe_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_newsletter_tokens_trigger
  BEFORE INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION generate_newsletter_tokens();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get active subscribers
CREATE OR REPLACE FUNCTION get_active_newsletter_subscribers(
  interest_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  frequency TEXT,
  interests TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ns.id,
    ns.email,
    ns.name,
    ns.frequency,
    ns.interests
  FROM newsletter_subscribers ns
  WHERE ns.status = 'confirmed'
    AND (interest_filter IS NULL OR ns.interests && interest_filter)
  ORDER BY ns.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm subscription
CREATE OR REPLACE FUNCTION confirm_newsletter_subscription(token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  subscriber_id UUID;
BEGIN
  UPDATE newsletter_subscribers
  SET
    status = 'confirmed',
    confirmed_at = NOW()
  WHERE confirmation_token = token
    AND status = 'pending'
  RETURNING id INTO subscriber_id;

  RETURN subscriber_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unsubscribe
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter(token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  subscriber_id UUID;
BEGIN
  UPDATE newsletter_subscribers
  SET
    status = 'unsubscribed',
    unsubscribed_at = NOW()
  WHERE unsubscribe_token = token
    AND status IN ('pending', 'confirmed')
  RETURNING id INTO subscriber_id;

  RETURN subscriber_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track email open
CREATE OR REPLACE FUNCTION track_newsletter_email_open(subscriber_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE newsletter_subscribers
  SET
    emails_opened = emails_opened + 1,
    last_email_opened_at = NOW()
  WHERE id = subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscribers with preferences and engagement tracking';
COMMENT ON COLUMN newsletter_subscribers.confirmation_token IS 'Token sent in confirmation email';
COMMENT ON COLUMN newsletter_subscribers.unsubscribe_token IS 'Token used in unsubscribe links';
COMMENT ON COLUMN newsletter_subscribers.interests IS 'Array of topics user is interested in';
COMMENT ON COLUMN newsletter_subscribers.frequency IS 'How often they want to receive emails';
