import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, Crown, Flame } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      *,
      subscriptions (
        plan_type,
        status
      )
    `)
    .order("created_at", { ascending: false });

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

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
            <h1 className="text-3xl font-bold text-zinc-50">Потребители</h1>
            <p className="text-zinc-400">Общо: {totalUsers || 0} потребители</p>
          </div>
        </div>

        {/* Users Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Всички потребители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profiles && profiles.length > 0 ? (
                profiles.map((profile: any) => {
                  const subscription = profile.subscriptions?.[0];
                  const isPremium = subscription?.plan_type !== "free";

                  return (
                    <div
                      key={profile.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-lg font-bold">
                          {profile.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-zinc-100">
                              {profile.full_name}
                            </p>
                            {isPremium && (
                              <Crown className="w-4 h-4 text-accent-400" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-400">
                            {profile.zodiac_sign}
                            {" • "}
                            {new Date(profile.birth_date).toLocaleDateString(
                              "bg-BG"
                            )}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-400" />
                              Streak: {profile.daily_streak || 0}
                            </span>
                            {subscription && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isPremium
                                    ? "bg-accent-900/30 text-accent-400"
                                    : "bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                {subscription.plan_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 text-right">
                        <p className="text-sm text-zinc-400">
                          Регистриран:{" "}
                          {new Date(profile.created_at).toLocaleDateString(
                            "bg-BG"
                          )}
                        </p>
                        <p className="text-xs text-zinc-500">
                          ID: {profile.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-zinc-500 text-center py-8">
                  Няма регистрирани потребители
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
