import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, Calendar, Star, TrendingUp, BookOpen, Quote, Crown, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StructuredData, organizationSchema, webApplicationSchema, faqSchema } from "@/components/StructuredData";
import { createClient } from '@supabase/supabase-js'
import { ZodiacIcon } from '@/components/icons/zodiac'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { HoverCardWrapper } from '@/components/ui/hover-card-wrapper'
import { GradientText } from '@/components/ui/gradient-text'

// Revalidate every hour for fresh blog posts
export const revalidate = 3600

// Zodiac signs data (emoji removed - now using custom SVG icons)
const zodiacSigns = [
  { sign: 'oven', name: 'Овен', dates: '21 март - 19 април' },
  { sign: 'telec', name: 'Телец', dates: '20 април - 20 май' },
  { sign: 'bliznaci', name: 'Близнаци', dates: '21 май - 20 юни' },
  { sign: 'rak', name: 'Рак', dates: '21 юни - 22 юли' },
  { sign: 'lav', name: 'Лъв', dates: '23 юли - 22 август' },
  { sign: 'deva', name: 'Дева', dates: '23 август - 22 септември' },
  { sign: 'vezni', name: 'Везни', dates: '23 септември - 22 октомври' },
  { sign: 'skorpion', name: 'Скорпион', dates: '23 октомври - 21 ноември' },
  { sign: 'strelec', name: 'Стрелец', dates: '22 ноември - 21 декември' },
  { sign: 'kozirog', name: 'Козирог', dates: '22 декември - 19 януари' },
  { sign: 'vodolej', name: 'Водолей', dates: '20 януари - 18 февруари' },
  { sign: 'ribi', name: 'Риби', dates: '19 февруари - 20 март' },
] as const

// Testimonials
const testimonials = [
  {
    name: 'Мария К.',
    zodiac: 'Лъв',
    text: 'Vrachka промени начина, по който разбирам себе си. Дневните хороскопи са невероятно точни!',
    rating: 5
  },
  {
    name: 'Георги П.',
    zodiac: 'Скорпион',
    text: 'AI Оракулът ми помогна да взема важно решение. Впечатляващо!',
    rating: 5
  },
  {
    name: 'Елена Д.',
    zodiac: 'Везни',
    text: 'Таро четенията са точни и детайлни. Използвам платформата всеки ден!',
    rating: 5
  },
  {
    name: 'Иван С.',
    zodiac: 'Овен',
    text: 'Седмичните прогнози ми помагат да планирам седмицата си. Много полезно!',
    rating: 5
  },
  {
    name: 'Цветелина М.',
    zodiac: 'Риби',
    text: 'Натална карта разкри толкова много за личността ми. Препоръчвам на всички!',
    rating: 5
  },
  {
    name: 'Петър Н.',
    zodiac: 'Телец',
    text: 'Анализът на съвместимост беше изключително точен. Благодаря!',
    rating: 5
  },
  {
    name: 'Анна В.',
    zodiac: 'Дева',
    text: 'Нумерологията ми помогна да разбера жизнения си път по-добре.',
    rating: 5
  },
  {
    name: 'Димитър К.',
    zodiac: 'Стрелец',
    text: 'Качеството на AI прогнозите е невероятно. Искрено впечатлен!',
    rating: 5
  },
]

// FAQ data
const faqs = [
  {
    question: 'Как работи AI Оракулът?',
    answer: 'AI Оракулът използва напреднали езикови модели, обучени на хиляди астрологични текстове и духовни учения. Той анализира вашия въпрос в контекста на вашата натална карта и текущите астрологични аспекти, за да предостави персонализирани насоки.'
  },
  {
    question: 'Мога ли да откажа абонамента си по всяко време?',
    answer: 'Да, можете да отмените абонамента си по всяко време от вашия профил. Ще запазите достъп до края на текущия период и няма такси за анулиране.'
  },
  {
    question: 'Защитени ли са моите лични данни?',
    answer: 'Абсолютно. Използваме банково ниво на криптиране за всички данни. Вашата информация никога не се споделя с трети страни и е съхранена на сигурни сървъри в Европа.'
  },
  {
    question: 'Колко точни са прогнозите?',
    answer: 'Нашите прогнози се базират на традиционни астрологични принципи, подобрени с AI анализ. Хиляди потребители потвърждават високата точност на дневните хороскопи и таро четенията.'
  },
  {
    question: 'Какво включва безплатният план?',
    answer: 'Безплатният план включва дневен хороскоп и карта на деня за всички 12 зодиакални знака. За достъп до таро четения, AI Оракул и детайлни анализи се изисква premium абонамент.'
  },
]

