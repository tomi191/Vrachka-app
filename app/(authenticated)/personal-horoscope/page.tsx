import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PersonalHoroscopeForm } from './PersonalHoroscopeForm';
import { Lock, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function PersonalHoroscopePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, trial_tier')
    .eq('id', user.id)
    .single();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, status')
    .eq('id', user.id)
    .single();

  // Check if user has Ultimate plan
  const userPlan = profile?.trial_tier || subscription?.plan_type || 'free';
  const hasUltimatePlan = userPlan === 'ultimate';

  // Get user's natal charts
  const { data: natalCharts } = await supabase
    .from('natal_charts')
    .select('id, birth_date, birth_time, birth_location, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Get recent personal horoscopes
  const { data: recentHoroscopes } = await supabase
    .from('personal_horoscopes')
    .select('id, forecast_type, start_date, end_date, generated_at')
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-accent-400" />
          Личен Хороскоп
        </h1>
        <p className="text-zinc-400">
          Персонализирана прогноза базирана на твоята натална карта и текущи транзити
        </p>
      </div>

      {/* Ultimate Plan Lock Screen */}
      {!hasUltimatePlan && (
        <div className="glass-card p-8 text-center border-accent-500/30">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-4">
            <Lock className="w-8 h-8 text-accent-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-50 mb-3">
            Ultimate План Функция
          </h2>
          <p className="text-zinc-300 mb-6 max-w-md mx-auto">
            Личният хороскоп е достъпен само за Ultimate план потребители.
            Upgrade сега и получи персонализирани месечни и годишни прогнози.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
            >
              Виж Ultimate План
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-lg transition-colors"
            >
              Назад към Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Ultimate Plan Access */}
      {hasUltimatePlan && (
        <>
          {/* No Natal Chart Warning */}
          {(!natalCharts || natalCharts.length === 0) && (
            <div className="glass-card p-6 border-yellow-500/30">
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">
                    Нужна е натална карта
                  </h3>
                  <p className="text-zinc-300 mb-4">
                    За да генерираш личен хороскоп, първо трябва да имаш изчислена натална карта.
                  </p>
                  <Link
                    href="/natal-chart"
                    className="inline-block px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    Изчисли натална карта
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {natalCharts && natalCharts.length > 0 && (
            <PersonalHoroscopeForm
              userName={profile?.full_name || 'Човек'}
              natalCharts={natalCharts}
            />
          )}

          {/* Recent Horoscopes */}
          {recentHoroscopes && recentHoroscopes.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-zinc-50 mb-4">
                Последни Хороскопи
              </h2>
              <div className="space-y-3">
                {recentHoroscopes.map((horoscope) => (
                  <Link
                    key={horoscope.id}
                    href={`/personal-horoscope/${horoscope.id}`}
                    className="block p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-zinc-100 capitalize">
                          {horoscope.forecast_type === 'monthly' ? 'Месечен' : 'Годишен'} хороскоп
                        </div>
                        <div className="text-sm text-zinc-400">
                          {new Date(horoscope.start_date).toLocaleDateString('bg-BG')} - {new Date(horoscope.end_date).toLocaleDateString('bg-BG')}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(horoscope.generated_at).toLocaleDateString('bg-BG')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
