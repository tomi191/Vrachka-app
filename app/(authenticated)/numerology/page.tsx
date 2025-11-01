import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Star, Heart, Briefcase, TrendingUp, AlertCircle } from "lucide-react";
import { calculateLifePathNumber, getLifePathMeaning, getCompatibility } from "@/lib/numerology";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NumerologyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If no birth date, show message to add it
  if (!profile?.birth_date) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-6xl mb-6">🔢</div>
              <h1 className="text-3xl font-bold text-zinc-50 mb-4">
                Добави дата на раждане
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
                За да видиш своя пълен нумерологичен анализ, моля добави дата на раждане в профила си.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/profile/edit">Добави дата на раждане</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate Life Path Number
  const birthDate = new Date(profile.birth_date);
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const lifePathData = getLifePathMeaning(lifePathNumber);

  if (!lifePathData) {
    return (
      <div className="min-h-screen py-12 px-4">
        <Card className="glass-card max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-red-400 text-center">
              Грешка при изчисляване на личното число
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get compatibility with all numbers
  const compatibilityData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]
    .map((num) => {
      const compat = getCompatibility(lifePathNumber, num);
      const meaning = getLifePathMeaning(num);
      return compat && meaning ? { ...compat, number: num, emoji: meaning.emoji } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Твоят Нумерологичен Анализ
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50">
            {profile.full_name}, ти си
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {lifePathData.title}
            </span>
          </h1>
        </div>

        {/* Main Number Display */}
        <Card className="glass-card border-purple-500/30">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div
                className="text-9xl"
                style={{ filter: "drop-shadow(0 0 40px rgba(168, 85, 247, 0.6))" }}
              >
                {lifePathData.emoji}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-7xl font-bold mb-2" style={{ color: lifePathData.color }}>
                  {lifePathNumber}
                </div>
                <h2 className="text-3xl font-semibold text-zinc-100 mb-4">
                  {lifePathData.title}
                </h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {lifePathData.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-3">
          {lifePathData.keywords.map((keyword) => (
            <Badge
              key={keyword}
              className="px-4 py-2 text-base bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20"
            >
              {keyword}
            </Badge>
          ))}
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-zinc-900/50">
            <TabsTrigger value="strengths">
              <Star className="w-4 h-4 mr-2" />
              Силни страни
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <AlertCircle className="w-4 h-4 mr-2" />
              Предизвикателства
            </TabsTrigger>
            <TabsTrigger value="compatibility">
              <Heart className="w-4 h-4 mr-2" />
              Съвместимост
            </TabsTrigger>
            <TabsTrigger value="career">
              <Briefcase className="w-4 h-4 mr-2" />
              Кариера
            </TabsTrigger>
          </TabsList>

          {/* Strengths Tab */}
          <TabsContent value="strengths" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Твоите Силни Страни
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {lifePathData.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                          ✓
                        </div>
                        <p className="text-zinc-300 flex-1">{strength}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  Твоите Предизвикателства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <p className="text-zinc-400">
                    Тези предизвикателства са възможности за личностен растеж. Познаването им
                    ти помага да работиш съзнателно върху тях.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {lifePathData.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                          !
                        </div>
                        <p className="text-zinc-300 flex-1">{challenge}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-400" />
                  Съвместимост с други числа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <p className="text-zinc-400">
                    Разбери как се съчетаваш с хора с различни лични числа в любов,
                    приятелство и работни отношения.
                  </p>
                </div>
                <div className="space-y-3">
                  {compatibilityData.map((compat) => (
                    <div
                      key={compat.number}
                      className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{compat.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-semibold text-zinc-100">
                              Число {compat.number}
                            </span>
                            <Badge
                              className={
                                compat.score >= 8
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : compat.score >= 6
                                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                    : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                              }
                            >
                              {compat.score}/10
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-400">{compat.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Кариера и Призвание
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Препоръчани кариерни области
                    </h3>
                    <p className="text-zinc-300 leading-relaxed">{lifePathData.career}</p>
                  </div>

                  <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                      Как да постигнеш успех
                    </h3>
                    <ul className="space-y-2 text-zinc-300">
                      {lifePathData.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">→</span>
                          <span>Използвай силата си в: {strength.toLowerCase()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                      Внимавай с
                    </h3>
                    <ul className="space-y-2 text-zinc-300">
                      {lifePathData.challenges.slice(0, 3).map((challenge, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1">⚠</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="glass-card border-purple-500/30">
          <CardContent className="pt-8 pb-8 text-center">
            <h3 className="text-2xl font-bold text-zinc-50 mb-3">
              Искаш да научиш повече?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Открий как личното ти число се съчетава с твоята натална карта
              и разбери пълната картина на твоята астрологична и нумерологична същност.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/natal-chart">
                  <Star className="w-5 h-5 mr-2" />
                  Виж Натална Карта
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-zinc-700">
                <Link href="/dashboard">Обратно към Началото</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
