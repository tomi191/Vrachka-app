import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData'
import { ArrowLeft, Heart, Briefcase, Star, TrendingUp } from 'lucide-react'
import { ZodiacIcon } from '@/components/icons/zodiac'
import { GradientText } from '@/components/ui/gradient-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'

// ISR: Revalidate every 24 hours (daily horoscope updates)
export const revalidate = 86400

interface ZodiacData {
  sign: string
  name: string
  dates: string
  element: string
  planet: string
  color: string
  luckyNumbers: number[]
  traits: {
    positive: string[]
    negative: string[]
  }
  compatibility: {
    best: string[]
    challenging: string[]
  }
  career: string
  love: string
  health: string
  description: string
  famous: string[]
}

const zodiacData: Record<string, ZodiacData> = {
  oven: {
    sign: 'oven',
    name: 'Овен',
    dates: '21 март - 19 април',
    element: 'Огън',
    planet: 'Марс',
    color: 'Червено',
    luckyNumbers: [1, 9, 19, 28],
    traits: {
      positive: ['Смел', 'Енергичен', 'Уверен', 'Страстен', 'Оптимист', 'Лидер'],
      negative: ['Импулсивен', 'Нетърпелив', 'Агресивен', 'Егоцентричен'],
    },
    compatibility: {
      best: ['Лъв', 'Стрелец', 'Близнаци', 'Водолей'],
      challenging: ['Рак', 'Козирог'],
    },
    career: 'Овенът е естествен лидер и предприемач. Отличава се в кариери, които изискват инициатива, смелост и независимост - бизнес, спорт, военна служба, хирургия.',
    love: 'В любовта Овенът е страстен и директен. Харесва да гони и да завоюва. Търси партньор, който може да го предизвиква и да поддържа искрата жива.',
    health: 'Овенът трябва да внимава с главата и лицето. Склонен е към стрес и нараняване поради импулсивност. Препоръчва се редовна физическа активност за разтоварване на енергията.',
    description: 'Овенът е първата зодия в астрологичния кръг, символизираща начало, инициатива и сурова енергия. Управляван от планетата Марс, Овенът притежава неукротим дух и жажда за действие.',
    famous: ['Леонардо да Винчи', 'Лейди Гага', 'Роберт Дауни Джуниър', 'Елтън Джон'],
  },
  telec: {
    sign: 'telec',
    name: 'Телец',
    dates: '20 април - 20 май',
    element: 'Земя',
    planet: 'Венера',
    color: 'Зелено',
    luckyNumbers: [2, 6, 15, 24],
    traits: {
      positive: ['Надежден', 'Практичен', 'Стабилен', 'Упорит', 'Лоялен', 'Сензуален'],
      negative: ['Инатлив', 'Притежателен', 'Материалист', 'Бавен'],
    },
    compatibility: {
      best: ['Дева', 'Козирог', 'Рак', 'Риби'],
      challenging: ['Лъв', 'Водолей'],
    },
    career: 'Телецът се реализира в кариери, свързани с финанси, изкуство, недвижими имоти и земеделие. Отличен е в позиции, изискващи търпение и дългосрочно планиране.',
    love: 'В любовта Телецът е предан и романтичен. Търси стабилност и дългосрочен ангажимент. Обича физическа близост и материални изрази на обич.',
    health: 'Телецът трябва да внимава с гърлото и щитовидната жлеза. Има склонност към наднормено тегло поради любовта си към хубава храна. Важна е умерената диета.',
    description: 'Телецът е земна зодия, управлявана от Венера - планетата на любовта и красотата. Това го прави ценител на всичко красиво, удобно и качествено в живота.',
    famous: ['Уилям Шекспир', 'Адел', 'Джордж Клуни', 'Дуейн Джонсън'],
  },
  bliznaci: {
    sign: 'bliznaci',
    name: 'Близнаци',
    dates: '21 май - 20 юни',
    element: 'Въздух',
    planet: 'Меркурий',
    color: 'Жълто',
    luckyNumbers: [3, 5, 12, 18],
    traits: {
      positive: ['Общителен', 'Интелигентен', 'Адаптивен', 'Любознателен', 'Остроумен'],
      negative: ['Непостоянен', 'Повърхностен', 'Нервен', 'Нерешителен'],
    },
    compatibility: {
      best: ['Везни', 'Водолей', 'Овен', 'Лъв'],
      challenging: ['Дева', 'Риби'],
    },
    career: 'Близнаците се реализират в комуникационни професии - журналистика, PR, преподаване, писателство, продажби. Нуждаят се от разнообразие и интелектуално предизвикателство.',
    love: 'В любовта Близнаците търсят интелектуална връзка и постоянна комуникация. Нуждаят се от партньор, който не ги ограничава и поддържа тяхната социална активност.',
    health: 'Близнаците трябва да внимават с дихателната система и нервите. Склонни са към безсъние и тревожност. Важно е да намерят начини за релаксация.',
    description: 'Близнаците са въздушна зодия, управлявана от Меркурий - планетата на комуникацията. Те са естествени комуникатори, интелектуалци и социални пеперуди.',
    famous: ['Мерилин Монро', 'Джони Деп', 'Анджелина Джоли', 'Кание Уест'],
  },
  rak: {
    sign: 'rak',
    name: 'Рак',
    dates: '21 юни - 22 юли',
    element: 'Вода',
    planet: 'Луна',
    color: 'Сребристо',
    luckyNumbers: [2, 7, 11, 16],
    traits: {
      positive: ['Грижовен', 'Интуитивен', 'Верен', 'Емоционален', 'Защитаващ'],
      negative: ['Свръхчувствителен', 'Притежателен', 'Скрит', 'Обиден'],
    },
    compatibility: {
      best: ['Скорпион', 'Риби', 'Телец', 'Дева'],
      challenging: ['Овен', 'Везни'],
    },
    career: 'Ракът се реализира в грижовни професии - медицина, социална работа, хотелиерство, кулинария, работа с деца. Нуждае се от емоционална връзка с работата си.',
    love: 'В любовта Ракът е изключително предан и грижовен. Търси дълбока емоционална връзка и желае да изгради семейство. Нуждае се от сигурност и топлина.',
    health: 'Ракът трябва да внимава със стомаха и храносмилателната система. Емоциите пряко влияят на физическото му здраве. Важна е емоционалната стабилност.',
    description: 'Ракът е водна зодия, управлявана от Луната. Това го прави най-емоционалната и интуитивна зодия, със силна връзка към дома, семейството и миналото.',
    famous: ['Том Ханкс', 'Принцеса Даяна', 'Селена Гомез', 'Илон Мъск'],
  },
  lav: {
    sign: 'lav',
    name: 'Лъв',
    dates: '23 юли - 22 август',
    element: 'Огън',
    planet: 'Слънце',
    color: 'Златисто',
    luckyNumbers: [1, 4, 10, 19],
    traits: {
      positive: ['Харизматичен', 'Щедър', 'Креативен', 'Уверен', 'Топъл', 'Лоялен'],
      negative: ['Горделив', 'Драматичен', 'Егоцентричен', 'Инатлив'],
    },
    compatibility: {
      best: ['Овен', 'Стрелец', 'Близнаци', 'Везни'],
      challenging: ['Телец', 'Скорпион'],
    },
    career: 'Лъвът се реализира в креативни и лидерски позиции - мениджмънт, актьорство, моден дизайн, политика. Нуждае се от признание и възможност да блести.',
    love: 'В любовта Лъвът е страстен, романтичен и щедър. Обича да бъде обожаван и да впечатлява партньора си. Търси лоялност и възхищение.',
    health: 'Лъвът трябва да внимава със сърцето и гръбначния стълб. Склонен е към прекомерни усилия. Важно е да балансира работата с почивката.',
    description: 'Лъвът е огнена зодия, управлявана от Слънцето - центъра на Слънчевата система. Като Слънцето, Лъвът също търси да бъде в центъра на вниманието.',
    famous: ['Барак Обама', 'Мадона', 'Дженифър Лопес', 'Коко Шанел'],
  },
  deva: {
    sign: 'deva',
    name: 'Дева',
    dates: '23 август - 22 септември',
    element: 'Земя',
    planet: 'Меркурий',
    color: 'Тъмносиньо',
    luckyNumbers: [5, 14, 23, 32],
    traits: {
      positive: ['Аналитична', 'Практична', 'Старателна', 'Услужлива', 'Перфекционист'],
      negative: ['Критична', 'Притеснителна', 'Свръхкритична', 'Сдържана'],
    },
    compatibility: {
      best: ['Телец', 'Козирог', 'Рак', 'Скорпион'],
      challenging: ['Близнаци', 'Стрелец'],
    },
    career: 'Девата се реализира в аналитични и прецизни професии - счетоводство, здравеопазване, научни изследвания, редактиране. Отлична е в детайлите.',
    love: 'В любовта Девата е предана и практична. Показва обич чрез грижи и полезни действия. Нуждае се от време да се отвори емоционално.',
    health: 'Девата трябва да внимава с храносмилателната система и черния дроб. Склонна е към тревожност и стрес. Важна е здравословната диета и рутина.',
    description: 'Девата е земна зодия, управлявана от Меркурий. Това я прави най-аналитичната и практична зодия, с око за детайлите и перфекционизъм.',
    famous: ['Майкъл Джаксън', 'Бионсе', 'Киану Рийвс', 'Майка Тереза'],
  },
  vezni: {
    sign: 'vezni',
    name: 'Везни',
    dates: '23 септември - 22 октомври',
    element: 'Въздух',
    planet: 'Венера',
    color: 'Розово',
    luckyNumbers: [6, 15, 24, 33],
    traits: {
      positive: ['Балансирани', 'Дипломатични', 'Справедливи', 'Социални', 'Артистични'],
      negative: ['Нерешителни', 'Избягващи конфликти', 'Зависими', 'Повърхностни'],
    },
    compatibility: {
      best: ['Близнаци', 'Водолей', 'Лъв', 'Стрелец'],
      challenging: ['Рак', 'Козирог'],
    },
    career: 'Везните се реализират в дипломатически и артистични професии - право, дизайн, модна индустрия, консултации. Отлични са в медиация и преговори.',
    love: 'В любовта Везните са романтични и търсят хармония. Нуждаят се от партньор и не обичат да бъдат сами. Ценят красотата и елегантността.',
    health: 'Везните трябва да внимават с бъбреците и кожата. Склонни са към дисбаланс. Важно е да поддържат хармония в живота си.',
    description: 'Везните са въздушна зодия, управлявана от Венера. Символът им - везни, перфектно описва тяхното търсене на баланс, справедливост и хармония.',
    famous: ['Ким Кардашиян', 'Уил Смит', 'Серена Уилямс', 'Махатма Ганди'],
  },
  skorpion: {
    sign: 'skorpion',
    name: 'Скорпион',
    dates: '23 октомври - 21 ноември',
    element: 'Вода',
    planet: 'Плутон',
    color: 'Тъмночервено',
    luckyNumbers: [8, 11, 18, 22],
    traits: {
      positive: ['Страстен', 'Проницателен', 'Верен', 'Силен', 'Трансформиращ'],
      negative: ['Ревнив', 'Мстителен', 'Манипулативен', 'Подозрителен'],
    },
    compatibility: {
      best: ['Рак', 'Риби', 'Дева', 'Козирог'],
      challenging: ['Лъв', 'Водолей'],
    },
    career: 'Скорпионът се реализира в интензивни професии - психология, криминалистика, хирургия, изследователска работа. Отличен е в разкриването на тайни.',
    love: 'В любовта Скорпионът е изключително интензивен и страстен. Търси дълбока емоционална и физическа връзка. Лоялен е до край, но и ревнив.',
    health: 'Скорпионът трябва да внимава с репродуктивната система. Склонен е към задържане на емоции. Важно е да намира здравословни начини за трансформация.',
    description: 'Скорпионът е водна зодия, управлявана от Плутон - планетата на трансформацията и подсъзнанието. Най-интензивната и мистериозна зодия.',
    famous: ['Леонардо ди Каприо', 'Джулия Робъртс', 'Бил Гейтс', 'Пабло Пикасо'],
  },
  strelec: {
    sign: 'strelec',
    name: 'Стрелец',
    dates: '22 ноември - 21 декември',
    element: 'Огън',
    planet: 'Юпитер',
    color: 'Лилаво',
    luckyNumbers: [3, 9, 12, 21],
    traits: {
      positive: ['Оптимист', 'Авантюрист', 'Философ', 'Честен', 'Свободолюбив'],
      negative: ['Нетактичен', 'Безотговорен', 'Нетърпелив', 'Прекалено уверен'],
    },
    compatibility: {
      best: ['Овен', 'Лъв', 'Везни', 'Водолей'],
      challenging: ['Дева', 'Риби'],
    },
    career: 'Стрелецът се реализира в професии, свързани с пътувания, образование, философия, публикации. Нуждае се от свобода и възможност за растеж.',
    love: 'В любовта Стрелецът е авантюрен и оптимистичен. Търси партньор за пътешествия и приключения. Нуждае се от свобода и независимост.',
    health: 'Стрелецът трябва да внимава с бедрата и черния дроб. Склонен е към прекомерности. Важна е умерeността във всичко.',
    description: 'Стрелецът е огнена зодия, управлявана от Юпитер - планетата на разширението и късмета. Вечният оптимист и търсач на истината.',
    famous: ['Брад Пит', 'Тейлър Суифт', 'Уолт Дисни', 'Джейн Остин'],
  },
  kozirog: {
    sign: 'kozirog',
    name: 'Козирог',
    dates: '22 декември - 19 януари',
    element: 'Земя',
    planet: 'Сатурн',
    color: 'Кафяво',
    luckyNumbers: [4, 8, 13, 22],
    traits: {
      positive: ['Амбициозен', 'Дисциплиниран', 'Отговорен', 'Търпелив', 'Мъдър'],
      negative: ['Песимист', 'Сдържан', 'Инатлив', 'Работохолик'],
    },
    compatibility: {
      best: ['Телец', 'Дева', 'Скорпион', 'Риби'],
      challenging: ['Овен', 'Везни'],
    },
    career: 'Козирогът се реализира в корпоративни и управленски позиции - бизнес, финанси, мениджмънт, политика. Стреми се към върха.',
    love: 'В любовта Козирогът е сериозен и традиционен. Търси дългосрочен ангажимент и стабилност. Показва обич чрез практични действия.',
    health: 'Козирогът трябва да внимава с костите, ставите и кожата. Склонен е към депресия. Важно е да намира време за почивка и удоволствия.',
    description: 'Козирогът е земна зодия, управлявана от Сатурн - планетата на дисциплината и структурата. Най-амбициозната и целеустремена зодия.',
    famous: ['Мартин Лутър Кинг', 'Мишел Обама', 'Дензъл Уошингтън', 'Дейвид Боуи'],
  },
  vodolej: {
    sign: 'vodolej',
    name: 'Водолей',
    dates: '20 януари - 18 февруари',
    element: 'Въздух',
    planet: 'Уран',
    color: 'Електриково синьо',
    luckyNumbers: [4, 7, 11, 22],
    traits: {
      positive: ['Иноватор', 'Хуманитарен', 'Независим', 'Интелигентен', 'Прогресивен'],
      negative: ['Дистанциран', 'Бунтар', 'Непредсказуем', 'Инатлив'],
    },
    compatibility: {
      best: ['Близнаци', 'Везни', 'Овен', 'Стрелец'],
      challenging: ['Телец', 'Скорпион'],
    },
    career: 'Водолеят се реализира в иновативни професии - технологии, наука, социална работа, астрология. Нуждае се от свобода и възможност за промяна.',
    love: 'В любовта Водолеят търси интелектуална връзка и приятелство. Нуждае се от партньор, който уважава неговата независимост и уникалност.',
    health: 'Водолеят трябва да внимава с кръвообращението и глезените. Склонен е към нервно напрежение. Важно е да намира начини за заземяване.',
    description: 'Водолеят е въздушна зодия, управлявана от Уран - планетата на революциите и иновациите. Най-прогресивната и хуманитарна зодия.',
    famous: ['Опра Уинфри', 'Майкъл Джордан', 'Ейбрахам Линкълн', 'Ед Шийрън'],
  },
  ribi: {
    sign: 'ribi',
    name: 'Риби',
    dates: '19 февруари - 20 март',
    element: 'Вода',
    planet: 'Нептун',
    color: 'Морско зелено',
    luckyNumbers: [3, 7, 12, 16],
    traits: {
      positive: ['Състрадателни', 'Артистични', 'Духовни', 'Интуитивни', 'Романтични'],
      negative: ['Убягващи от реалността', 'Свръхемоционални', 'Жертва', 'Неорганизирани'],
    },
    compatibility: {
      best: ['Рак', 'Скорпион', 'Телец', 'Козирог'],
      challenging: ['Близнаци', 'Стрелец'],
    },
    career: 'Рибите се реализират в творчески и грижовни професии - изкуство, музика, психология, работа с животни. Нуждаят се от работа с дълбок смисъл.',
    love: 'В любовта Рибите са романтични и отдадени. Търсят душевна връзка и дълбоко разбиране. Склонни са да се жертват за любимия човек.',
    health: 'Рибите трябва да внимават с краката и имунната система. Склонни са към бягство в зависимости. Важна е грижата за себе си и границите.',
    description: 'Рибите са водна зодия, управлявана от Нептун - планетата на мечтите и духовността. Най-емпатичната и артистична зодия.',
    famous: ['Алберт Айнщайн', 'Рианна', 'Стив Джобс', 'Джъстин Бийбър'],
  },
}

