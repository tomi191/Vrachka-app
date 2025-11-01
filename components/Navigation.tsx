'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Menu, X, User, Home, MessageCircle, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

import { Logo } from '@/components/branding/Logo'

interface NavigationProps {
  user?: SupabaseUser | null;
}

export function Navigation({ user }: NavigationProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [astrologyDropdownOpen, setAstrologyDropdownOpen] = useState(false);
  const [numerologyDropdownOpen, setNumerologyDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-brand-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            <div className="relative">
              <Logo className="transition-all duration-300 group-hover:scale-110" />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span className="font-semibold text-lg text-zinc-50 group-hover:text-white transition-colors duration-300">Врачка</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/horoscope" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Хороскопи
            </Link>
            <div className="relative">
              <button
                onClick={() => setAstrologyDropdownOpen(!astrologyDropdownOpen)}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                <span>Астрология</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {astrologyDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setAstrologyDropdownOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-xl z-20">
                    <div className="py-2">
                      <Link
                        href="/natal-chart"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                        onClick={() => setAstrologyDropdownOpen(false)}
                      >
                        Натална Карта
                      </Link>
                      <Link
                        href="/moon-phase"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                        onClick={() => setAstrologyDropdownOpen(false)}
                      >
                        Лунна Фаза
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setNumerologyDropdownOpen(!numerologyDropdownOpen)}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                <span>Нумерология</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {numerologyDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNumerologyDropdownOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-xl z-20">
                    <div className="py-2">
                      <Link
                        href="/numerology"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                        onClick={() => setNumerologyDropdownOpen(false)}
                      >
                        Нумерология
                      </Link>
                      <Link
                        href="/life-path-number"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                        onClick={() => setNumerologyDropdownOpen(false)}
                      >
                        Лично число
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link href="/tarot" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Таро
            </Link>
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Блог
            </Link>
            <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              За нас
            </Link>
            <Link href="/contact" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
              Контакти
            </Link>

            {user ? (
              /* Profile Dropdown for logged-in users */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Профил</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {profileDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-xl z-20">
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Home className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/tarot-readings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Sparkles className="w-4 h-4" />
                          Таро
                        </Link>
                        <Link
                          href="/oracle"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Оракул
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Профил
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:bg-mystic-900 hover:text-zinc-50 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Настройки
                        </Link>
                        <div className="border-t border-mystic-800 my-2" />
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {isLoggingOut ? 'Излизане...' : 'Изход'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Login/Register buttons for non-logged users */
              <>
                <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
                  Вход
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-accent-600 hover:bg-accent-700">
                    Започни сега
                  </Button>
                </Link>
              </>
            )}
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
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-zinc-950/98 backdrop-blur-xl border-l border-zinc-700 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
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
            href="/natal-chart"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Натална карта
          </Link>
          <Link
            href="/moon-phase"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Лунна фаза
          </Link>
          <Link
            href="/numerology"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Нумерология
          </Link>
          <Link
            href="/life-path-number"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Лично число
          </Link>
          <Link
            href="/tarot"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Таро
          </Link>
          <Link
            href="/blog"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Блог
          </Link>
          <Link
            href="/about"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            За нас
          </Link>
          <Link
            href="/contact"
            className="text-zinc-400 hover:text-zinc-50 transition-colors py-2"
            onClick={closeMobileMenu}
          >
            Контакти
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
