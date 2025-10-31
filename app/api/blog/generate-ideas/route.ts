import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOpenRouterCompletion } from '@/lib/ai/openrouter';
import { insertBlogIdeas, type BlogIdeaInsert } from '@/lib/supabase/blog-ideas';

function getIdeasGenerationPrompt(): string {
  const currentDate = new Date().toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentYear = new Date().getFullYear();

  return `ДНЕШНА ДАТА: ${currentDate}
ТЕКУЩА ГОДИНА: ${currentYear}

Ти си опитен content strategist и SEO специалист за VRACHKA - водеща българска платформа за астрология, таро и духовност.

ВАЖНО: Всички идеи трябва да са АКТУАЛНИ за ${currentYear}-${currentYear + 1} година!
- Фокусирай се на текущи и предстоящи астрологични събития, транзити, енергии
- Избягвай остарели статии за минали години (2023, 2024)
- Пиши за предстоящи ретроградни планети, новолуния/пълнолуния, сезонни енергии за ${currentYear}-${currentYear + 1}
- Темите трябва да са РЕЛЕВАНТНИ ЗА ХОРАТА ПРЕЗ ${currentYear} ГОДИНА

ТВОЯТА ЗАДАЧА: Генерирай 10 конкретни и привлекателни идеи за blog статии.

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
- tarot - таро, подредби, символика
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
}

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
    const { focus, category, selectedKeyword, batchSize = 10, avoidExisting = true } = body;

    // Fetch existing blog post titles if avoidExisting is true
    let existingTitles = '';
    if (avoidExisting) {
      const { data: existingPosts } = await supabase
        .from('blog_posts')
        .select('title, slug')
        .not('published_at', 'is', null);

      if (existingPosts && existingPosts.length > 0) {
        existingTitles = existingPosts.map(p => p.title).join('\n- ');
      }
    }

    // Build custom prompt based on focus
    let customPrompt = getIdeasGenerationPrompt();

    // Replace default batch size (10) with custom batchSize
    customPrompt = customPrompt.replace(
      'Генерирай 10 КОНКРЕТНИ идеи СЕГА:',
      `Генерирай ${batchSize} КОНКРЕТНИ идеи СЕГА:`
    );

    if (selectedKeyword) {
      customPrompt += `\n\nSEO FOCUS KEYWORD: "${selectedKeyword}"\n`;
      customPrompt += `ЗАДЪЛЖИТЕЛНО включи този keyword в заглавията на идеите!\n`;
      customPrompt += `Генерирай идеи които естествено включват "${selectedKeyword}" в title.\n`;
    }

    if (focus) {
      customPrompt += `\n\nСПЕЦИАЛЕН ФОКУС: ${focus}\n`;
    }

    if (category && category !== 'all') {
      customPrompt += `\nПРИОРИТЕТ КЪМ КАТЕГОРИЯ: ${category}\n`;
    }

    if (existingTitles) {
      customPrompt += `\n\n⚠️ ИЗБЯГВАЙ СЛЕДНИТЕ ТЕМИ (вече имаме статии за тях):\n- ${existingTitles}\n`;
      customPrompt += `Генерирай идеи които са РАЗЛИЧНИ от горните!\n`;
    }

    // Call Claude Haiku (fast and cheap - $0.0002 per request)
    // Dynamic max_tokens based on batchSize (each idea ~150 tokens)
    const maxTokens = Math.min(batchSize * 300, 8000);

    let response;
    try {
      response = await createOpenRouterCompletion({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'user',
            content: customPrompt,
          },
        ],
        temperature: 0.9, // More creative for ideas
        max_tokens: maxTokens,
      });
    } catch (aiError) {
      console.error('OpenRouter API call failed:', aiError);
      return NextResponse.json(
        {
          error: 'AI service error',
          details: aiError instanceof Error ? aiError.message : 'Failed to generate ideas'
        },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!response || !response.choices || !response.choices[0]?.message?.content) {
      console.error('Invalid AI response structure:', response);
      return NextResponse.json(
        { error: 'Invalid AI response - no content returned' },
        { status: 500 }
      );
    }

    // Parse response
    let ideas;
    try {
      const content = response.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const cleanContent = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');

      console.log('[Ideas] Parsing AI response, length:', cleanContent.length);
      ideas = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw response:', response.choices[0]?.message?.content?.substring(0, 500) || 'No content');
      return NextResponse.json(
        {
          error: 'AI response was not valid JSON',
          details: parseError instanceof Error ? parseError.message : 'Parse error'
        },
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

    // Save ideas to database for later use
    try {
      // Build comprehensive generation prompt for tracking
      const generationContext = {
        focus: focus || null,
        category: category !== 'all' ? category : null,
        selectedKeyword: selectedKeyword || null,
        batchSize,
        avoidExisting,
        timestamp: new Date().toISOString(),
      };

      const generationPromptText = [
        selectedKeyword && `SEO Keyword: "${selectedKeyword}"`,
        focus && `Focus: "${focus}"`,
        category && category !== 'all' && `Category: ${category}`,
        `Batch: ${batchSize} ideas`,
        avoidExisting && 'Gap Analysis: Enabled',
      ].filter(Boolean).join(' | ') || 'General ideas generation';

      const ideasToInsert: BlogIdeaInsert[] = ideas.map((idea) => ({
        title: idea.title,
        description: idea.description,
        content_type: idea.contentType,
        category: idea.category,
        keywords: idea.keywords || [],
        target_word_count: idea.targetWordCount || 2000,
        seo_score: idea.estimatedPerformance?.seoScore,
        viral_potential: idea.estimatedPerformance?.viralPotential,
        conversion_potential: idea.estimatedPerformance?.conversionPotential,
        generation_prompt: generationPromptText,
        generated_by: user.id,
      }));

      const savedIdeas = await insertBlogIdeas(ideasToInsert);
      console.log(`[Blog Ideas] Saved ${savedIdeas.length} ideas to database`);

      // Add database IDs to the response
      ideas.forEach((idea, index) => {
        idea.id = savedIdeas[index]?.id;
      });
    } catch (dbError) {
      console.error('[Blog Ideas] Failed to save to database:', dbError);
      // Don't fail the request if database save fails - ideas are still returned
    }

    // Return structured response
    return NextResponse.json({
      success: true,
      ideas: ideas,
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
