import Link from 'next/link'
import { Sparkles, Facebook, Mail } from 'lucide-react'
import { NewsletterSubscribeForm } from '@/components/NewsletterSubscribeForm'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-12 px-6 mt-20">
      <div className="container mx-auto max-w-6xl">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-zinc-800/50">
          <div className="max-w-xl mx-auto text-center mb-6">
            <h3 className="text-2xl font-bold text-zinc-50 mb-2">
              Дневен хороскоп в пощата ти
            </h3>
            <p className="text-zinc-400">
              Получавай персонализирани астрологични прогнози всяка сутрин в 7:00
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterSubscribeForm source="footer" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-zinc-50">Vrachka</span>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Твоят духовен гид с AI технология
            </p>

            {/* Social Links */}
            <div className="flex flex-col gap-3 mt-4">
              <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Последвай ни</h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/vrachka.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-accent-500/50 flex items-center justify-center transition-all group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-accent-400 transition-colors" />
                </a>
                <a
                  href="mailto:support@vrachka.eu"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-accent-500/50 flex items-center justify-center transition-all group"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4 text-zinc-400 group-hover:text-accent-400 transition-colors" />
                </a>
              </div>
            </div>
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
              <Link href="/refund-policy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Възстановявания
              </Link>
              <Link href="/cookies-policy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Бисквитки
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
