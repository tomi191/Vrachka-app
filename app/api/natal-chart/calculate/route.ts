import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateNatalChart, validateBirthData } from '@/lib/astrology/natal-chart';
import { generateNatalChartInterpretation } from '@/lib/astrology/interpretations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/natal-chart/calculate
 * Calculate and save natal chart for authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, trial_tier, subscription_tier')
      .eq('id', user.id)
      .single();

    // Check if user has Ultimate plan (or trial)
    const userPlan = profile?.trial_tier || profile?.subscription_tier || 'free';
    if (userPlan !== 'ultimate') {
      return NextResponse.json(
        {
          error: 'Natal chart feature is available only for Ultimate plan users',
          upgrade_required: true,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { birthDate, birthTime, location } = body;

    // Validate input
    const birthData = {
      date: birthDate,
      time: birthTime,
      latitude: location?.latitude,
      longitude: location?.longitude,
      timezone: location?.timezone,
    };

    const validation = validateBirthData(birthData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid birth data', details: validation.errors },
        { status: 400 }
      );
    }

    // Check if chart already exists for this birth data
    const { data: existingCharts } = await supabase
      .from('natal_charts')
      .select('id')
      .eq('user_id', user.id)
      .eq('birth_date', birthDate)
      .eq('birth_time', birthTime);

    if (existingCharts && existingCharts.length > 0) {
      return NextResponse.json(
        {
          error: 'Natal chart already exists for this birth data',
          chart_id: existingCharts[0].id,
        },
        { status: 409 }
      );
    }

    // Calculate natal chart
    console.log('[Natal Chart] Calculating chart for user:', user.id);
    const chart = await calculateNatalChart(birthData);

    // Generate AI interpretation
    console.log('[Natal Chart] Generating AI interpretation...');
    const firstName = profile?.full_name?.split(' ')[0];
    const interpretation = await generateNatalChartInterpretation(chart, firstName);

    // Save to database
    const { data: savedChart, error: saveError } = await supabase
      .from('natal_charts')
      .insert({
        user_id: user.id,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_location: {
          city: location.city,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: location.timezone,
        },
        chart_data: chart,
        interpretation: interpretation,
        interpretation_generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Natal Chart] Database error:', saveError);
      return NextResponse.json(
        { error: 'Failed to save natal chart' },
        { status: 500 }
      );
    }

    console.log('[Natal Chart] Chart saved successfully:', savedChart.id);

    return NextResponse.json({
      success: true,
      chart_id: savedChart.id,
      chart: chart,
      interpretation: interpretation,
    });
  } catch (error) {
    console.error('[Natal Chart] Calculation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to calculate natal chart',
      },
      { status: 500 }
    );
  }
}
