import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Moon, Sparkles, Heart, Zap, Star, Sun, ChevronDown } from 'lucide-react';
import { StructuredData, getBreadcrumbSchema, getFAQSchema } from '@/components/StructuredData';
import { GradientText } from '@/components/ui/gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Navigation } from '@/components/Navigation';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Footer } from '@/components/Footer';
import { MysticBackground } from '@/components/background/MysticBackground';
import { BentoTestimonials } from '@/components/landing/BentoTestimonials';
import { LiveMoonPhaseWidget } from '@/components/moon/LiveMoonPhaseWidget';
import { MoonCalendar } from '@/components/moon/MoonCalendar';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Лунна Магия: Фази на Луната и Календар | Врачка',
  description: 'Открий силата на лунните фази с Врачка. Нашият лунен календар ще те води през цикъла, а духовните ни практики ще ти помогнат да използваш енергията на луната за любов, успехи и личностно израстване.',
  keywords: [
    'лунен календар',
    'фази на луната',
    'луна фази',
    'новолуние',
    'пълнолуние',
    'луна днес',
    'vrachka лунен календар',
    'врачка луна',
    'лунни ритуали',
    'духовна луна',
    'енергия на луната',
    'астрология луна',
    'лунна магия'
  ],
  openGraph: {
    title: 'Лунен Календар и Фази на Луната | Vrachka',
    description: 'Следи луната в реално време. Лунен календар, духовни практики и ритуали.',
    images: ['/api/og?title=Лунен Календар&description=Следи луната в реално време'],
  },
  alternates: {
    canonical: '/moon-phase',
  },
};

const moonPhases = [
  {
    id: 'new',
    name: 'Новолуние',
    emoji: '🌑',
    description: 'Началото на всичко',
    energy: 'Посей семената на своите мечти. Луната ти дава празно платно – нарисувай бъдещето, което желаеш.',
    rituals: ['Създай Карта на желанията', 'Медитация за ново начало', 'Запиши своите намерения в лунния си дневник'],
  },
  {
    id: 'waxing-crescent',
    name: 'Нарастващ сърп',
    emoji: '🌒',
    description: 'Първи лъчи надежда',
    energy: 'Време е за първите стъпки. Вложи енергия в намеренията си и наблюдавай как започват да покълват.',
    rituals: ['Започни нов проект', 'Изгради си нов навик', 'Планирай според лунния календар'],
  },
  {
    id: 'first-quarter',
    name: 'Първа четвърт',
    emoji: '🌓',
    description: 'Първото изпитание',
    energy: 'Появяват се първите предизвикателства. Бъди решителен и отстоявай целите си с увереност.',
    rituals: ['Вземи важно решение', 'Преодолей конкретно препятствие', 'Работи с енергията на луната'],
  },
  {
    id: 'waxing-gibbous',
    name: 'Нарастваща Луна',
    emoji: '🌔',
    description: 'Почти на върха',
    energy: 'Енергията се натрупва. Време е да усъвършенстваш детайлите и да се подготвиш за кулминацията.',
    rituals: ['Финализирай детайли', 'Подготви се за успех', 'Довери се на лунния цикъл'],
  },
  {
    id: 'full',
    name: 'Пълнолуние',
    emoji: '🌕',
    description: 'Магия и Кулминация',
    energy: 'Най-мощната фаза. Време за празнуване на постигнатото и освобождаване от всичко, което ти пречи.',
    rituals: ['Ритуал за благодарност при пълнолуние', 'Церемония за освобождаване', 'Зареди своите кристали под лунната светлина'],
  },
  {
    id: 'waning-gibbous',
    name: 'Намаляваща Луна',
    emoji: '🌖',
    description: 'Споделена мъдрост',
    energy: 'След еуфорията на пълнолунието е време да споделиш наученото и да благодариш за уроците.',
    rituals: ['Сподели своята мъдрост', 'Направи равносметка на лунния цикъл', 'Дари или помогни на някого'],
  },
  {
    id: 'last-quarter',
    name: 'Последна четвърт',
    emoji: '🌗',
    description: 'Време за пускане',
    energy: 'Освободи се от старите товари. Прости на себе си и на другите, за да направиш място за новото.',
    rituals: ['Ритуал за прошка', 'Изчисти дома си с тамян', 'Напиши и изгори списък с товари'],
  },
  {
    id: 'waning-crescent',
    name: 'Балсамова Луна',
    emoji: '🌘',
    description: 'Почивка и презареждане',
    energy: 'Най-тъмната фаза преди новото начало. Време е за дълбока почивка, сънища и интуитивни прозрения.',
    rituals: ['Отдай се на почивка', 'Запиши сънищата си в лунен дневник', 'Медитирай в тишина'],
  },
];

