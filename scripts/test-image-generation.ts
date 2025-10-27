/**
 * Test Script: Blog Image Generation
 * Tests Gemini 2.5 Flash Image generation and Supabase Storage upload
 *
 * Run with: npx tsx scripts/test-image-generation.ts
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

const envPath = resolve(__dirname, '../.env.local');
console.log('📂 Loading environment from:', envPath);
config({ path: envPath });

// Verify environment variables
console.log('🔍 Checking environment variables...');
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY is not set!');
  console.error('   Please set it in .env.local file');
  process.exit(1);
}
console.log('✅ OPENROUTER_API_KEY found');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set!');
  process.exit(1);
}
console.log('✅ NEXT_PUBLIC_SUPABASE_URL found');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set!');
  process.exit(1);
}
console.log('✅ SUPABASE_SERVICE_ROLE_KEY found');
console.log('');

async function testImageGeneration() {
  console.log('🚀 Starting image generation test...\n');

  // Dynamic imports AFTER env vars are loaded
  const { generateImage } = await import('../lib/ai/image-generation');
  const { insertBlogImage } = await import('../lib/supabase/blog-images');

  try {
    // Test 1: Generate a single image
    console.log('📸 Test 1: Generating single test image...');
    const image = await generateImage({
      prompt: 'A mystical Bulgarian scene with zodiac symbols floating in a starry night sky over a mountain landscape. Professional, spiritual, blog-ready image.',
      style: 'mystical, professional, Bulgarian cultural elements',
      aspectRatio: '16:9',
    });

    console.log('✅ Image generated successfully!');
    console.log('   URL:', image.url);
    console.log('   Model:', image.model);
    console.log('   Storage Path:', image.storagePath);
    console.log('   Prompt:', image.prompt.substring(0, 50) + '...');
    console.log('');

    // Test 2: Save metadata to database
    console.log('💾 Test 2: Saving image metadata to database...');
    const dbRecord = await insertBlogImage({
      url: image.url,
      alt_text: image.prompt,
      ai_generated: true,
      dalle_prompt: image.prompt,
      format: 'png',
      position_in_article: 0, // Hero image
    });

    console.log('✅ Metadata saved successfully!');
    console.log('   Database ID:', dbRecord.id);
    console.log('   Created at:', dbRecord.created_at);
    console.log('');

    // Summary
    console.log('🎉 All tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Image generation via Gemini 2.5 Flash Image');
    console.log('   ✅ Upload to Supabase Storage (blog-images bucket)');
    console.log('   ✅ Metadata saved to blog_images table');
    console.log('\n🔗 Test Image URL:');
    console.log('   ', image.url);

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run test
testImageGeneration()
  .then(() => {
    console.log('\n✨ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  });
