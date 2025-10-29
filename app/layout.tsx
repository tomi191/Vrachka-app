import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/lib/providers/query-provider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "@/lib/env"; // Validate environment variables at startup
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'),
  title: {
    template: '%s | Vrachka - Астрология и таро с AI',
    default: 'Vrachka - AI предсказания, хороскопи и таро четения'
  },
    description: 'Лични AI предсказания, дневни хороскопи и таро четения. Вземи насоки за любов, кариера и късмет чрез модерна астрология и изкуствен интелект. Първата AI астрологична платформа в България.',
  keywords: [
    'хороскоп',
    'дневен хороскоп',
    'таро',
    'таро четене',
    'астрология',
    'зодии',
    'изкуствен интелект',
    'AI хороскоп',
    'любов',
    'кариера',
    'късмет',
    'лични предсказания'
  ],
  authors: [{ name: 'Vrachka' }],
  creator: 'Vrachka',
  publisher: 'Vrachka',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vrachka",
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: '/',
    siteName: 'Vrachka',
    title: 'Vrachka - AI предсказания, хороскопи и таро четения',
    description: 'Лични AI предсказания, дневни/седмични/месечни хороскопи и таро четения. Доверяват ни се 5,000+ потребители за мъдри и навременни съвети.',
    images: [
      {
        url: '/og-image.svg', // 1200x630 OG image (SVG for quality and size)
        width: 1200,
        height: 630,
        alt: 'Vrachka - Астрология и таро с AI',
        type: 'image/svg+xml',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vrachka - AI предсказания и таро',
    description: 'Лични предсказания, хороскопи и таро, задвижвани от AI.',
    images: ['/og-image.png'], // 1200x630 OG image for Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0b2e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.vrachka.eu/#organization",
        "name": "Vrachka",
        "url": "https://www.vrachka.eu",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.vrachka.eu/icon-192.png",
          "width": 192,
          "height": 192
        },
        "description": "AI предсказания, хороскопи и таро четения за информирани решения и лична перспектива. Първата AI астрологична платформа в България.",
        "sameAs": [
          "https://www.facebook.com/vrachka.bg"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BG",
          "addressRegion": "София",
          "addressLocality": "София"
        },
        "areaServed": "BG",
        "knowsAbout": [
          "астрология",
          "таро четения",
          "нумерология",
          "хороскопи",
          "духовно развитие",
          "изкуствен интелект"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.vrachka.eu/#website",
        "url": "https://www.vrachka.eu",
        "name": "Vrachka",
        "description": "AI предсказания, хороскопи и таро четения",
        "publisher": {
          "@id": "https://www.vrachka.eu/#organization"
        },
        "inLanguage": "bg-BG"
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.vrachka.eu/#webapp",
        "name": "Vrachka",
        "url": "https://www.vrachka.eu",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "BGN",
          "lowPrice": "0",
          "highPrice": "29.99",
          "offerCount": "3"
        },
        "description": "AI‑задвижвани предсказания, хороскопи и таро четения за любов, кариера и късмет",
        "featureList": [
          "Персонализирани AI предсказания",
          "Дневни/седмични/месечни хороскопи",
          "Таро разтвори и Карта на деня",
          "История на разговори и четения",
          "Абонаментни планове",
          "Фокус върху поверителността"
        ],
        "screenshot": "https://www.vrachka.eu/og-image.png"
      }
    ]
  };

  return (
    <html lang="bg" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
