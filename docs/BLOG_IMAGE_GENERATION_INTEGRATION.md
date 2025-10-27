# Blog Image Generation Integration - Gemini 2.5 Flash Image + Supabase Storage

## Overview

This document describes the integration of AI-powered image generation for blog posts using Google's Gemini 2.5 Flash Image model via OpenRouter, with images stored in Supabase Storage.

## Changes Made

### 1. AI Model Configuration (`lib/ai/models.ts`)

Added Gemini 2.5 Flash Image model configuration:

```typescript
gemini_image: {
  id: 'google/gemini-2.5-flash-image',
  name: 'Gemini 2.5 Flash Image',
  provider: 'Google',
  costPer1M: {
    input: 0,
    output: 0,
  },
  maxTokens: 8192,
  contextWindow: 1_048_576,
  strengths: ['image-generation', 'free', 'fast', 'creative'],
}
```

Feature mapping:
```typescript
blog_images: ['gemini_image']
```

### 2. Supabase Storage Service (`lib/supabase/storage.ts`)

Created a new service for uploading images to Supabase Storage bucket `blog-images`:

**Key Functions:**
- `uploadImage(options)` - Upload single image to storage
- `uploadImages(images[])` - Upload multiple images in parallel
- `deleteImage(path)` - Delete image from storage
- `listImages(folderPath)` - List images in folder
- `getImageInfo(path)` - Get file metadata

**Storage Configuration:**
- Bucket: `blog-images`
- Public access: Yes
- File size limit: 5MB
- Allowed formats: JPEG, PNG, WebP, GIF
- Upload path pattern: `blog/{timestamp}-{filename}`

### 3. Blog Images Database Service (`lib/supabase/blog-images.ts`)

Created helper functions for managing `blog_images` table records:

**Key Functions:**
- `insertBlogImage(image)` - Insert single image metadata
- `insertBlogImages(images[])` - Batch insert multiple images
- `getBlogPostImages(blogPostId)` - Get all images for a blog post
- `updateBlogImage(imageId, updates)` - Update image metadata
- `deleteBlogImage(imageId)` - Delete image record
- `linkImagesToPost(imageUrls[], blogPostId)` - Link unassigned images to post

### 4. Image Generation Service Refactor (`lib/ai/image-generation.ts`)

Completely refactored from Unsplash stock photos to AI-generated images:

**Old Approach:**
- Used Unsplash Source API for stock photos
- No storage, just external URLs
- No true AI generation

**New Approach:**
- Uses Gemini 2.5 Flash Image via OpenRouter
- Generates images from text prompts
- Uploads to Supabase Storage
- Returns public Supabase URLs
- Stores metadata in `blog_images` table

**Key Changes:**
```typescript
// New generateImage function flow:
1. Build enhanced prompt with style instructions
2. Call OpenRouter with modalities: ['image', 'text']
3. Extract base64 image data from response
4. Convert base64 to Buffer
5. Upload Buffer to Supabase Storage
6. Return public URL from Supabase
```

**API Configuration:**
- Model: `google/gemini-2.5-flash-image`
- Modalities: `['image', 'text']`
- Image config: Supports aspect ratio control
- Response format: Base64-encoded PNG images

### 5. API Route Updates (`app/api/blog/generate-images/route.ts`)

Enhanced to save image metadata to database:

**New Features:**
- Generates images via Gemini 2.5 Flash Image
- Uploads to Supabase Storage automatically
- Saves metadata to `blog_images` table
- Tracks generation stats and costs
- Returns storage paths and public URLs

**Response Structure:**
```typescript
{
  success: true,
  images: [
    {
      url: "https://.../storage/v1/object/public/blog-images/blog/...",
      prompt: "Hero banner image for...",
      model: "Gemini 2.5 Flash Image",
      storagePath: "blog/1234567890-generated.png"
    }
  ],
  metadata: {
    total: 3,
    successful: 3,
    failed: 0,
    model: "Gemini 2.5 Flash Image",
    estimatedCost: "$0.09",
    storage: "Supabase Storage (blog-images bucket)"
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Blog Creator UI (BlogCreatorTab.tsx)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  API Route: /api/blog/generate-images                       │
│  - Validates admin authentication                           │
│  - Calls generateImages() with prompts                      │
│  - Saves metadata to blog_images table                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Image Generation Service (image-generation.ts)             │
│  - Generates images via Gemini 2.5 Flash Image              │
│  - Converts base64 to Buffer                                │
│  - Uploads to Supabase Storage                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├──────────────────────┬────────────────────┐
                 ▼                      ▼                    ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  OpenRouter API      │  │  Supabase Storage│  │  blog_images DB  │
│  (Gemini Image)      │  │  (blog-images)   │  │  (metadata)      │
└──────────────────────┘  └──────────────────┘  └──────────────────┘
```

## Usage Example

### Generate Blog Images

```typescript
// Generate 3 images for a blog post
const images = await generateBlogImages(
  "Zodiac Signs and Their Meanings",
  ["astrology", "zodiac", "horoscope"],
  3  // hero + 2 in-article images
);

// Result:
// [
//   { url: "https://...supabase.co/.../hero.png", prompt: "Hero banner...", ... },
//   { url: "https://...supabase.co/.../img1.png", prompt: "Illustrative...", ... },
//   { url: "https://...supabase.co/.../img2.png", prompt: "Supporting...", ... }
// ]
```

