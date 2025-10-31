import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ChevronDown } from 'lucide-react'
import { StructuredData, getBreadcrumbSchema, getFAQSchema } from '@/components/StructuredData'
import { GradientText } from '@/components/ui/gradient-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Navigation } from '@/components/Navigation'
import { TopHeader } from '@/components/layout/top-header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Footer } from '@/components/Footer'
import { MysticBackground } from '@/components/background/MysticBackground'
import { BentoTestimonials } from '@/components/landing/BentoTestimonials'
import { TarotSpreadsGrid } from '@/components/tarot/TarotSpreadsGrid'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription'
import type { PlanType } from '@/lib/config/plans'

export const metadata: Metadata = {
  title: 'Безплатно Таро Гадаене с AI | Online Таро Четене',
  description: 'Онлайн таро гадаене с AI. Безплатни и премиум четения - карта на деня, минало-настояще-бъдеще, любовно таро и кариера. Точни тълкувания на 78 карти с изкуствен интелект.',
  keywords: [
    'таро',
    'таро гадаене',
    'онлайн таро',
    'врачка таро',
    'vrachka tarot',
    'безплатно таро',
    'таро карти',
    'таро четене',
    'карта на деня',
    'любовно таро',
    'таро за кариера',
    'таро на три карти',
    'AI таро',
    'дигитална врачка',
    'онлайн врачка таро',
    'таро предсказания',
    'бъдеще таро'
  ],
  openGraph: {
    title: 'Безплатно Таро Гадаене с AI | Vrachka',
    description: 'Онлайн таро гадаене с изкуствен интелект. 78 карти, множество подредби, точни тълкувания.',
    images: ['/api/og?title=Безплатно Таро Гадаене с AI&description=78 карти, множество подредби'],
  },
  alternates: {
    canonical: '/tarot',
  },
}


const faqData = [
  {
    question: 'Колко често мога да си правя таро четене?',
    answer: 'Безплатните потребители могат да изтеглят 1 карта на деня. Basic абонатите - 5 четения дневно, а Ultimate потребителите имат неограничен достъп до всички подредби.',
  },
  {
    question: 'Точни ли са AI таро четенията?',
    answer: 'Нашият AI използва хиляди класически таро тълкувания и е обучен по методологиите на Рейчъл Полак и Артър Уейт. Четенията съчетават традиционната мъдрост с модерни психологични интерпретации.',
  },
  {
    question: 'Каква е разликата между обърната и права карта?',
    answer: 'Правите карти показват прямото значение на аркана. Обърнатите карти често указват блокирана енергия, вътрешни предизвикателства или обърнати аспекти на картата.',
  },
  {
    question: 'Мога ли да задавам един и същ въпрос няколко пъти?',
    answer: 'Препоръчваме да изчакате поне 24 часа преди да зададете отново същия въпрос. Картите отразяват текущата енергия и прекалено честите четения могат да объркат отговора.',
  },
  {
    question: 'Какви таро карти използвате?',
    answer: 'Използваме пълен комплект от 78 карти - 22 Голяма Аркана и 56 Малка Аркана (Жезли, Чаши, Мечове, Пентакли), с тълкувания на български език.',
  },
  {
    question: 'Какво означава "Карта на деня"?',
    answer: 'Картата на деня е едно-картова подредба, който ви дава насоки за енергията и фокуса на текущия ден. Това е бърз начин да получите духовна перспектива сутрин.',
  },
  {
    question: 'Как работи Любовната подредба?',
    answer: 'Любовната подредба използва 5 карти: първата представя вас, втората - партньора, третата - връзката, четвъртата - предизвикателства, петата - потенциал. Това дава цялостна картина на романтичната ви ситуация.',
  },
]

const breadcrumbData = getBreadcrumbSchema([
  { name: 'Начало', url: 'https://www.vrachka.eu' },
  { name: 'Таро', url: 'https://www.vrachka.eu/tarot' },
])

const faqSchema = getFAQSchema(faqData)

