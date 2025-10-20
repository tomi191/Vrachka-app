import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
        <div className="h-5 w-48 bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Horoscope Card Skeleton */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Sparkles className="w-12 h-12 text-accent-500 animate-pulse" />
              <p className="text-zinc-400 text-sm">Подготвяме хороскопа ти...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other cards skeleton */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="h-32 bg-zinc-800/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  )
}
