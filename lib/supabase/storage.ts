/**
 * Supabase Storage Service
 * Handles image uploads to blog-images bucket
 */

import { createAdminClient } from './server';

const BUCKET_NAME = 'blog-images';

export interface UploadImageOptions {
  buffer: Buffer;
  filename: string;
  contentType: string;
  metadata?: {
    blogPostId?: string;
    altText?: string;
    prompt?: string;
  };
}

export interface UploadedImage {
  url: string;
  path: string;
  bucket: string;
  fullPath: string;
}

/**
 * Upload image to Supabase Storage
 * Returns public URL of uploaded image
 */
export async function uploadImage(
  options: UploadImageOptions
): Promise<UploadedImage> {
  const { buffer, filename, contentType, metadata } = options;

  try {
    const supabase = createAdminClient();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${filename}`;
    const path = `blog/${uniqueFilename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
        ...metadata && { metadata }
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return {
      url: urlData.publicUrl,
      path,
      bucket: BUCKET_NAME,
      fullPath: data.path
    };
  } catch (error) {
    console.error('Upload image error:', error);
    throw error;
  }
}

/**
 * Upload multiple images in parallel
 */
export async function uploadImages(
  images: UploadImageOptions[]
): Promise<UploadedImage[]> {
  const promises = images.map(img => uploadImage(img));
  const results = await Promise.allSettled(promises);

  const successfulUploads = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<UploadedImage>).value);

  if (successfulUploads.length === 0) {
    throw new Error('Failed to upload any images');
  }

  return successfulUploads;
}

/**
 * Delete image from storage
 */
export async function deleteImage(path: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Delete image error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * List images in storage
 */
export async function listImages(folderPath: string = 'blog') {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) {
    throw new Error(`Failed to list images: ${error.message}`);
  }

  return data;
}

/**
 * Get file info from storage
 */
export async function getImageInfo(path: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path.split('/').slice(0, -1).join('/'), {
      search: path.split('/').pop()
    });

  if (error || !data || data.length === 0) {
    throw new Error('Image not found');
  }

  return data[0];
}
