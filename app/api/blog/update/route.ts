import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
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
    const {
      id,
      title,
      slug,
      content,
      excerpt,
      featuredImageUrl,
      metaTitle,
      metaDescription,
      keywords,
      tags,
      category,
      contentType,
      status,
    } = body;

    // Validation
    if (!id || !title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, slug, content' },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current post)
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: `Slug "${slug}" already exists. Please choose a different slug.` },
        { status: 400 }
      );
    }

    // Calculate word count from content
    const textContent = content.replace(/<[^>]*>/g, ' ');
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Update blog post
    const { data: blogPost, error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featured_image_url: featuredImageUrl || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || null,
        keywords: keywords || [],
        tags: tags || [],
        category: category || 'general',
        content_type: contentType || 'tofu',
        status: status || 'draft',
        reading_time: readingTime,
        word_count: wordCount,
        updated_at: new Date().toISOString(),
        published_at: status === 'published' && !existingPost ? new Date().toISOString() : undefined,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update blog post', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: blogPost.id,
        slug: blogPost.slug,
        status: blogPost.status,
        updatedAt: blogPost.updated_at,
      },
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
