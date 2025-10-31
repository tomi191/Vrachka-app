import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { linkImagesToPost } from '@/lib/supabase/blog-images';

export async function POST(request: Request) {
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
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      keywords,
      category,
      contentType,
      readingTime,
      wordCount,
      status,
      featuredImageUrl,
      imageUrls,
      tags,
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    // IMPORTANT: Keep markers as placeholders in content (don't replace them here)
    // The display page will handle dynamic replacement using image_urls array
    // This allows flexibility for image updates without re-generating content

    // Insert blog post
    const { data: blogPost, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
            title,
            slug,
            content: content, // Store with markers intact
            excerpt: excerpt || null,
            featured_image_url: featuredImageUrl || (imageUrls && imageUrls.length > 0 ? imageUrls[0] : null),
            image_urls: imageUrls || [], // Store image URLs array for dynamic replacement
            meta_title: metaTitle || title,
            meta_description: metaDescription || excerpt || null,
        keywords: keywords || [],
        tags: tags || [],
        category: category || 'general',
        content_type: contentType || 'tofu',
        reading_time: readingTime || null,
        word_count: wordCount || null,
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
        ai_generated: true,
        model_used: 'google/gemini-2.5-pro',
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save blog post', details: insertError.message },
        { status: 500 }
      );
    }

    // Generate JSON-LD schema (for SEO)
    const schemaMarkup = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: metaDescription || excerpt,
      author: {
        '@type': 'Organization',
        name: 'Vrachka',
        url: 'https://vrachka.eu',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vrachka',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vrachka.eu/logo.svg',
        },
      },
      datePublished: blogPost.published_at || blogPost.created_at,
      dateModified: blogPost.updated_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://vrachka.eu/blog/${slug}`,
      },
    };

    // Update with schema markup
    await supabase
      .from('blog_posts')
      .update({ schema_markup: schemaMarkup })
      .eq('id', blogPost.id);

    // Link generated images to this blog post
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      try {
        await linkImagesToPost(imageUrls, blogPost.id);
        console.log(`[Blog Publish] Linked ${imageUrls.length} images to post ${blogPost.id}`);
      } catch (linkError) {
        console.error('[Blog Publish] Failed to link images:', linkError);
        // Don't fail the whole request if linking fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: blogPost.id,
        slug: blogPost.slug,
        status: blogPost.status,
        publishedAt: blogPost.published_at,
        url: `/blog/${blogPost.slug}`,
      },
      message: status === 'published' ? 'Blog post published successfully' : 'Blog post saved as draft',
    });
  } catch (error) {
    console.error('Blog publish error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
