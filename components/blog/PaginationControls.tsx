'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/blog?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 mt-12">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
          ${currentPage <= 1 ? 'pointer-events-none text-zinc-600 bg-zinc-800/30' : 'text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/70'}`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <ChevronLeft className="w-4 h-4" />
        Предишна
      </Link>

      <span className="text-sm text-zinc-400">
        Страница <span className="font-semibold text-zinc-200">{currentPage}</span> от <span className="font-semibold text-zinc-200">{totalPages}</span>
      </span>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors
          ${currentPage >= totalPages ? 'pointer-events-none text-zinc-600 bg-zinc-800/30' : 'text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/70'}`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        Следваща
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
