import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/pricing',
          '/features',
          '/blog',
          '/blog/*',
          '/auth/login',
          '/auth/register',
          '/privacy',
          '/terms',
          '/contact',
          '/horoscope/*',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/onboarding/',
          '/profile/',
          '/subscription/',
        ],
      },
      {
        userAgent: 'GPTBot', // ChatGPT web crawler
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
          '/contact',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT user browsing
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
      {
        userAgent: 'Google-Extended', // Bard and other Google AI
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
          '/contact',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
      {
        userAgent: 'anthropic-ai', // Claude
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
