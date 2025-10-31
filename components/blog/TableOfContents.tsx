'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    // Extract H2 and H3 headings from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');

    const items: TOCItem[] = Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));

    setTocItems(items);

    // Add IDs to actual headings in DOM for smooth scroll
    const actualHeadings = document.querySelectorAll('article h2, article h3');
    actualHeadings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    // Intersection Observer for active heading highlight
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    actualHeadings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      actualHeadings.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, [content]);

  if (tocItems.length === 0) {
    return null; // Don't show TOC if no headings
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update active state immediately
      setActiveId(id);
    }
  };

  return (
    <div className="sticky top-24 glass-card p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
      <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
        <span className="text-xl">📑</span>
        Съдържание
      </h3>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={cn(
              'block text-sm transition-all duration-200 py-1',
              item.level === 2
                ? 'font-medium border-l-2 pl-3'
                : 'font-normal pl-6 border-l-2',
              activeId === item.id
                ? item.level === 2
                  ? 'text-accent-400 border-accent-400'
                  : 'text-accent-300 border-accent-400'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:border-zinc-600'
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