### API Call

```bash
POST /api/blog/generate-images
Content-Type: application/json
Authorization: Bearer <supabase-token>

{
  "prompts": [
    "Hero banner for astrology blog",
    "Zodiac wheel illustration",
    "Mystical stars background"
  ],
  "aspectRatio": "16:9",
  "style": "mystical, professional, Bulgarian cultural elements"
}
```

## Database Schema

### blog_images Table

```sql
CREATE TABLE blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id),
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  ai_generated BOOLEAN DEFAULT true,
  dalle_prompt TEXT,  -- Actually stores Gemini prompt
  generation_time INTERVAL,
  width INTEGER,
  height INTEGER,
  file_size INTEGER CHECK (file_size > 0),
  format TEXT CHECK (format IN ('png', 'jpg', 'jpeg', 'webp', 'svg')),
  position_in_article INTEGER DEFAULT 0 CHECK (position_in_article >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields:**
- `blog_post_id`: Links image to blog post (nullable for unassigned images)
- `url`: Public Supabase Storage URL
- `alt_text`: SEO-friendly alt text (uses generation prompt)
- `dalle_prompt`: Original generation prompt (for reference/iteration)
- `position_in_article`: 0 = hero, 1+ = in-article images

## Supabase Storage Setup

### Bucket Configuration

The `blog-images` bucket is configured in migration `015_blog_images_storage.sql`:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,  -- Public bucket
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

### Storage Policies

**Upload Policy (Authenticated Users):**
```sql
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');
```

**Read Policy (Public):**
```sql
CREATE POLICY "Public read access to blog images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'blog-images');
```

## Cost Estimation

### Gemini 2.5 Flash Image Pricing (OpenRouter)

Based on OpenRouter documentation:
- **Output images**: ~$0.03 per image
- **Input tokens**: $0.30 per million tokens
- **Output tokens**: $2.50 per million tokens

**Typical Blog Post (3 images):**
- 3 images × $0.03 = **$0.09 per blog post**
- Prompts are small (~100-200 tokens) = **~$0.0001**
- **Total: ~$0.09 per blog post**

### Supabase Storage Costs

- **Storage**: $0.021 per GB/month
- **Bandwidth**: $0.09 per GB egress
- **Typical image size**: 500KB PNG
- **3 images per post**: ~1.5MB = 0.0015GB
- **Storage cost**: $0.021 × 0.0015 = **$0.000032/month**

**100 Blog Posts:**
- Images: 100 × $0.09 = $9.00
- Storage: 150MB = $0.003/month
- **Total: ~$9 one-time + $0.003/month storage**

## Testing

### Manual Test

1. Start dev server: `npm run dev`
2. Navigate to Admin Panel → Blog Creator
3. Generate blog ideas
4. Select an idea and generate content
5. Generate images (3 images)
6. Verify images are displayed
7. Check Supabase Storage for uploaded files
8. Check `blog_images` table for metadata records

### API Test

```bash
# Generate test images
curl -X POST http://localhost:3000/api/blog/generate-images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "prompts": ["Test mystical image"],
    "aspectRatio": "16:9"
  }'
```

## Troubleshooting

### Issue: Images not uploading to Supabase

**Check:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
2. Verify `blog-images` bucket exists: `SELECT * FROM storage.buckets WHERE name = 'blog-images'`
3. Check storage policies are created
4. Check console logs for upload errors

### Issue: Image generation fails

**Check:**
1. Verify `OPENROUTER_API_KEY` is set correctly
2. Check OpenRouter account has credits
3. Verify model ID is correct: `google/gemini-2.5-flash-image`
4. Check console for API errors

### Issue: TypeScript errors

**Run:**
```bash
npx tsc --noEmit
```

**Common fixes:**
- Ensure all imports are correct
- Check `BlogImageInsert` type matches usage
- Verify optional fields use `?` or `undefined` (not `null`)

## Future Improvements

1. **Image Optimization**
   - Compress images before upload (Sharp.js)
   - Generate multiple sizes (responsive images)
   - Convert to WebP for better compression

2. **Caching**
   - Cache generated images by prompt hash
   - Reuse similar images for similar prompts

3. **Advanced Prompting**
   - Add Bulgarian cultural elements to prompts
   - Style consistency across blog posts
   - Brand color palette integration

4. **Analytics**
   - Track image view counts
   - A/B test different image styles
   - Measure impact on engagement

5. **Batch Operations**
   - Generate images for multiple posts at once
   - Bulk upload from external sources
   - Automated hero image selection

## Migration Checklist

✅ Model configuration added to `models.ts`
✅ Supabase Storage service created
✅ Blog images database service created
✅ Image generation service refactored
✅ API route updated with database saves
✅ TypeScript errors resolved
✅ Supabase bucket and tables verified
✅ Documentation created

## Support

For issues or questions:
- Check console logs for detailed errors
- Verify environment variables are set
- Review Supabase logs for storage/database errors
- Check OpenRouter dashboard for API usage

---

**Last Updated:** 2025-10-27
**Author:** Claude Code
**Version:** 1.0.0
