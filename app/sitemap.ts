import type { MetadataRoute } from "next";
import { PAGES } from "@/lib/pages";

const SITE = "https://www.bijay-paudel.com.np";

// Served at /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...Object.keys(PAGES).map((p) => ({ url: SITE + p, lastModified: now, changeFrequency: "monthly" as const, priority: p.startsWith("/work/") ? 0.8 : 0.7 })),
    { url: `${SITE}/stats`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE}/writing/llm-layers`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
}
