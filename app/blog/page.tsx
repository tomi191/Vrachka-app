import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Блог | Vrachka',
  description: 'Научи повече за астрологията, таро, нумерологията и духовността с експертните ни статии',
};

export default async function BlogIndexPage() {
  const supabase = await createClient();

  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Vrachka Блог
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Разкрий тайните на звездите, таро картите и духовния свят
          </p>
        </div>

        {!blogPosts || blogPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-zinc-300 mb-2">Скоро тук ще има статии</h2>
            <p className="text-zinc-500">Работим усилено над съдържанието</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300 group">
                {post.featured_image_url ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-accent-600/20 to-purple-600/20 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-accent-400/30" />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <Link
                      href={`/blog/category/${post.category}`}
                      className="inline-block text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-3 hover:bg-accent-500/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
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
        )}
      </div>
    </div>
  );
}
