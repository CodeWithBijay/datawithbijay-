import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = "https://www.bijay-paudel.com.np";
const TITLE = "Bijay Paudel — Analytics Engineer";
const DESC = "Analytics engineer building reliable data pipelines and clean, tested data models with SQL, Python, PostgreSQL and Microsoft Fabric."; // 133 characters

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  authors: [{ name: "Bijay Paudel", url: SITE }],
  keywords: ["Bijay Paudel", "analytics engineer", "data engineer", "SQL", "Python", "PostgreSQL", "Microsoft Fabric", "portfolio"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DataWithBijay",
    title: TITLE,
    description: DESC,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Bijay Paudel — Analytics Engineer · DataWithBijay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
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
      <body>{children}</body>
    </html>
  );
}
