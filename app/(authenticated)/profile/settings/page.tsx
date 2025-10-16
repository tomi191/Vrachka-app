import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { PushNotificationSettings } from "@/components/PushNotificationPrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        href="/profile"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад към профил
      </Link>

      {/* Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50">Настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm userEmail={user?.email || ""} />
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50">Нотификации</CardTitle>
        </CardHeader>
        <CardContent>
          <PushNotificationSettings />
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="glass-card border-blue-500/20">
        <CardContent className="pt-6">
          <p className="text-sm text-zinc-400">
            Настройките ти помагат да персонализираш опита във Vrachka.
            Всички промени се запазват автоматично.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
