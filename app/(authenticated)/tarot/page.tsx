import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, CreditCard, Sparkles, Heart, Briefcase } from "lucide-react";

export default function TarotPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">
          Таро Оракул
        </h1>
        <p className="text-zinc-400">
          Открий мъдростта на древните карти
        </p>
      </div>

      {/* Card of the Day - Free */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50">Карта на деня</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[2/3] max-w-[200px] mx-auto mb-4 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center">
            <CreditCard className="w-16 h-16 text-accent-400" />
          </div>
          <button className="w-full px-4 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold">
            Разкрий картата
          </button>
        </CardContent>
      </Card>

      {/* Premium Features - Locked */}
      <div className="space-y-4">
        <PremiumFeatureCard
          title="Гадане с 3 карти"
          description="Минало, настояще, бъдеще"
          icon={<Sparkles className="w-8 h-8 text-accent-400" />}
        />
        <PremiumFeatureCard
          title="Любовно четене"
          description="5 карти за твоята връзка"
          icon={<Heart className="w-8 h-8 text-red-400" />}
        />
        <PremiumFeatureCard
          title="Кариерно четене"
          description="5 карти за професионалното ти развитие"
          icon={<Briefcase className="w-8 h-8 text-blue-400" />}
        />
      </div>
    </div>
  );
}

function PremiumFeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="glass-card relative overflow-hidden">
      <div className="absolute top-3 right-3">
        <Lock className="w-5 h-5 text-zinc-500" />
      </div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div>{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>
        </div>
        <button className="mt-4 w-full px-4 py-2 border border-accent-600 text-accent-300 rounded-lg hover:bg-accent-900/20 transition-colors text-sm">
          Отключи Премиум
        </button>
      </CardContent>
    </Card>
  );
}
