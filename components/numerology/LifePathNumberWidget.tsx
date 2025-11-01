"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ExternalLink, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateLifePathNumber, getLifePathMeaning } from "@/lib/numerology";

interface LifePathNumberWidgetProps {
  birthDate: Date | null;
  userName?: string;
}

/**
 * Life Path Number Widget for Dashboard
 *
 * Shows the user's Life Path Number with emoji, basic meaning,
 * and link to detailed analysis page.
 */
export default function LifePathNumberWidget({
  birthDate,
  userName,
}: LifePathNumberWidgetProps) {
  // Calculate Life Path Number
  const lifePathData = useMemo(() => {
    if (!birthDate) return null;

    try {
      const number = calculateLifePathNumber(birthDate);
      const meaning = getLifePathMeaning(number);
      return { number, meaning };
    } catch (error) {
      console.error("Life Path Number calculation error:", error);
      return null;
    }
  }, [birthDate]);

  // If no birth date, show CTA to add it
  if (!birthDate) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-zinc-50">
            <Calculator className="w-6 h-6 text-purple-400" />
            <div className="flex-1">
              <div>Твоето Лично Число</div>
              <div className="text-sm font-normal text-zinc-400">
                Открий своята нумерологична същност
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-6xl">🔢</div>
            <p className="text-zinc-400 text-center text-sm">
              За да видиш своето лично число, добави дата на раждане в профила си.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/profile/edit">
                Добави дата на раждане
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If calculation failed
  if (!lifePathData || !lifePathData.meaning) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-red-400 text-center">
            Грешка при изчисляване на личното число
          </p>
        </CardContent>
      </Card>
    );
  }

  const { number, meaning } = lifePathData;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-zinc-50">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <div className="flex-1">
            <div>Твоето Лично Число</div>
            <div className="text-sm font-normal text-zinc-400">
              {userName ? `${userName}, ти си ${meaning.title}` : meaning.title}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Life Path Number Display */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-7xl" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))' }}>
            {meaning.emoji}
          </div>
          <div className="flex-1">
            <div className="text-4xl font-bold mb-1" style={{ color: meaning.color }}>
              {number}
            </div>
            <div className="text-lg font-semibold text-zinc-100">
              {meaning.title}
            </div>
          </div>
        </div>

        {/* Brief Description */}
        <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800 mb-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            {meaning.description.substring(0, 150)}...
          </p>
        </div>

        {/* Key Keywords */}
        <div className="flex flex-wrap gap-2 mb-6">
          {meaning.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              {keyword}
            </span>
          ))}
        </div>

        {/* CTA to full analysis */}
        <Button
          asChild
          variant="outline"
          className="w-full border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10"
        >
          <Link href="/numerology">
            <span className="flex-1">Виж пълен анализ</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {/* Public Calculator Link */}
        <div className="mt-3 text-center">
          <Link
            href="/life-path-number"
            className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors inline-flex items-center gap-1"
          >
            <Calculator className="w-3 h-3" />
            Калкулатор за лично число
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
