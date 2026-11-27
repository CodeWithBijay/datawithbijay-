import type { Metadata } from "next";
import "./admin.css";

// The admin login area: its own look, none of the site's effects or analytics, hidden from search engines.
export const metadata: Metadata = { title: "Admin login · Bijay Paudel", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}
