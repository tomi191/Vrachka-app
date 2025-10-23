import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-brand-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-zinc-50">Vrachka</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/horoscope" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
            Хороскопи
          </Link>
          <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
            Блог
          </Link>
          <Link href="/#features" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
            Функции
          </Link>
          <Link href="/#pricing" className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">
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
      </div>
    </nav>
  )
}
