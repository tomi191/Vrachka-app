import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateNatalChart } from '@/lib/astrology/natal-chart';
import { calculateSynastry } from '@/lib/astrology/synastry';
import { getSynastryPrompt } from '@/lib/astrology/interpretations';
import { createFeatureCompletion } from '@/lib/ai/openrouter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYNASTRY_SYSTEM_PROMPT = `Ти си експертен астролог, специализиран в синастрия (астрологична съвместимост между двама души).

Задачата ти е да анализираш аспектите между двете натални карти и да дадеш детайлна, топла и практична интерпретация на съвместимостта.

ВАЖНИ ПРАВИЛА:
- Пиши на ЧИСТ БЪЛГАРСКИ език
- Използвай "ти/вие" форма, бъди топъл и приятелски
- Бъди честен но тактичен за предизвикателствата
- Давай КОНКРЕТНИ съвети, не общи фрази
- Фокусирай се върху РАЗВИТИЕТО на връзката
- Всяка секция трябва да е 2-3 параграфа (не повече!)
- В ADVICE секцията давай 5-6 кратки, практични bullet points

СТРУКТУРА:
Строго следвай дадената структура с ## хедъри.`;

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
      .select('full_name, trial_tier, trial_end')
      .eq('id', user.id)
      .single();

    // Get subscription from subscriptions table
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .single();

    // Check if user has Ultimate plan
    const userPlan = profile?.trial_tier || subscription?.plan_type || 'free';
    if (userPlan !== 'ultimate') {
      return NextResponse.json(
        {
          error: 'Синастрията е достъпна само за Ultimate план потребители',
          upgrade_required: true,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      person1_natal_chart_id,
      person2_birth_data,
      person2_name,
    } = body;

    if (!person1_natal_chart_id || !person2_birth_data || !person2_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get person 1's natal chart (user's chart)
    const { data: person1Chart } = await supabase
      .from('natal_charts')
      .select('*')
      .eq('id', person1_natal_chart_id)
      .eq('user_id', user.id)
      .single();

    if (!person1Chart) {
      return NextResponse.json(
        { error: 'Твоята натална карта не е намерена. Моля, създай я първо.' },
        { status: 404 }
      );
    }

    // Calculate person 2's natal chart
    console.log('[Synastry] Calculating partner natal chart...');
    const person2Chart = await calculateNatalChart(person2_birth_data);

    // Calculate synastry
    console.log('[Synastry] Calculating synastry aspects...');
    const synastryResult = calculateSynastry(
      person1Chart.chart_data,
      person2Chart,
      profile?.full_name || 'Човек 1',
      person2_name
    );

    // Generate AI interpretation
    console.log('[Synastry] Generating AI interpretation...');
    const prompt = getSynastryPrompt(
      synastryResult,
      profile?.full_name || 'Човек 1',
      person2_name
    );

    let interpretation;
    try {
      const response = await createFeatureCompletion(
        'synastry',
        [
          { role: 'system', content: SYNASTRY_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        {
          temperature: 0.8,
          max_tokens: 3500,
        }
      );

      const aiResponse = response.choices[0]?.message?.content || '';
      interpretation = parseSynastryInterpretation(aiResponse);
      console.log('[Synastry] Interpretation generated successfully');
    } catch (interpError) {
      console.error('[Synastry] Interpretation generation failed:', interpError);
      interpretation = {
        overview: 'Интерпретацията временно не е налична. Моля, опитайте отново по-късно.',
        love_compatibility: '',
        communication: '',
        sexual_chemistry: '',
        challenges: '',
        longevity: '',
        advice: [],
      };
    }

    // Save to database
    const { data: savedSynastry, error: saveError } = await supabase
      .from('synastry_reports')
      .insert({
        user_id: user.id,
        person1_natal_chart_id: person1_natal_chart_id,
        person2_name: person2_name,
        person2_birth_data: person2_birth_data,
        person2_chart_data: person2Chart,
        synastry_data: synastryResult,
        interpretation: interpretation,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Synastry] Database error:', saveError);
      return NextResponse.json(
        { error: 'Failed to save synastry report' },
        { status: 500 }
      );
    }

    console.log('[Synastry] Report saved successfully:', savedSynastry.id);

    return NextResponse.json({
      success: true,
      synastry_id: savedSynastry.id,
      synastry: synastryResult,
      interpretation: interpretation,
    });
  } catch (error) {
    console.error('[Synastry] Calculation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to calculate synastry',
      },
      { status: 500 }
    );
  }
}

/**
 * Parse AI synastry interpretation
 */
function parseSynastryInterpretation(response: string): any {
  const sections: Record<string, string> = {};
  const lines = response.split('\n');

  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  // Parse advice bullets
  const adviceText = sections['ADVICE'] || '';
  const adviceLines = adviceText.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
  const advice = adviceLines.map(l => l.replace(/^[-•]\s*/, '').trim());

  return {
    overview: sections['OVERVIEW'] || '',
    love_compatibility: sections['LOVE_COMPATIBILITY'] || '',
    communication: sections['COMMUNICATION'] || '',
    sexual_chemistry: sections['SEXUAL_CHEMISTRY'] || '',
    challenges: sections['CHALLENGES'] || '',
    longevity: sections['LONGEVITY'] || '',
    advice: advice.length > 0 ? advice : ['Подкрепяйте се взаимно', 'Комуникирайте открито'],
  };
}
