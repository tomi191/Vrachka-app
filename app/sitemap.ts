import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'

  // Static routes (only public pages - exclude auth pages)
  const routes = [
    '',
    '/pricing',
    '/privacy',
    '/terms',
    '/contact',
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

  return [
    ...routes,
    ...zodiacRoutes,
  ]
}
