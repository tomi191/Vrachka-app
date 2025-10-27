/**
 * Author Bio Box Component
 * Displays author information at the end of blog posts
 */

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthorBio() {
  return (
    <div className="glass-card p-6 sm:p-8 my-8 sm:my-12 border border-accent-500/20 bg-gradient-to-br from-zinc-900/80 to-zinc-900/60">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-accent-500 to-purple-600 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent-400" />
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-2">
            Екипът на Врачка
          </h3>
          <p className="text-sm text-accent-400 mb-3">
            Професионални астролози и таро експерти
          </p>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">
            Ние сме екип от опитни астролози, таролози и нумеролози с над 15 години
            практика в окултните науки. Нашата мисия е да направим древната мъдрост
            достъпна и разбираема за всеки, който търси пътеводител в живота си.
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Всички статии
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Открий всички функции
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
