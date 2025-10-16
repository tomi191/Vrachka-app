import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function OracleLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="h-8 w-56 bg-zinc-800 rounded animate-pulse mx-auto" />
        <div className="h-5 w-80 bg-zinc-800 rounded animate-pulse mx-auto" />
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl animate-pulse">✨</div>
              <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
              <p className="text-zinc-400 text-sm">Свързваме се с висшите сили...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
