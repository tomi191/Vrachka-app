import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-accent-500 animate-spin" />
        <p className="text-zinc-400 text-sm">Зареждане...</p>
      </div>
    </div>
  )
}
