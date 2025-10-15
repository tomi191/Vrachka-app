import { createClient } from "@/lib/supabase/server";
import { ReferralCard } from "./ReferralCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Gift } from "lucide-react";
import Link from "next/link";

export default async function ReferralPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get or create referral code
  let { data: referralCode } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("referrer_user_id", user!.id)
    .single();

  // If no code exists, create one
  if (!referralCode) {
    const code = generateReferralCode(user!.email!);

    const { data: newCode } = await supabase
      .from("referral_codes")
      .insert({
        referrer_user_id: user!.id,
        code: code,
        uses_count: 0,
      })
      .select()
      .single();

    referralCode = newCode;
  }

  // Get referral redemptions count
  const { count } = await supabase
    .from("referral_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("referrer_user_id", user!.id);

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

      {/* Referral Card */}
      <Card className="glass-card border-accent-500/30">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent-400" />
            Покани приятел
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralCard
            code={referralCode?.code || ""}
            usesCount={count || 0}
          />
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 text-lg">Как работи?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Step
            number={1}
            title="Сподели своя код"
            description="Изпрати уникалния си референтен код на приятели"
          />
          <Step
            number={2}
            title="Те се регистрират"
            description="Когато се регистрират с твоя код, и двамата получавате награда"
          />
          <Step
            number={3}
            title="Получаваш награда"
            description="За всеки нов premium потребител получаваш 7 дни Ultimate безплатно!"
          />
        </CardContent>
      </Card>

      {/* Stats */}
      {count && count > 0 ? (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-accent-400">{count}</p>
              <p className="text-zinc-300">
                {count === 1
                  ? "приятел се присъедини"
                  : "приятели се присъединиха"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

// Generate unique referral code from email
function generateReferralCode(email: string): string {
  const username = email.split("@")[0].toUpperCase();
  const randomNum = Math.floor(Math.random() * 10000);
  return `${username}${randomNum}`;
}
