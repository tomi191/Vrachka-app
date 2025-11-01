import { Card, CardContent } from "@/components/ui/card";
import type { LifePathData } from "@/lib/numerology";

interface LifePathCardProps {
  data: LifePathData;
}

/**
 * Life Path Number Card Component
 *
 * Displays a single Life Path Number in a grid with emoji, number, title, and brief description
 */
export default function LifePathCard({ data }: LifePathCardProps) {
  return (
    <Card className="glass-card hover:border-purple-500/50 transition-all duration-300 group cursor-default h-full">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Number and Emoji */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="text-5xl group-hover:scale-110 transition-transform duration-300"
            style={{ filter: "drop-shadow(0 0 15px rgba(168, 85, 247, 0.3))" }}
          >
            {data.emoji}
          </div>
          <div>
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: data.color }}
            >
              {data.number}
            </div>
            <div className="text-lg font-semibold text-zinc-100">
              {data.title}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
          {data.description.substring(0, 120)}...
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {data.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
