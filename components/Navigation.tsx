'use client';

import Link from 'next/link'
import { Sparkles, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-brand-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            <div className="relative">
              {/* SVG Logo */}
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 group-hover:scale-110">
                <defs>
                  <radialGradient id="nav-logo-grad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#e879f9"/>
                    <stop offset="30%" stopColor="#c084fc"/>
                    <stop offset="70%" stopColor="#8b5cf6"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </radialGradient>
                  <radialGradient id="nav-logo-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                    <stop offset="50%" stopColor="#e879f9" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                  </radialGradient>
                  <mask id="nav-logo-mask" maskUnits="userSpaceOnUse">
                    <rect width="48" height="48" fill="black"/>
                    <circle cx="24" cy="24" r="18" fill="white"/>
                    <ellipse cx="20" cy="20" rx="6" ry="8" fill="black"/>
                  </mask>
                </defs>

                {/* Outer glow */}
                <circle cx="24" cy="24" r="22" fill="url(#nav-logo-glow)" opacity="0.3"/>

                {/* Crystal ball */}
                <g mask="url(#nav-logo-mask)">
                  <circle cx="24" cy="24" r="18" fill="url(#nav-logo-grad)"/>
                </g>

                {/* Central star */}
                <g transform="translate(24,24) scale(0.6)">
                  <path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" fill="#fef3c7"/>
                </g>

                {/* Sparkles */}
                <circle cx="8" cy="14" r="1" fill="#fbbf24" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="40" cy="18" r="0.8" fill="#fbbf24" opacity="0.6">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>
                </circle>
              </svg>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span className="font-semibold text-lg text-zinc-50 group-hover:text-white transition-colors duration-300">Vrachka</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/horoscope" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Хороскопи
            </Link>
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Блог
            </Link>
            <Link href="/features" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Функции
            </Link>
            <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Цени
            </Link>
            <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Вход
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-accent-600 hover:bg-accent-700">
                Започни сега
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-brand-950 border-l border-zinc-800/50 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          <Link
            href="/horoscope"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Хороскопи
          </Link>
          <Link
            href="/blog"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Блог
          </Link>
          <Link
            href="/features"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Функции
          </Link>
          <Link
            href="/pricing"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Цени
          </Link>

          <div className="pt-6 border-t border-zinc-800/50 space-y-4">
            <Link
              href="/auth/login"
              className="block text-center py-2 text-zinc-400 hover:text-zinc-50 transition-colors"
              onClick={closeMobileMenu}
            >
              Вход
            </Link>
            <Link href="/auth/register" onClick={closeMobileMenu}>
              <Button className="w-full bg-accent-600 hover:bg-accent-700">
                Започни сега
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
