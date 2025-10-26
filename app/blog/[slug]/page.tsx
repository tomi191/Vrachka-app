import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_title, meta_description, og_image_url, keywords')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'Статия не е намерена | Vrachka' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || undefined,
    keywords: post.keywords?.join(', '),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || undefined,
      images: post.og_image_url ? [post.og_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id);

  const categoryLabels: Record<string, string> = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  const processContentWithCTAs = (htmlContent: string) => {
    return htmlContent
      .replace(/<!-- CTA:soft -->/g, '<div class="my-8 p-6 bg-accent-500/10 border border-accent-500/20 rounded-lg text-center"><p class="text-zinc-300 mb-4">Искаш да научиш повече за себе си?</p><a href="/natal-chart" class="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold">Изчисли безплатната си натална карта</a></div>')
      .replace(/<!-- CTA:medium -->/g, '<div class="my-8 p-6 bg-gradient-to-r from-accent-600/10 to-purple-600/10 border border-accent-500/20 rounded-lg text-center"><p class="text-zinc-300 mb-4">Готов/а за по-задълбочен анализ?</p><a href="/pricing" class="inline-block px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold">Виж Ultimate плана</a></div>')
      .replace(/<!-- CTA:strong -->/g, '<div class="my-8 p-6 bg-gradient-to-r from-accent-600/20 to-purple-600/20 border-2 border-accent-500 rounded-lg text-center"><p class="text-xl text-zinc-100 font-semibold mb-2">Персонализирани прогнози само за теб</p><p class="text-zinc-300 mb-4">Upgrade до Ultimate и получи месечни и годишни хороскопи базирани на твоята натална карта</p><a href="/pricing" class="inline-block px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-bold text-lg">Започни Ultimate Trial</a></div>')
      .replace(/<!-- CTA:free -->/g, '<div class="my-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center"><p class="text-zinc-300 mb-4">Използвай нашите безплатни инструменти</p><a href="/dashboard" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold">Отвори Dashboard</a></div>')
      .replace(/<!-- CTA:feature -->/g, '<div class="my-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center"><p class="text-zinc-300 mb-4">Открий повече функции</p><a href="/features" class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold">Виж всички функции</a></div>')
      .replace(/<!-- CTA:conversion -->/g, '<div class="my-8 p-6 bg-gradient-to-r from-accent-600/15 to-purple-600/15 border border-accent-500/30 rounded-lg text-center"><p class="text-lg text-zinc-100 font-semibold mb-3">Искаш персонализирани прогнози?</p><a href="/pricing" class="inline-block px-8 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold">Виж плановете</a></div>')
      .replace(/<!-- CTA:urgent -->/g, '<div class="my-8 p-6 bg-gradient-to-r from-red-600/10 to-accent-600/10 border-2 border-accent-500 rounded-lg text-center"><p class="text-xl text-zinc-100 font-bold mb-2">Ограничена оферта!</p><p class="text-zinc-300 mb-4">Започни Ultimate план и получи първата седмица безплатно</p><a href="/pricing" class="inline-block px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-bold text-lg">Активирай Ultimate сега</a></div>');
  };

  return (
    <div className="min-h-screen bg-brand-950">
      <div className="container mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад към блога
        </Link>

        <article className="max-w-4xl mx-auto">
          {post.featured_image_url && (
            <div className="w-full h-[400px] overflow-hidden rounded-lg mb-8">
              <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {post.category && (
            <span className="inline-block text-sm px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-4">
              {categoryLabels[post.category]}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.reading_time} мин четене
              </div>
            )}
            {post.view_count > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.view_count.toLocaleString('bg-BG')} прегледи
              </div>
            )}
          </div>

          <div className="prose prose-invert prose-zinc prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: processContentWithCTAs(post.content) }} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-sm px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {post.schema_markup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema_markup) }} />
      )}
    </div>
  );
}
