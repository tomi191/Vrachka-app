import { createClient } from "@/lib/supabase/server";
import { getGreeting, getDayOfWeek, formatDate } from "@/lib/utils";
import { zodiacSigns, type ZodiacSign } from "@/lib/zodiac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CreditCard } from "lucide-react";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const zodiac = profile ? zodiacSigns[profile.zodiac_sign as ZodiacSign] : null;
  const greeting = getGreeting();
  const dayOfWeek = getDayOfWeek();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-50">
          {greeting}, {profile?.full_name}!
        </h1>
        <p className="text-zinc-400 capitalize">
          {dayOfWeek}, {formatDate(new Date())}
        </p>
      </div>

      {/* Daily Horoscope */}
      {zodiac && profile && (
        <HoroscopeCard
          zodiacSign={profile.zodiac_sign}
          zodiacEmoji={zodiac.emoji}
          zodiacName={zodiac.name}
        />
      )}

      {/* Card of the Day Teaser */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent-400" />
            Карта на деня
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300 mb-4">
            Открий своето послание от таро картите
          </p>
          <Link href="/tarot" className="block w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-center font-semibold">
            Разкрий картата
          </Link>
        </CardContent>
      </Card>

      {/* Premium Teaser */}
      <Card className="glass-card border-accent-500/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Sparkles className="w-8 h-8 text-accent-400 mx-auto" />
            <h3 className="text-lg font-semibold text-zinc-100">
              Отключи Премиум
            </h3>
            <p className="text-sm text-zinc-300">
              Седмични хороскопи, таро четения и AI оракул
            </p>
            <Link href="/pricing" className="inline-block px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-full transition-colors text-sm font-semibold">
              Виж плановете
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
