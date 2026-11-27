import type { Metadata, Viewport } from "next";

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
  // Site icon for browser tabs and Google results. Fixed addresses (no build hash) and true sizes:
  // Google needs a square icon of at least 48×48 linked from the homepage.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  other: { "tdm-reservation": "1" },
  // Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel → Settings → Environment Variables
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DataWithBijay",
    title: TITLE,
    description: DESC,
    locale: "en_US",
    images: [{ url: "/og-card.png", width: 1200, height: 630, alt: "Bijay Paudel — Data Analyst & Analytics Engineer · DataWithBijay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-card.png"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071a2c" };

// The outer page shell shared by the site and the Keystatic editor (/keystatic).
// Site styles, structured data and analytics live in app/(site)/layout.tsx so they never touch the editor.
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
      <body>{children}</body>
    </html>
  );
}
