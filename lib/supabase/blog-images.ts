/**
 * Blog Images Database Service
 * Handles blog_images table operations
 */

import { createAdminClient } from './server';

export interface BlogImageInsert {
  blog_post_id?: string;
  url: string;
  alt_text?: string;
  caption?: string;
  ai_generated: boolean;
  dalle_prompt?: string;
  width?: number;
  height?: number;
  file_size?: number;
  format?: string;
  position_in_article?: number;
}

/**
 * Insert blog image metadata into database
 */
export async function insertBlogImage(image: BlogImageInsert) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_images')
    .insert(image)
    .select()
    .single();

  if (error) {
    console.error('Failed to insert blog image:', error);
    throw new Error(`Failed to insert blog image: ${error.message}`);
  }

  return data;
}

/**
 * Insert multiple blog images in batch
 */
export async function insertBlogImages(images: BlogImageInsert[]) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_images')
    .insert(images)
    .select();

  if (error) {
    console.error('Failed to insert blog images:', error);
    throw new Error(`Failed to insert blog images: ${error.message}`);
  }

  return data;
}

/**
 * Get images for a blog post
 */
export async function getBlogPostImages(blogPostId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_images')
    .select('*')
    .eq('blog_post_id', blogPostId)
    .order('position_in_article', { ascending: true });

  if (error) {
    throw new Error(`Failed to get blog post images: ${error.message}`);
  }

  return data;
}

/**
 * Update blog image
 */
export async function updateBlogImage(
  imageId: string,
  updates: Partial<BlogImageInsert>
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_images')
    .update(updates)
    .eq('id', imageId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog image: ${error.message}`);
  }

  return data;
}

/**
 * Delete blog image
 */
export async function deleteBlogImage(imageId: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('blog_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    throw new Error(`Failed to delete blog image: ${error.message}`);
  }
}

/**
 * Link unassigned images to a blog post
 * Useful when images are generated before the blog post is created
 */
export async function linkImagesToPost(imageUrls: string[], blogPostId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_images')
    .update({ blog_post_id: blogPostId })
    .in('url', imageUrls)
    .select();

  if (error) {
    throw new Error(`Failed to link images to post: ${error.message}`);
  }

  return data;
}
