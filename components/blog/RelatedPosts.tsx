/**
 * Related Posts Component
 * Displays related blog posts at the end of the article
 */

import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_urls?: string[];
  reading_time?: number;
  view_count?: number;
  published_at?: string;
}

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="my-12 sm:my-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
          Препоръчани статии
        </h2>
        <p className="text-zinc-400">
          Разгледай повече статии по тази тема
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="glass-card group hover:border-accent-500/40 transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            {post.image_urls && post.image_urls.length > 0 && (
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                <img
                  src={post.image_urls[0]}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Title */}
              <h3 className="text-lg font-bold text-zinc-100 mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                {post.reading_time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.reading_time} мин
                  </div>
                )}
                {post.view_count && post.view_count > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {post.view_count > 1000
                      ? `${(post.view_count / 1000).toFixed(1)}k`
                      : post.view_count}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors font-medium"
        >
          Виж всички статии
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
