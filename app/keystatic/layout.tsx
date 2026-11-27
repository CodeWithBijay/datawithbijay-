import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

// The content editor gets its own clean page: none of the site's styles, effects or analytics.
export const metadata: Metadata = { title: "Content editor · Bijay Paudel", robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  return <KeystaticApp />;
}