// Generate static params for all zodiac signs
export async function generateStaticParams() {
  return Object.keys(zodiacData).map((sign) => ({
    sign,
  }))
}

// Generate metadata for each zodiac page
export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign } = await params
  const zodiac = zodiacData[sign]

  if (!zodiac) {
    return {
      title: 'Зодия не е намерена',
    }
  }

  return {
    title: `Хороскоп ${zodiac.name} - Дневна Прогноза и Характеристики`,
    description: `${zodiac.description} Дневен хороскоп за ${zodiac.name} (${zodiac.dates}). Любов, кариера, здраве и съвместимост. AI персонализирани прогнози.`,
    keywords: [
      `хороскоп ${zodiac.name.toLowerCase()}`,
      `${zodiac.name.toLowerCase()} днес`,
      `зодия ${zodiac.name.toLowerCase()}`,
      `дневен хороскоп ${zodiac.name.toLowerCase()}`,
      `любовен хороскоп ${zodiac.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Хороскоп ${zodiac.name} - Дневна Прогноза`,
      description: `${zodiac.description}`,
      images: [`/api/og?title=Хороскоп ${zodiac.name}&description=${zodiac.dates} • ${zodiac.element}`],
    },
    alternates: {
      canonical: `/horoscope/${zodiac.sign}`,
    },
  }
}

