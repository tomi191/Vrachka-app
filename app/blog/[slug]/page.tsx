import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'

// ISR: Revalidate every 24 hours for daily horoscopes
export const revalidate = 86400

const categoryLabels: Record<string, string> = {
  'daily-horoscope': 'Дневен Хороскоп',
  'weekly-horoscope': 'Седмичен Хороскоп',
  'monthly-horoscope': 'Месечен Хороскоп',
  'tarot': 'Таро',
  'astrology': 'Астрология',
  'numerology': 'Нумерология',
  'spirituality': 'Духовност',
  'compatibility': 'Съвместимост',
  'lunar-calendar': 'Лунен Календар',
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: string
  zodiac_sign: string | null
  keywords: string[]
  published_at: string
  view_count: number
  created_at: string
  updated_at: string
}

// Generate static params for published posts (will be called at build time)
export async function generateStaticParams() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)
    .limit(100)

  if (!posts) return []

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, description, meta_title, meta_description, keywords, published_at')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) {
    return {
      title: 'Статия не е намерена',
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.description

  return {
    title,
    description,
    keywords: post.keywords || [],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`],
    },
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Fetch the blog post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single<BlogPost>()

  if (error || !post) {
    notFound()
  }

  // Increment view count (fire and forget)
  supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)
    .then(() => {})

  // Fetch related posts (same category or zodiac sign)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, category, zodiac_sign')
    .eq('published', true)
    .neq('id', post.id)
    .or(`category.eq.${post.category}${post.zodiac_sign ? `,zodiac_sign.eq.${post.zodiac_sign}` : ''}`)
    .order('published_at', { ascending: false })
    .limit(3)

  // Schema.org Article markup
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `https://www.vrachka.eu/api/og?title=${encodeURIComponent(post.title)}`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Vrachka',
      url: 'https://www.vrachka.eu',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vrachka',
      url: 'https://www.vrachka.eu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vrachka.eu/icon-512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.vrachka.eu/blog/${post.slug}`,
    },
    keywords: post.keywords?.join(', ') || '',
  }

  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Начало', url: 'https://www.vrachka.eu' },
    { name: 'Блог', url: 'https://www.vrachka.eu/blog' },
    { name: post.title, url: `https://www.vrachka.eu/blog/${post.slug}` },
  ])

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Всички статии</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.zodiac_sign && (
                <Badge variant="outline" className="text-lg">
                  {getZodiacEmoji(post.zodiac_sign)} {getZodiacName(post.zodiac_sign)}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {post.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count} прегледа</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Сподели
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-purple dark:prose-invert max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          </div>

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Тагове:</span>
              {post.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-12">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Искаш Персонализиран Хороскоп?
              </h2>
              <p className="text-lg mb-6 text-purple-100">
                Получи AI-генерирани прогнози, специално за твоята зодия и натална карта
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary">
                    Започни Безплатно
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                    Виж Плановете
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Свързани Статии</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[related.category]}
                          </Badge>
                          {related.zodiac_sign && (
                            <span className="text-xl">{getZodiacEmoji(related.zodiac_sign)}</span>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {related.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  )
}

function getZodiacEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    oven: '♈',
    telec: '♉',
    bliznaci: '♊',
    rak: '♋',
    lav: '♌',
    deva: '♍',
    vezni: '♎',
    skorpion: '♏',
    strelec: '♐',
    kozirog: '♑',
    vodolej: '♒',
    ribi: '♓',
  }
  return emojis[sign] || '✨'
}

function getZodiacName(sign: string): string {
  const names: Record<string, string> = {
    oven: 'Овен',
    telec: 'Телец',
    bliznaci: 'Близнаци',
    rak: 'Рак',
    lav: 'Лъв',
    deva: 'Дева',
    vezni: 'Везни',
    skorpion: 'Скорпион',
    strelec: 'Стрелец',
    kozirog: 'Козирог',
    vodolej: 'Водолей',
    ribi: 'Риби',
  }
  return names[sign] || sign
}

// Format content: Convert markdown-like syntax to HTML
function formatContent(content: string): string {
  // Replace newlines with paragraph breaks
  let formatted = content
    .split('\n\n')
    .map((para) => `<p>${para.trim()}</p>`)
    .join('\n')

  // Bold: **text** -> <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Italic: *text* -> <em>text</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Headings: ### Heading -> <h3>Heading</h3>
  formatted = formatted.replace(/### (.*?)\n/g, '<h3>$1</h3>\n')
  formatted = formatted.replace(/## (.*?)\n/g, '<h2>$1</h2>\n')

  // Lists: - item -> <li>item</li>
  formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>')
  formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  return formatted
}
