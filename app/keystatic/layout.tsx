import type { Metadata } from "next";
import KeystaticApp from "./keystatic";
import { adminConfigured } from "@/lib/adminSession";
import "./editor-theme.css";

// The content editor gets its own clean page: none of the site's styles, effects or analytics.
// It is styled to match the site (editor-theme.css) and is only reachable after logging in at /admin/login.
export const metadata: Metadata = { title: "Content editor · Bijay Paudel", robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  return (
    <>
      <KeystaticApp />
      {adminConfigured() && (
        <form className="bp-logout" method="post" action="/api/admin/logout">
          <button type="submit">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Log out
          </button>
        </form>
      )}
    </>
  );
}
