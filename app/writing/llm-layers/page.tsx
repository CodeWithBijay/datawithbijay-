import type { Metadata } from "next";
import Site from "@/components/Site";

// Real address for the article, so LinkedIn and others show the post's own preview card.
const title = "1 API call → 8 layers: how a company's AI feature grows up";
const description =
  "The stack that turns a single model call into a production AI feature: system prompt, RAG, MCP tools, RBAC + OAuth, guardrails, cache + router, observability + evals, and why most of it is data engineering.";

export const metadata: Metadata = {
  title: `${title} · Bijay Paudel`,
  description,
  alternates: { canonical: "/writing/llm-layers" },
  openGraph: {
    type: "article",
    url: "/writing/llm-layers",
    siteName: "Bijay Paudel · Analytics & Data Engineer",
    title,
    description,
    authors: ["Bijay Paudel"],
    images: [{ url: "/og-llm-layers.png", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-llm-layers.png"] },
};

export default function Page() {
  return <Site />;
}
