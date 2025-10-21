import { BottomNav } from "@/components/layout/bottom-nav";
import { TopHeader } from "@/components/layout/top-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { trackDailyVisit } from "@/app/actions/streak";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Track daily visit for streak (must await to update before fetching profile)
  await trackDailyVisit();

  // Get user profile for streak (fetched AFTER streak update)
  const { data: profile } = await supabase
    .from("profiles")
    .select("daily_streak, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystic-950 via-mystic-900 to-cosmic-950">
      <TopHeader streak={profile?.daily_streak || 0} />

      {/* Main content with bottom padding for nav */}
      <main className="container max-w-lg mx-auto px-4 pb-20 pt-6">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
