/**
 * Reading Progress Bar Component
 * Displays scroll progress at the top of the page
 */

'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollHeight = documentHeight - windowHeight;

      if (scrollHeight > 0) {
        const scrolled = (scrollTop / scrollHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrolled)));

        // Show progress bar after scrolling 300px
        setIsVisible(scrollTop > 300);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="h-1 bg-zinc-900/50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-accent-600 via-accent-500 to-purple-500 transition-all duration-150 ease-out shadow-lg shadow-accent-500/50"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
