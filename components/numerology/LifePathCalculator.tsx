"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Sparkles, ArrowRight } from "lucide-react";
import { calculateLifePathNumber, getLifePathMeaning } from "@/lib/numerology";
import Link from "next/link";

/**
 * Life Path Number Calculator Component
 *
 * Allows users to calculate their Life Path Number by entering birth date
 * Shows results with emoji, title, brief description, and CTA to register
 */
export default function LifePathCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    number: number;
    meaning: NonNullable<ReturnType<typeof getLifePathMeaning>>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    if (!birthDate) {
      setError("Моля, въведи дата на раждане");
      return;
    }

    try {
      const date = new Date(birthDate);

      // Validate date
      if (isNaN(date.getTime())) {
        setError("Невалидна дата");
        return;
      }

      // Check if date is in the future
      if (date > new Date()) {
        setError("Датата не може да бъде в бъдещето");
        return;
      }

      // Check if date is too far in the past (reasonable birth year)
      const year = date.getFullYear();
      if (year < 1900 || year > new Date().getFullYear()) {
        setError("Моля, въведи валидна година на раждане");
        return;
      }

      const number = calculateLifePathNumber(date);
      const meaning = getLifePathMeaning(number);

      if (!meaning) {
        setError("Грешка при изчисляване");
        return;
      }

      setResult({ number, meaning });
    } catch (err) {
      console.error("Calculation error:", err);
      setError("Грешка при изчисляване на личното число");
    }
  };

  const handleReset = () => {
    setBirthDate("");
    setResult(null);
    setError(null);
  };

  return (
    <Card className="glass-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-zinc-50 text-2xl">
          <Calculator className="w-7 h-7 text-purple-400" />
          Изчисли своето лично число
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!result ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="birthDate" className="text-zinc-300 text-base block font-medium">
                Дата на раждане
              </label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="bg-zinc-950/50 border-zinc-800 text-zinc-100"
              />
              <p className="text-xs text-zinc-500">
                Въведи пълната си дата на раждане (ден, месец, година)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleCalculate}
              disabled={!birthDate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Изчисли личното число
            </Button>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-zinc-400 text-sm text-center">
                💡 Личното число се изчислява чрез сумиране на всички цифри от датата ти на раждане
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Result Display */}
            <div className="text-center space-y-4 py-6">
              <div
                className="text-8xl mx-auto"
                style={{ filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))" }}
              >
                {result.meaning.emoji}
              </div>
              <div>
                <div
                  className="text-6xl font-bold mb-2"
                  style={{ color: result.meaning.color }}
                >
                  {result.number}
                </div>
                <div className="text-2xl font-semibold text-zinc-100">
                  {result.meaning.title}
                </div>
              </div>
            </div>

            {/* Brief Description */}
            <div className="p-6 bg-zinc-950/50 rounded-lg border border-zinc-800">
              <p className="text-zinc-300 text-center leading-relaxed">
                {result.meaning.description.substring(0, 200)}...
              </p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap justify-center gap-2">
              {result.meaning.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* CTA to Register */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg"
              >
                <Link href="/auth/register">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Регистрирай се за пълен анализ
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-zinc-700 hover:border-zinc-600"
              >
                Изчисли отново
              </Button>
            </div>

            {/* Benefits List */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-zinc-300 text-sm font-medium mb-2 text-center">
                Регистрирай се, за да получиш:
              </p>
              <ul className="text-zinc-400 text-sm space-y-1 text-center">
                <li>✓ Пълен анализ на личното число</li>
                <li>✓ Съвместимост с други числа</li>
                <li>✓ Кариерни препоръки</li>
                <li>✓ Силни страни и предизвикателства</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
