import type { Metadata } from "next";

// One entry per real address on the site. Every page renders the same Blueprint app;
// these give each address its own title, description and share card.
const OG = [{ url: "/og.png", width: 1200, height: 630, alt: "Bijay Paudel — Data Analyst & Analytics Engineer · DataWithBijay" }];

export const PAGES: Record<string, { title: string; description: string }> = {
  "/about": { title: "About", description: "How Bijay Paudel builds pipelines that carry data from where it is created to where decisions get made." },
  "/stack": { title: "Stack", description: "The tools Bijay Paudel uses to build data pipelines and to analyze data: SQL, Python, PostgreSQL, Power BI, Excel, R and more." },
  "/work": { title: "Work", description: "Selected data engineering and analytics projects by Bijay Paudel, with case studies." },
  "/activity": { title: "GitHub activity", description: "Bijay Paudel's public GitHub activity: repositories, languages and recent work." },
  "/journey": { title: "Journey", description: "Bijay Paudel's experience, education and certificates, newest first." },
  "/writing": { title: "Writing", description: "Field notes from Bijay Paudel on building data pipelines, models and AI systems." },
  "/contact": { title: "Contact", description: "Get in touch with Bijay Paudel about analytics and data engineering roles." },
  "/resume": { title: "Résumé", description: "Résumé of Bijay Paudel, data analyst and analytics engineer, M.S. Informatics (Analytics), Saint Louis University." },
  "/work/fraud": { title: "Case study: Fraud Operations Decision Intelligence", description: "A decision-support app that ranks fraud alerts so a review team works the riskiest ones first." },
  "/work/help": { title: "Case study: St. Louis HELP impact dashboard", description: "A nightly data pipeline and impact dashboard for a nonprofit that lends donated medical equipment." },
};

export function meta(path: string): Metadata {
  const p = PAGES[path];
  const title = `${p.title} · Bijay Paudel`;
  return {
    title,
    description: p.description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: "DataWithBijay", title, description: p.description, images: OG },
    twitter: { card: "summary_large_image", title, description: p.description, images: ["/og.png"] },
  };
}
