import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SynastryForm } from "./SynastryForm";

export default async function SynastryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile to check plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, trial_tier, trial_end")
    .eq("id", user.id)
    .single();

  // Get subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_type, status")
    .eq("user_id", user.id)
    .single();

  // Check if user has Ultimate plan
  const userPlan = profile?.trial_tier || subscription?.plan_type || 'free';
  const hasUltimatePlan = userPlan === 'ultimate';

  // Get user's natal charts
  const { data: natalCharts } = await supabase
    .from("natal_charts")
    .select("id, birth_date, birth_time, birth_location")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Синастрия</h1>
        <p className="text-zinc-400 mt-2">
          Астрологична съвместимост с партньор
        </p>
      </div>

      <SynastryForm
        hasUltimatePlan={hasUltimatePlan}
        natalCharts={natalCharts || []}
        userName={profile?.full_name || 'Човек 1'}
      />
    </div>
  );
}
