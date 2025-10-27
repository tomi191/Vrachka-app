import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateImages } from '@/lib/ai/image-generation';
import { insertBlogImages } from '@/lib/supabase/blog-images';

interface ImageGenerationRequest {
  prompts: string[];
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  style?: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth + admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: ImageGenerationRequest = await req.json();
    const { prompts, aspectRatio = '16:9', style = '' } = body;

    if (!prompts || prompts.length === 0) {
      return NextResponse.json(
        { error: 'No prompts provided' },
        { status: 400 }
      );
    }

    console.log(`[Blog Images] Generating ${prompts.length} images with Gemini 2.5 Flash Image via OpenRouter`);

    // Generate images using Gemini 2.5 Flash Image via OpenRouter
    // Images are uploaded to Supabase Storage and public URLs are returned
    const images = await generateImages(prompts, style, aspectRatio);

    console.log(`[Blog Images] Successfully generated and uploaded ${images.length}/${prompts.length} images to Supabase Storage`);

    // Save image metadata to blog_images table
    try {
      const imageRecords = images.map((img, index) => ({
        url: img.url,
        alt_text: img.prompt,
        ai_generated: true,
        dalle_prompt: img.prompt,
        format: 'png', // Gemini typically returns PNG
        position_in_article: index, // 0 = hero, 1+ = in-article
      }));

      await insertBlogImages(imageRecords);
      console.log(`[Blog Images] Saved ${imageRecords.length} image metadata records to database`);
    } catch (dbError) {
      console.error('[Blog Images] Failed to save image metadata:', dbError);
      // Don't fail the request if database save fails - images are already generated
    }

    // Calculate estimated cost (rough estimate)
    const estimatedCost = images.length * 0.03; // ~$0.03 per image

    return NextResponse.json({
      success: true,
      images,
      metadata: {
        total: prompts.length,
        successful: images.length,
        failed: prompts.length - images.length,
        model: 'Gemini 2.5 Flash Image',
        estimatedCost: `$${estimatedCost.toFixed(2)}`,
        storage: 'Supabase Storage (blog-images bucket)',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
