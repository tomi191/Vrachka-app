import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'

  // 1. Static routes
  const staticRoutes = [
    '', '/pricing', '/privacy', '/terms', '/contact', 
    '/features', '/blog', '/about', '/horoscope'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Zodiac sign routes
  const zodiacSigns = [
    'oven', 'telec', 'bliznaci', 'rak', 'lav', 'deva',
    'vezni', 'skorpion', 'strelec', 'kozirog', 'vodolej', 'ribi'
  ]
  const zodiacRoutes = zodiacSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  if (!supabase) {
    console.error('[Sitemap] Supabase client not initialized. Returning static routes only.')
    return [...staticRoutes, ...zodiacRoutes]
  }

  try {
    // 3. Fetch Blog Posts (published_at is not null = published)
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .not('published_at', 'is', null)
    
    const blogPostRoutes = blogPosts?.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

    // 4. Fetch Blog Categories
    const { data: categories } = await supabase
      .from('blog_categories')
      .select('slug')

    const categoryRoutes = categories?.map((category: any) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

    // 5. Fetch Blog Tags
    const { data: tags } = await supabase
      .from('blog_tags')
      .select('slug')

    const tagRoutes = tags?.map((tag: any) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []

    return [
      ...staticRoutes,
      ...zodiacRoutes,
      ...blogPostRoutes,
      ...categoryRoutes,
      ...tagRoutes,
    ]
  } catch (error) {
    console.error('[Sitemap] Failed to fetch dynamic routes:', error)
    return [...staticRoutes, ...zodiacRoutes] // Fallback to static routes
  }
}
