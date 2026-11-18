import type { MetadataRoute } from "next";

// Served at /sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.bijay-paudel.com.np/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
