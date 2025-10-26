import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateImages } from '@/lib/ai/image-generation';

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
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
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

    console.log(`[Blog Images] Generating ${prompts.length} images with Gemini 2.5 Flash Image (FREE)`);

    // Generate images using FREE Gemini Image model via OpenRouter
    const images = await generateImages(prompts, style, aspectRatio);

    console.log(`[Blog Images] Successfully generated ${images.length}/${prompts.length} images`);

    return NextResponse.json({
      success: true,
      images,
      metadata: {
        total: prompts.length,
        successful: images.length,
        failed: prompts.length - images.length,
        model: 'Gemini 2.5 Flash Image (Free)',
        estimatedCost: '$0.00 (FREE!)',
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
