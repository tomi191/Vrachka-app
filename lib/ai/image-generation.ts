/**
 * Blog Image Generation using Unsplash API (FREE)
 * High-quality stock photos perfect for blog posts
 */

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
 * Generate a single image using Unsplash API
 * IMPORTANT: This is FREE!
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { prompt } = options;

  try {
    // Extract keywords from prompt for better Unsplash search
    const keywords = prompt
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter((word) => word.length > 3)
      .slice(0, 3)
      .join(',');

    // Fallback to general mystical/spiritual keywords if extraction fails
    const searchQuery = keywords || 'mystical,spiritual,astrology';

    // Use Unsplash Source API for random high-quality images
    // This is completely FREE and doesn't require an API key for basic usage
    const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchQuery)}`;

    return {
      url: unsplashUrl,
      prompt: prompt,
      model: 'Unsplash (Free Stock Photos)',
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
