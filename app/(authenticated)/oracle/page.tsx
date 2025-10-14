import { createClient } from "@/lib/supabase/server";
import { OracleChat } from "@/components/OracleChat";

export default async function OraclePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const isPremium = subscription?.plan_type !== "free" && subscription?.status === "active";

  return <OracleChat isPremium={isPremium} />;
}
