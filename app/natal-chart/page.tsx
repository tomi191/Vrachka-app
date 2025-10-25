import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import { GradientText } from '@/components/ui/gradient-text';
import { NatalChartForm } from './NatalChartForm';
import { NatalChartList } from './NatalChartList';
import { Sparkles, Star, Moon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Натална Карта',
  description: 'Създай детайлна натална карта с AI интерпретация. Открий своите силни страни, предизвикателства и жизнен път чрез астрологичен анализ.',
};

export default async function NatalChartPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/natal-chart');
  }

  // Get user profile to check plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, trial_tier, subscription_tier')
    .eq('id', user.id)
    .single();

  const userPlan = profile?.trial_tier || profile?.subscription_tier || 'free';
  const hasAccess = userPlan === 'ultimate';

  // Get existing natal charts
  const { data: charts } = await supabase
    .from('natal_charts')
    .select('id, birth_date, birth_time, birth_location, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <MysticBackground />

        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
              <Star className="w-4 h-4" />
              <span>Ultimate Feature</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Натална Карта
              </GradientText>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Открий своя космически план и духовно предназначение
            </p>
          </div>

          {/* Access Check */}
          {!hasAccess ? (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-4">
                    <Sparkles className="w-8 h-8 text-accent-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-50 mb-2">
                    Натал

ната карта е Ultimate функция
                  </h2>
                  <p className="text-zinc-400">
                    Надградете до Ultimate план за достъп до детайлна натална карта с AI интерпретация
                  </p>
                </div>

                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <Moon className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-200 font-medium">Пълна астрологична карта</p>
                      <p className="text-sm text-zinc-400">
                        Позиции на всички планети, къщи и аспекти
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-200 font-medium">AI интерпретация</p>
                      <p className="text-sm text-zinc-400">
                        Детайлен анализ на личността, силните страни и предизвикателствата
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-accent-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-200 font-medium">Жизнен път</p>
                      <p className="text-sm text-zinc-400">
                        Препоръки за кариера, отношения и личностно развитие
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <Sparkles className="w-5 h-5" />
                  Надградете до Ultimate
                </a>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Create New Chart */}
              <div>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-2xl font-bold text-zinc-50 mb-4">
                    Създай Нова Натална Карта
                  </h2>
                  <p className="text-zinc-400 mb-6">
                    Въведи данни за рождението си за да получиш детайлна астрологична интерпретация
                  </p>

                  <NatalChartForm />
                </div>

                {/* How it works */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-zinc-50 mb-4">
                    Как работи?
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0">
                        1
                      </div>
                      <p className="text-zinc-400">
                        Въведи дата, час и място на раждане
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0">
                        2
                      </div>
                      <p className="text-zinc-400">
                        Изчисляваме позициите на планетите и аспектите
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0">
                        3
                      </div>
                      <p className="text-zinc-400">
                        AI генерира детайлна интерпретация на български език
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 font-bold text-xs flex-shrink-0">
                        4
                      </div>
                      <p className="text-zinc-400">
                        Разглеждаш визуализация и препоръки за жизнения си път
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Saved Charts */}
              <div>
                <div className="glass-card p-6">
                  <h2 className="text-2xl font-bold text-zinc-50 mb-4">
                    Твоите Натални Карти
                  </h2>
                  <p className="text-zinc-400 mb-6">
                    {charts && charts.length > 0
                      ? `Имаш ${charts.length} запазени натални карти`
                      : 'Все още нямаш създадени натални карти'}
                  </p>

                  <NatalChartList charts={charts || []} />
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
