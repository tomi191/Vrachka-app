import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Zap,
  ArrowLeft,
  Activity
} from "lucide-react";
import Link from "next/link";
import { getStripeRevenue, getChurnRate } from "@/lib/stripe/analytics";
import { getMonthAICosts, getAICostsByFeature } from "@/lib/ai/cost-tracker";
import { getStripeMode, getModeEmoji, getModeColorClass } from "@/lib/stripe/mode-detector";

export default async function FinancialPage() {
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

  // Вземане на РЕАЛНИ финансови данни
  const [revenueData, aiCostsMonth, aiCostsByFeature, churnRate] = await Promise.all([
    getStripeRevenue(),
    getMonthAICosts(),
    getAICostsByFeature(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date()
    ),
    getChurnRate(),
  ]);

  const stripeMode = getStripeMode();
  const totalCosts = aiCostsMonth; // Засега само AI разходи
  const profit = revenueData.mrr - totalCosts;
  const profitMargin = revenueData.mrr > 0 ? (profit / revenueData.mrr) * 100 : 0;

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заглавка */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад към Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-50">Финансов преглед</h1>
            <p className="text-zinc-400">Приходи, разходи и печалба</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="MRR (Месечни приходи)"
            value={`€${revenueData.mrr.toFixed(2)}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="blue"
            subtitle={`${revenueData.totalActiveSubscriptions} активни`}
          />

          <MetricCard
            title="ARR (Годишни приходи)"
            value={`€${revenueData.arr.toFixed(2)}`}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
            subtitle="прогнозни"
          />

          <MetricCard
            title="AI Разходи (месец)"
            value={`€${aiCostsMonth.toFixed(2)}`}
            icon={<Zap className="w-5 h-5" />}
            color="orange"
            subtitle="OpenRouter API"
          />

          <MetricCard
            title="Печалба (месец)"
            value={`€${profit.toFixed(2)}`}
            icon={<Activity className="w-5 h-5" />}
            color={profit >= 0 ? "green" : "red"}
            subtitle={`${profitMargin.toFixed(1)}% марж`}
          />
        </div>

        {/* Subscription breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Абонаменти по план
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic план */}
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-zinc-100">Basic план</p>
                    <p className="text-sm text-zinc-400">€5.00/месец</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-100">
                      {revenueData.subscriptionBreakdown.byPlan.basic.count}
                    </p>
                    <p className="text-xs text-zinc-500">потребители</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    MRR: <span className="text-zinc-100 font-medium">
                      €{revenueData.subscriptionBreakdown.byPlan.basic.mrr.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Ultimate план */}
              <div className="p-4 bg-zinc-950/50 border border-accent-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-zinc-100">Ultimate план</p>
                    <p className="text-sm text-zinc-400">€10.00/месец</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-400">
                      {revenueData.subscriptionBreakdown.byPlan.ultimate.count}
                    </p>
                    <p className="text-xs text-zinc-500">потребители</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-accent-800/30">
                  <p className="text-sm text-zinc-400">
                    MRR: <span className="text-accent-400 font-medium">
                      €{revenueData.subscriptionBreakdown.byPlan.ultimate.mrr.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI разходи breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-zinc-50 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                AI Разходи по функция
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(aiCostsByFeature).map(([feature, cost]) => {
                const featureNames: Record<string, string> = {
                  tarot: 'Таро четения',
                  oracle: 'Врачката (Oracle)',
                  horoscope: 'Хороскопи',
                  daily_content: 'Дневно съдържание'
                };

                const percentage = aiCostsMonth > 0 ? (Number(cost) / aiCostsMonth) * 100 : 0;

                return (
                  <div key={feature} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-zinc-200">
                        {featureNames[feature] || feature}
                      </p>
                      <p className="text-sm font-bold text-zinc-100">
                        €{Number(cost).toFixed(2)}
                      </p>
                    </div>
                    {/* Progress bar */}
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

              {Object.keys(aiCostsByFeature).length === 0 && (
                <p className="text-zinc-500 text-center py-4 text-sm">
                  Няма данни за AI разходи този месец
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Бързи линкове */}
        <Card className="glass-card border-accent-500/30">
          <CardHeader>
            <CardTitle className="text-zinc-50">Детайлни отчети</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/financial/ai-costs"
                className="p-4 bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800 rounded-lg transition-colors text-center"
              >
                <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="font-medium text-zinc-200">AI Разходи</p>
                <p className="text-xs text-zinc-500">Детайлна разбивка</p>
              </Link>

              <Link
                href="/admin/financial/revenue"
                className="p-4 bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800 rounded-lg transition-colors text-center"
              >
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="font-medium text-zinc-200">Приходи</p>
                <p className="text-xs text-zinc-500">Subscription аналитика</p>
              </Link>

              <Link
                href="/admin/financial/reports"
                className="p-4 bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800 rounded-lg transition-colors text-center"
              >
                <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="font-medium text-zinc-200">Отчети</p>
                <p className="text-xs text-zinc-500">P&L и експорт</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Допълнителни метрики */}
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
              <p className="text-sm text-zinc-400 mb-1">Средна стойност</p>
              <p className="text-2xl font-bold text-zinc-100">
                €{revenueData.totalActiveSubscriptions > 0
                  ? (revenueData.mrr / revenueData.totalActiveSubscriptions).toFixed(2)
                  : '0.00'
                }
              </p>
              <p className="text-xs text-zinc-500 mt-1">ARPU (на потребител/месец)</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">AI cost/user</p>
              <p className="text-2xl font-bold text-zinc-100">
                €{revenueData.totalActiveSubscriptions > 0
                  ? (aiCostsMonth / revenueData.totalActiveSubscriptions).toFixed(3)
                  : '0.000'
                }
              </p>
              <p className="text-xs text-zinc-500 mt-1">Среден AI разход на потребител</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
    red: "text-red-400",
    purple: "text-accent-400",
  };

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-zinc-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-zinc-50">{value}</p>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
