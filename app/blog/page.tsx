import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye } from 'lucide-react'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'

// ISR: Revalidate every hour (new articles appear frequently)
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Блог - Хороскопи, Астрология и Духовност',
  description: 'Дневни хороскопи за всички зодии, статии за астрология, таро, нумерология и духовно развитие. Научи повече за зодиите и астрологичните прогнози.',
  keywords: [
    'хороскоп блог',
    'астрология статии',
    'дневен хороскоп',
    'седмичен хороскоп',
    'месечен хороскоп',
    'таро четене',
    'нумерология',
    'съвместимост зодии',
    'лунен календар',
    'духовност'
  ],
  openGraph: {
    title: 'Блог - Хороскопи, Астрология и Духовност | Vrachka',
    description: 'Дневни хороскопи, астрологични прогнози и духовни статии',
    images: ['/api/og?title=Блог Vrachka&description=Хороскопи и Астрология'],
  },
  alternates: {
    canonical: '/blog',
  },
}

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

const categoryColors: Record<string, string> = {
  'daily-horoscope': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
  'weekly-horoscope': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
  'monthly-horoscope': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100',
  'tarot': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100',
  'astrology': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
  'numerology': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
  'spirituality': 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-100',
  'compatibility': 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100',
  'lunar-calendar': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-100',
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const breadcrumbData = getBreadcrumbSchema([
  { name: 'Начало', url: 'https://www.vrachka.eu' },
  { name: 'Блог', url: 'https://www.vrachka.eu/blog' },
])

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch published blog posts (max 50 for initial load)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, category, zodiac_sign, published_at, view_count')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50)

  // If no posts yet, show placeholder
  const hasPosts = posts && posts.length > 0

  return (
    <>
      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Блог Vrachka
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Дневни хороскопи, астрологични прогнози и духовни статии за твоето развитие
            </p>
          </div>

          {/* Category Filter (Future Enhancement) */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Badge key={key} variant="outline" className="text-sm px-4 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900">
                {label}
              </Badge>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {hasPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-purple-500">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={categoryColors[post.category] || 'bg-gray-100 text-gray-700'}>
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        {post.zodiac_sign && (
                          <span className="text-2xl">
                            {getZodiacEmoji(post.zodiac_sign)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.view_count}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* Placeholder when no posts */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-4">Скоро ще има нови статии!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Работим усилено да ти предоставим качествено съдържание за хороскопи и астрология
              </p>
              <Link
                href="/horoscope"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Разгледай Дневните Хороскопи
              </Link>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">За Какво е Нашият Блог?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-purple dark:prose-invert max-w-none">
                <p>
                  Блогът на Vrachka е твоят източник за актуални астрологични прогнози, дневни хороскопи и духовни насоки.
                  Всеки ден публикуваме нови хороскопи за всички 12 зодии, базирани на най-новите позиции на планетите.
                </p>
                <h3 className="text-xl font-semibold mt-4">Какво ще намериш тук:</h3>
                <ul>
                  <li><strong>Дневни хороскопи</strong> - Прогнози за всяка зодия, актуализирани ежедневно</li>
                  <li><strong>Седмични прогнози</strong> - Задълбочен поглед върху предстоящата седмица</li>
                  <li><strong>Месечни хороскопи</strong> - Астрологичен план за целия месец</li>
                  <li><strong>Астрология обучение</strong> - Научи повече за знаците, планетите и аспектите</li>
                  <li><strong>Таро и Нумерология</strong> - Допълнителни инструменти за самопознание</li>
                  <li><strong>Съвместимост</strong> - Разбери връзките между различните зодии</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
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
