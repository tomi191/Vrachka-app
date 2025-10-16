import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Card Skeleton */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Зареждане на профила...</p>
        </div>
      </div>
    </div>
  )
}
