import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye, BookOpen, PenTool } from 'lucide-react'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { MysticBackground } from '@/components/background/MysticBackground'
import { ZodiacIcon } from '@/components/icons/zodiac'
import { GradientText } from '@/components/ui/gradient-text'
import { HoverCardWrapper } from '@/components/ui/hover-card-wrapper'

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

      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <MysticBackground />
        <div className="container mx-auto px-4 pt-32 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-accent-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Блог Vrachka
              </GradientText>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Дневни хороскопи, астрологични прогнози и духовни статии за твоето развитие
            </p>
          </div>

          {/* Category Filter (Future Enhancement) */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Badge key={key} variant="outline" className="text-sm px-4 py-2 cursor-pointer hover:bg-accent-600/20 border-zinc-700">
                {label}
              </Badge>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {hasPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <HoverCardWrapper className="h-full">
                    <div className="h-full cursor-pointer glass-card card-hover p-6">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <Badge className={categoryColors[post.category] || 'bg-zinc-800 text-zinc-200'}>
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        {post.zodiac_sign && (
                          <ZodiacIcon
                            sign={post.zodiac_sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                            size={24}
                            className="text-accent-400"
                          />
                        )}
                      </div>
                      <h3 className="line-clamp-2 text-zinc-50 text-xl font-bold mb-2">{post.title}</h3>
                      <p className="line-clamp-3 text-zinc-400 mb-4">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-zinc-500 mt-auto">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.view_count}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardWrapper>
                </Link>
              ))}
            </div>
          ) : (
            /* Placeholder when no posts */
            <div className="text-center py-20 glass-card mx-auto max-w-2xl">
              <div className="flex justify-center mb-4">
                <PenTool className="w-16 h-16 text-accent-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-zinc-50">Скоро ще има нови статии!</h2>
              <p className="text-zinc-400 mb-8">
                Работим усилено да ти предоставим качествено съдържание за хороскопи и астрология
              </p>
              <Link
                href="/horoscope"
                className="inline-block bg-accent-600 hover:bg-accent-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Разгледай Дневните Хороскопи
              </Link>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">За Какво е Нашият Блог?</h2>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <p>
                  Блогът на Vrachka е твоят източник за актуални астрологични прогнози, дневни хороскопи и духовни насоки.
                  Всеки ден публикуваме нови хороскопи за всички 12 зодии, базирани на най-новите позиции на планетите.
                </p>
                <h3 className="text-xl font-semibold mt-4 text-zinc-200">Какво ще намериш тук:</h3>
                <ul>
                  <li><strong>Дневни хороскопи</strong> - Прогнози за всяка зодия, актуализирани ежедневно</li>
                  <li><strong>Седмични прогнози</strong> - Задълбочен поглед върху предстоящата седмица</li>
                  <li><strong>Месечни хороскопи</strong> - Астрологичен план за целия месец</li>
                  <li><strong>Астрология обучение</strong> - Научи повече за знаците, планетите и аспектите</li>
                  <li><strong>Таро и Нумерология</strong> - Допълнителни инструменти за самопознание</li>
                  <li><strong>Съвместимост</strong> - Разбери връзките между различните зодии</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
