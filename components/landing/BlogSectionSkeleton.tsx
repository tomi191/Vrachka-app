import { BookOpen } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

/**
 * BlogSectionSkeleton Component
 * Loading skeleton for BlogSection while data is being fetched
 */
export function BlogSectionSkeleton() {
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-full animate-pulse">
              {/* Badge Skeleton */}
              <div className="h-6 w-32 bg-zinc-800 rounded-full mb-4" />

              {/* Title Skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-6 bg-zinc-800 rounded w-full" />
                <div className="h-6 bg-zinc-800 rounded w-3/4" />
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
              </div>

              {/* Link Skeleton */}
              <div className="h-4 w-32 bg-zinc-800 rounded mt-4" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-block h-12 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}
