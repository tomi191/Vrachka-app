import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(`
      *,
      profiles (
        full_name,
        zodiac_sign
      )
    `)
    .order("created_at", { ascending: false });

  const { count: activeCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: premiumCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .neq("plan_type", "free");

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="text-zinc-400 hover:text-zinc-300 flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад към Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-50">Абонаменти</h1>
            <div className="flex gap-4 text-sm">
              <p className="text-zinc-400">
                Активни: <span className="text-green-400 font-semibold">{activeCount || 0}</span>
              </p>
              <p className="text-zinc-400">
                Premium: <span className="text-accent-400 font-semibold">{premiumCount || 0}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Free</p>
                  <p className="text-2xl font-bold text-zinc-50 mt-1">
                    {subscriptions?.filter((s: any) => s.plan_type === "free")
                      .length || 0}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-zinc-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Basic</p>
                  <p className="text-2xl font-bold text-zinc-50 mt-1">
                    {subscriptions?.filter((s: any) => s.plan_type === "basic")
                      .length || 0}
                  </p>
                </div>
                <Crown className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Ultimate</p>
                  <p className="text-2xl font-bold text-zinc-50 mt-1">
                    {subscriptions?.filter(
                      (s: any) => s.plan_type === "ultimate"
                    ).length || 0}
                  </p>
                </div>
                <Crown className="w-5 h-5 text-accent-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent-400" />
              Всички абонаменти
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscriptions && subscriptions.length > 0 ? (
                subscriptions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-zinc-100">
                        {sub.profiles?.full_name || "Unknown User"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {sub.profiles?.zodiac_sign || "N/A"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            sub.plan_type === "ultimate"
                              ? "bg-accent-900/30 text-accent-400"
                              : sub.plan_type === "basic"
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {sub.plan_type.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            sub.status === "active"
                              ? "bg-green-900/30 text-green-400"
                              : sub.status === "trialing"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 text-right space-y-1">
                      <p className="text-sm text-zinc-400">
                        Създаден:{" "}
                        {new Date(sub.created_at).toLocaleDateString("bg-BG")}
                      </p>
                      {sub.current_period_end && (
                        <p className="text-xs text-zinc-500">
                          Изтича:{" "}
                          {new Date(sub.current_period_end).toLocaleDateString(
                            "bg-BG"
                          )}
                        </p>
                      )}
                      {sub.stripe_customer_id && (
                        <p className="text-xs text-zinc-600">
                          Stripe: {sub.stripe_customer_id.substring(0, 12)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма абонаменти
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
