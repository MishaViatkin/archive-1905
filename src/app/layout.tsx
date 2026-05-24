import type { Metadata } from "next";
import { Old_Standard_TT, PT_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const display = Old_Standard_TT({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const serif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://archive-1905.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Архив 1905 · Екатеринбург",
    template: "%s · Архив 1905",
  },
  description:
    "Цифровое историческое расследование: революция 1905–1907 годов в Екатеринбурге и на территории современной Свердловской области. По аналитической работе УрФУ.",
  keywords: [
    "революция 1905",
    "Екатеринбург",
    "Свердловская область",
    "Урал",
    "Свердлов",
    "ВИЗ",
    "история России",
    "УрФУ",
    "первая русская революция",
  ],
  authors: [{ name: "УрФУ · Кафедра отечественной истории" }],
  creator: "УрФУ",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Архив 1905",
    title: "Архив 1905 · Екатеринбург",
    description:
      "Цифровое историческое расследование о первой русской революции на территории современной Свердловской области.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Архив 1905",
    description: "Революция 1905–1907 годов в Екатеринбурге.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${serif.variable} ${mono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
