import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { regenerateMetadataWithAI } from '@/lib/seo/ai-regenerator';
import { getPageMetadata } from '@/lib/seo/page-scanner';

export const maxDuration = 60; // 60 seconds for AI generation

/**
 * POST /api/admin/seo/regenerate
 * Regenerate SEO metadata for a page using AI
 *
 * Body: { pagePath: string }
 */
export async function POST(req: NextRequest) {
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
    const { pagePath } = body;

    if (!pagePath) {
      return NextResponse.json({ error: 'pagePath is required' }, { status: 400 });
    }

    console.log(`[SEO Regenerate] Starting regeneration for: ${pagePath}`);

    // Get current page metadata
    const currentPage = await getPageMetadata(pagePath);

    if (!currentPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Regenerate with AI
    const startTime = Date.now();
    const regenerated = await regenerateMetadataWithAI(
      pagePath,
      currentPage.metadata
    );
    const duration = Date.now() - startTime;

    console.log(`[SEO Regenerate] Completed in ${duration}ms`);
    console.log('[SEO Regenerate] Result:', {
      title: regenerated.title,
      descriptionLength: regenerated.description.length,
      keywordsCount: regenerated.keywords.length,
    });

    return NextResponse.json({
      success: true,
      regenerated,
      currentMetadata: currentPage.metadata,
      duration,
    });
  } catch (error) {
    console.error('[SEO Regenerate] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to regenerate metadata',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
