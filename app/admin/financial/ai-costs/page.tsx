import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowLeft, TrendingDown, Users, Activity } from "lucide-react";
import Link from "next/link";
import {
  getMonthAICosts,
  getAICostsByFeature,
  getAICostsByModel,
  getTopUsersByAICosts,
  getAICostsTimeline,
} from "@/lib/ai/cost-tracker";
import dynamic from "next/dynamic";

// Lazy load heavy chart components
const AICostsPieChart = dynamic(
  () => import("@/components/admin/charts/AICostsPieChart").then(mod => ({ default: mod.AICostsPieChart })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Зареждане на графика...</div>
      </div>
    )
  }
);

const MRRTrendChart = dynamic(
  () => import("@/components/admin/charts/MRRTrendChart").then(mod => ({ default: mod.MRRTrendChart })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Зареждане на графика...</div>
      </div>
    )
  }
);

export default async function AICostsPage() {
  const supabase = await createClient();

  // Проверка за админ
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  // Период за анализ - последните 30 дни
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const startOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  // Вземане на РЕАЛНИ данни
  const [
    totalMonthCosts,
    costsByFeature,
    costsByModel,
    topUsers,
    timeline,
  ] = await Promise.all([
    getMonthAICosts(),
    getAICostsByFeature(startOfMonth, endDate),
    getAICostsByModel(startDate, endDate),
    getTopUsersByAICosts(startDate, endDate, 10),
    getAICostsTimeline(startDate, endDate),
  ]);

  // Подготовка на данни за графиките
  const featureNames: Record<string, string> = {
    tarot: 'Таро четения',
    oracle: 'Врачката (Oracle)',
    horoscope: 'Хороскопи',
    daily_content: 'Дневно съдържание'
  };

  const totalCosts = Object.values(costsByFeature).reduce((sum, cost) => sum + Number(cost), 0);

  const pieChartData = Object.entries(costsByFeature).map(([feature, cost]) => ({
    име: featureNames[feature] || feature,
    разход: Number(cost),
    процент: totalCosts > 0 ? (Number(cost) / totalCosts) * 100 : 0,
  }));

  // Timeline данни за графика
  const chartData = timeline.map((item) => ({
    месец: new Date(item.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' }),
    aiРазходи: item.cost,
    mrr: 0, // Само AI разходи в тази графика
    печалба: -item.cost,
  }));

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заглавка */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/financial"
              className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад към Финансов преглед
            </Link>
            <h1 className="text-3xl font-bold text-zinc-50">AI Разходи</h1>
            <p className="text-zinc-400">Детайлна разбивка на AI разходи (OpenRouter)</p>
          </div>
        </div>

        {/* Главни метрики */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">Общо този месец</p>
                  <p className="text-3xl font-bold text-zinc-50">€{totalMonthCosts.toFixed(2)}</p>
                </div>
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">Общо (30 дни)</p>
                  <p className="text-3xl font-bold text-zinc-50">
                    €{Object.values(costsByModel).reduce((sum, cost) => sum + Number(cost), 0).toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">Активни потребители</p>
                  <p className="text-3xl font-bold text-zinc-50">{topUsers.length}</p>
                  <p className="text-xs text-zinc-500 mt-1">с AI usage</p>
                </div>
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">Общо AI calls</p>
                  <p className="text-3xl font-bold text-zinc-50">
                    {topUsers.reduce((sum, user) => sum + user.callCount, 0)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">последните 30 дни</p>
                </div>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Costs Pie Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                AI Разходи по функция
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <AICostsPieChart data={pieChartData} />
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма данни за AI разходи този месец
                </p>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                AI Разходи през време
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <MRRTrendChart data={chartData} />
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма данни за показване
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown по модел */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Разходи по AI модел</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(costsByModel).map(([model, cost]) => {
                const percentage = totalCosts > 0 ? (Number(cost) / totalCosts) * 100 : 0;

                return (
                  <div key={model} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-zinc-200">{model}</p>
                      <p className="text-sm font-bold text-zinc-100">€{Number(cost).toFixed(4)}</p>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{percentage.toFixed(1)}% от общо</p>
                  </div>
                );
              })}

              {Object.keys(costsByModel).length === 0 && (
                <p className="text-zinc-500 text-center py-4 text-sm">
                  Няма данни за AI модели
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top потребители */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Top 10 потребители по AI разходи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">#</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">User ID</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">AI Calls</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Общо разход</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Среден разход/call</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, index) => (
                    <tr key={user.userId || 'system'} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                      <td className="py-3 px-4 text-sm text-zinc-300">{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-mono text-zinc-300">
                        {user.userId ? user.userId.slice(0, 8) + '...' : 'System'}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-zinc-300">{user.callCount}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-zinc-100">
                        €{user.totalCost.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-zinc-400">
                        €{(user.totalCost / user.callCount).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {topUsers.length === 0 && (
                <p className="text-zinc-500 text-center py-8 text-sm">
                  Няма данни за потребители с AI usage
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Breakdown по функция (детайлно) */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Разходи по функция (детайлно)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(costsByFeature).map(([feature, cost]) => {
                const percentage = totalCosts > 0 ? (Number(cost) / totalCosts) * 100 : 0;

                return (
                  <div key={feature} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-zinc-200">
                        {featureNames[feature] || feature}
                      </p>
                      <p className="text-sm font-bold text-zinc-100">€{Number(cost).toFixed(4)}</p>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{percentage.toFixed(1)}% от общо</p>
                  </div>
                );
              })}

              {Object.keys(costsByFeature).length === 0 && (
                <p className="text-zinc-500 text-center py-4 text-sm">
                  Няма данни за AI разходи по функция
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
