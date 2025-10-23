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
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-zinc-50">Vrachka</span>
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
