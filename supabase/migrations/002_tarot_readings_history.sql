-- =============================================
-- TAROT READINGS HISTORY TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS tarot_readings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id INT NOT NULL REFERENCES tarot_cards(id),
  card_name TEXT NOT NULL,
  card_name_bg TEXT NOT NULL,
  card_image_url TEXT NOT NULL,
  is_reversed BOOLEAN DEFAULT FALSE,
  interpretation TEXT NOT NULL,
  advice TEXT NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tarot_readings_user ON tarot_readings(user_id, read_at DESC);

-- RLS для tarot_readings
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readings"
  ON tarot_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings"
  ON tarot_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
