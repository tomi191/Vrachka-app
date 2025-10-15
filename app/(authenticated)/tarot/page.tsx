import { createClient } from "@/lib/supabase/server";
import { TarotReading } from "@/components/TarotReading";

export default async function TarotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const planType = (subscription?.plan_type || "free") as "free" | "basic" | "ultimate";

  return <TarotReading planType={planType} />;
}
