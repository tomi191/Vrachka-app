import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updatePageMetadata } from '@/lib/seo/page-scanner';
import { calculateSEOScore } from '@/lib/seo/score-calculator';

/**
 * PUT /api/admin/seo/update
 * Update SEO metadata for a page
 *
 * Body: {
 *   pagePath: string,
 *   title?: string,
 *   description?: string,
 *   keywords?: string[],
 *   ogImage?: string
 * }
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const { pagePath, title, description, keywords, ogImage } = body;

    if (!pagePath) {
      return NextResponse.json({ error: 'pagePath is required' }, { status: 400 });
    }

    console.log(`[SEO Update] Updating metadata for: ${pagePath}`);

    // Prepare metadata update
    const metadataUpdate: {
      title?: string;
      description?: string;
      keywords?: string[];
      ogImage?: string;
    } = {};

    if (title) metadataUpdate.title = title;
    if (description) metadataUpdate.description = description;
    if (keywords) metadataUpdate.keywords = keywords;
    if (ogImage) metadataUpdate.ogImage = ogImage;

    // Update page metadata (this modifies the source file)
    await updatePageMetadata(pagePath, metadataUpdate);

    // Calculate new SEO score
    const newScore = calculateSEOScore({
      pagePath,
      title: metadataUpdate.title,
      description: metadataUpdate.description,
      keywords: metadataUpdate.keywords,
      ogImage: metadataUpdate.ogImage,
    });

    console.log(`[SEO Update] Success - new score: ${newScore.totalScore}`);

    return NextResponse.json({
      success: true,
      message: 'Metadata updated successfully',
      newScore: newScore.totalScore,
      scoreBreakdown: newScore,
    });
  } catch (error) {
    console.error('[SEO Update] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update metadata',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
