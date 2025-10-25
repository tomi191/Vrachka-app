import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/natal-chart/list
 * List all natal charts for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all natal charts for user (RLS enforced)
    const { data: charts, error } = await supabase
      .from('natal_charts')
      .select('id, birth_date, birth_time, birth_location, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Natal Chart] List error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch natal charts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      charts: charts || [],
      count: charts?.length || 0,
    });
  } catch (error) {
    console.error('[Natal Chart] List error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch natal charts' },
      { status: 500 }
    );
  }
}
