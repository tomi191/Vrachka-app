import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getStripeRevenue } from "@/lib/stripe/analytics";
import { getMonthAICosts } from "@/lib/ai/cost-tracker";
import { FinancialReportsClient } from "@/components/admin/FinancialReportsClient";

export default async function FinancialReportsPage() {
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

  // Вземане на финансови данни
  const [revenueData, aiCosts] = await Promise.all([
    getStripeRevenue(),
    getMonthAICosts(),
  ]);

  // Изчисляване на P&L
  const revenue = revenueData.mrr;
  const costs = {
    ai: aiCosts,
    supabase: 0, // Можеш да добавиш реални разходи
    vercel: 0,
    other: 0,
  };

  const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0);
  const grossProfit = revenue - totalCosts;
  const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  // Месечен брейкдаун
  const currentMonth = new Date().toLocaleString('bg-BG', { month: 'long', year: 'numeric' });

  // Data for export
  const exportData = {
    period: currentMonth,
    revenue: {
      total: revenue,
      basic: {
        mrr: revenueData.subscriptionBreakdown.byPlan.basic.mrr,
        count: revenueData.subscriptionBreakdown.byPlan.basic.count,
      },
      ultimate: {
        mrr: revenueData.subscriptionBreakdown.byPlan.ultimate.mrr,
        count: revenueData.subscriptionBreakdown.byPlan.ultimate.count,
      },
    },
    costs,
    totalCosts,
    grossProfit,
    profitMargin,
  };

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin/financial"
            className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад към Финансов преглед
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50">Финансови отчети</h1>
              <p className="text-zinc-400">P&L Statement и export</p>
            </div>
            <FinancialReportsClient data={exportData} />
          </div>
        </div>

        {/* Period selector */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-400">Период</p>
                <p className="font-semibold text-zinc-100">{currentMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* P&L Statement */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Profit & Loss Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Revenue Section */}
              <div className="pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-semibold text-zinc-100">Приходи (Revenue)</p>
                    <p className="text-xs text-zinc-500">Subscription income</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    €{revenue.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 ml-4">
                  <div className="p-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Basic план</p>
                    <p className="font-semibold text-zinc-200">
                      €{revenueData.subscriptionBreakdown.byPlan.basic.mrr.toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {revenueData.subscriptionBreakdown.byPlan.basic.count} потребители
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950/50 rounded border border-accent-800/50">
                    <p className="text-xs text-zinc-500 mb-1">Ultimate план</p>
                    <p className="font-semibold text-accent-400">
                      €{revenueData.subscriptionBreakdown.byPlan.ultimate.mrr.toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {revenueData.subscriptionBreakdown.byPlan.ultimate.count} потребители
                    </p>
                  </div>
                </div>
              </div>

              {/* Costs Section */}
              <div className="pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-semibold text-zinc-100">Разходи (Costs)</p>
                    <p className="text-xs text-zinc-500">Operating expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    €{totalCosts.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2 ml-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-sm text-zinc-300">AI разходи (OpenRouter)</span>
                    <span className="font-semibold text-zinc-100">€{costs.ai.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-sm text-zinc-300">Supabase</span>
                    <span className="font-semibold text-zinc-100">€{costs.supabase.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-sm text-zinc-300">Vercel Hosting</span>
                    <span className="font-semibold text-zinc-100">€{costs.vercel.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="text-sm text-zinc-300">Други разходи</span>
                    <span className="font-semibold text-zinc-100">€{costs.other.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Profit Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-zinc-100">Печалба (Gross Profit)</p>
                    <p className="text-xs text-zinc-500">
                      {profitMargin.toFixed(1)}% profit margin
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {grossProfit >= 0 ? '+' : ''}€{grossProfit.toFixed(2)}
                  </p>
                </div>

                {/* Calculation breakdown */}
                <div className="p-4 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-2">Изчисление:</p>
                  <p className="text-sm font-mono text-zinc-300">
                    <span className="text-green-400">€{revenue.toFixed(2)}</span>
                    {' '}-{' '}
                    <span className="text-red-400">€{totalCosts.toFixed(2)}</span>
                    {' '}={' '}
                    <span className={grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      €{grossProfit.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">MRR</p>
                  <p className="text-2xl font-bold text-zinc-100">€{revenue.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Monthly Recurring Revenue</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Разходи</p>
                  <p className="text-2xl font-bold text-zinc-100">€{totalCosts.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Total Operating Costs</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Марж</p>
                  <p className="text-2xl font-bold text-zinc-100">{profitMargin.toFixed(1)}%</p>
                  <p className="text-xs text-zinc-500 mt-1">Profit Margin</p>
                </div>
                <div className={`text-3xl ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profitMargin >= 0 ? '📈' : '📉'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card className="glass-card border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-zinc-50 text-sm">Забележки</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
              <li>AI разходите се актуализират в реално време от OpenRouter API</li>
              <li>MRR се изчислява от активни Stripe subscriptions</li>
              <li>Supabase и Vercel разходите трябва да се въведат ръчно</li>
              <li>Данните се показват в EUR (€)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
