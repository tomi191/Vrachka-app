import Script from 'next/script'

interface StructuredDataProps {
  data: object
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vrachka',
  url: 'https://vrachka.app',
  logo: 'https://vrachka.app/icon-512.png',
  description: 'Персонализирани AI хороскопи, таро четения и духовни консултации с българския оракул Врачката.',
  sameAs: [
    // Add social media links when available
  ],
}

// WebApplication Schema
export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vrachka',
  url: 'https://vrachka.app',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BGN',
    lowPrice: '0',
    highPrice: '19.99',
    offerCount: '3',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '10000',
    bestRating: '5',
    worstRating: '1',
  },
}

// FAQ Schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Какво е Vrachka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vrachka е AI-базирана платформа за персонализирани астрологични прогнози, таро четения и духовни консултации. Използваме напреднала AI технология за да предоставим качествени хороскопи и духовни насоки.',
      },
    },
    {
      '@type': 'Question',
      name: 'Колко струва Vrachka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vrachka предлага 3 плана: Безплатен (0 лв) с дневен хороскоп, Basic (9.99 лв/месец) с таро четения и AI оракул, и Ultimate (19.99 лв/месец) с неограничени функции.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какво е "Врачката"?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Врачката е нашият уникален AI оракул, базиран на образа на българската баба врачка. Тя предлага духовни насоки, мъдрост и съвети по житейски въпроси с топъл, човешки подход.',
      },
    },
  ],
}

// Product Schema for Subscription Plans
export function getSubscriptionSchema(plan: 'basic' | 'ultimate') {
  const plans = {
    basic: {
      name: 'Basic План',
      price: '9.99',
      description: 'Дневни хороскопи, 3 таро четения на ден, 3 въпроса към AI оракула, седмични прогнози',
    },
    ultimate: {
      name: 'Ultimate План',
      price: '19.99',
      description: 'Неограничени таро четения, 10 въпроса към оракула на ден, седмични и месечни прогнози, персонализирани съвети',
    },
  }

  const selectedPlan = plans[plan]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: selectedPlan.name,
    description: selectedPlan.description,
    brand: {
      '@type': 'Brand',
      name: 'Vrachka',
    },
    offers: {
      '@type': 'Offer',
      price: selectedPlan.price,
      priceCurrency: 'BGN',
      availability: 'https://schema.org/InStock',
      url: 'https://vrachka.app/pricing',
    },
  }
}

// Breadcrumb Schema
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
