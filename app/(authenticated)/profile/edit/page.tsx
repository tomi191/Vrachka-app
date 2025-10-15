import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "./EditProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

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

      {/* Edit Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50">Редакция на профила</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
