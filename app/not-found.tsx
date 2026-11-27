import type { Metadata } from "next";
import "./globals.css";
import TallyRunner from "@/components/TallyRunner";

// 404 page: shown for any address that doesn't exist. Tally is lost too, so visitors can play a quick game
// (components/TallyRunner.tsx) or jump back to a real page.
export const metadata: Metadata = { title: "Page not found · Bijay Paudel", robots: { index: false } };

const links = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/writing", "Writing"],
  ["/contact", "Contact"],
];

export default function NotFound() {
  return (
    <main className="nf2">
      <header className="nf2-head">
        <p className="nf2-q">
          <span className="g">portfolio_db ›</span> <span className="k">SELECT</span> * <span className="k">FROM</span> pages <span className="k">WHERE</span> url = <span className="s">&apos;this-page&apos;</span>; <span className="r">→ 0 rows</span>
        </p>
        <h1>
          <span className="nf2-code">404</span> Tally couldn&apos;t find this page
        </h1>
        <p className="nf2-p">The link may be old or have a typo. While you&apos;re here, help Tally dodge some broken data:</p>
      </header>

      <TallyRunner />

      <nav className="nf2-links" aria-label="Go somewhere that exists">
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label} <span aria-hidden="true">→</span>
          </a>
        ))}
      </nav>
    </main>
  );
}
