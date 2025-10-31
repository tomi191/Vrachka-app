import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpdumthwuahkuaggilpz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZHVtdGh3dWFoa3VhZ2dpbHB6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM2MTY3NywiZXhwIjoyMDc1OTM3Njc3fQ.AW3rYwgNTE6yE_6YkAFSTi7DKquNTjaD4jpGb7aiomU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

console.log('🚀 Starting blog migration...\n');

// Step 1: Get all blog posts with their images
console.log('📊 Step 1: Fetching blog posts and images...');
const { data: posts, error: postsError } = await supabase
  .from('blog_posts')
  .select('id, title, content, slug');

if (postsError) {
  console.error('❌ Error fetching posts:', postsError);
  process.exit(1);
}

console.log(`✅ Found ${posts.length} blog posts\n`);

// Step 2: Update each post
for (const post of posts) {
  console.log(`\n📝 Processing: "${post.title}"`);

  // Get images for this post
  const { data: images, error: imagesError } = await supabase
    .from('blog_images')
    .select('url')
    .eq('blog_post_id', post.id)
    .order('position_in_article');

  if (imagesError) {
    console.error(`  ❌ Error fetching images:`, imagesError);
    continue;
  }

  const imageUrls = images.map(img => img.url);
  console.log(`  📸 Found ${imageUrls.length} images`);

  // Update content: Replace old markers with new format
  let updatedContent = post.content;

  // Replace <!-- IMAGE_2 --> with <!-- IMAGE:1 -->
  updatedContent = updatedContent.replace(/<!--\s*IMAGE_2\s*-->/g, '<!-- IMAGE:1 -->');

  // Replace <!-- IMAGE_3 --> with <!-- IMAGE:2 -->
  updatedContent = updatedContent.replace(/<!--\s*IMAGE_3\s*-->/g, '<!-- IMAGE:2 -->');

  const markersUpdated = updatedContent !== post.content;

  // Update the post with image_urls array and updated content
  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({
      image_urls: imageUrls,
      content: updatedContent
    })
    .eq('id', post.id);

  if (updateError) {
    console.error(`  ❌ Error updating post:`, updateError);
    continue;
  }

  console.log(`  ✅ Updated image_urls (${imageUrls.length} URLs)`);
  if (markersUpdated) {
    console.log(`  ✅ Updated markers to new format (IMAGE:1, IMAGE:2)`);
  } else {
    console.log(`  ℹ️  No old markers found (already using new format or no markers)`);
  }
}

// Step 3: Verify
console.log('\n\n🔍 Verification:\n');
const { data: verifyPosts, error: verifyError } = await supabase
  .from('blog_posts')
  .select('title, image_urls, content')
  .not('image_urls', 'is', null);

if (verifyError) {
  console.error('❌ Verification error:', verifyError);
  process.exit(1);
}

console.log(`✅ ${verifyPosts.length} posts with image_urls:\n`);
verifyPosts.forEach(post => {
  const hasNewMarkers = post.content.includes('<!-- IMAGE:1 -->') || post.content.includes('<!-- IMAGE:2 -->');
  const hasOldMarkers = post.content.includes('<!-- IMAGE_2 -->') || post.content.includes('<!-- IMAGE_3 -->');

  console.log(`  📄 ${post.title}`);
  console.log(`     - Images: ${post.image_urls?.length || 0}`);
  console.log(`     - New markers (IMAGE:X): ${hasNewMarkers ? '✅' : '❌'}`);
  console.log(`     - Old markers (IMAGE_X): ${hasOldMarkers ? '⚠️ FOUND' : '✅ Clean'}`);
  console.log('');
});

console.log('✨ Migration completed successfully!\n');
process.exit(0);
