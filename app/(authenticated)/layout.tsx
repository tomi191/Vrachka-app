import { BottomNav } from "@/components/layout/bottom-nav";
import { TopHeader } from "@/components/layout/top-header";
import { Navigation } from "@/components/Navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { trackDailyVisit } from "@/app/actions/streak";
import { MysticBackground } from "@/components/background/MysticBackground";

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
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("daily_streak, onboarding_completed, full_name, trial_tier")
    .eq("id", user.id)
    .single();

  // Get subscription for plan badge
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_type, status")
    .eq("user_id", user.id)
    .single();

  const userPlan = profile?.trial_tier || subscription?.plan_type || 'free';

  console.log('[LAYOUT] Profile check:', {
    userId: user.id,
    email: user.email,
    profile,
    profileError,
    onboarding_completed: profile?.onboarding_completed,
  });

  if (!profile?.onboarding_completed) {
    console.log('[LAYOUT] Redirecting to /onboarding');
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystic-950 via-mystic-900 to-cosmic-950 relative">
      <MysticBackground />

      {/* Desktop: Public Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger menu */}
      <div className="lg:hidden">
        <TopHeader streak={profile?.daily_streak || 0} />
      </div>

      {/* Main content - no sidebar offset anymore */}
      <main className="container max-w-lg lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-20 lg:pb-8 pt-20 relative z-10">
        {children}
      </main>

      {/* Bottom Navigation - mobile only */}
      <BottomNav />
    </div>
  );
}
