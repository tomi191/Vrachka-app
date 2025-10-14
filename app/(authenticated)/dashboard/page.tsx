import { createClient } from "@/lib/supabase/server";
import { getGreeting, getDayOfWeek, formatDate } from "@/lib/utils";
import { zodiacSigns, type ZodiacSign } from "@/lib/zodiac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Briefcase, Activity, Sparkles, CreditCard } from "lucide-react";

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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-zinc-50">
            <span className="text-3xl">{zodiac?.emoji}</span>
            <div>
              <div>Твоят хороскоп за днес</div>
              <div className="text-sm font-normal text-zinc-400">
                {zodiac?.name}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-200 leading-relaxed">
            Днес е ден на нови възможности. Звездите благоприятстват твоите
            начинания и ти дават енергия за постигане на целите. Обърни внимание
            на интуицията си - тя те води в правилната посока.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-zinc-400">Любов</div>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Heart key={i} className="w-5 h-5 text-red-400 fill-red-400" />
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400">Кариера</div>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Briefcase key={i} className="w-5 h-5 text-blue-400 fill-blue-400" />
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-zinc-400">Здраве</div>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Activity key={i} className="w-5 h-5 text-green-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">Късметлийски числа</div>
            <div className="flex gap-2">
              {[7, 15, 23].map((num) => (
                <div
                  key={num}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-100 font-semibold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
          <button className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors">
            Разкрий картата
          </button>
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
            <button className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-full transition-colors text-sm font-semibold">
              Виж плановете
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