const faqData = [
  {
    question: 'Какво е лунна фаза?',
    answer: 'Лунната фаза показва каква част от Луната виждаме осветена от Слънцето. Пълният лунен цикъл продължава около 29.5 дни и включва 8 основни фази, всяка със своята уникална енергия и значение в астрологията.',
  },
  {
    question: 'Как влияе луната на човека?',
    answer: 'Точно както Луната управлява приливите и отливите, нейната гравитация и енергия влияят и на нас. В духовните практики, всяка лунна фаза се свързва с различни емоции и възможности – новолунието е за нови начала, а пълнолунието – за кулминация и освобождаване.',
  },
  {
    question: 'Кога е следващото пълнолуние?',
    answer: 'Нашият лунен календар се обновява в реално време. Погледни го по-горе, за да видиш точните дати на следващото пълнолуние, новолуние и всички останали фази за месеца.',
  },
  {
    question: 'Какво да правя при новолуние?',
    answer: 'Новолунието е твоят шанс за рестарт. Това е идеалният момент да поставиш намеренията си за следващия лунен месец. Препоръчваме ти да медитираш, да си направиш Карта на желанията или просто да запишеш целите си.',
  },
  {
    question: 'Какво да правя при пълнолуние?',
    answer: 'Пълнолунието е време за празнуване и освобождаване. Благодари за постигнатото и се освободи от всичко, което ти пречи. Един прекрасен ритуал е да напишеш на лист всичко, с което се разделяш, и да го изгориш (безопасно).',
  },
  {
    question: 'Точен ли е лунният календар на Vrachka?',
    answer: 'Абсолютно! Лунният календар на Vrachka използва Swiss Ephemeris - най-точната астрономическа библиотека за изчисляване на лунни позиции. Това гарантира професионално ниво на точност.',
  },
  {
    question: 'Може ли луната да влияе на съня?',
    answer: 'Много хора споделят, че сънят им е по-неспокоен около пълнолуние. Въпреки че науката все още изследва темата, в астрологията пълнолунието традиционно се свързва с по-интензивни сънища и прилив на енергия, които могат да повлияят на съня.',
  },
];

const breadcrumbData = getBreadcrumbSchema([
  { name: 'Начало', url: 'https://www.vrachka.eu' },
  { name: 'Лунен Календар', url: 'https://www.vrachka.eu/moon-phase' },
]);

const faqSchema = getFAQSchema(faqData);

