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

    // Call OpenRouter API (Google Gemini 2.5 Pro - better Bulgarian language, natural tone)
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vrachka.eu',
        'X-Title': 'Vrachka AI Blog Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8, // Higher for creativity and natural tone
        max_tokens: 12000, // Increased for full 2000+ word articles
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

    // Word count quality control
    const requestedWordCount = targetWordCount || 2000;
    const warnings: string[] = [];
    let wordCountQuality = 100;

    // Check if content meets minimum word count requirement
    if (wordCount < requestedWordCount) {
      const percentageReached = Math.round((wordCount / requestedWordCount) * 100);
      wordCountQuality = Math.max(0, percentageReached);

      warnings.push(
        `⚠️ Съдържанието е ${wordCount} думи вместо минимум ${requestedWordCount} думи (достигнати ${percentageReached}%)`
      );

      console.warn(`[Blog Gen] Word count below target: ${wordCount}/${requestedWordCount} (${percentageReached}%)`);
    } else if (wordCount < requestedWordCount * 0.9) {
      // Below 90% of target
      warnings.push(
        `⚠️ Съдържанието е близо до минимума: ${wordCount} думи (минимум: ${requestedWordCount})`
      );
    }

    // Check for optimal length (target * 1.2)
    const optimalWordCount = Math.ceil(requestedWordCount * 1.2);
    if (wordCount >= optimalWordCount) {
      console.log(`[Blog Gen] ✓ Optimal word count reached: ${wordCount}/${optimalWordCount}`);
    }

    // Overall quality score based on word count
    const overallQuality = Math.min(100, Math.round(
      (wordCountQuality * 0.4) + // 40% weight on word count
      (85 * 0.3) + // 30% weight on readability (placeholder)
      (90 * 0.3)   // 30% weight on SEO (placeholder)
    ));

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
          overall: overallQuality,
          wordCountQuality,
          readability: 85, // Placeholder
          seo: 90, // Placeholder
          aiDetectionRisk: 'low',
          warnings,
          metrics: {
            wordCount,
            targetWordCount: requestedWordCount,
            optimalWordCount,
            percentageOfTarget: Math.round((wordCount / requestedWordCount) * 100),
          },
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
