/**
 * Blog Utilities
 * Server-side utilities for fetching blog posts
 */

import { createClient } from '@supabase/supabase-js'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  published_at: string
}

/**
 * Fetches latest published blog posts
 * Server-side only function
 *
 * @param limit - Number of posts to fetch (default: 3)
 * @returns Array of blog posts
 */
export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Blog Utils] Missing Supabase env vars')
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[Blog Utils] Supabase error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[Blog Utils] Failed to fetch blog posts:', error)
    return []
  }
}
