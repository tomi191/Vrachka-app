import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Crown,
  Activity,
  CreditCard,
  MessageSquare,
  FileText,
  Database
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch all statistics
  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: activeSubscriptions },
    { count: totalReadings },
    { count: totalConversations },
    { count: totalContent },
    { data: recentProfiles },
    { data: recentSubscriptions },
    { data: recentReadings },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).neq("plan_type", "free"),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("tarot_readings").select("*", { count: "exact", head: true }),
    supabase.from("oracle_conversations").select("*", { count: "exact", head: true }),
    supabase.from("daily_content").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("subscriptions").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("tarot_readings").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="min-h-screen bg-brand-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-50">Admin Dashboard</h1>
          <p className="text-zinc-400">Управление на Vrachka платформата</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Общо потребители"
            value={totalUsers || 0}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Premium потребители"
            value={premiumUsers || 0}
            icon={<Crown className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Активни абонаменти"
            value={activeSubscriptions || 0}
            icon={<Activity className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Таро четения"
            value={totalReadings || 0}
            icon={<CreditCard className="w-5 h-5" />}
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Oracle разговори"
            value={totalConversations || 0}
            icon={<MessageSquare className="w-5 h-5" />}
            color="cyan"
          />
          <StatCard
            title="Дневно съдържание"
            value={totalContent || 0}
            icon={<FileText className="w-5 h-5" />}
            color="pink"
          />
        </div>

        {/* Recent Profiles */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Последни потребители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProfiles && recentProfiles.length > 0 ? (
                recentProfiles.map((profile: any) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-zinc-100">{profile.full_name}</p>
                      <p className="text-sm text-zinc-400">
                        {profile.zodiac_sign} • Streak: {profile.daily_streak || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        {new Date(profile.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">Няма данни</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent-400" />
              Последни абонаменти
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubscriptions && recentSubscriptions.length > 0 ? (
                recentSubscriptions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-zinc-100">
                        {sub.profiles?.full_name || "Unknown"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        <span className="capitalize font-medium text-accent-400">
                          {sub.plan_type}
                        </span>
                        {" • "}
                        <span
                          className={
                            sub.status === "active"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {sub.status}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        {new Date(sub.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">Няма данни</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tarot Readings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              Последни таро четения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReadings && recentReadings.length > 0 ? (
                recentReadings.map((reading: any) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-zinc-100">
                        {reading.profiles?.full_name || "Unknown"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {reading.reading_type} • {reading.cards_count} карти
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        {new Date(reading.created_at).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">Няма данни</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-accent-500/30">
          <CardHeader>
            <CardTitle className="text-zinc-50 flex items-center gap-2">
              <Database className="w-5 h-5 text-accent-400" />
              Бързи действия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ActionButton label="Потребители" href="/admin/users" />
              <ActionButton label="Абонаменти" href="/admin/subscriptions" />
              <ActionButton label="Съдържание" href="/admin/content" />
              <ActionButton label="Настройки" href="/admin/settings" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-accent-400",
    green: "text-green-400",
    orange: "text-orange-400",
    cyan: "text-cyan-400",
    pink: "text-pink-400",
  };

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-3xl font-bold text-zinc-50 mt-1">{value}</p>
          </div>
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="px-4 py-3 bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800 rounded-lg transition-colors text-center text-zinc-200 font-medium"
    >
      {label}
    </a>
  );
}