// Category labels
const categoryLabels: Record<string, string> = {
  'daily-horoscope': 'Дневен Хороскоп',
  'weekly-horoscope': 'Седмичен Хороскоп',
  'monthly-horoscope': 'Месечен Хороскоп',
  'tarot': 'Таро',
  'astrology': 'Астрология',
  'numerology': 'Нумерология',
  'spirituality': 'Духовност',
}

// Fetch latest blog posts
async function getLatestBlogPosts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Homepage] Missing Supabase env vars')
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, description, category, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)

    return data || []
  } catch (error) {
    console.error('[Homepage] Failed to fetch blog posts:', error)
    return []
  }
}

export default async function LandingPage() {
  const blogPosts = await getLatestBlogPosts()

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webApplicationSchema} />
      <StructuredData data={faqSchema} />
      <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-brand-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-zinc-50">Vrachka</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/horoscope" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Хороскопи
            </Link>
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Блог
            </Link>
            <Link href="#features" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Функции
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Цени
            </Link>
            <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Вход
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-accent-600 hover:bg-accent-700">
                Започни сега
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-zinc-300">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span>AI-базирана астрологична платформа</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mx-auto leading-tight">
              <GradientText>
                Твоят личен астрологичен асистент
              </GradientText>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Персонализирани дневни хороскопи, таро четения и духовни насоки, генерирани от напреднала AI технология
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/horoscope">
                <ShimmerButton className="text-base">
                  Виж твоя хороскоп днес
                  <ArrowRight className="ml-2 w-5 h-5" />
                </ShimmerButton>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-900 px-8 h-12 text-base">
                  Научи повече
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-zinc-500 pt-4">
              Присъедини се към 10,000+ потребители в тяхното духовно пътуване
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="glass-card p-2 max-w-5xl mx-auto card-hover">
              <div className="bg-brand-900 rounded-xl h-[500px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-accent-500/10 flex items-center justify-center">
                    <Star className="w-10 h-10 text-accent-400" />
                  </div>
                  <p className="text-zinc-600 text-lg">Dashboard Preview</p>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-accent-500/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Free Horoscopes Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-brand-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Star className="w-4 h-4" />
              <span>100% Безплатно</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Изберете вашата зодия
            </h2>
            <p className="text-xl text-zinc-400">
              Дневни хороскопи за всички 12 зодиакални знака
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {zodiacSigns.map((zodiac) => (
              <Link key={zodiac.sign} href={`/horoscope/${zodiac.sign}`}>
                <HoverCardWrapper className="h-full">
                  <div className="glass-card p-6 text-center card-hover group h-full">
                    <div className="mb-3 flex justify-center">
                      <ZodiacIcon
                        sign={zodiac.sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                        size={64}
                        className="text-accent-400 group-hover:text-accent-300 transition-colors"
                      />
                    </div>
                    <h3 className="font-semibold text-zinc-50 mb-1 text-lg">
                      {zodiac.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {zodiac.dates}
                    </p>
                  </div>
                </HoverCardWrapper>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/horoscope">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900">
                Виж всички хороскопи
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Всичко необходимо за твоето духовно развитие
            </h2>
            <p className="text-xl text-zinc-400">
              Мощни функции за управление на твоето пътуване
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Дневни хороскопи
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Персонализирани астрологични прогнози базирани на твоята натална карта. Актуализират се ежедневно с AI-генерирано съдържание.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Таро четения
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Изтегли карти и получи моментална интерпретация. Множество подредби налични за различни въпроси.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                AI Оракул
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Задай всякакъв духовен въпрос и получи обмислени насоки от нашия напреднал AI асистент.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Нумерология
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Открий значението на числата в твоя живот. Детайлни анализи базирани на рождената ти дата и име.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Съвместимост
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Анализирай връзките си с други хора. Любовна, приятелска и бизнес съвместимост.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-50 mb-3">
                Натална карта
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Пълна астрологична карта с всички планети, къщи и аспекти. Задълбочен анализ на личността ти.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-brand-950">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Блог</span>
              </div>
              <h2 className="text-4xl font-bold text-zinc-50 mb-4">
                Последни статии
              </h2>
              <p className="text-xl text-zinc-400">
                Открий нови прозрения и духовни насоки
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="glass-card p-6 card-hover h-full">
                    <Badge variant="secondary" className="mb-4">
                      {categoryLabels[post.category] || post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-zinc-50 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 text-sm text-accent-400 flex items-center gap-2">
                      <span>Прочети повече</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900">
                  Всички статии
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Прости и прозрачни цени
            </h2>
            <p className="text-xl text-zinc-400">
              Избери плана, който работи най-добре за теб
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8 card-hover">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">0 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">Перфектен за начинаещи</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Таро четения</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Digital Oracle (AI)</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                  <span className="text-zinc-500">Седмични прогнози</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                  Започни безплатно
                </Button>
              </Link>
            </div>

            {/* Basic Plan */}
            <div className="glass-card p-8 card-hover border-blue-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  Популярен
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-blue-400" />
                  Basic
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">9.99 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">За редовни потребители</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">3 таро четения/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">3 въпроса към Oracle/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Седмични прогнози</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Приоритетна поддръжка</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                  Започни сега
                </Button>
              </Link>
            </div>

            {/* Ultimate Plan */}
            <div className="glass-card p-8 card-hover border-accent-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs px-3 py-1 rounded-full">
                  Най-добра стойност
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-zinc-50 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  Ultimate
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-zinc-100">19.99 лв</span>
                  <span className="text-zinc-400">/месец</span>
                </div>
                <p className="text-zinc-400 text-sm">Пълен духовен опит</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Дневен хороскоп</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Карта на деня</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Неограничени таро четения</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">10 въпроса към Oracle/ден</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Седмични и месечни прогнози</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">Персонализирани съвети</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-zinc-200">VIP поддръжка</span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="w-full bg-accent-600 hover:bg-accent-700 font-semibold">
                  Започни сега
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-brand-950">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Star className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Често задавани въпроси
            </h2>
            <p className="text-xl text-zinc-400">
              Отговори на най-честите въпроси
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="glass-card group">
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                  <h3 className="text-lg font-semibold text-zinc-50 pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-accent-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-zinc-400 mb-4">Не намери отговор на въпроса си?</p>
            <Link href="/contact">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900">
                Свържи се с нас
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Quote className="w-4 h-4" />
              <span>Отзиви</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-4">
              Какво казват нашите потребители
            </h2>
            <p className="text-xl text-zinc-400">
              Присъедини се към хилядите доволни потребители
            </p>
          </div>

          {/* Horizontal Scrollable Container with Fade */}
          <div className="relative">
            {/* Left Fade Gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-950 to-transparent z-10 pointer-events-none" />

            {/* Right Fade Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-950 to-transparent z-10 pointer-events-none" />

            {/* Scrollable Testimonials */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="glass-card p-6 min-w-[320px] max-w-[360px] snap-center flex-shrink-0"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 leading-relaxed mb-4 italic text-sm">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-base">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-50 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-zinc-500">{testimonial.zodiac}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6 mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-zinc-50">Vrachka</span>
              </div>
              <p className="text-sm text-zinc-500">
                Твоят духовен гид с AI технология
              </p>
            </div>

            {/* Безплатни */}
            <div>
              <h4 className="font-semibold text-zinc-50 mb-4">Безплатни</h4>
              <div className="flex flex-col gap-2">
                <Link href="/horoscope" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Дневни Хороскопи
                </Link>
                <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Блог & Статии
                </Link>
                <Link href="/tarot" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Таро Четене
                </Link>
              </div>
            </div>

            {/* Функции */}
            <div>
              <h4 className="font-semibold text-zinc-50 mb-4">Функции</h4>
              <div className="flex flex-col gap-2">
                <Link href="/oracle" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  AI Оракул
                </Link>
                <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Цени
                </Link>
              </div>
            </div>

            {/* Информация */}
            <div>
              <h4 className="font-semibold text-zinc-50 mb-4">Информация</h4>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Поверителност
                </Link>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Условия
                </Link>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Контакт
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800/50">
            <p className="text-sm text-zinc-600 text-center">
              © 2025 Vrachka. Всички права запазени.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
