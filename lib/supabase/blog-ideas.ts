/**
 * Blog Ideas Database Service
 * Handles blog_ideas table operations
 */

import { createAdminClient } from './server';

export interface BlogIdea {
  id?: string;
  title: string;
  description: string;
  content_type: 'tofu' | 'mofu' | 'bofu' | 'advertorial';
  category: 'astrology' | 'tarot' | 'numerology' | 'spirituality' | 'general';
  keywords: string[];
  target_word_count: number;
  seo_score?: number;
  viral_potential?: number;
  conversion_potential?: number;
  status?: 'pending' | 'in_progress' | 'published' | 'archived';
  published_post_id?: string;
  generation_prompt?: string;
  generated_by?: string;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogIdeaInsert {
  title: string;
  description: string;
  content_type: 'tofu' | 'mofu' | 'bofu' | 'advertorial';
  category: 'astrology' | 'tarot' | 'numerology' | 'spirituality' | 'general';
  keywords: string[];
  target_word_count: number;
  seo_score?: number;
  viral_potential?: number;
  conversion_potential?: number;
  generation_prompt?: string;
  generated_by?: string;
}

/**
 * Insert a single blog idea
 */
export async function insertBlogIdea(idea: BlogIdeaInsert) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_ideas')
    .insert(idea)
    .select()
    .single();

  if (error) {
    console.error('Failed to insert blog idea:', error);
    throw new Error(`Failed to insert blog idea: ${error.message}`);
  }

  return data;
}

/**
 * Insert multiple blog ideas in batch
 */
export async function insertBlogIdeas(ideas: BlogIdeaInsert[]) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_ideas')
    .insert(ideas)
    .select();

  if (error) {
    console.error('Failed to insert blog ideas:', error);
    throw new Error(`Failed to insert blog ideas: ${error.message}`);
  }

  return data;
}

/**
 * Get all blog ideas with optional filters
 */
export async function getBlogIdeas(filters?: {
  category?: string;
  status?: string;
  limit?: number;
}) {
  const supabase = createAdminClient();

  let query = supabase
    .from('blog_ideas')
    .select('*')
    .order('generated_at', { ascending: false });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get blog ideas: ${error.message}`);
  }

  return data;
}

/**
 * Get a single blog idea by ID
 */
export async function getBlogIdea(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_ideas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to get blog idea: ${error.message}`);
  }

  return data;
}

/**
 * Update blog idea status
 */
export async function updateBlogIdeaStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'published' | 'archived',
  publishedPostId?: string
) {
  const supabase = createAdminClient();

  const updates: {
    status: string;
    published_post_id?: string;
  } = { status };

  if (publishedPostId) {
    updates.published_post_id = publishedPostId;
  }

  const { data, error } = await supabase
    .from('blog_ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog idea status: ${error.message}`);
  }

  return data;
}

/**
 * Delete a blog idea
 */
export async function deleteBlogIdea(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('blog_ideas')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete blog idea: ${error.message}`);
  }
}

/**
 * Get blog ideas count by category
 */
export async function getBlogIdeasCountByCategory() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('blog_ideas')
    .select('category, status')
    .eq('status', 'pending');

  if (error) {
    throw new Error(`Failed to get blog ideas count: ${error.message}`);
  }

  // Group by category
  const counts: Record<string, number> = {
    all: data.length,
    astrology: 0,
    tarot: 0,
    numerology: 0,
    spirituality: 0,
    general: 0,
  };

  data.forEach((idea) => {
    counts[idea.category] = (counts[idea.category] || 0) + 1;
  });

  return counts;
}
