/**
 * AI Image Generation using Google Gemini 2.5 Flash Image (FREE)
 * Via OpenRouter
 */

import { openai } from './client';
import { getModelForFeature } from './models';

interface ImageGenerationOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
}

/**
 * Generate a single image using Gemini 2.5 Flash Image
 * IMPORTANT: This is FREE via OpenRouter!
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { prompt, style = '', aspectRatio = '16:9' } = options;

  // Get the Gemini Image model
  const model = getModelForFeature('blog_images');

  // Enhance prompt with style and aspect ratio
  const enhancedPrompt = `Generate an image: ${prompt}. ${style ? `Style: ${style}.` : ''} Aspect ratio: ${aspectRatio}. Professional, high-quality, mystical atmosphere. Bulgarian cultural elements if relevant.`;

  try {
    // Call Gemini Image model via OpenRouter
    // NOTE: Gemini Image models return image URLs in the response content
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
      temperature: 0.9, // More creative
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';

    // Extract image URL from response
    // Gemini Image returns URLs in format: ![image](URL) or just the URL
    const urlMatch = content.match(/https?:\/\/[^\s)]+/);
    const imageUrl = urlMatch ? urlMatch[0] : content.trim();

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('No valid image URL returned from Gemini');
    }

    return {
      url: imageUrl,
      prompt: prompt,
      model: 'Gemini 2.5 Flash Image (Free)',
    };
  } catch (error) {
    console.error('Image generation failed:', error);
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

  // Hero image (always first)
  prompts.push(
    `Hero banner image for blog post titled: "${blogTitle}". Eye-catching, professional, represents the main theme. Mystical and spiritual atmosphere.`
  );

  // Additional in-article images based on count
  if (count >= 2) {
    prompts.push(
      `Illustrative image representing: ${blogKeywords[0] || blogTitle}. Artistic, symbolic, visually appealing. Suitable for blog article.`
    );
  }

  if (count >= 3) {
    prompts.push(
      `Supporting visual for article about: ${blogKeywords[1] || blogKeywords[0] || blogTitle}. Elegant, mysterious, professional quality.`
    );
  }

  if (count >= 4) {
    prompts.push(
      `Conceptual image showing: ${blogKeywords[2] || blogKeywords[1] || 'spirituality'}. Abstract or realistic, high quality, blog-ready.`
    );
  }

  if (count >= 5) {
    prompts.push(
      `Final supporting image related to: ${blogTitle}. Cohesive with overall blog theme. Professional and polished.`
    );
  }

  // Generate all images (FREE!)
  return generateImages(
    prompts.slice(0, count),
    'mystical, professional, Bulgarian cultural elements',
    '16:9'
  );
}
