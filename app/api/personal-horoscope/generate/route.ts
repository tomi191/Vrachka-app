import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalHoroscope } from '@/lib/astrology/transits';
import { createFeatureCompletion } from '@/lib/ai/openrouter';
import {
  getPersonalHoroscopePrompt,
  PERSONAL_HOROSCOPE_SYSTEM_PROMPT
} from '@/lib/astrology/interpretations';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const { natal_chart_id, forecast_type } = await req.json();

    if (!natal_chart_id || !forecast_type) {
      return NextResponse.json(
        { error: 'natal_chart_id и forecast_type са задължителни' },
        { status: 400 }
      );
    }

    if (forecast_type !== 'monthly' && forecast_type !== 'yearly') {
      return NextResponse.json(
        { error: 'forecast_type трябва да е "monthly" или "yearly"' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, trial_tier')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Профилът не е намерен' },
        { status: 404 }
      );
    }

    // Get subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .single();

    // Check if user has Ultimate plan
    const userPlan = profile.trial_tier || subscription?.plan_type || 'free';
    if (userPlan !== 'ultimate') {
      return NextResponse.json(
        { error: 'Личният хороскоп е достъпен само за Ultimate план потребители' },
        { status: 403 }
      );
    }

    // Get user's natal chart
    const { data: natalChart, error: chartError } = await supabase
      .from('natal_charts')
      .select('*')
      .eq('id', natal_chart_id)
      .eq('user_id', user.id)
      .single();

    if (chartError || !natalChart) {
      return NextResponse.json(
        { error: 'Натална карта не е намерена' },
        { status: 404 }
      );
    }

    console.log(`[Personal Horoscope] Generating ${forecast_type} forecast for user ${user.id}`);

    // Generate personal horoscope with transits
    const horoscopeData = generatePersonalHoroscope(
      profile.full_name || 'Човек',
      natalChart.chart_data,
      forecast_type
    );

    console.log(`[Personal Horoscope] Calculated ${horoscopeData.transits.length} transits`);

    // Generate AI interpretation
    const response = await createFeatureCompletion(
      'personal_horoscope',
      [
        { role: 'system', content: PERSONAL_HOROSCOPE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: getPersonalHoroscopePrompt(
            horoscopeData,
            profile.full_name || 'Човек',
            forecast_type
          )
        },
      ],
      {
        temperature: 0.8,
        max_tokens: 4000,
      }
    );

    const interpretation = response.choices[0].message.content;

    console.log('[Personal Horoscope] AI interpretation generated');

    // Parse interpretation into structured format
    const parsedInterpretation = parsePersonalHoroscopeInterpretation(interpretation);

    // Save to database
    const { data: savedHoroscope, error: saveError } = await supabase
      .from('personal_horoscopes')
      .insert({
        user_id: user.id,
        natal_chart_id,
        forecast_type,
        start_date: horoscopeData.start_date.toISOString(),
        end_date: horoscopeData.end_date.toISOString(),
        transits_data: horoscopeData.transits,
        current_planets: horoscopeData.current_planets,
        themes: horoscopeData.themes,
        highlights: horoscopeData.highlights,
        challenges: horoscopeData.challenges,
        opportunities: horoscopeData.opportunities,
        interpretation: parsedInterpretation,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Personal Horoscope] Database save error:', saveError);
      return NextResponse.json(
        { error: 'Грешка при запазване на хороскопа' },
        { status: 500 }
      );
    }

    console.log('[Personal Horoscope] Saved to database:', savedHoroscope.id);

    return NextResponse.json({
      success: true,
      horoscope_id: savedHoroscope.id,
      horoscope: {
        ...horoscopeData,
        interpretation: parsedInterpretation,
      },
    });

  } catch (error) {
    console.error('[Personal Horoscope API] Error:', error);
    return NextResponse.json(
      { error: 'Възникна грешка при генерирането на хороскопа' },
      { status: 500 }
    );
  }
}

/**
 * Parse AI response into structured personal horoscope interpretation
 */
function parsePersonalHoroscopeInterpretation(response: string): any {
  const sections: Record<string, string> = {};
  const lines = response.split('\n');

  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if it's a section header
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }

      // Start new section
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  // Extract bullet points from ADVICE section
  const adviceContent = sections['ADVICE'] || '';
  const advice = adviceContent
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().replace(/^-\s*/, ''));

  // Extract key dates
  const keyDatesContent = sections['KEY_DATES'] || '';
  const keyDates = keyDatesContent
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().replace(/^-\s*/, ''));

  return {
    overview: sections['OVERVIEW'] || 'Интерпретация не е налична.',
    career: sections['CAREER'] || '',
    love: sections['LOVE'] || '',
    health: sections['HEALTH'] || '',
    finances: sections['FINANCES'] || '',
    personal_growth: sections['PERSONAL_GROWTH'] || '',
    key_dates: keyDates,
    advice,
  };
}
