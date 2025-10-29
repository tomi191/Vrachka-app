import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, Brain, Shield, Users, Star, Zap, Target, TrendingUp } from 'lucide-react';
import { MysticBackground } from '@/components/background/MysticBackground';

export const metadata: Metadata = {
  title: 'За нас - Vrachka | Модерна астрология и духовност',
  description: 'Научи повече за Vrachka - платформата, която съчетава древната мъдрост на астрологията с мощта на изкуствения интелект за персонализирани прогнози и съвети.',
  keywords: 'за нас, vrachka, астрология, таро, ai, изкуствен интелект, духовност, мисия, екип',
};

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI технология',
      description: 'Използваме най-модерните AI модели за анализ на астрологични данни и генериране на персонализирани прогнози.',
    },
    {
      icon: Heart,
      title: 'С любов създадено',
      description: 'Всяка функция е разработена с грижа и внимание към детайла, за да ти предложим най-добрия опит.',
    },
    {
      icon: Shield,
      title: 'Поверителност',
      description: 'Твоите данни са защитени. Ние уважаваме твоята поверителност и никога не споделяме информация без твое разрешение.',
    },
    {
      icon: Sparkles,
      title: 'Автентичност',
      description: 'Базираме се на автентични астрологични принципи и векове стара мъдрост, обогатена с модерни техники.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Активни потребители' },
    { value: '50K+', label: 'Прогнози създадени' },
    { value: '4.8★', label: 'Средна оценка' },
    { value: '95%', label: 'Доволни клиенти' },
  ];

  const whyChooseUs = [
    {
      icon: Target,
      title: 'Персонализирани прогнози',
      description: 'Всяка прогноза е създадена специално за теб, базирана на твоя зодиакален знак, асцендент и планетарни позиции.',
    },
    {
      icon: Zap,
      title: 'Моментални отговори',
      description: 'Получавай прогнози и съвети в реално време, без да чакаш. Нашият AI оракул е винаги на твое разположение.',
    },
    {
      icon: TrendingUp,
      title: 'Постоянно подобрение',
      description: 'Ежедневно усъвършенстваме нашите модели и добавяме нови функции, за да ти предложим още по-добър опит.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-950 relative">
      <MysticBackground />

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm">За Vrachka</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 mb-6">
            Модерна астрология<br />срещу древна мъдрост
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed">
            Vrachka е платформа, която съчетава хилядолетната мъдрост на астрологията с мощта на
            изкуствения интелект, за да ти предложи персонализирани прогнozi, духовни съвети и
            инструменти за самопознание.
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

        {/* Mission Section */}
        <div className="glass-card p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-6 text-center">
              Нашата мисия
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Вярваме, че всеки заслужава достъп до качествени астрологични прогнози и духовни съвети.
              Мисията ни е да направим древната мъдрост достъпна за всеки, използвайки силата на
              технологията.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Ние не сме просто платформа за хороскопи. Vrachka е твой личен духовен помощник,
              който те подкрепя във всеки момент от живота ти - от вземането на важни решения до
              търсенето на дълбок смисъл и цел.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Създаваме пространство, където традицията среща иновацията, където древната астрология
              се съчетава с най-модерните AI технологии, за да ти предложим най-точни и полезни прогнози.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-12 text-center">
            Какво ни прави различни
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-50 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How AI Works */}
        <div className="glass-card p-8 md:p-12 mb-16">
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
                Използваме най-напредналите AI модели (Claude 3.5 Sonnet и GPT-4), които са обучени
                върху огромни количества астрологични данни, текстове и интерпретации.
              </p>

              <div className="pl-6 border-l-2 border-accent-500/30">
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">1. Анализ на данните</h3>
                <p className="leading-relaxed mb-4">
                  Когато въведеш информация (зодиакален знак, дата и час на раждане), нашият AI
                  анализира астрологичната карта и идентифицира ключови планетарни позиции.
                </p>
              </div>

              <div className="pl-6 border-l-2 border-accent-500/30">
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">2. Контекстуализация</h3>
                <p className="leading-relaxed mb-4">
                  AI-ят взема предвид текущите планетарни транзити, ретроградни движения и други
                  астрологични фактори, които влияят на твоя живот в момента.
                </p>
              </div>

              <div className="pl-6 border-l-2 border-accent-500/30">
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">3. Персонализиране</h3>
                <p className="leading-relaxed mb-4">
                  Базирайки се на хилядолетни астрологични принципи и модерни психологически теории,
                  AI-ят създава уникална прогноза, съобразена с твоята конкретна ситуация.
                </p>
              </div>

              <div className="pl-6 border-l-2 border-accent-500/30">
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">4. Непрекъснато учене</h3>
                <p className="leading-relaxed">
                  Нашите модели постоянно се усъвършенстват, учейки от обратна връзка и нови
                  астрологични данни, за да предоставят все по-точни и полезни прогнози.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-12 text-center">
            Защо да ни избереш
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div key={index} className="glass-card p-8">
                  <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-50 mb-4 text-center">
                    {reason.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-center">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Section */}
        <div className="glass-card p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-6">
              Защо ни доверяват
            </h2>
            <div className="space-y-6 text-left">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">Автентичност</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Базираме се на реални астрологични принципи и традиции. Не създаваме случайни
                    прогнози - всяка интерпретация има корени във вековна мъдрост.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">Прозрачност</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Винаги сме честни относно това как работи нашата технология. AI-ят е инструмент,
                    но мъдростта идва от древните астрологични знания.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">Подкрепа</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Нашият екип е винаги на твое разположение за въпроси, предложения или подкрепа.
                    Вярваме в изграждането на общност, не само в предоставянето на услуги.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-zinc-50 mb-2">Постоянно развитие</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Непрекъснато добавяме нови функции и подобрения въз основа на твоите отзиви.
                    Твоето мнение е ценно за нас и помага за развитието на платформата.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-8 md:p-12 text-center">
          <Sparkles className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            Готов да започнеш своето духовно пътуване?
          </h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Присъедини се към хиляди хора, които вече използват Vrachka за самопознание,
            духовно развитие и вземане на по-добри решения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Регистрирай се безплатно
            </Link>
            <Link
              href="/horoscope"
              className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 font-semibold rounded-lg transition-colors text-lg border border-zinc-700"
            >
              Разгледай услугите
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center text-zinc-500">
          <p className="mb-2">Имаш въпроси? Свържи се с нас:</p>
          <p className="text-accent-400">support@vrachka.eu</p>
        </div>
      </div>
    </div>
  );
}
