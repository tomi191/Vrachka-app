import { createClient } from "@/lib/supabase/server";
import { getGreeting, getDayOfWeek, formatDate } from "@/lib/utils";
import { zodiacSigns, type ZodiacSign } from "@/lib/zodiac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CreditCard, Star, Heart, TrendingUp } from "lucide-react";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import { MoonPhaseWidget } from "@/components/MoonPhaseWidget";
import LifePathNumberWidget from "@/components/numerology/LifePathNumberWidget";
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

  // Get subscription to check if user has Ultimate plan
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_type, status")
    .eq("user_id", user!.id)
    .single();

  // Check if user has Ultimate plan (trial takes priority)
  const userPlan = profile?.trial_tier || subscription?.plan_type || 'free';
  const hasUltimatePlan = userPlan === 'ultimate';

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
          userPlan={userPlan as 'free' | 'basic' | 'ultimate'}
        />
      )}

      {/* Moon Phase Tracker */}
      <MoonPhaseWidget zodiacSign={profile?.zodiac_sign as ZodiacSign | undefined} />

      {/* Life Path Number Widget */}
      <LifePathNumberWidget
        birthDate={profile?.birth_date ? new Date(profile.birth_date) : null}
        userName={profile?.full_name}
      />

      {/* Ultimate Plan Features */}
      {hasUltimatePlan && (
        <div className="space-y-4">
          {/* Natal Chart Card */}
          <Card className="glass-card border-accent-500/30">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-400" />
                Натална Карта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Открий своята астрологична карта на раждането и разбери планетарните влияния в живота ти
              </p>
              <Link href="/natal-chart" className="block w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-center font-semibold">
                Изчисли картата
              </Link>
            </CardContent>
          </Card>

          {/* Synastry Card */}
          <Card className="glass-card border-red-500/30">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Синастрия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Открий астрологичната ви съвместимост с партньор. Любов, комуникация, сексуална химия и дългосрочен потенциал.
              </p>
              <Link href="/synastry" className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-colors text-center font-semibold">
                Анализирай съвместимостта
              </Link>
            </CardContent>
          </Card>

          {/* Personal Horoscope Card */}
          <Card className="glass-card border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Личен Хороскоп
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Персонализирана месечна или годишна прогноза базирана на твоята натална карта и текущи транзити.
              </p>
              <Link href="/personal-horoscope" className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors text-center font-semibold">
                Генерирай прогноза
              </Link>
            </CardContent>
          </Card>
        </div>
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
          <Link href="/tarot-readings" className="block w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-center font-semibold">
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
