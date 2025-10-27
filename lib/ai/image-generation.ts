/**
 * Blog Image Generation using Gemini 2.5 Flash Image via OpenRouter
 * AI-generated images stored in Supabase Storage
 */

import { openai } from './client';
import { AI_MODELS } from './models';
import { uploadImage } from '@/lib/supabase/storage';

interface ImageGenerationOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
  storagePath?: string;
}

/**
 * Convert aspect ratio to Gemini format
 */
function getGeminiAspectRatio(aspectRatio?: string): string {
  const ratioMap: Record<string, string> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
  };
  return ratioMap[aspectRatio || '16:9'] || '16:9';
}

/**
 * Generate a single image using Gemini 2.5 Flash Image via OpenRouter
 * Uploads to Supabase Storage and returns public URL
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { prompt, style, aspectRatio } = options;

  try {
    // Build enhanced prompt with style
    const enhancedPrompt = style
      ? `${prompt}\n\nStyle: ${style}. Professional, high-quality, blog-ready image.`
      : `${prompt}\n\nProfessional, high-quality, blog-ready image with mystical and spiritual atmosphere.`;

    console.log('[Image Gen] Generating image with Gemini 2.5 Flash Image...');
    console.log('[Image Gen] Prompt:', enhancedPrompt);

    // Call OpenRouter with Gemini 2.5 Flash Image model
    const response = await openai.chat.completions.create({
      model: AI_MODELS.gemini_image.id,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
      // @ts-expect-error OpenRouter supports modalities for image generation but not in OpenAI SDK types
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: getGeminiAspectRatio(aspectRatio),
      },
      max_tokens: 8192,
    });

    // Extract generated image from response
    const message = response.choices[0]?.message;
    // @ts-expect-error OpenRouter returns images array in message but not in OpenAI SDK types
    const images = message?.images;

    if (!images || images.length === 0) {
      throw new Error('No image generated in response');
    }

    // Get first image (base64 data URL)
    const imageDataUrl = images[0]?.image_url?.url;

    if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
      throw new Error('Invalid image data URL');
    }

    console.log('[Image Gen] Image generated successfully, uploading to Supabase...');

    // Extract base64 data and content type
    const matches = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Failed to parse base64 image data');
    }

    const [, format, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = `image/${format}`;
    const filename = `generated-${Date.now()}.${format}`;

    // Upload to Supabase Storage
    const uploadedImage = await uploadImage({
      buffer,
      filename,
      contentType,
      metadata: {
        prompt,
        altText: prompt,
      },
    });

    console.log('[Image Gen] Image uploaded to Supabase:', uploadedImage.url);

    return {
      url: uploadedImage.url,
      prompt: prompt,
      model: AI_MODELS.gemini_image.name,
      storagePath: uploadedImage.path,
    };
  } catch (error) {
    console.error('[Image Gen] Image generation failed:', error);
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
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
): Promise<GeneratedImage[]> {
  const promises = prompts.map((prompt) =>
    generateImage({ prompt, style, aspectRatio })
  );

  // Generate all images in parallel
  const results = await Promise.allSettled(promises);

  // Extract successful images
  const successfulImages = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<GeneratedImage>).value);

  if (successfulImages.length === 0) {
    throw new Error('Failed to generate any images');
  }

  return successfulImages;
}

/**
 * Generate blog post images (hero + in-article)
 */
export async function generateBlogImages(
  blogTitle: string,
  blogKeywords: string[],
  count: number = 3
): Promise<GeneratedImage[]> {
  const prompts: string[] = [];

  // Base style for all images - NO TEXT!
  const noTextRequirement = 'NO TEXT, NO LETTERS, NO WORDS, NO TYPOGRAPHY on the image. Pure visual, symbolic, abstract or realistic imagery only.';

  // Hero image (always first)
  prompts.push(
    `Hero banner image for blog post titled: "${blogTitle}". Eye-catching, professional, represents the main theme. Mystical and spiritual atmosphere. ${noTextRequirement}`
  );

  // Additional in-article images based on count
  if (count >= 2) {
    prompts.push(
      `Illustrative image representing: ${blogKeywords[0] || blogTitle}. Artistic, symbolic, visually appealing. Suitable for blog article. ${noTextRequirement}`
    );
  }

  if (count >= 3) {
    prompts.push(
      `Supporting visual for article about: ${blogKeywords[1] || blogKeywords[0] || blogTitle}. Elegant, mysterious, professional quality. ${noTextRequirement}`
    );
  }

  if (count >= 4) {
    prompts.push(
      `Conceptual image showing: ${blogKeywords[2] || blogKeywords[1] || 'spirituality'}. Abstract or realistic, high quality, blog-ready. ${noTextRequirement}`
    );
  }

  if (count >= 5) {
    prompts.push(
      `Final supporting image related to: ${blogTitle}. Cohesive with overall blog theme. Professional and polished. ${noTextRequirement}`
    );
  }

  // Generate all images with Gemini 2.5 Flash Image
  return generateImages(
    prompts.slice(0, count),
    'mystical, professional, Bulgarian cultural elements, NO TEXT',
    '16:9'
  );
}
