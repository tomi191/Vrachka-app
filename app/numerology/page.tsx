import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Sparkles, Heart, TrendingUp, Star, ChevronRight, Clock, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllLifePathNumbers, getLifePathMeaning } from '@/lib/numerology';

export const metadata: Metadata = {
  title: 'Нумерология | Езикът на Числата | Vrachka',
  description:
    'Открий тайния език на числата с Vrachka. Научи какво разкриват числата за теб - личност, съдба, връзки и призвание. Безплатни нумерологични калкулатори и пълни анализи.',
  keywords: [
    'нумерология',
    'лично число',
    'езикът на числата',
    'нумерологичен анализ',
    'life path number',
    'карма число',
    'съвместимост по числа',
    'нумеролог',
    'vrachka нумерология',
    'врачка числа',
    'духовна нумерология',
    'значение на числата',
    'майсторски числа',
  ],
  openGraph: {
    title: 'Нумерология - Езикът на Числата | Vrachka',
    description: 'Открий какво разкриват числата за твоята личност, съдба и призвание.',
    type: 'website',
    url: 'https://vrachka.eu/numerology',
    images: [
      {
        url: '/og-numerology.jpg',
        width: 1200,
        height: 630,
        alt: 'Нумерология - Vrachka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Нумерология - Езикът на Числата',
    description: 'Открий какво разкриват числата за твоята личност и призвание.',
    images: ['/og-numerology.jpg'],
  },
  alternates: {
    canonical: 'https://vrachka.eu/numerology',
  },
};

const numerologyServices = [
  {
    id: 'life-path',
    title: 'Лично Число',
    emoji: '✨',
    description: 'Открий своето Life Path Number - най-важното число в нумерологията. То разкрива твоята същност, мисия и жизнен път.',
    features: [
      'Изчисление от дата на раждане',
      'Пълен анализ на личността',
      'Съвместимост с други числа',
      'Кариерни препоръки',
    ],
    available: true,
    link: '/life-path-number',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'karma',
    title: 'Карма Число',
    emoji: '🔄',
    description: 'Разбери кармичните ти задачи и уроците, които душата ти трябва да научи в този живот.',
    features: [
      'Кармични дългове',
      'Духовни уроци',
      'Минали животи',
      'Еволюция на душата',
    ],
    available: false,
    link: '#',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'compatibility',
    title: 'Съвместимост',
    emoji: '💕',
    description: 'Провери нумерологичната съвместимост с партньор, приятел или колега според личните ви числа.',
    features: [
      'Любовна съвместимост',
      'Приятелска връзка',
      'Бизнес партньорство',
      'Семейна хармония',
    ],
    available: false,
    link: '#',
    color: 'from-red-600 to-pink-600',
  },
  {
    id: 'yearly-cycle',
    title: 'Годишен Цикъл',
    emoji: '📅',
    description: 'Разкрий какво те очаква през настоящата година според личното ти число и годишния цикъл.',
    features: [
      'Прогноза за годината',
      'Благоприятни периоди',
      'Предизвикателства',
      'Месечни влияния',
    ],
    available: false,
    link: '#',
    color: 'from-green-600 to-emerald-600',
  },
];

const numerologyBenefits = [
  {
    icon: '🔢',
    title: 'Числата като код',
    description: 'Всяко число носи уникална вибрация и енергия. Нумерологията дешифрира този код и разкрива скритата информация за теб.',
  },
  {
    icon: '✨',
    title: 'Твоята духовна карта',
    description: 'Личното число е духовната ти карта - показва кой си, накъде отиваш и какво трябва да научиш по пътя.',
  },
  {
    icon: '🎯',
    title: 'Път към себепознанието',
    description: 'Нумерологията ти помага да разбереш силните си страни, предизвикателствата и истинското си призвание.',
  },
];

const faqItems = [
  {
    question: 'Какво е нумерология?',
    answer: 'Нумерологията е древна метафизична наука, която изучава връзката между числата и живота. Тя разкрива как числата от нашата дата на раждане и име влияят на нашата личност, съдба и жизнен път.',
  },
  {
    question: 'Как работи нумерологията?',
    answer: 'Нумерологията е базирана на принципа, че всяко число носи специфична вибрация и енергия. Чрез специални изчисления на датата на раждане и името, нумеролозите определят ключови числа, които разкриват различни аспекти на личността и съдбата.',
  },
  {
    question: 'Какво е Лично число (Life Path Number)?',
    answer: 'Личното число е най-важното число в нумерологията. То се изчислява от пълната дата на раждане и показва твоята жизнена мисия, таланти, предизвикателства и пътя, който душата ти трябва да измине.',
  },
  {
    question: 'Защо числата 11, 22 и 33 са специални?',
    answer: 'Числата 11, 22 и 33 се наричат "майсторски числа" и носят по-висока духовна вибрация. Те не се редуцират до единична цифра и означават особен духовен потенциал и отговорност.',
  },
  {
    question: 'Колко точна е нумерологията?',
    answer: 'Нумерологията е метод за самопознание, а не точна наука. Много хора намират нумерологичните анализи за изключително точни и полезни за разбиране на себе си. Точността зависи от опита на нумеролога и отвореността на човека.',
  },
];

export default function NumerologyPage() {
  const allNumbers = getAllLifePathNumbers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-zinc-800/50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          {/* Badge */}
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 text-sm">
            <Calculator className="w-4 h-4 mr-2" />
            Безплатни Нумерологични Калкулатори
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 leading-tight">
            Нумерология
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Езикът на Числата
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Открий какво разкриват числата за твоята личност, съдба, връзки и призвание.
            Древна мъдрост в помощ на съвременния човек.
          </p>

          {/* Quick Features */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: Calculator, text: 'Безплатни калкулатори' },
              { icon: Sparkles, text: 'Пълни анализи' },
              { icon: Heart, text: 'Съвместимост' },
              { icon: TrendingUp, text: 'Кариерни съвети' },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full"
              >
                <feature.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
            >
              <Link href="/life-path-number">
                <Calculator className="w-5 h-5 mr-2" />
                Изчисли личното си число
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 hover:border-zinc-600"
            >
              <Link href="/auth/register">Регистрация за пълен достъп</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What is Numerology Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Какво е Нумерология?
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Древна система за самопознание, която разкрива връзката между числата и живота
            </p>
          </div>

          <div className="glass-card p-8 md:p-10 mb-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                Нумерологията е древна метафизична наука, която изучава мистичната връзка между числата и
                събитията в живота. Тя е била практикувана от цивилизации като древните египтяни, гърци,
                китайци и евреи още преди хилядолетия.
              </p>
              <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                Според нумерологията, всяко число носи уникална вибрация и енергия, която влияе на нашата
                личност, поведение, взаимоотношения и жизнен път. Датата на раждане и името ни не са случайни -
                те съдържат важна информация за това кои сме и какво трябва да постигнем в този живот.
              </p>
              <p className="text-zinc-300 leading-relaxed text-lg">
                Най-известният нумеролог в историята е древногръцкият философ и математик <strong className="text-purple-400">Питагор</strong>,
                който е разработил система, според която &ldquo;всичко може да бъде изразено чрез числа&rdquo;. Неговите учения
                са в основата на съвременната нумерология.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {numerologyBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="glass-card p-6 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-3">{benefit.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Нумерологични Услуги
            </h2>
            <p className="text-lg text-zinc-400">
              Изследвай различните аспекти на нумерологията
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {numerologyServices.map((service) => (
              <div
                key={service.id}
                className={`glass-card p-8 relative overflow-hidden group ${
                  service.available ? 'hover:border-purple-500/50' : 'opacity-75'
                } transition-all duration-300`}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                {/* Coming Soon Badge */}
                {!service.available && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Очаквайте скоро
                    </Badge>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="text-5xl mb-4">{service.emoji}</div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-3">{service.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                        <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {service.available ? (
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90`}
                    >
                      <Link href={service.link}>
                        <Calculator className="w-4 h-4 mr-2" />
                        Опитай сега
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Очаквайте скоро
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Overview Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Нумерологични Числа
            </h2>
            <p className="text-lg text-zinc-400">
              Кратък преглед на значенията на личните числа
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {allNumbers.map((num) => {
              const meaning = getLifePathMeaning(num);
              if (!meaning) return null;
              return (
                <div
                  key={num}
                  className="glass-card p-4 text-center hover:border-purple-500/50 transition-all duration-300 group cursor-default"
                >
                  <div
                    className="text-4xl mb-2 group-hover:scale-110 transition-transform"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))' }}
                  >
                    {meaning.emoji}
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: meaning.color }}>
                    {num}
                  </div>
                  <div className="text-xs text-zinc-400">{meaning.title}</div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-500/30 hover:border-purple-500/50"
            >
              <Link href="/life-path-number">
                <Star className="w-5 h-5 mr-2" />
                Виж пълната информация за всички числа
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
              Често Задавани Въпроси
            </h2>
            <p className="text-lg text-zinc-400">
              Всичко, което трябва да знаеш за нумерологията
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details key={index} className="glass-card p-6 group">
                <summary className="text-lg font-semibold text-zinc-100 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-purple-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-zinc-400 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="text-6xl mb-4">🔢✨</div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
                Готов да откриеш езика на числата?
              </h2>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">
                Започни своето пътешествие към себепознанието с безплатния ни калкулатор за
                Лично число. Регистрирай се за достъп до пълни анализи и всички нумерологични услуги!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
                >
                  <Link href="/life-path-number">
                    <Calculator className="w-5 h-5 mr-2" />
                    Изчисли личното си число
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 hover:border-zinc-600"
                >
                  <Link href="/auth/register">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Регистрирай се безплатно
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
