import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scanAllPages } from '@/lib/seo/page-scanner';

/**
 * GET /api/admin/seo/pages
 * Returns all pages with their metadata and SEO scores
 */
export async function GET(req: NextRequest) {
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

    // Scan all pages
    console.log('[SEO API] Scanning all pages...');
    const pages = await scanAllPages();
    console.log(`[SEO API] Found ${pages.length} pages`);

    // Sort by score (lowest first - needs attention)
    const sortedPages = pages.sort((a, b) => a.score.totalScore - b.score.totalScore);

    return NextResponse.json({
      success: true,
      pages: sortedPages,
      stats: {
        total: pages.length,
        excellent: pages.filter(p => p.score.totalScore >= 80).length,
        good: pages.filter(p => p.score.totalScore >= 60 && p.score.totalScore < 80).length,
        needsWork: pages.filter(p => p.score.totalScore < 60).length,
        averageScore: pages.reduce((sum, p) => sum + p.score.totalScore, 0) / pages.length,
      },
    });
  } catch (error) {
    console.error('[SEO API] Error scanning pages:', error);
    return NextResponse.json(
      {
        error: 'Failed to scan pages',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
