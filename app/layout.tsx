import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const SITE = "https://www.bijay-paudel.com.np";
const TITLE = "Bijay Paudel — Data Analyst & Analytics Engineer";
const DESC = "Data analyst and analytics engineer who turns messy data into clear answers and builds the pipelines behind them with SQL, Python and Power BI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  authors: [{ name: "Bijay Paudel", url: SITE }],
  keywords: ["Bijay Paudel", "data analyst", "analytics engineer", "data engineer", "SQL", "Python", "PostgreSQL", "Microsoft Fabric", "portfolio"],
  robots: { index: true, follow: true },
  // Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel → Settings → Environment Variables
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DataWithBijay",
    title: TITLE,
    description: DESC,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Bijay Paudel — Data Analyst & Analytics Engineer · DataWithBijay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
};

// Structured data: tells search engines who this site is about.
const PERSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Bijay Paudel",
      url: SITE,
      image: `${SITE}/photo.jpg`,
      jobTitle: "Data Analyst & Analytics Engineer",
      description: DESC,
      address: { "@type": "PostalAddress", addressLocality: "St. Louis", addressRegion: "MO", addressCountry: "US" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Saint Louis University" },
        { "@type": "CollegeOrUniversity", name: "Pokhara University" },
      ],
      knowsAbout: ["Data analysis", "Analytics engineering", "Data engineering", "SQL", "Python", "PostgreSQL", "Power BI", "Microsoft Fabric", "Statistics"],
      sameAs: ["https://www.linkedin.com/in/b-paudel/", "https://github.com/CodeWithBijay"],
    },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "DataWithBijay", publisher: { "@id": `${SITE}/#person` }, inLanguage: "en-US" },
  ],
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071a2c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@700&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        <Analytics />
      </body>
    </html>
  );
}
