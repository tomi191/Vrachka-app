import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        <Card className="glass-card border-green-500/30">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="inline-flex p-6 bg-green-900/20 rounded-full border border-green-500/30">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-zinc-50">
                  Успешно абониране!
                </h1>
                <p className="text-zinc-300">
                  Добре дошъл в Vrachka Premium! Твоят абонамент е активен.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 text-left space-y-3">
                <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-400" />
                  Какво получаваш:
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Неограничени таро четения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Digital Oracle AI асистент</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Седмични и месечни прогнози</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Приоритетна поддръжка</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Към Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-900/50 transition-colors"
                >
                  Виж абонамента
                </Link>
              </div>

              {/* Note */}
              <p className="text-xs text-zinc-500">
                Ще получиш имейл с потвърждение на абонамента
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