export default async function TarotPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's subscription plan
  let userPlan: PlanType = 'free';
  if (user) {
    const subscription = await getUserSubscription(user.id);
    userPlan = subscription.plan_type as PlanType;
  }

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
              <Sparkles className="w-4 h-4" />
              <span>Таро Четения</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                                Отключи бъдещето си с Таро от Врачка
                              </GradientText>            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Във Vrachka, ние съчетаваме древната мъдрост на Таро с мощта на изкуствения интелект, за да ви предложим точни и персонализирани тълкувания. Открийте какво ви очаква с нашите 78 карти и множество подредби на български език.
            </p>
          </div>

          {/* Tarot Spreads Grid */}
          <TarotSpreadsGrid user={user} userPlan={userPlan} />

          {/* SEO Content Section */}
          <div className="max-w-6xl mx-auto space-y-24 mb-16">
            {/* Section 1: What is Tarot? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <Image
                  src="/images/tarot/what-is-tarot.png"
                  alt="Древна колода таро карти"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Какво е Таро?</h2>
                <p>
                  Таро картите са древна система за гадаене и самопознание, която датира от 15-ти век. Съвременният таро дек съдържа 78 карти, разделени на Голяма Аркана (22 карти) и Малка Аркана (56 карти в четири масти).
                </p>
                <p>
                  Всяка карта носи уникална символика и значение, като комбинацията им в подредбата разкрива дълбоки прозрения за миналото, настоящето и бъдещето. Таро не предсказва фиксирано бъдеще, а осветява възможности, предизвикателства и пътища за развитие. Във Врачка, ние уважаваме тази древна традиция и я правим достъпна за вас в дигитален формат.
                </p>
              </div>
            </div>

            {/* Section 2: How AI Tarot Readings Work? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="md:order-last">
                <Image
                  src="/images/tarot/how-ai-tarot-works.png"
                  alt="AI Таро Четения"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Как Работят AI Таро Четенията?</h2>
                <p>
                  Технологията на Vrachka е обучена с хиляди класически таро тълкувания от световноизвестни таро експерти като Рейчъл Полак и Артър Уейт. Процесът включва три стъпки:
                </p>
                <ol>
                  <li><strong>Фокус</strong> - Вие се концентрирате върху вашия въпрос или ситуация</li>
                  <li><strong>Подредба</strong> - Системата избира карти според избраната от вас подредба</li>
                  <li><strong>Анализ</strong> - AI анализира картите в контекста на позициите и връзките помежду им</li>
                </ol>
                <p>
                  Резултатът е персонализирано четене с практични съвети, психологически прозрения и духовни насоки, адаптирани към вашата уникална ситуация.
                </p>
              </div>
            </div>

            {/* Section 3: Why Choose Vrachka Tarot? */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <Image
                  src="/images/tarot/why-vrachka-tarot.png"
                  alt="Защо да избера Vrachka Таро"
                  width={1024}
                  height={512}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="prose prose-invert max-w-none text-zinc-300">
                <h2 className="text-3xl font-bold text-zinc-50 mb-4">Защо да Избера Vrachka Таро?</h2>
                <ul>
                  <li><strong>78 Карти</strong> - Пълен комплект Голяма и Малка Аркана</li>
                  <li><strong>Български Език</strong> - Автентични тълкувания на роден език</li>
                  <li><strong>AI Точност</strong> - Обучен с хиляди класически тълкувания</li>
                  <li><strong>Множество Подредби</strong> - От една карта до 5-картови четения</li>
                  <li><strong>Обърнати Карти</strong> - Подробни тълкувания за права и обърната позиция</li>
                  <li><strong>Практични Съвети</strong> - Не само предсказание, но и насоки за действие</li>
                  <li><strong>История на Четенията</strong> - Следете развитието на вашите въпроси</li>
                  <li><strong>Доверете се на Врачка</strong> - Хиляди доволни потребители разчитат на нашите таро четения всеки ден.</li>
                </ul>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:order-last">
                    <Image
                        src="/images/tarot/faq.png"
                        alt="Често задавани въпроси за таро"
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

        <div className="relative py-20">
          <div className="absolute inset-0">
            <Image
              src="/images/tarot/ready-for-reading.png"
              alt="Готови за Вашето Таро Четене"
              fill
              className="opacity-30 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 to-transparent"></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-zinc-50">
              Готови за Вашето Таро Четене?
            </h2>
            <p className="text-xl mb-8 text-zinc-300 max-w-2xl mx-auto">
              Създайте безплатен акаунт и започнете да изследвате мъдростта на Таро картите още днес
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Bottom Navigation - mobile only for logged-in users */}
      {user && <BottomNav />}
    </>
  )
}
