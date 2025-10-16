import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vrachka.app'

  // Static routes
  const routes = [
    '',
    '/pricing',
    '/auth/login',
    '/auth/register',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Zodiac signs for potential horoscope pages
  const zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ]

  const zodiacRoutes = zodiacSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    ...routes,
    ...zodiacRoutes,
  ]
}
