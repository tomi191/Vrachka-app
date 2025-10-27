-- Migration 016: Create blog_ideas table
-- Stores AI-generated blog post ideas for later use

CREATE TABLE IF NOT EXISTS blog_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Categorization
  content_type TEXT NOT NULL CHECK (content_type IN ('tofu', 'mofu', 'bofu', 'advertorial')),
  category TEXT NOT NULL CHECK (category IN ('astrology', 'tarot', 'numerology', 'spirituality', 'general')),

  -- SEO & Content Strategy
  keywords TEXT[] NOT NULL DEFAULT '{}',
  target_word_count INTEGER NOT NULL CHECK (target_word_count > 0 AND target_word_count < 10000),

  -- Performance Estimates (AI predictions)
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  viral_potential INTEGER CHECK (viral_potential >= 0 AND viral_potential <= 100),
  conversion_potential INTEGER CHECK (conversion_potential >= 0 AND conversion_potential <= 100),

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'published', 'archived')),
  published_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,

  -- Generation metadata
  generation_prompt TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast filtering
CREATE INDEX idx_blog_ideas_category ON blog_ideas(category);
CREATE INDEX idx_blog_ideas_content_type ON blog_ideas(content_type);
CREATE INDEX idx_blog_ideas_status ON blog_ideas(status);
CREATE INDEX idx_blog_ideas_generated_at ON blog_ideas(generated_at DESC);
CREATE INDEX idx_blog_ideas_generated_by ON blog_ideas(generated_by);

-- Composite index for common queries
CREATE INDEX idx_blog_ideas_category_status ON blog_ideas(category, status);

-- RLS Policies
ALTER TABLE blog_ideas ENABLE ROW LEVEL SECURITY;

-- Admin users can do everything
CREATE POLICY "Admins have full access to blog ideas"
  ON blog_ideas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_blog_ideas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_ideas_updated_at
  BEFORE UPDATE ON blog_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_ideas_updated_at();

-- Comment
COMMENT ON TABLE blog_ideas IS 'AI-generated blog post ideas that can be saved and used later';
COMMENT ON COLUMN blog_ideas.seo_score IS 'AI-estimated SEO potential (0-100)';
COMMENT ON COLUMN blog_ideas.viral_potential IS 'AI-estimated viral potential (0-100)';
COMMENT ON COLUMN blog_ideas.conversion_potential IS 'AI-estimated conversion potential (0-100)';
COMMENT ON COLUMN blog_ideas.status IS 'pending = not used yet, in_progress = being written, published = post created, archived = not interested';
COMMENT ON COLUMN blog_ideas.published_post_id IS 'Link to the blog post created from this idea';
