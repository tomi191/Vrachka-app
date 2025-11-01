import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import PaginationControls from '@/components/blog/PaginationControls';

const POSTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: 'Блог за Астрология, Таро и Нумерология | Vrachka',
  description: 'Разгледай нашите статии за астрология, таро, нумерология и духовност. Научи повече за натална карта, ретрограден меркурий, лунен календар и др.',
  keywords: ['блог', 'астрология', 'таро', 'нумерология', 'духовност', 'хороскоп', 'натална карта', 'астрологична прогноза', 'ретрограден меркурий', 'лунен календар', 'таро подредба', 'значение на таро карти'],
  openGraph: {
    title: 'Блог за Астрология, Таро и Нумерология | Vrachka',
    description: 'Експертни статии и анализи за тайните на звездите, картите и числата.',
    url: 'https://vrachka.eu/blog',
    type: 'website',
    images: [
      {
        url: 'https://vrachka.eu/opengraph-image.png', // Ensure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Vrachka.eu Блог',
      },
    ],
  },
};

interface BlogIndexPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

// Function to generate ItemList schema
const generateItemListSchema = (posts: any[], category?: string) => {
  if (!posts || posts.length === 0) return null;

  const itemListElement = posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Article',
      '@id': `https://vrachka.eu/blog/${post.slug}`,
      name: post.title,
      headline: post.title,
      description: post.excerpt,
      url: `https://vrachka.eu/blog/${post.slug}`,
      image: post.featured_image_url,
      datePublished: post.published_at,
      author: {
        '@type': 'Organization',
        name: 'Vrachka'
      }
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category ? `Блог - ${category}` : 'Блог',
    description: category ? `Статии в категория ${category}` : 'Последни статии в блога на Vrachka',
    itemListElement,
  };
};

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const selectedCategory = params.category;
  const currentPage = parseInt(params.page || '1', 10);

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // Base query
  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (selectedCategory) {
    query = query.eq('category', selectedCategory);
  }

  // Pagination logic
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: blogPosts, count } = await query
    .order('published_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  const categoryLabels: Record<string, string> = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  const itemListSchema = generateItemListSchema(blogPosts || [], selectedCategory ? categoryLabels[selectedCategory] : undefined);

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <div className="min-h-screen bg-gradient-dark relative">
        <MysticBackground />

        {/* Desktop: Navigation with Profile dropdown */}
        <div className="hidden lg:block">
          <Navigation user={user} />
        </div>

        {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
        <div className="lg:hidden">
          {user ? <TopHeader /> : <Navigation />}
        </div>

        <div className="container mx-auto px-6 pt-32 pb-16 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
              Vrachka Блог
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {selectedCategory ? `Статии в категория: ${categoryLabels[selectedCategory]}` : 'Разкрий тайните на звездите, таро картите и духовния свят'}
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            <Link href="/blog" className={`text-sm px-4 py-2 rounded-full transition-colors duration-300 ${!selectedCategory ? 'bg-accent-500/80 text-white font-semibold shadow-lg' : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/70'}`}>
              Всички
            </Link>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link key={key} href={`/blog?category=${key}`} className={`text-sm px-4 py-2 rounded-full transition-colors duration-300 ${selectedCategory === key ? 'bg-accent-500/80 text-white font-semibold shadow-lg' : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/70'}`}>
                {label}
              </Link>
            ))}
          </div>

          {!blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-zinc-300 mb-2">Няма намерени статии</h2>
              <p className="text-zinc-500">{selectedCategory ? `Няма статии в категория "${categoryLabels[selectedCategory]}".` : 'Работим усилено над съдържанието'}</p>
              {selectedCategory && <Link href="/blog" className="mt-4 inline-block text-accent-400 hover:text-accent-300 underline">Покажи всички статии</Link>}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300 group">
                    {post.featured_image_url ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-accent-600/20 to-purple-600/20 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-accent-400/30" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <Link href={`/blog?category=${post.category}`} className="inline-block text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-3 hover:bg-accent-500/20 transition-colors z-10 relative">
                          {categoryLabels[post.category]}
                        </Link>
                      )}
                      <h2 className="text-xl font-bold text-zinc-50 mb-3 line-clamp-2 group-hover:text-accent-400 transition-colors">{post.title}</h2>
                      {post.excerpt && (<p className="text-zinc-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>)}
                      <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                        {post.published_at && (<div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at).toLocaleDateString('bg-BG', {year: 'numeric', month: 'short', day: 'numeric'})}</div>)}
                        {post.reading_time && (<div className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time} мин</div>)}
                        {post.view_count > 0 && (<div className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{post.view_count}</div>)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </div>
        <Footer />

        {/* Bottom Navigation - mobile only for logged-in users */}
        {user && <BottomNav />}
      </div>
    </>
  );
}
