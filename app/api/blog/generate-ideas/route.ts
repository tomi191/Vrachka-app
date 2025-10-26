import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOpenRouterCompletion } from '@/lib/ai/openrouter';

const IDEAS_GENERATION_PROMPT = `Ти си опитен content strategist и SEO специалист за VRACHKA - водеща българска платформа за астрология, таро и духовност.

ТВОЯТА ЗАДАЧА: Генерирай 10 конкретни и привлек атели идеи за blog статии.

ИЗИСКВАНИЯ ЗА ВСЯКА ИДЕЯ:
1. **Заглавие** (50-60 символа):
   - Започни с число, въпрос, или "Как да"
   - Включи benefit или hook
   - Използвай FOMO, любопитство или practical value

2. **Описание** (100-150 думи):
   - Обясни защо е интересна темата
   - Кого целим (начинаещи, напреднали, скептици)
   - Какъв проблем решава

3. **Content Type**:
   - TOFU (awareness) - образователно
   - MOFU (consideration) - how-to guides
   - BOFU (conversion) - comparison, reviews
   - Advertorial - storytelling + conversion

4. **SEO Keywords** (5-7 keyword phrases):
   - Primary keyword с висок search volume
   - 4-6 related/long-tail keywords
   - Използвай български думи и фрази

5. **Target Word Count**:
   - TOFU: 1500-2500
   - MOFU: 2000-3500
   - BOFU: 1200-2000
   - Advertorial: 800-1500

6. **Estimated Performance**:
   - SEO Score (1-10): Базирано на keyword competition + search volume
   - Viral Potential (1-10): Shareability + emotional appeal
   - Conversion Potential (1-10): Колко вероятно е да доведе до subscription

КАТЕГОРИИ (избери най-подходящата):
- astrology - астрология, планети, транзити, натални карти
- tarot - таро, разклади, символика
- numerology - числа, дати, съдбоносни дни
- spirituality - медитация, чакри, енергия
- general - общи теми за всички

ВАЖНО:
- Всяка идея трябва да е УНИКАЛНА
- Избягвай generic titles като "Въведение в..."
- Фокусирай се на КОНКРЕТНИ проблеми/въпроси
- Използвай български език и културни референции
- Mix-вай content types за variety

OUTPUT FORMAT:
Върни САМО valid JSON array без markdown:
[
  {
    "title": "Заглавие на идеята",
    "description": "Детайлно описание на идеята и защо е valuable",
    "contentType": "tofu|mofu|bofu|advertorial",
    "category": "astrology|tarot|numerology|spirituality|general",
    "keywords": ["primary keyword", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
    "targetWordCount": 2000,
    "estimatedPerformance": {
      "seoScore": 8,
      "viralPotential": 7,
      "conversionPotential": 6
    }
  }
]

Генерирай 10 КОНКРЕТНИ идеи СЕГА:`;

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
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { focus, category } = body;

    // Build custom prompt based on focus
    let customPrompt = IDEAS_GENERATION_PROMPT;
    if (focus) {
      customPrompt += `\n\nСПЕЦИАЛЕН ФОКУС: ${focus}\n`;
    }
    if (category && category !== 'all') {
      customPrompt += `\nПРИОРИТЕТ КЪМ КАТЕГОРИЯ: ${category}\n`;
    }

    // Call Gemini Free (no cost!)
    const response = await createOpenRouterCompletion({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'user',
          content: customPrompt,
        },
      ],
      temperature: 0.9, // More creative for ideas
      max_tokens: 4000,
    });

    // Parse response
    let ideas;
    try {
      const content = response.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const cleanContent = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
      ideas = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw response:', response.choices[0]?.message?.content?.substring(0, 500) || 'No content');
      return NextResponse.json(
        { error: 'AI response was not valid JSON' },
        { status: 500 }
      );
    }

    // Validate ideas structure
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return NextResponse.json(
        { error: 'No ideas generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ideas,
      metadata: {
        count: ideas.length,
        model: 'Gemini 2.0 Flash (Free)',
        cost: 0,
      },
    });
  } catch (error) {
    console.error('Blog ideas generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
