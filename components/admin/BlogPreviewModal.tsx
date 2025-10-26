'use client';

import { X, Calendar, Clock, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  content: string;
  reading_time: number | null;
  view_count: number | null;
  published_at: string | null;
  created_at: string;
  tags?: string[];
}

interface BlogPreviewModalProps {
  post: BlogPost;
  onClose: () => void;
}

export function BlogPreviewModal({ post, onClose }: BlogPreviewModalProps) {
  const categoryLabels = {
    astrology: 'Астрология',
    tarot: 'Таро',
    numerology: 'Нумерология',
    spirituality: 'Духовност',
    general: 'Общо',
  };

  // Parse content if it's JSON (same as blog page)
  const parseContent = (rawContent: string): string => {
    const trimmed = rawContent.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"content"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.content && typeof parsed.content === 'string') {
          return parsed.content;
        }
      } catch {
        // Not valid JSON, return as is
      }
    }
    return rawContent;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-brand-950 rounded-xl border border-zinc-800 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-800 bg-brand-950/95 backdrop-blur-sm rounded-t-xl">
            <h2 className="text-lg font-bold text-zinc-50">Preview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <article className="max-w-3xl mx-auto">
              {/* Hero Image */}
              {post.featured_image_url && (
                <div className="w-full h-[350px] overflow-hidden rounded-lg mb-6">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Category Badge */}
              {post.category && (
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-4">
                  {categoryLabels[post.category as keyof typeof categoryLabels]}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-zinc-50 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">
                {(post.published_at || post.created_at) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at || post.created_at).toLocaleDateString('bg-BG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
                {post.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.reading_time} мин
                  </div>
                )}
                {post.view_count !== null && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {post.view_count > 1000 ? `${(post.view_count / 1000).toFixed(1)}k` : post.view_count}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className="prose prose-invert prose-zinc prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-zinc-50
                  prose-p:text-zinc-300 prose-p:leading-relaxed
                  prose-a:text-accent-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-zinc-100 prose-strong:font-semibold
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-zinc-300 prose-li:my-1
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                  prose-blockquote:border-l-accent-500 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: processContentWithCTAs(parseContent(post.content)) }}
              />

              {/* Tags */}
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
        </div>
      </div>
    </div>
  );
}
