-- Migration 016: Natal Charts Feature
-- Adds support for natal chart calculations and AI interpretations

-- ============================================================================
-- TABLE: natal_charts
-- ============================================================================
CREATE TABLE IF NOT EXISTS natal_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Birth data
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_location JSONB NOT NULL, -- {city, country, latitude, longitude, timezone}

  -- Calculated chart data
  chart_data JSONB NOT NULL, -- Full natal chart (planets, houses, aspects)

  -- AI-generated interpretation
  interpretation JSONB, -- Structured interpretation from AI
  interpretation_generated_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes will be added below
  CONSTRAINT valid_birth_date CHECK (birth_date >= '1900-01-01' AND birth_date <= CURRENT_DATE),
  CONSTRAINT valid_location CHECK (
    (birth_location->>'latitude')::numeric BETWEEN -90 AND 90 AND
    (birth_location->>'longitude')::numeric BETWEEN -180 AND 180
  )
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- User lookup (most common query)
CREATE INDEX idx_natal_charts_user_id ON natal_charts(user_id);

-- Recent charts
CREATE INDEX idx_natal_charts_created_at ON natal_charts(created_at DESC);

-- Birth date lookup (for duplicate detection)
CREATE INDEX idx_natal_charts_user_birth ON natal_charts(user_id, birth_date, birth_time);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE natal_charts ENABLE ROW LEVEL SECURITY;

-- Users can view their own natal charts
CREATE POLICY "Users can view own natal charts"
  ON natal_charts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own natal charts
CREATE POLICY "Users can create own natal charts"
  ON natal_charts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own natal charts
CREATE POLICY "Users can delete own natal charts"
  ON natal_charts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access to natal charts"
  ON natal_charts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_natal_charts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on row changes
CREATE TRIGGER natal_charts_updated_at_trigger
  BEFORE UPDATE ON natal_charts
  FOR EACH ROW
  EXECUTE FUNCTION update_natal_charts_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Get natal chart count for user
CREATE OR REPLACE FUNCTION get_user_natal_chart_count(p_user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM natal_charts
  WHERE user_id = p_user_id;
$$ LANGUAGE SQL STABLE;

-- Function: Check if user can create more charts (based on plan)
CREATE OR REPLACE FUNCTION can_create_natal_chart(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  chart_count INTEGER;
BEGIN
  -- Get user's current plan
  SELECT
    COALESCE(trial_tier, subscription_tier, 'free')
  INTO user_plan
  FROM profiles
  WHERE id = p_user_id;

  -- Only Ultimate users can create natal charts
  IF user_plan != 'ultimate' THEN
    RETURN FALSE;
  END IF;

  -- Check current chart count
  chart_count := get_user_natal_chart_count(p_user_id);

  -- Allow unlimited charts for Ultimate users
  -- (Could add a limit here if needed, e.g., max 10 charts)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE natal_charts IS 'Stores calculated natal charts with AI interpretations for Ultimate plan users';
COMMENT ON COLUMN natal_charts.birth_location IS 'JSON: {city, country, latitude, longitude, timezone}';
COMMENT ON COLUMN natal_charts.chart_data IS 'JSON: Complete natal chart data (planets, houses, aspects)';
COMMENT ON COLUMN natal_charts.interpretation IS 'JSON: AI-generated interpretation with sections';
COMMENT ON FUNCTION can_create_natal_chart IS 'Check if user has permission to create natal charts (Ultimate only)';

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT SELECT, INSERT, DELETE ON natal_charts TO authenticated;
GRANT ALL ON natal_charts TO service_role;
GRANT EXECUTE ON FUNCTION get_user_natal_chart_count TO authenticated;
GRANT EXECUTE ON FUNCTION can_create_natal_chart TO authenticated;

-- ============================================================================
-- VALIDATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 016: Natal Charts table created successfully';
  RAISE NOTICE '   - RLS enabled with 4 policies';
  RAISE NOTICE '   - 3 indexes created for performance';
  RAISE NOTICE '   - 2 helper functions added';
  RAISE NOTICE '   - Feature restricted to Ultimate plan users';
END $$;
