import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'

  // Static routes (only public pages - exclude auth pages)
  const routes = [
    '',
    '/pricing',
    '/privacy',
    '/terms',
    '/contact',
    '/features',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Bulgarian zodiac signs for horoscope pages
  const zodiacSigns = [
    'oven', 'telec', 'bliznaci', 'rak', 'lav', 'deva',
    'vezni', 'skorpion', 'strelec', 'kozirog', 'vodolej', 'ribi'
  ]

  const zodiacRoutes = zodiacSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9, // High priority for SEO
  }))

  // Fetch blog posts for dynamic sitemap
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('published', true)
        .order('updated_at', { ascending: false })

      if (blogPosts) {
        blogRoutes = blogPosts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      }
    }
  } catch (error) {
    console.error('[Sitemap] Failed to fetch blog posts:', error)
  }

  return [
    ...routes,
    ...zodiacRoutes,
    ...blogRoutes,
  ]
}
