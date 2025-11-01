-- ============================================================================
-- VIBER NOTIFICATIONS TABLE
-- ============================================================================
-- Tracks all Viber notifications sent for blog posts
-- Used for analytics, debugging, and preventing duplicate sends
--
-- Created: 2025-02-01
-- Purpose: Auto-notify Viber channel when new blog posts are published
-- ============================================================================

-- Create viber_notifications table
CREATE TABLE IF NOT EXISTS viber_notifications (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to blog_posts
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,

  -- Viber API response
  message_token TEXT, -- Viber's message ID (null if send failed)

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT, -- Error details if send failed

  -- Timestamps
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata (JSONB for flexibility)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

-- Index on blog_post_id for lookups
CREATE INDEX IF NOT EXISTS idx_viber_notifications_blog_post_id
  ON viber_notifications(blog_post_id);

-- Index on sent_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_viber_notifications_sent_at
  ON viber_notifications(sent_at DESC);

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_viber_notifications_status
  ON viber_notifications(status);

-- Compound index for blog post + status queries
CREATE INDEX IF NOT EXISTS idx_viber_notifications_blog_post_status
  ON viber_notifications(blog_post_id, status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE viber_notifications ENABLE ROW LEVEL SECURITY;

-- Admin users can view all notifications
CREATE POLICY "Admins can view all viber notifications"
  ON viber_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only system/service role can insert notifications
CREATE POLICY "Service role can insert viber notifications"
  ON viber_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only system/service role can update notifications (for retry logic)
CREATE POLICY "Service role can update viber notifications"
  ON viber_notifications
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTION: Check if blog post already has notification
-- ============================================================================

CREATE OR REPLACE FUNCTION has_viber_notification(p_blog_post_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM viber_notifications
    WHERE blog_post_id = p_blog_post_id
    AND status = 'success'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS for documentation
-- ============================================================================

COMMENT ON TABLE viber_notifications IS 'Tracks Viber channel notifications sent for blog posts';
COMMENT ON COLUMN viber_notifications.blog_post_id IS 'Reference to the blog post that was notified';
COMMENT ON COLUMN viber_notifications.message_token IS 'Viber API message token (ID) for the sent message';
COMMENT ON COLUMN viber_notifications.status IS 'success or failed - whether notification was sent successfully';
COMMENT ON COLUMN viber_notifications.error_message IS 'Error details if notification send failed';
COMMENT ON COLUMN viber_notifications.sent_at IS 'Timestamp when notification was attempted';
COMMENT ON COLUMN viber_notifications.metadata IS 'Additional data: title, excerpt, slug, featured_image, category, API response';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow service role full access
GRANT ALL ON viber_notifications TO service_role;

-- Allow authenticated users to read (with RLS)
GRANT SELECT ON viber_notifications TO authenticated;

-- ============================================================================
-- SAMPLE QUERIES (for testing)
-- ============================================================================

-- Get all notifications for a specific blog post
-- SELECT * FROM viber_notifications WHERE blog_post_id = 'xxx-xxx-xxx';

-- Get recent failed notifications
-- SELECT * FROM viber_notifications
-- WHERE status = 'failed'
-- ORDER BY sent_at DESC
-- LIMIT 10;

-- Get success rate
-- SELECT
--   status,
--   COUNT(*) as count,
--   ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
-- FROM viber_notifications
-- GROUP BY status;

-- Get notifications sent in last 24 hours
-- SELECT * FROM viber_notifications
-- WHERE sent_at > NOW() - INTERVAL '24 hours'
-- ORDER BY sent_at DESC;
