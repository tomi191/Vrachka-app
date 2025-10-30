import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Brain, Shield, Users, Star, Zap, Target, TrendingUp, BookOpen } from 'lucide-react';
import { MysticBackground } from '@/components/background/MysticBackground';
import { GradientText } from '@/components/ui/gradient-text';
import { Navigation } from '@/components/Navigation';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'За нас - Историята на Vrachka | Модерна астрология и духовност',
  description: 'Научете историята зад Vrachka.eu – как съчетахме древната мъдрост на астрологията с AI, за да създадем личен духовен пътеводител за всеки българин.',
  keywords: 'за нас, vrachka, история, екип, астрология, таро, ai, изкуствен интелект, духовност, мисия',
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const stats = [
    { value: '10K+', label: 'Доволни потребители' },
    { value: '50K+', label: 'Създадени прогнози' },
    { value: '4.8★', label: 'Средна оценка' },
    { value: '100%', label: 'Български проект' },
  ];

  return (
    <div className="min-h-screen bg-brand-950 relative">
      {/* Desktop: Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
      <div className="lg:hidden">
        {user ? <TopHeader /> : <Navigation />}
      </div>

      <MysticBackground />

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm">Нашата история</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 mb-6">
            <GradientText>От лично търсене до споделена мъдрост</GradientText>
          </h1>

          <p className="text-xl text-zinc-300 leading-relaxed">
            Vrachka се роди от едно лично пътуване – търсене на дълбок смисъл в един забързан свят. Искахме да направим древната мъдрост на звездите достъпна за всеки, по един модерен и разбираем начин. Така съчетахме астрологията с изкуствен интелект и създадохме вашия личен дигитален пътеводител.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story Section */}
        <div className="glass-card p-8 md:p-12 mb-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-6">
                Как започна всичко
              </h2>
              <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
                <p>
                  Като много от вас, и ние се сблъсквахме с ежедневни въпроси – за кариерата, любовта, за пътя напред. Търсехме отговори в древните знания, но информацията беше разпръсната, често неясна и труднодостъпна. Мечтаехме за място, където всеки може да получи точен, персонализиран и най-вече – разбираем астрологичен съвет.
                </p>
                <p>
                  Така се роди идеята за Vrachka. Решихме да използваме силата на изкуствения интелект, за да &ldquo;преведем&rdquo; сложния език на звездите. Целта ни не беше да заменим традицията, а да я направим по-достъпна от всякога.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/og-image-main.png"
                  alt="Основателят на Vrachka"
                  width={256}
                  height={256}
                  className="rounded-full object-cover shadow-2xl shadow-accent-500/20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* The Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-12 text-center">
            Екипът зад Vrachka
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="glass-card p-8 text-center">
              <Image
                src="/og-image-main.png"
                alt="Профилна снимка на основателя"
                width={128}
                height={128}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold text-zinc-50">Матей Стоев</h3>
              <p className="text-accent-400 mb-2">Основател и Визионер</p>
              <p className="text-zinc-400">
                &ldquo;Създадох Vrachka, за да помогна на хората да намерят своята пътека. Вярвам, че технологиите могат да бъдат мост към по-дълбокото разбиране на себе си.&rdquo;
              </p>
            </div>
            <div className="text-lg text-zinc-300 leading-relaxed">
              <p className="mb-4">
                Vrachka е плод на труда на малък, но отдаден екип от български разработчици, дизайнери и астролози.
              </p>
              <p>
                Обединява ни обща страст: да създадем качествен, полезен и красив продукт, който да носи стойност на хората в България. Ние не сме голяма корпорация, а хора като вас, които вярват в мисията си.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="glass-card p-8 md:p-12 mb-20 text-center">
          <BookOpen className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-6">
            Нашата мисия: Мъдрост за всеки
          </h2>
          <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Нашата мисия е да направим астрологията и духовните учения достъпни, разбираеми и полезни в ежедневието на всеки българин. Искаме да ви дадем инструменти, с които да взимате по-осъзнати решения и да живеете в хармония със себе си.
          </p>
        </div>

        {/* How AI Works */}
        <div className="glass-card p-8 md:p-12 mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-accent-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
                Как работи нашият AI
              </h2>
            </div>

            <div className="space-y-6 text-zinc-300">
              <p className="text-lg leading-relaxed">
                Ние използваме най-модерните AI модели, обучени върху огромна библиотека от астрологични текстове, за да създадем прогнози, които са едновременно точни и вдъхновяващи.
              </p>
              <div className="pl-6 border-l-2 border-accent-500/30 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">1. Астрологичен анализ</h3>
                  <p>AI анализира вашата рождена карта и текущите планетарни позиции, за да идентифицира ключови влияния.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">2. Тълкуване и синтез</h3>
                  <p>След това, моделът тълкува тези влияния, като ги свързва в цялостна и разбираема прогноза.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">3. Персонализация за вас</h3>
                  <p>Прогнозата се адаптира, за да бъде максимално релевантна и полезна за вашия живот, на ясен български език.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-8 md:p-12 text-center">
          <Sparkles className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Готови ли сте да погледнете към звездите?
          </h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Присъединете се към хиляди българи, които вече откриват себе си с Vrachka. Вашето пътуване започва сега.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Създай безплатен профил
            </Link>
            <Link
              href="/horoscope"
              className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 font-semibold rounded-lg transition-colors text-lg border border-zinc-700"
            >
              Разгледай хороскопите
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </div>
  );
}
