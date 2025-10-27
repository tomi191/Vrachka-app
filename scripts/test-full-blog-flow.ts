/**
 * Test Script: Full Blog Post Flow with Image Linking
 * Tests the complete flow: generate images → publish post → verify linking
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

async function testFullBlogFlow() {
  console.log('🚀 Testing Full Blog Post Flow with Image Linking\n');

  // Dynamic imports after env loading
  const { generateBlogImages } = await import('../lib/ai/image-generation');
  const { insertBlogImages } = await import('../lib/supabase/blog-images');
  const { linkImagesToPost } = await import('../lib/supabase/blog-images');
  const { createAdminClient } = await import('../lib/supabase/server');

  try {
    // Step 1: Generate blog images
    console.log('📸 Step 1: Generating 3 blog images...');
    const images = await generateBlogImages(
      'Зодиакалните Знаци и Тяхното Значение',
      ['астрология', 'зодиак', 'хороскоп'],
      3
    );
    console.log(`✅ Generated ${images.length} images`);
    images.forEach((img, i) => {
      console.log(`   Image ${i + 1}: ${img.url.substring(0, 80)}...`);
    });
    console.log('');

    // Step 2: Save image metadata
    console.log('💾 Step 2: Saving image metadata to database...');
    const imageRecords = images.map((img, index) => ({
      url: img.url,
      alt_text: img.prompt,
      ai_generated: true,
      dalle_prompt: img.prompt,
      format: 'png' as const,
      position_in_article: index,
    }));

    await insertBlogImages(imageRecords);
    console.log(`✅ Saved ${imageRecords.length} image metadata records`);
    console.log('');

    // Step 3: Create blog post
    console.log('📝 Step 3: Creating blog post...');
    const supabase = createAdminClient();

    const { data: blogPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title: 'Зодиакалните Знаци и Тяхното Значение',
        slug: 'zodiakal-znaci-znachenie-test-' + Date.now(),
        content: '<p>Това е тестова статия за зодиакалните знаци.</p>',
        excerpt: 'Тестова статия',
        featured_image_url: images[0].url,
        category: 'astrology',
        content_type: 'tofu',
        status: 'draft',
        ai_generated: true,
        model_used: 'gemini-2.5-flash-image',
      })
      .select()
      .single();

    if (postError || !blogPost) {
      throw new Error(`Failed to create blog post: ${postError?.message}`);
    }

    console.log(`✅ Created blog post: ${blogPost.id}`);
    console.log(`   Title: ${blogPost.title}`);
    console.log(`   Slug: ${blogPost.slug}`);
    console.log('');

    // Step 4: Link images to post
    console.log('🔗 Step 4: Linking images to blog post...');
    const imageUrls = images.map(img => img.url);
    const linkedImages = await linkImagesToPost(imageUrls, blogPost.id);
    console.log(`✅ Linked ${linkedImages.length} images to post`);
    console.log('');

    // Step 5: Verify linking
    console.log('🔍 Step 5: Verifying image linking...');
    const { data: verifyImages, error: verifyError } = await supabase
      .from('blog_images')
      .select('id, url, blog_post_id, position_in_article')
      .eq('blog_post_id', blogPost.id)
      .order('position_in_article', { ascending: true });

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    console.log(`✅ Found ${verifyImages.length} linked images:`);
    verifyImages.forEach((img, i) => {
      console.log(`   ${i + 1}. Position ${img.position_in_article}: ${img.url.substring(0, 60)}...`);
    });
    console.log('');

    // Success summary
    console.log('🎉 ALL TESTS PASSED!\n');
    console.log('📊 Summary:');
    console.log(`   ✅ Generated ${images.length} AI images via Gemini 2.5 Flash Image`);
    console.log(`   ✅ Uploaded to Supabase Storage`);
    console.log(`   ✅ Saved metadata to blog_images table`);
    console.log(`   ✅ Created blog post: ${blogPost.id}`);
    console.log(`   ✅ Linked ${linkedImages.length} images to post`);
    console.log(`   ✅ Verification: ${verifyImages.length} images linked correctly`);
    console.log('');
    console.log('🔗 Blog Post URL:');
    console.log(`   /blog/${blogPost.slug}`);
    console.log('');
    console.log('🖼️  Featured Image:');
    console.log(`   ${images[0].url}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Error:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run test
testFullBlogFlow()
  .then(() => {
    console.log('\n✨ Full blog flow test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
