'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Мария К.',
    zodiac: 'Лъв',
    text: 'Vrachka промени начина, по който разбирам себе си. Дневните хороскопи са невероятно точни!',
    rating: 5,
    size: 'large' // spans 2 columns
  },
  {
    name: 'Георги П.',
    zodiac: 'Скорпион',
    text: 'AI Оракулът ми помогна да взема важно решение. Впечатляващо!',
    rating: 5,
    size: 'small'
  },
  {
    name: 'Елена Д.',
    zodiac: 'Везни',
    text: 'Таро четенията са точни и детайлни. Използвам платформата всеки ден!',
    rating: 5,
    size: 'small'
  },
  {
    name: 'Иван С.',
    zodiac: 'Овен',
    text: 'Седмичните прогнози ми помагат да планирам седмицата си. Много полезно!',
    rating: 5,
    size: 'small'
  },
  {
    name: 'Цветелина М.',
    zodiac: 'Риби',
    text: 'Натална карта разкри толкова много за личността ми. Препоръчвам на всички!',
    rating: 5,
    size: 'large'
  },
  {
    name: 'Петър Н.',
    zodiac: 'Телец',
    text: 'Анализът на съвместимост беше изключително точен. Благодаря!',
    rating: 5,
    size: 'small'
  },
];

export function BentoTestimonials() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-accent-400 mb-4">
            <Quote className="w-4 h-4" />
            <span>Отзиви</span>
          </div>
          <h2 className="text-4xl font-bold text-zinc-50 mb-4">
            Какво казват нашите потребители
          </h2>
          <p className="text-xl text-zinc-400">
            Присъедини се към хилядите доволни потребители
          </p>
        </div>

        {/* Bento Grid Layout for Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-6 ${
                testimonial.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-zinc-300 leading-relaxed mb-4 italic text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-base font-semibold text-accent-400">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-zinc-50 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-zinc-500">{testimonial.zodiac}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
