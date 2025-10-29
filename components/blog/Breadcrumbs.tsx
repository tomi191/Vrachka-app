/**
 * Breadcrumbs Component
 * Shows navigation path: Blog > Category > Article
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  category: string;
  categoryLabel: string;
  title: string;
}

export default function Breadcrumbs({ category, categoryLabel, title }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-zinc-400">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-accent-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Начало</span>
          </Link>
        </li>

        <li>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </li>

        {/* Blog */}
        <li>
          <Link
            href="/blog"
            className="hover:text-accent-400 transition-colors"
          >
            Блог
          </Link>
        </li>

        <li>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </li>

        {/* Category */}
        <li>
          <Link
            href={`/blog?category=${category}`}
            className="hover:text-accent-400 transition-colors"
          >
            {categoryLabel}
          </Link>
        </li>

        <li>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </li>

        {/* Current Article */}
        <li className="text-zinc-300 font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}

/**
 * Generate BreadcrumbList schema for SEO
 */
export function generateBreadcrumbSchema(
  category: string,
  categoryLabel: string,
  slug: string,
  title: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Начало',
        item: 'https://vrachka.eu',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Блог',
        item: 'https://vrachka.eu/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: `https://vrachka.eu/blog?category=${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: title,
        item: `https://vrachka.eu/blog/${slug}`,
      },
    ],
  };
}
