import { createClient } from "@/lib/supabase/server";
import { CareerReading } from "@/components/CareerReading";

export default async function CareerReadingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const hasAccess = subscription?.plan_type === "ultimate";

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <CareerReading hasAccess={hasAccess} />
    </div>
  );
}
