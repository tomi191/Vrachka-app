import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBlogIdeas, getBlogIdeasCountByCategory } from '@/lib/supabase/blog-ideas';

export async function GET(req: NextRequest) {
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

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get ideas with filters
    const ideas = await getBlogIdeas({
      category: category === 'all' ? undefined : category,
      status,
      limit,
    });

    // Get counts by category for the sidebar
    const counts = await getBlogIdeasCountByCategory();

    return NextResponse.json({
      success: true,
      ideas,
      counts,
      metadata: {
        total: ideas.length,
        category,
        status,
      },
    });
  } catch (error) {
    console.error('List blog ideas error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
