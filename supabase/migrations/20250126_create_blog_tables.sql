-- =====================================================
-- AI BLOG GENERATION SYSTEM - DATABASE SCHEMA
-- Created: 2025-01-26
-- Purpose: Support AI-powered blog content generation
-- =====================================================

-- =====================================================
-- TABLE: blog_posts
-- Purpose: Store blog articles (AI-generated and manual)
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metadata
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- Short description (150-160 chars)
  featured_image_url TEXT,

  -- Content
  content TEXT NOT NULL, -- HTML with embedded images and CTA markers
  reading_time INTEGER, -- Auto-calculated in minutes
  word_count INTEGER,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[], -- Array of keywords
  og_image_url TEXT,
  schema_markup JSONB, -- Structured data (JSON-LD)

  -- Categorization
  content_type TEXT CHECK (content_type IN ('tofu', 'mofu', 'bofu', 'advertorial')),
  category TEXT CHECK (category IN ('astrology', 'tarot', 'numerology', 'spirituality', 'general')),
  tags TEXT[],

  -- AI Generation Metadata
  ai_generated BOOLEAN DEFAULT TRUE,
  generation_prompt TEXT, -- Store prompt used for reproducibility
  model_used TEXT DEFAULT 'claude-3.5-sonnet', -- Track which model generated
  generation_time INTERVAL, -- How long it took to generate

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  -- Analytics (updated via API)
  view_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  cta_clicks INTEGER DEFAULT 0,
  avg_time_on_page INTERVAL,
  conversion_count INTEGER DEFAULT 0, -- Tracked conversions from this post
  conversion_rate DECIMAL(5,2), -- Percentage (calculated)

  -- Related Content
  related_posts UUID[], -- Array of blog_post IDs
  related_services TEXT[], -- Links to services (natal-chart, synastry, etc.)

  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_reading_time CHECK (reading_time > 0 AND reading_time < 60),
  CONSTRAINT valid_word_count CHECK (word_count > 0 AND word_count < 20000),
  CONSTRAINT valid_conversion_rate CHECK (conversion_rate >= 0 AND conversion_rate <= 100)
);

-- =====================================================
-- TABLE: blog_images
-- Purpose: Store images for blog posts
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,

  -- Image Data
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,

  -- Generation
  ai_generated BOOLEAN DEFAULT TRUE,
  dalle_prompt TEXT, -- DALL-E prompt used
  generation_time INTERVAL,

  -- Metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- bytes
  format TEXT CHECK (format IN ('png', 'jpg', 'jpeg', 'webp', 'svg')),

  -- Position in article
  position_in_article INTEGER DEFAULT 0, -- 0 = hero, 1+ = in-article positions

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0),
  CONSTRAINT valid_position CHECK (position_in_article >= 0),
  CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Blog Posts Indexes
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_content_type ON blog_posts(content_type);
CREATE INDEX idx_blog_posts_keywords ON blog_posts USING GIN(keywords);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_view_count ON blog_posts(view_count DESC);

-- Blog Images Indexes
CREATE INDEX idx_blog_images_blog_post_id ON blog_images(blog_post_id);
CREATE INDEX idx_blog_images_position ON blog_images(blog_post_id, position_in_article);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
-- Public can read published posts
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all posts (for previews)
CREATE POLICY "Authenticated users can read all blog posts" ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can do everything on blog posts
CREATE POLICY "Admin full access to blog posts" ON blog_posts
  FOR ALL
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

-- Blog Images Policies
-- Public can read images for published posts
CREATE POLICY "Public can read blog images for published posts" ON blog_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_images.blog_post_id
      AND blog_posts.status = 'published'
    )
  );

-- Authenticated users can read all images
CREATE POLICY "Authenticated users can read all blog images" ON blog_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can do everything on blog images
CREATE POLICY "Admin full access to blog images" ON blog_images
  FOR ALL
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

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at on blog_posts modification
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate conversion_rate when conversion_count or view_count changes
CREATE OR REPLACE FUNCTION calculate_conversion_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.view_count > 0 THEN
    NEW.conversion_rate := (NEW.conversion_count::DECIMAL / NEW.view_count::DECIMAL) * 100;
  ELSE
    NEW.conversion_rate := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_calculate_conversion_rate
  BEFORE INSERT OR UPDATE OF view_count, conversion_count ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_conversion_rate();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get popular blog posts
CREATE OR REPLACE FUNCTION get_popular_blog_posts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT,
  view_count INTEGER,
  published_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    bp.category,
    bp.view_count,
    bp.published_at
  FROM blog_posts bp
  WHERE bp.status = 'published'
  ORDER BY bp.view_count DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get related blog posts by category/tags
CREATE OR REPLACE FUNCTION get_related_blog_posts(
  post_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT,
  published_at TIMESTAMPTZ
) AS $$
DECLARE
  post_category TEXT;
  post_tags TEXT[];
BEGIN
  -- Get current post's category and tags
  SELECT category, tags INTO post_category, post_tags
  FROM blog_posts
  WHERE blog_posts.id = post_id;

  RETURN QUERY
  SELECT
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.featured_image_url,
    bp.category,
    bp.published_at
  FROM blog_posts bp
  WHERE bp.status = 'published'
    AND bp.id != post_id
    AND (
      bp.category = post_category
      OR bp.tags && post_tags -- Overlapping tags
    )
  ORDER BY
    CASE WHEN bp.category = post_category THEN 1 ELSE 2 END,
    bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE blog_posts IS 'AI-generated blog articles with SEO optimization and analytics tracking';
COMMENT ON TABLE blog_images IS 'Images for blog posts (AI-generated via DALL-E or manually uploaded)';

COMMENT ON COLUMN blog_posts.content_type IS 'TOFU (awareness), MOFU (engagement), BOFU (conversion), or Advertorial';
COMMENT ON COLUMN blog_posts.schema_markup IS 'JSON-LD structured data for search engines';
COMMENT ON COLUMN blog_posts.generation_prompt IS 'Original prompt used to generate content (for iteration/improvement)';
COMMENT ON COLUMN blog_posts.related_posts IS 'Array of related blog post UUIDs for internal linking';
COMMENT ON COLUMN blog_posts.related_services IS 'Services this post should link to (natal-chart, synastry, personal-horoscope, etc.)';

COMMENT ON COLUMN blog_images.position_in_article IS '0 = hero image at top, 1+ = sequential in-article images';
COMMENT ON COLUMN blog_images.dalle_prompt IS 'DALL-E 3 prompt used to generate this image';
