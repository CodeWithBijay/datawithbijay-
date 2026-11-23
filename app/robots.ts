import type { MetadataRoute } from "next";

// AI crawlers that collect pages to TRAIN models are blocked.
// Search engines and AI *search/answer* bots (ChatGPT search, Perplexity, Claude, Copilot via Bing)
// stay allowed, so recruiters can still find this site when they ask an AI assistant.
export const AI_TRAINING_BOTS = [
  "GPTBot", // OpenAI training
  "ClaudeBot", // Anthropic training
  "anthropic-ai",
  "Google-Extended", // Gemini training
  "Applebot-Extended", // Apple AI training
  "CCBot", // Common Crawl (used by many model builders)
  "Bytespider", // ByteDance
  "meta-externalagent", // Meta AI
  "FacebookBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "omgili",
  "omgilibot",
  "ImagesiftBot",
  "img2dataset",
  "Timpibot",
  "PanguBot",
];

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_TRAINING_BOTS, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: "https://www.bijay-paudel.com.np/sitemap.xml",
    host: "https://www.bijay-paudel.com.np",
  };
}
