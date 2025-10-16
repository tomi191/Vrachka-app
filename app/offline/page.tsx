'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Offline Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-zinc-900/50 border-2 border-zinc-800 flex items-center justify-center">
              <WifiOff className="w-16 h-16 text-zinc-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <span className="text-red-400 text-2xl">!</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-50">
            Няма връзка с интернет
          </h1>
          <p className="text-zinc-400 text-lg">
            Изглежда че си изгубил връзка с интернет. Провери връзката си и опитай отново.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            Опитай отново
          </button>

          <p className="text-sm text-zinc-500">
            Някои функции може да не работят без интернет връзка
          </p>
        </div>

        {/* Cached Content Info */}
        <div className="pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Можеш да разглеждаш вече заредено съдържание докато не възстановиш връзката.
          </p>
        </div>
      </div>
    </div>
  )
}
