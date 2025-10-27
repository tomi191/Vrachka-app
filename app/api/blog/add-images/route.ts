import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateBlogImages } from '@/lib/ai/image-generation';

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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Get the blog post
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, keywords, category')
      .eq('slug', slug)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    console.log(`[Blog Images] Generating images for: ${post.title}`);
    console.log(`[Blog Images] Post ID: ${post.id}`);

    // Generate images using Gemini Flash Image and upload to Supabase Storage
    const images = await generateBlogImages(
      post.title,
      post.keywords || [],
      3, // Generate 3 images: hero + 2 in-article
      post.id // Pass blog post ID for storage organization
    );

    console.log(`[Blog Images] Generated ${images.length} images successfully`);
    console.log(`[Blog Images] Images stored in Supabase Storage bucket: blog-images`);

    // Update the blog post with the featured image (first image)
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        featured_image_url: images[0]?.url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (updateError) {
      console.error('Failed to update blog post:', updateError);
      return NextResponse.json(
        { error: 'Failed to update blog post with images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        postId: post.id,
        slug: post.slug,
        featuredImage: images[0]?.url,
        allImages: images.map(img => ({
          url: img.url,
          prompt: img.prompt,
          model: img.model,
          storagePath: img.storagePath,
        })),
        storage: {
          bucket: 'blog-images',
          paths: images.map(img => img.storagePath).filter(Boolean),
        },
      },
      message: `Successfully generated and uploaded ${images.length} AI images to Supabase Storage`,
    });
  } catch (error) {
    console.error('Add images error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
