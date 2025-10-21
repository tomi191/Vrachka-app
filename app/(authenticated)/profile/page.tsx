import { createClient } from "@/lib/supabase/server";
import { zodiacSigns, type ZodiacSign } from "@/lib/zodiac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, LogOut, Crown, Flame, History } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const zodiac = profile ? zodiacSigns[profile.zodiac_sign as ZodiacSign] : null;
  const isPremium = subscription?.plan_type !== "free";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile?.avatar_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-accent-500/30">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "User"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-3xl font-bold ring-2 ring-accent-500/30">
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-zinc-100">
                {profile?.full_name}
              </h2>
              <p className="text-zinc-400 flex items-center gap-2 mt-1">
                <span className="text-xl">{zodiac?.emoji}</span>
                {zodiac?.name}
              </p>
            </div>
          </div>

          {/* Streak */}
          <div className="mt-4 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Streak</span>
              <span className="text-2xl font-bold text-orange-500 flex items-center gap-2">
                <Flame className="w-6 h-6" />
                {profile?.daily_streak || 0} дни
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card className={`${
        isPremium
          ? "glass-card border-accent-500/30"
          : "glass-card"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Crown className="w-5 h-5 text-accent-400" />
            Абонамент
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">План</span>
                <span className="font-semibold text-zinc-100 capitalize">
                  {subscription?.plan_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Статус</span>
                <span className="font-semibold text-green-400">Активен</span>
              </div>
              {subscription?.current_period_end && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm">Изтича</span>
                  <span className="text-zinc-400 text-sm">
                    {new Date(subscription.current_period_end).toLocaleDateString("bg-BG")}
                  </span>
                </div>
              )}
              <ManageSubscriptionButton />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-zinc-300">Безплатен план</p>
              <Link
                href="/pricing"
                className="block w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold text-center"
              >
                Виж Premium плановете
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="space-y-2">
        <MenuButton icon={<History />} label="История на четенията" href="/profile/history" />
        <MenuButton icon={<User />} label="Редакция на профила" href="/profile/edit" />
        <MenuButton icon={<Settings />} label="Настройки" href="/profile/settings" />
        <MenuButton icon={<Crown />} label="Покани приятел" href="/profile/referral" />
      </div>

      {/* Logout */}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full px-4 py-3 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Изход
        </button>
      </form>
    </div>
  );
}

function MenuButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href} className="block w-full px-4 py-3 glass-card rounded-lg transition-colors flex items-center gap-3 text-left hover:bg-zinc-800/50">
      <div className="text-zinc-400">{icon}</div>
      <span className="text-zinc-200">{label}</span>
    </Link>
  );
}
