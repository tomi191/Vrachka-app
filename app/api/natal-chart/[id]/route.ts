import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/natal-chart/[id]
 * Retrieve a specific natal chart by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartId = params.id;

    // Fetch natal chart (RLS will ensure user owns this chart)
    const { data: chart, error } = await supabase
      .from('natal_charts')
      .select('*')
      .eq('id', chartId)
      .single();

    if (error || !chart) {
      return NextResponse.json(
        { error: 'Natal chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      chart,
    });
  } catch (error) {
    console.error('[Natal Chart] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch natal chart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/natal-chart/[id]
 * Delete a specific natal chart
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartId = params.id;

    // Delete natal chart (RLS will ensure user owns this chart)
    const { error } = await supabase
      .from('natal_charts')
      .delete()
      .eq('id', chartId);

    if (error) {
      console.error('[Natal Chart] Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete natal chart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Natal chart deleted successfully',
    });
  } catch (error) {
    console.error('[Natal Chart] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete natal chart' },
      { status: 500 }
    );
  }
}
