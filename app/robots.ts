import type { MetadataRoute } from "next";

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://www.bijay-paudel.com.np/sitemap.xml",
    host: "https://www.bijay-paudel.com.np",
  };
}
