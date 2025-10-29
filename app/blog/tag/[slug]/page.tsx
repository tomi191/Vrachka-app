import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, Calendar, Clock, TrendingUp, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Decode and format the tag for display
  const tagDisplay = decodeURIComponent(slug).replace(/-/g, ' ');

  return {
    title: `${tagDisplay} - Статии и Ръководства | Vrachka Блог`,
    description: `Разгледай всички статии свързани с ${tagDisplay}. Научи повече за астрологията, таро, нумерологията и духовността.`,
    keywords: [tagDisplay, 'астрология', 'таро', 'духовност', 'блог'].join(', '),
    openGraph: {
      title: `#${tagDisplay} | Vrachka Блог`,
      description: `Статии с таг ${tagDisplay}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Decode the tag from URL (e.g., "merkuri-retrograden" -> "merkuri retrograden")
  const tagQuery = decodeURIComponent(slug).replace(/-/g, ' ');

  // Fetch posts with this tag (case insensitive search)
  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .contains('tags', [tagQuery])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching tagged posts:', error);
  }

  // If no posts found, check if the tag exists at all
  if (!blogPosts || blogPosts.length === 0) {
    // Try to find similar tags (case insensitive)
    const { data: allPosts } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('status', 'published')
      .not('tags', 'is', null);

    const allTags = new Set<string>();
    allPosts?.forEach((post) => {
      post.tags?.forEach((tag: string) => {
        if (tag.toLowerCase().includes(tagQuery.toLowerCase())) {
          allTags.add(tag);
        }
      });
    });

    // If no similar tags found, it's truly not found
    if (allTags.size === 0) {
      notFound();
    }
  }

  // Get all tags with post counts for sidebar
  const { data: allPublishedPosts } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('status', 'published')
    .not('tags', 'is', null);

  const tagCounts = new Map<string, number>();
  allPublishedPosts?.forEach((post) => {
    post.tags?.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Sort tags by count and convert to array
  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({
      name: tag,
      count,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    }));

  const categoryLabels: Record<string, string> = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

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
            {/* Tag Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-4">
                <TagIcon className="w-4 h-4" />
                <span className="text-sm">таг</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
                #{tagQuery}
              </h1>
              <p className="text-lg text-zinc-400 max-w-3xl">
                Всички статии свързани с {tagQuery}
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
                  Все още няма статии с този таг
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
                      {post.category && (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-800 mb-3">
                          {categoryLabels[post.category]}
                        </span>
                      )}
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
              <h3 className="text-lg font-bold text-zinc-50 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-accent-400" />
                Популярни тагове
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tag/${tag.slug}`}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                      tag.slug === slug
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
                    }`}
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[10px] opacity-60">({tag.count})</span>
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
