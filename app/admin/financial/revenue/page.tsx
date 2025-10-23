import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowLeft, TrendingUp, Users, CreditCard } from "lucide-react";
import Link from "next/link";
import { getStripeRevenue, getChurnRate, getRecentSubscriptionEvents } from "@/lib/stripe/analytics";
import dynamic from "next/dynamic";
import { getStripeMode, getModeEmoji, getModeColorClass } from "@/lib/stripe/mode-detector";

// Lazy load chart component with loading fallback
const SubscriptionBarChart = dynamic(
  () => import("@/components/admin/charts/SubscriptionBarChart").then(mod => ({ default: mod.SubscriptionBarChart })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Зареждане на графика...</div>
      </div>
    )
  }
);

export default async function RevenuePage() {
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

  // Вземане на РЕАЛНИ данни от Stripe
  const [revenueData, churnRate, recentEvents] = await Promise.all([
    getStripeRevenue(),
    getChurnRate(),
    getRecentSubscriptionEvents(20),
  ]);

  const stripeMode = getStripeMode();

  // Подготовка на данни за графиките
  const subscriptionChartData = [
    {
      план: 'Basic',
      потребители: revenueData.subscriptionBreakdown.byPlan.basic.count,
      mrr: revenueData.subscriptionBreakdown.byPlan.basic.mrr,
    },
    {
      план: 'Ultimate',
      потребители: revenueData.subscriptionBreakdown.byPlan.ultimate.count,
      mrr: revenueData.subscriptionBreakdown.byPlan.ultimate.mrr,
    },
  ];

  const avgRevenuePerUser = revenueData.totalActiveSubscriptions > 0
    ? revenueData.mrr / revenueData.totalActiveSubscriptions
    : 0;

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
            <h1 className="text-3xl font-bold text-zinc-50">Приходи (Subscription Analytics)</h1>
            <p className="text-zinc-400">РЕАЛНИ данни от Stripe API</p>
          </div>

          {/* Stripe Mode Badge */}
          <div className={`px-4 py-2 rounded-lg border ${getModeColorClass()}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getModeEmoji()}</span>
              <div>
                <p className="text-xs opacity-80">Stripe Режим</p>
                <p className="font-bold">{stripeMode === 'test' ? 'ТЕСТ' : 'АКТИВЕН'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Главни метрики */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">MRR (Месечни приходи)</p>
                  <p className="text-3xl font-bold text-zinc-50">€{revenueData.mrr.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">от Stripe API</p>
                </div>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">ARR (Годишни приходи)</p>
                  <p className="text-3xl font-bold text-zinc-50">€{revenueData.arr.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">прогнозни</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">Активни абонати</p>
                  <p className="text-3xl font-bold text-zinc-50">{revenueData.totalActiveSubscriptions}</p>
                  <p className="text-xs text-zinc-500 mt-1">текущо активни</p>
                </div>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">ARPU</p>
                  <p className="text-3xl font-bold text-zinc-50">€{avgRevenuePerUser.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">среден приход/user</p>
                </div>
                <CreditCard className="w-5 h-5 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Абонаменти по план
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionBarChart data={subscriptionChartData} />

            {/* Детайлна таблица */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic план */}
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-zinc-100 text-lg">Basic План</p>
                    <p className="text-sm text-zinc-400">€5.00/месец</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-zinc-100">
                      {revenueData.subscriptionBreakdown.byPlan.basic.count}
                    </p>
                    <p className="text-xs text-zinc-500">потребители</p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">MRR:</span>
                    <span className="text-zinc-100 font-medium">
                      €{revenueData.subscriptionBreakdown.byPlan.basic.mrr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">% от общ MRR:</span>
                    <span className="text-zinc-100 font-medium">
                      {revenueData.mrr > 0
                        ? ((revenueData.subscriptionBreakdown.byPlan.basic.mrr / revenueData.mrr) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">ARR (прогнозен):</span>
                    <span className="text-zinc-100 font-medium">
                      €{(revenueData.subscriptionBreakdown.byPlan.basic.mrr * 12).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ultimate план */}
              <div className="p-4 bg-zinc-950/50 border border-accent-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-zinc-100 text-lg">Ultimate План</p>
                    <p className="text-sm text-zinc-400">€10.00/месец</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-accent-400">
                      {revenueData.subscriptionBreakdown.byPlan.ultimate.count}
                    </p>
                    <p className="text-xs text-zinc-500">потребители</p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-accent-800/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">MRR:</span>
                    <span className="text-accent-400 font-medium">
                      €{revenueData.subscriptionBreakdown.byPlan.ultimate.mrr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">% от общ MRR:</span>
                    <span className="text-accent-400 font-medium">
                      {revenueData.mrr > 0
                        ? ((revenueData.subscriptionBreakdown.byPlan.ultimate.mrr / revenueData.mrr) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">ARR (прогнозен):</span>
                    <span className="text-accent-400 font-medium">
                      €{(revenueData.subscriptionBreakdown.byPlan.ultimate.mrr * 12).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Churn & Retention */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Churn Rate</p>
              <p className="text-2xl font-bold text-zinc-100">{churnRate.toFixed(1)}%</p>
              <p className="text-xs text-zinc-500 mt-1">Процент отписани този месец</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Retention Rate</p>
              <p className="text-2xl font-bold text-green-400">{(100 - churnRate).toFixed(1)}%</p>
              <p className="text-xs text-zinc-500 mt-1">Процент задържани абонати</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">LTV (прогнозна)</p>
              <p className="text-2xl font-bold text-zinc-100">
                €{churnRate > 0 ? (avgRevenuePerUser / (churnRate / 100)).toFixed(2) : '∞'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Lifetime Value на customer</p>
            </CardContent>
          </Card>
        </div>

        {/* Последни subscription събития */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50">Последни subscription събития</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Subscription ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">План</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Статус</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Сума</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Начало</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event: any) => (
                    <tr key={event.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                      <td className="py-3 px-4 text-sm font-mono text-zinc-300">
                        {event.subscription_id.slice(0, 16)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-300">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.plan_type === 'ultimate'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {event.plan_type === 'basic' ? 'Basic' : 'Ultimate'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-300">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-zinc-100">
                        €{Number(event.amount_usd).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-400">
                        {new Date(event.started_at).toLocaleDateString('bg-BG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentEvents.length === 0 && (
                <p className="text-zinc-500 text-center py-8 text-sm">
                  Няма subscription събития в базата данни
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
