import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, Calendar, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// Category configuration
const CATEGORIES: Record<string, { label: string; description: string; keywords: string[] }> = {
  astrology: {
    label: 'Астрология',
    description: 'Всичко за астрологията, хороскопи, зодии и планетарни влияния. Научи как звездите влияят на живота ти.',
    keywords: ['астрология', 'хороскоп', 'зодия', 'планети', 'астрологична прогноза'],
  },
  tarot: {
    label: 'Таро',
    description: 'Разкрий тайните на Таро картите. Научи значението на всяка карта и как да четеш таро за себе си и другите.',
    keywords: ['таро', 'таро карти', 'таро гадание', 'таро четене', 'таро значение'],
  },
  numerology: {
    label: 'Нумерология',
    description: 'Открий силата на числата и как те формират съдбата ти. Нумерологични изчисления и анализи.',
    keywords: ['нумерология', 'числа', 'числова съдба', 'число на живота', 'нумерологичен анализ'],
  },
  spirituality: {
    label: 'Духовност',
    description: 'Пътуване към духовното пробуждане. Медитация, чакри, аура и духовно развитие.',
    keywords: ['духовност', 'медитация', 'чакри', 'аура', 'духовно развитие', 'пробуждане'],
  },
  general: {
    label: 'Общо',
    description: 'Общи статии за мистицизма, езотериката и духовните практики.',
    keywords: ['мистика', 'езотерика', 'духовни практики', 'вдъхновение'],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    return { title: 'Категория не е намерена | Vrachka' };
  }

  return {
    title: `${category.label} - Статии и Ръководства | Vrachka Блог`,
    description: category.description,
    keywords: category.keywords.join(', '),
    openGraph: {
      title: `${category.label} | Vrachka Блог`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  // Fetch posts in this category
  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', slug)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching category posts:', error);
  }

  // Fetch post count per category for sidebar
  const { data: categoryCounts } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('status', 'published');

  const categoryStats = Object.entries(CATEGORIES).map(([key, cat]) => ({
    slug: key,
    label: cat.label,
    count: categoryCounts?.filter((p) => p.category === key).length || 0,
  }));

  return (
    <div className="min-h-screen bg-brand-950">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-accent-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Обратно към блога
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-10">
              <div className="inline-block px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-4">
                {category.label}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
                {category.label}
              </h1>
              <p className="text-lg text-zinc-400 max-w-3xl">
                {category.description}
              </p>
              {blogPosts && blogPosts.length > 0 && (
                <p className="text-sm text-zinc-500 mt-4">
                  {blogPosts.length} {blogPosts.length === 1 ? 'статия' : 'статии'}
                </p>
              )}
            </div>

            {/* Posts Grid */}
            {!blogPosts || blogPosts.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <FileText className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-zinc-300 mb-2">
                  Все още няма статии в тази категория
                </h2>
                <p className="text-zinc-500 mb-6">
                  Работим усилено над съдържанието
                </p>
                <Link
                  href="/blog"
                  className="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
                >
                  Разгледай всички статии
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="glass-card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
                  >
                    {post.featured_image_url ? (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-accent-600/20 to-purple-600/20 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-accent-400/30" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-zinc-50 mb-3 line-clamp-2 group-hover:text-accent-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                        {post.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at).toLocaleDateString('bg-BG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                        {post.reading_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.reading_time} мин
                          </div>
                        )}
                        {post.view_count > 0 && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {post.view_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-6">
              <h3 className="text-lg font-bold text-zinc-50 mb-4">
                Категории
              </h3>
              <div className="space-y-2">
                {categoryStats
                  .filter((cat) => cat.count > 0)
                  .map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/blog/category/${cat.slug}`}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        cat.slug === slug
                          ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.label}</span>
                        <span className="text-xs text-zinc-500">{cat.count}</span>
                      </div>
                    </Link>
                  ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <Link
                  href="/blog"
                  className="block text-center px-4 py-2 text-sm text-zinc-400 hover:text-accent-400 transition-colors"
                >
                  Всички статии →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
