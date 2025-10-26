export default function Loading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-64 bg-zinc-800/50 rounded-lg animate-pulse" />
        <div className="h-5 w-96 bg-zinc-800/30 rounded-lg animate-pulse" />
      </div>

      {/* Form Card Skeleton */}
      <div className="glass-card p-6 space-y-6">
        <div className="h-8 w-48 bg-zinc-800/50 rounded-lg animate-pulse" />

        {/* Natal Chart Selector */}
        <div className="space-y-2">
          <div className="h-5 w-40 bg-zinc-800/30 rounded-lg animate-pulse" />
          <div className="h-12 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
        </div>

        {/* Forecast Type Selector */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-zinc-800/30 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse" />
            <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Info Box */}
        <div className="h-32 bg-zinc-800/30 rounded-lg animate-pulse" />

        {/* Button */}
        <div className="h-14 w-full bg-zinc-800/50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
