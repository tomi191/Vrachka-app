import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vrachka - Твоят Духовен Гид",
  description: "Персонализирани хороскопи, таро четения и AI оракул за твоето духовно пътуване",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0b2e" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vrachka",
  },
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
      </body>
    </html>
  );
}
