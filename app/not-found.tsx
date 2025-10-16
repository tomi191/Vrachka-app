import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[150px] font-bold text-accent-500/20 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🔮</div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-50">
            Изгубени сме в космоса
          </h1>
          <p className="text-zinc-400 text-lg">
            Тази страница не съществува или е била преместена.
            Но не се притеснявай - звездите ще те насочат обратно!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            Начална страница
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent-600 text-accent-300 hover:bg-accent-900/20 rounded-lg transition-colors font-semibold"
          >
            <Search className="w-5 h-5" />
            Към Dashboard
          </Link>
        </div>

        {/* Fun fact */}
        <div className="pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 italic">
            "Понякога се изгубваме, за да намерим нещо ново." ✨
          </p>
        </div>
      </div>
    </div>
  )
}
