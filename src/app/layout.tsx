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
    "Цифровое сопровождение аналитической работы УрФУ: революция 1905–1907 годов в Екатеринбурге — от рабочего подполья до первого Совета депутатов. На основе опубликованных источников.",
  keywords: [
    "революция 1905",
    "Екатеринбург",
    "Свердлов",
    "ВИЗ",
    "Верх-Исетский завод",
    "Совет рабочих депутатов",
    "Манифест 17 октября",
    "первая русская революция",
    "история России",
    "УрФУ",
  ],
  authors: [{ name: "Студенты группы ЭУ-153604 · УрФУ" }],
  creator: "УрФУ · Кафедра отечественной истории",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Архив 1905",
    title: "Архив 1905 · Екатеринбург",
    description:
      "Революция 1905–1907 годов в Екатеринбурге: от рабочего подполья до первого Совета депутатов.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Архив 1905",
    description: "Революция 1905–1907 годов в Екатеринбурге.",
  },
  robots: { index: true, follow: true },
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
