// Reads the content you edit in Keystatic (/keystatic) from the content/ folder.
// Runs on the server only, at build time: a save in Keystatic is a commit, and the commit triggers a new build.
import { createReader } from "@keystatic/core/reader";
import Markdoc, { type Node } from "@markdoc/markdoc";
import config from "@/keystatic.config";

const reader = createReader(process.cwd(), config);

export type Project = {
  id: string; title: string; summary: string; types: string[]; tools: string[]; org: string;
  year: number; status: string; featured: boolean; links: { caseStudy?: string; code?: string; live?: string };
};
export type PostCard = { slug: string; title: string; date: string; summary: string; topic: string; tags: string[]; cover: string | null; minutes: number };
export type JourneyEntry = { when: string; title: string; org: string; details: string; highlight: string };
export type Journey = { experience: JourneyEntry[]; education: JourneyEntry[]; certificates: JourneyEntry[] };

const words = (n: Node): number => {
  let c = 0;
  for (const x of n.walk()) if (x.type === "text" && typeof x.attributes.content === "string") c += x.attributes.content.split(/\s+/).filter(Boolean).length;
  return c;
};

export async function getProjects(): Promise<Project[]> {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry: e }) => ({
      id: slug, title: e.title, summary: e.summary, types: [...e.types], tools: [...e.tools].filter(Boolean), org: e.org, year: e.year ?? 0,
      status: e.status, featured: e.featured,
      links: { caseStudy: e.links.caseStudy || undefined, code: e.links.code || undefined, live: e.links.live || undefined },
    }))
    .sort((a, b) => b.year - a.year || Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
}

export async function getPosts(): Promise<PostCard[]> {
  const all = await reader.collections.posts.all();
  const cards = await Promise.all(
    all
      .filter(({ entry }) => !entry.draft)
      .map(async ({ slug, entry: e }) => ({
        slug, title: e.title, date: e.date ?? "", summary: e.summary, topic: e.topic, tags: [...e.tags].filter(Boolean),
        cover: e.cover ?? null, minutes: Math.max(1, Math.round(words((await e.content()).node) / 220)),
      }))
  );
  return cards.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const e = await reader.collections.posts.read(slug);
  if (!e || e.draft) return null;
  const { node } = await e.content();
  const html = Markdoc.renderers.html(Markdoc.transform(node));
  return { slug, title: e.title, date: e.date ?? "", summary: e.summary, topic: e.topic, tags: [...e.tags].filter(Boolean), cover: e.cover ?? null, minutes: Math.max(1, Math.round(words(node) / 220)), html };
}

export async function getJourney(): Promise<Journey> {
  const j = await reader.singletons.journey.read();
  const m = (a: readonly JourneyEntry[] = []) => a.map((x) => ({ ...x }));
  return { experience: m(j?.experience), education: m(j?.education), certificates: m(j?.certificates) };
}

/** Everything the one-page site needs, handed to the browser as JSON. */
export async function siteData() {
  const [projects, posts, journey] = await Promise.all([getProjects(), getPosts(), getJourney()]);
  return { projects, posts, journey };
}