export default async function MoonPhasePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <StructuredData data={faqSchema} />

      {/* Desktop: Navigation with Profile dropdown */}
      <div className="hidden lg:block">
        <Navigation user={user} />
      </div>

      {/* Mobile: TopHeader with hamburger (if logged in) or Navigation */}
      <div className="lg:hidden">
        {user ? <TopHeader /> : <Navigation />}
      </div>

      <MysticBackground />

      <div className="min-h-screen bg-gradient-dark">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-6">
              <Moon className="w-4 h-4" />
              <span>Безплатно</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Живей в Ритъма на Луната
              </GradientText>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Луната, нашият мълчалив спътник, е огледало на вътрешния ни свят. Нейният цикъл на растеж и смаляване е древен танц, който влияе на всичко живо. С лунния календар на Vrachka ще се свържеш с този космически ритъм, ще разбереш езика на лунните фази и ще използваш тяхната енергия, за да превърнеш желанията си в реалност.
            </p>
          </div>

          {/* Live Moon Phase Widget + Calendar - Side by Side on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Live Moon Phase Widget */}
            <div className="flex flex-col">
              <LiveMoonPhaseWidget />
            </div>

            {/* Moon Calendar */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-zinc-50 text-center mb-8">
                Лунен Календар
              </h2>
              <MoonCalendar />
            </div>
          </div>

          {/* 8 Moon Phases Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-50 text-center mb-4">
              8-те Лунни Фази
            </h2>
            <p className="text-zinc-400 text-center mb-8 max-w-2xl mx-auto">
              Всяка лунна фаза носи уникална енергия и духовно значение. Научи как да използваш силата на всяка фаза.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moonPhases.map((phase) => (
                <div
                  key={phase.id}
                  className="glass-card card-hover h-full p-6 border-2 border-accent-500/20"
                >
                  {/* Emoji */}
                  <div className="flex justify-center mb-4">
                    <div className="text-6xl">{phase.emoji}</div>
                  </div>

                  {/* Name */}
                  <h3 className="text-center text-xl font-bold text-zinc-50 mb-2">
                    {phase.name}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-sm text-zinc-400 mb-4">
                    {phase.description}
                  </p>

                  {/* Energy */}
                  <div className="mb-4 p-3 bg-accent-500/10 rounded-lg border border-accent-500/20">
                    <div className="text-xs font-semibold text-accent-300 mb-1">
                      Енергия
                    </div>
                    <div className="text-sm text-zinc-300">{phase.energy}</div>
                  </div>

                  {/* Rituals */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 mb-2">
                      Препоръчани практики:
                    </div>
                    <div className="space-y-1">
                      {phase.rituals.map((ritual, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-zinc-400"
                        >
                          <div className="w-1 h-1 rounded-full bg-accent-400"></div>
                          <span>{ritual}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="max-w-6xl mx-auto space-y-24 mb-16">
            {/* Section 1: How to Use Moon Energy */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <Image
                  src="/images/moon-phase/how-to-use-moon-energy.png"
                  alt="Жена държи светещ кристал под пълнолуние"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Как да Използваш Енергията на Луната</h2>
                <p>
                  Луната преминава през пълен цикъл от 29.5 дни, като всяка фаза носи уникална енергия, която можем да използваме в живота си. Работата с лунните фази е древна практика, използвана в астрологията, духовността и личностното развитие. Ето как във Vrachka подхождаме към лунните практики:
                </p>
                <h3 className="text-xl font-bold text-zinc-50 mt-6 mb-3">
                  Новолуние - Време за Нови Начала
                </h3>
                <p>
                  Новолунието е идеалното време за поставяне на намерения и стартиране на нови проекти. Луната е тъмна, което символизира чист лист. Практикувай: медитация, писане на цели, създаване на vision board.
                </p>
                <h3 className="text-xl font-bold text-zinc-50 mt-6 mb-3">
                  Пълнолуние - Кулминация и Освобождаване
                </h3>
                <p>
                  Пълнолунието е най-мощната фаза - време за благодарност, празнуване и пускане на старото. Практикувай церемония на освобождаване - напиши на хартия всичко което искаш да отпуснеш и го изгори (безопасно).
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:order-last">
                    <Image
                        src="/images/moon-phase/faq-moon-phase.png"
                        alt="Често задавани въпроси за лунните фази"
                        width={1024}
                        height={512}
                        className="rounded-lg shadow-2xl"
                    />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-zinc-50 mb-8">Често Задавани Въпроси</h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <details key={index} className="glass-card group p-4">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <h3 className="text-lg font-semibold text-zinc-50 pr-8">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown className="w-5 h-5 text-accent-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                                </summary>
                                <div className="pt-4">
                                    <p className="text-zinc-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <BentoTestimonials />

        {/* Final CTA Section */}
        <div className="relative py-20">
          <div className="absolute inset-0">
            <Image
              src="/images/moon-phase/how-to-use-moon-energy.png"
              alt="Искаш Персонализирани Лунни Прогнози?"
              fill
              className="opacity-30 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 to-transparent"></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-zinc-50">
              Искаш Персонализирани Лунни Прогнози?
            </h2>
            <p className="text-xl mb-8 text-zinc-300 max-w-2xl mx-auto">
              {user
                ? 'Виж персонализираните лунни препоръки според твоята зодия в dashboard'
                : 'Регистрирай се за персонализирани лунни прогнози според твоята зодия'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <ShimmerButton className="text-lg px-8">
                    <Moon className="w-5 h-5 mr-2" />
                    Към Dashboard
                  </ShimmerButton>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <ShimmerButton className="text-lg px-8">
                      Започни Сега - Безплатно
                    </ShimmerButton>
                  </Link>
                  <Link href="/pricing">
                    <button className="px-8 py-3 rounded-full glass text-zinc-50 font-medium card-hover">
                      Разгледай Плановете
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </>
  );
}
