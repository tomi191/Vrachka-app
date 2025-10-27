/**
 * Blog Image Generation using Gemini Flash Image + Supabase Storage
 * Generates AI images via OpenRouter and stores them in Supabase
 */

import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

interface ImageGenerationOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GeneratedImage {
  url: string; // Supabase Storage public URL
  prompt: string;
  model: string;
  storagePath?: string; // Path in Supabase Storage
}

/**
 * Get image dimensions based on aspect ratio
 */
function getDimensions(aspectRatio: string = '16:9'): { width: number; height: number } {
  const dimensions: Record<string, { width: number; height: number }> = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1920, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '4:3': { width: 1600, height: 1200 },
    '3:4': { width: 1200, height: 1600 },
  };
  return dimensions[aspectRatio] || dimensions['16:9'];
}

/**
 * Generate a single image using Gemini Flash Image via OpenRouter
 */
export async function generateImage(
  options: ImageGenerationOptions,
  blogPostId?: string
): Promise<GeneratedImage> {
  const { prompt, style, aspectRatio = '16:9' } = options;

  try {
    const dimensions = getDimensions(aspectRatio);

    // Build enhanced prompt with style
    let fullPrompt = prompt;
    if (style) {
      fullPrompt = `${prompt}\n\nStyle: ${style}`;
    }

    console.log('[Image Gen] Generating image with Gemini Flash Image...');
    console.log('[Image Gen] Prompt:', fullPrompt.substring(0, 100) + '...');

    // Call OpenRouter with Gemini Flash Image model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vrachka.bg',
        'X-Title': 'Vrachka Blog Image Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        // Image generation specific params
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error('[Image Gen] OpenRouter error:', errorData);
      throw new Error(`OpenRouter API failed: ${errorData.error || 'Unknown error'}`);
    }

    const openRouterData = await openRouterResponse.json();
    console.log('[Image Gen] OpenRouter response received');

    // Extract image URL or base64 from response
    // Gemini Flash Image returns image URL in the content
    const imageContent = openRouterData.choices[0]?.message?.content;

    if (!imageContent) {
      throw new Error('No image content in AI response');
    }

    // Check if response contains image URL or base64
    let imageBuffer: Buffer;

    if (imageContent.startsWith('http')) {
      // It's a URL - download the image
      console.log('[Image Gen] Downloading image from URL...');
      const imageResponse = await fetch(imageContent);
      if (!imageResponse.ok) {
        throw new Error('Failed to download generated image');
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else if (imageContent.startsWith('data:image')) {
      // It's a base64 data URI
      console.log('[Image Gen] Converting base64 to buffer...');
      const base64Data = imageContent.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Fallback: try to find image URL in text response
      const urlMatch = imageContent.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)/i);
      if (urlMatch) {
        console.log('[Image Gen] Found image URL in response text');
        const imageResponse = await fetch(urlMatch[0]);
        const arrayBuffer = await imageResponse.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      } else {
        throw new Error('Could not extract image from AI response');
      }
    }

    // Convert to WebP format using sharp
    console.log('[Image Gen] Converting to WebP...');
    const webpBuffer = await sharp(imageBuffer)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    // Upload to Supabase Storage
    const supabase = await createClient();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomId}.webp`;
    const storagePath = blogPostId
      ? `${blogPostId}/${filename}`
      : `general/${filename}`;

    console.log('[Image Gen] Uploading to Supabase:', storagePath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(storagePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Image Gen] Supabase upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(storagePath);

    console.log('[Image Gen] Image uploaded successfully:', publicUrl);

    return {
      url: publicUrl,
      prompt: fullPrompt,
      model: 'Gemini Flash Image',
      storagePath,
    };
  } catch (error) {
    console.error('[Image Gen] Generation failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Image generation failed'
    );
  }
}

/**
 * Generate multiple images in parallel
 */
export async function generateImages(
  prompts: string[],
  style?: string,
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
  blogPostId?: string
): Promise<GeneratedImage[]> {
  const promises = prompts.map((prompt, index) =>
    generateImage({ prompt, style, aspectRatio }, blogPostId)
      .catch(error => {
        console.error(`[Image Gen] Failed to generate image ${index + 1}:`, error);
        return null; // Return null for failed images
      })
  );

  // Generate all images in parallel
  const results = await Promise.all(promises);

  // Filter out failed images (null values)
  const successfulImages = results.filter((img): img is GeneratedImage => img !== null);

  if (successfulImages.length === 0) {
    throw new Error('Failed to generate any images');
  }

  console.log(`[Image Gen] Successfully generated ${successfulImages.length}/${prompts.length} images`);

  return successfulImages;
}

/**
 * Generate blog post images (hero + in-article)
 */
export async function generateBlogImages(
  blogTitle: string,
  blogKeywords: string[],
  count: number = 3,
  blogPostId?: string
): Promise<GeneratedImage[]> {
  const prompts: string[] = [];

  // Hero image (always first)
  prompts.push(
    `Create a stunning hero banner image for a Bulgarian astrology blog post titled: "${blogTitle}".
Style: Professional, mystical, spiritual atmosphere with cosmic elements.
Bulgarian cultural aesthetics. High quality, eye-catching, modern design.
Aspect ratio: 16:9 landscape format.`
  );

  // Additional in-article images based on count
  if (count >= 2 && blogKeywords[0]) {
    prompts.push(
      `Create an illustrative image representing the concept: "${blogKeywords[0]}".
Style: Artistic, symbolic, visually appealing. Mystical and spiritual theme.
Suitable for article illustration. Bulgarian cultural elements.
Professional quality, harmonious colors.`
    );
  }

  if (count >= 3 && (blogKeywords[1] || blogKeywords[0])) {
    const keyword = blogKeywords[1] || blogKeywords[0];
    prompts.push(
      `Create a supporting visual for an article about: "${keyword}".
Style: Elegant, mysterious, professional quality.
Cosmic and spiritual atmosphere. Modern Bulgarian design aesthetics.
Complementary colors, balanced composition.`
    );
  }

  if (count >= 4 && (blogKeywords[2] || blogKeywords[1])) {
    const keyword = blogKeywords[2] || blogKeywords[1] || 'spirituality';
    prompts.push(
      `Create a conceptual image showing: "${keyword}".
Style: Abstract or semi-realistic. High quality, blog-ready.
Mystical Bulgarian theme with modern touches.
Professional photography or digital art style.`
    );
  }

  if (count >= 5) {
    prompts.push(
      `Create a final supporting image related to: "${blogTitle}".
Style: Cohesive with overall blog theme. Professional and polished.
Mystical, spiritual, cosmic atmosphere. Bulgarian cultural elements.
Eye-catching but elegant, suitable for blog article.`
    );
  }

  // Generate all images with Gemini Flash Image
  return generateImages(
    prompts.slice(0, count),
    'mystical, professional, Bulgarian astrology theme, cosmic elements, spiritual atmosphere',
    '16:9',
    blogPostId
  );
}

/**
 * Delete blog images from Supabase Storage
 */
export async function deleteBlogImages(storagePaths: string[]): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from('blog-images')
    .remove(storagePaths);

  if (error) {
    console.error('[Image Gen] Failed to delete images:', error);
    throw new Error(`Failed to delete images: ${error.message}`);
  }

  console.log(`[Image Gen] Deleted ${storagePaths.length} images from storage`);
}
