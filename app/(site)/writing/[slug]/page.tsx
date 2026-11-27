import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import PostTracker from "@/components/PostTracker";

// A blog post written in Keystatic (/keystatic → Blog posts). Built into a static page at deploy time.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  const title = `${p.title} · Bijay Paudel`;
  const images = p.cover ? [{ url: p.cover }] : [{ url: "/og-card.png", width: 1200, height: 630 }];
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/writing/${p.slug}` },
    openGraph: { type: "article", url: `/writing/${p.slug}`, siteName: "DataWithBijay", title, description: p.summary, publishedTime: p.date, images },
    twitter: { card: "summary_large_image", title, description: p.summary, images: images.map((i) => i.url) },
  };
}

const fmt = (d: string) => {
  try { return new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); } catch { return d; }
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.summary, datePublished: p.date,
    author: { "@type": "Person", name: "Bijay Paudel", url: "https://www.bijay-paudel.com.np" },
    mainEntityOfPage: `https://www.bijay-paudel.com.np/writing/${p.slug}`,
  };
  return (
    <main className="cp">
      <nav className="cp-top">
        <a href="/" className="cp-home">Bijay Paudel</a>
        <a href="/writing" className="cp-back">← All writing</a>
      </nav>
      <article className="cp-art">
        <div className="cp-meta">
          <span className="cp-topic">{p.topic}</span>
          <span>{fmt(p.date)}</span>
          <span>~{p.minutes} min read</span>
        </div>
        <h1>{p.title}</h1>
        <p className="cp-lead">{p.summary}</p>
        {p.tags.length > 0 && (
          <div className="cp-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
        )}
        {p.cover && <img className="cp-cover" src={p.cover} alt="" />}
        <div className="cp-body" dangerouslySetInnerHTML={{ __html: p.html }} />
        <footer className="cp-foot">
          <a href="/writing">← More writing</a>
          <a href="/contact">Talk to me about this →</a>
        </footer>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <PostTracker />
    </main>
  );
}
