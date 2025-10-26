import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import {
  getBlogGenerationPrompt,
  parseAIBlogResponse,
  generateSlug,
  calculateReadingTime,
  calculateWordCount,
} from '@/lib/ai/blog-prompts';

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { topic, keywords, contentType, category, targetWordCount } = body;

    // Validation
    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!contentType || !['tofu', 'mofu', 'bofu', 'advertorial'].includes(contentType)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!category || !['astrology', 'tarot', 'numerology', 'spirituality', 'general'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Generate prompt
    const prompt = getBlogGenerationPrompt({
      topic,
      keywords: keywords || [],
      contentType,
      category,
      targetWordCount: targetWordCount || 2000,
    });

    // Call OpenRouter API (Claude 3.5 Sonnet)
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vrachka.bg',
        'X-Title': 'Vrachka AI Blog Generator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8, // Higher for creativity
        max_tokens: 8000, // Enough for long articles
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'AI generation failed', details: errorData },
        { status: 500 }
      );
    }

    const openRouterData = await openRouterResponse.json();
    const aiResponse = openRouterData.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
    }

    // Parse AI response
    const parsed = parseAIBlogResponse(aiResponse);

    // Calculate metrics
    const wordCount = calculateWordCount(parsed.content);
    const readingTime = calculateReadingTime(parsed.content);
    const suggestedSlug = generateSlug(parsed.title);

    // Calculate generation time
    const generationTime = Math.round((Date.now() - startTime) / 1000);

    // Return structured response
    return NextResponse.json({
      success: true,
      data: {
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        readingTime,
        wordCount,
        suggestedSlug,
        seoMetadata: {
          metaTitle: parsed.metaTitle,
          metaDescription: parsed.metaDescription,
          keywords: parsed.keywords,
        },
        qualityScore: {
          overall: 85, // TODO: Implement actual quality scoring
          readability: 80,
          seo: 90,
          aiDetectionRisk: 'low',
          warnings: [],
        },
      },
      generationTime,
      model: 'claude-3.5-sonnet',
    });
  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
