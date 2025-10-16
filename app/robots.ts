import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vrachka.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/onboarding/',
          '/profile/',
          '/oracle/',
          '/tarot/',
          '/subscription/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
