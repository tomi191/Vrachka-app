/**
 * Testimonials Constants
 * User testimonials displayed on homepage
 * Only 6 active testimonials are used in BentoTestimonials component
 */

export interface Testimonial {
  name: string
  zodiac: string
  text: string
  rating: number
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: 'Мария К.',
    zodiac: 'Лъв',
    text: 'Vrachka промени начина, по който разбирам себе си. Дневните хороскопи са невероятно точни!',
    rating: 5
  },
  {
    name: 'Георги П.',
    zodiac: 'Скорпион',
    text: 'AI Оракулът ми помогна да взема важно решение. Впечатляващо!',
    rating: 5
  },
  {
    name: 'Елена Д.',
    zodiac: 'Везни',
    text: 'Таро четенията са точни и детайлни. Използвам платформата всеки ден!',
    rating: 5
  },
  {
    name: 'Иван С.',
    zodiac: 'Овен',
    text: 'Седмичните прогнози ми помагат да планирам седмицата си. Много полезно!',
    rating: 5
  },
  {
    name: 'Цветелина М.',
    zodiac: 'Риби',
    text: 'Натална карта разкри толкова много за личността ми. Препоръчвам на всички!',
    rating: 5
  },
  {
    name: 'Петър Н.',
    zodiac: 'Телец',
    text: 'Анализът на съвместимост беше изключително точен. Благодаря!',
    rating: 5
  },
] as const
