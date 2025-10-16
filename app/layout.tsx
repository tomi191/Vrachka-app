import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vrachka.app'),
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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vrachka - Твоят Духовен Гид',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vrachka - AI Хороскопи и Таро Четения',
    description: 'Персонализирани дневни хороскопи, таро четения и духовни консултации с AI.',
    images: ['/og-image.png'],
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
  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
