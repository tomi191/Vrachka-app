-- =============================================
-- CREATE TAROT_CARDS TABLE ONLY
-- =============================================

CREATE TABLE IF NOT EXISTS tarot_cards (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  name_bg TEXT NOT NULL,
  card_type TEXT CHECK (card_type IN ('major_arcana', 'minor_arcana')) NOT NULL,
  suit TEXT CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles')),
  image_url TEXT NOT NULL,
  upright_meaning TEXT NOT NULL,
  reversed_meaning TEXT
);

-- RLS за tarot_cards (всички могат да четат)
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read tarot cards" ON tarot_cards;

CREATE POLICY "Anyone can read tarot cards"
  ON tarot_cards FOR SELECT
  TO authenticated
  USING (true);
