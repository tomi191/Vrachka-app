import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-12 px-6 mt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-zinc-50">Vrachka</span>
            </div>
            <p className="text-sm text-zinc-500">
              Твоят духовен гид с AI технология
            </p>
          </div>

          {/* Безплатни */}
          <div>
            <h4 className="font-semibold text-zinc-50 mb-4">Безплатни</h4>
            <div className="flex flex-col gap-2">
              <Link href="/horoscope" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Дневни Хороскопи
              </Link>
              <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Блог & Статии
              </Link>
              <Link href="/tarot" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Таро Четене
              </Link>
            </div>
          </div>

          {/* Функции */}
          <div>
            <h4 className="font-semibold text-zinc-50 mb-4">Функции</h4>
            <div className="flex flex-col gap-2">
              <Link href="/oracle" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                AI Оракул
              </Link>
              <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Цени
              </Link>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h4 className="font-semibold text-zinc-50 mb-4">Информация</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Поверителност
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Условия
              </Link>
              <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Контакт
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/50">
          <p className="text-sm text-zinc-600 text-center">
            © 2025 Vrachka. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  )
}
