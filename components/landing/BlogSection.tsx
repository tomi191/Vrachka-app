import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { BLOG_CATEGORY_LABELS } from '@/lib/constants/blog-categories';
import { getLatestBlogPosts } from '@/lib/utils/blog';

/**
 * BlogSection Component
 * Server component that fetches and displays latest blog posts
 */
export async function BlogSection() {
  const blogPosts = await getLatestBlogPosts(3);

  // Don't render if no posts
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          icon={BookOpen}
          badge="Блог"
          heading="Последни статии"
          description="Открий нови прозрения и духовни насоки"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="glass-card p-6 card-hover h-full">
                <Badge variant="secondary" className="mb-4">
                  {BLOG_CATEGORY_LABELS[post.category] || post.category}
                </Badge>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
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
  );
}
