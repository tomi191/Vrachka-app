import { createClient } from "@/lib/supabase/server";
import { ThreeCardSpread } from "@/components/ThreeCardSpread";

export default async function ThreeCardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const isPremium = subscription?.plan_type !== "free";

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <ThreeCardSpread isPremium={isPremium} />
    </div>
  );
}
