-- Migration: Add image_urls array column to blog_posts table
-- Purpose: Store image URLs directly in blog_posts for easier querying and dynamic marker replacement
-- Date: 2025-01-31

-- Step 1: Add image_urls column (array of text URLs)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Step 2: Populate image_urls for existing blog posts from blog_images table
-- This will create an array of image URLs ordered by position_in_article
UPDATE blog_posts bp
SET image_urls = (
  SELECT ARRAY_AGG(bi.url ORDER BY bi.position_in_article)
  FROM blog_images bi
  WHERE bi.blog_post_id = bp.id
)
WHERE EXISTS (
  SELECT 1 FROM blog_images bi WHERE bi.blog_post_id = bp.id
);

-- Step 3: Add comment for documentation
COMMENT ON COLUMN blog_posts.image_urls IS 'Array of image URLs for this blog post, ordered by position (0=hero, 1+=in-article)';

-- Verification query (commented out - run manually to verify):
-- SELECT id, title, featured_image_url, array_length(image_urls, 1) as image_count, image_urls
-- FROM blog_posts
-- WHERE image_urls IS NOT NULL;
