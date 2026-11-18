import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bijay Paudel — Analytics Engineer",
  description:
    "Bijay Paudel is an analytics engineer in the USA building reliable data pipelines and clean, tested data models with SQL, Python, PostgreSQL and Microsoft Fabric.",
  openGraph: {
    title: "Bijay Paudel — Analytics Engineer",
    description: "Reliable data pipelines and clean, tested data models. DataWithBijay.",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06080d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans+Condensed:wght@600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
