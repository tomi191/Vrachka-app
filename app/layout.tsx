import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.vrachka.eu'),
  title: {
    template: '%s | Vrachka - Твоят Духовен Гид',
    default: 'Vrachka - AI Хороскопи, Таро Четения и Духовни Насоки'
  },
  description: 'Персонализирани дневни хороскопи, таро четения и духовни консултации с AI Врачката. Попитай българския духовен оракул за любов, кариера и житейски въпроси.',
  keywords: [
    'хороскоп',
    'дневен хороскоп',
    'таро',
    'таро четене',
    'астрология',
    'зодия',
    'врачка',
    'духовен гид',
    'AI оракул',
    'България',
    'нумерология',
    'натална карта',
    'съвместимост зодии'
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
    title: 'Vrachka - AI Хороскопи, Таро Четения и Духовни Насоки',
    description: 'Персонализирани дневни хороскопи, таро четения и духовни консултации с AI Врачката. Присъедини се към 10,000+ потребители в тяхното духовно пътуване.',
    images: [
      {
        url: '/og-image.png', // 1200x630 OG image
        width: 1200,
        height: 630,
        alt: 'Vrachka - Твоят Духовен Гид с AI Хороскопи и Таро Четения',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vrachka - AI Хороскопи и Таро Четения',
    description: 'Персонализирани дневни хороскопи, таро четения и духовни консултации с AI.',
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
        "description": "Персонализирани AI хороскопи, таро четения и духовни консултации на български език",
        "sameAs": [
          "https://www.facebook.com/vrachka",
          "https://www.instagram.com/vrachka"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.vrachka.eu/#website",
        "url": "https://www.vrachka.eu",
        "name": "Vrachka",
        "description": "AI Хороскопи, Таро Четения и Духовни Насоки",
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
        "description": "AI-базирана платформа за персонализирани хороскопи, таро четения и духовни консултации",
        "featureList": [
          "Дневни персонализирани хороскопи",
          "AI таро четения",
          "Нумерология и натална карта",
          "Съвместимост между зодии",
          "Лунен календар",
          "Духовни консултации"
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
