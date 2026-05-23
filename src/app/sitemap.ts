import type { MetadataRoute } from "next";
import { mainNav } from "@/lib/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://archive-1905.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...mainNav.map((item) => ({
      url: `${SITE_URL}${item.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
