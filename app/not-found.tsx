import type { Metadata } from "next";

// Blueprint-style 404: shown for any address that doesn't exist.
export const metadata: Metadata = { title: "Sheet not found · Bijay Paudel", robots: { index: false } };

const links = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/writing", "Writing"],
  ["/contact", "Contact"],
];

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-sheet">
        <div className="nf-t">
          <span>FIG. 404 — SHEET NOT FOUND</span>
          <span>PORTFOLIO_DB</span>
        </div>
        <pre className="nf-q">
          <span className="g">portfolio_db › </span>
          <span className="k">SELECT</span> * <span className="k">FROM</span> bijay.pages{"\n"}
          {"              "}
          <span className="k">WHERE</span> url = <span className="s">&apos;this-page&apos;</span>;
        </pre>
        <p className="nf-r">→ 0 rows returned</p>
        <h1>This sheet isn&apos;t in the drawing set</h1>
        <p className="nf-p">The address may have changed, or there&apos;s a typo in the link. Here&apos;s where you can go instead:</p>
        <nav className="nf-l">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label} <span>→</span>
            </a>
          ))}
        </nav>
        <div className="nf-b">
          <span>DRAWN BY B. PAUDEL</span>
          <span>ERROR 404</span>
        </div>
      </div>
    </main>
  );
}
