"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getZodiacSign, zodiacSigns } from "@/lib/zodiac";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const zodiacSign = birthDate ? getZodiacSign(new Date(birthDate)) : null;

  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      setError("Моля въведи име");
      return;
    }
    if (step === 2 && !birthDate) {
      setError("Моля избери рождена дата");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!birthDate) {
      setError("Моля избери рождена дата");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Не си логнат");

      const zodiac = getZodiacSign(new Date(birthDate));

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: fullName.trim(),
        birth_date: birthDate,
        birth_time: birthTime || null,
        birth_place: birthPlace.trim() || null,
        zodiac_sign: zodiac,
        onboarding_completed: true,
      });

      if (profileError) throw profileError;

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Onboarding error:", error);
      setError(error instanceof Error ? error.message : "Грешка при запазване");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-all ${
                s <= step ? "bg-accent-500" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-6">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold gradient-text">
                    Добре дошъл!
                  </h1>
                  <p className="text-zinc-400">
                    Как да те наричаме?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Твоето име
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Например: Мария"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleNext}
                  variant="default"
                  className="w-full"
                  size="lg"
                >
                  Напред
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Birth Date */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold gradient-text">
                    Отлично, {fullName}!
                  </h1>
                  <p className="text-zinc-400">
                    Коя е твоята рождена дата?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Дата на раждане
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Zodiac Display */}
                {zodiacSign && (
                  <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg text-center space-y-2">
                    <div className="text-4xl">
                      {zodiacSigns[zodiacSign].emoji}
                    </div>
                    <div className="text-xl font-semibold text-zinc-100">
                      {zodiacSigns[zodiacSign].name}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {zodiacSigns[zodiacSign].dates}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Назад
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="default"
                    className="flex-1"
                    size="lg"
                  >
                    Напред
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Optional Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold gradient-text">
                    Последна стъпка!
                  </h1>
                  <p className="text-zinc-400">
                    Допълнителна информация (по желание)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Час на раждане
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    За по-точни астрологични прогнози
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Място на раждане
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Град, държава"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Назад
                  </Button>
                  <Button
                    onClick={handleComplete}
                    variant="default"
                    className="flex-1"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Запазване..." : "Готово!"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skip (only on step 3) */}
        {step === 3 && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full text-center text-sm text-zinc-500 hover:text-zinc-400"
          >
            Пропусни тази стъпка
          </button>
        )}
      </div>
    </div>
  );
}
