/**
 * Back to Top Button Component
 * Scrolls to the top of the page when clicked
 */

'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 shadow-lg shadow-accent-500/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-accent-500/70 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Обратно нагоре"
    >
      <ArrowUp className="w-6 h-6 text-white" />
    </button>
  );
}