export default async function ZodiacSignPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params
  const zodiac = zodiacData[sign]

  if (!zodiac) {
    notFound()
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Хороскоп ${zodiac.name} - Дневна Прогноза и Характеристики`,
    description: zodiac.description,
    image: `https://www.vrachka.eu/api/og?title=Хороскоп ${zodiac.name}`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Vrachka',
    },
  }

  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Начало', url: 'https://www.vrachka.eu' },
    { name: 'Хороскопи', url: 'https://www.vrachka.eu/horoscope' },
    { name: zodiac.name, url: `https://www.vrachka.eu/horoscope/${zodiac.sign}` },
  ])

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Back Button */}
          <Link href="/horoscope" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Всички зодии</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <ZodiacIcon
                sign={zodiac.sign as keyof typeof import('@/components/icons/zodiac').zodiacIcons}
                size={128}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <GradientText from="#9333ea" via="#ec4899" to="#9333ea">
                Хороскоп {zodiac.name}
              </GradientText>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{zodiac.dates}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {zodiac.element}
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {zodiac.planet}
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {zodiac.color}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">За Зодия {zodiac.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{zodiac.description}</p>
            </CardContent>
          </Card>

          {/* Traits */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Положителни Черти
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {zodiac.traits.positive.map((trait, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Предизвикателства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {zodiac.traits.negative.map((trait, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-orange-500">⚠</span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Life Areas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Любов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{zodiac.love}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  Кариера
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{zodiac.career}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ❤️‍🩹
                  Здраве
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{zodiac.health}</p>
              </CardContent>
            </Card>
          </div>

          {/* Compatibility & Lucky Numbers */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Съвместимост</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400 mb-2">Най-добра съвместимост:</p>
                  <div className="flex flex-wrap gap-2">
                    {zodiac.compatibility.best.map((sign, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Предизвикателна съвместимост:</p>
                  <div className="flex flex-wrap gap-2">
                    {zodiac.compatibility.challenging.map((sign, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Късметлийски Числа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {zodiac.luckyNumbers.map((num, index) => (
                    <div key={index} className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      {num}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Famous People */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Известни Личности - {zodiac.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {zodiac.famous.map((person, index) => (
                  <Badge key={index} variant="outline" className="text-base px-4 py-2">
                    ⭐ {person}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Искаш Персонализиран Хороскоп за Днес?
              </h2>
              <p className="text-lg mb-6 text-purple-100">
                Получи AI-генериран дневен хороскоп, специално за теб - базиран не само на зодията ти, но и на твоята лична натална карта
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <ShimmerButton
                    className="text-lg px-8"
                    background="linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)"
                    shimmerColor="#9333ea"
                  >
                    Започни Безплатно
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                    Виж Плановете
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
