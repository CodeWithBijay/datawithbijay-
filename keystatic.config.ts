import { createElement as h } from "react";
import { config, fields, collection, singleton } from "@keystatic/core";

// Keystatic: the content editor at /keystatic.
// Every save becomes a commit in the GitHub repo, which triggers a normal deploy.
//
// Where it saves:
//   • On your computer (npm run dev): straight into the files in this folder ("local" mode, no login).
//   • On the live site: through GitHub ("github" mode). Only GitHub accounts with write access to the repo can log in.
//   Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github on your computer once to run the one-time GitHub App setup (see KEYSTATIC.md).

const useGithub = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

const TYPES = ["Analytics", "Data Engineering", "Machine Learning", "Dashboards", "AI"];

const entry = (what: string) =>
  fields.object({
    when: fields.text({ label: "When", description: 'e.g. "Apr 2025 — present" or "expected Dec 2026"', validation: { isRequired: true } }),
    title: fields.text({ label: what === "certificate" ? "Certificate name" : what === "education" ? "Degree" : "Role", validation: { isRequired: true } }),
    org: fields.text({ label: what === "certificate" ? "Issued by" : what === "education" ? "School" : "Organization", validation: { isRequired: true } }),
    details: fields.text({ label: "Details", multiline: true }),
    highlight: fields.text({ label: "Highlight (optional)", description: 'Shown as a small badge, e.g. "★ Dean\'s List 2023"' }),
  });

export default config({
  storage: useGithub ? { kind: "github", repo: { owner: "CodeWithBijay", name: "datawithbijay-" } } : { kind: "local" },
  ui: {
    // logo in the editor's top-left corner: a mint "BP" tile, like the site's accent
    brand: {
      name: "Bijay Paudel · Editor",
      mark: () =>
        h("svg", { width: 26, height: 26, viewBox: "0 0 26 26", "aria-hidden": true },
          h("rect", { width: 26, height: 26, rx: 7, fill: "#5eead4" }),
          h("text", { x: 13, y: 17.5, textAnchor: "middle", fontFamily: "Space Grotesk, Inter, sans-serif", fontWeight: 700, fontSize: 12, fill: "#04211c" }, "BP")),
    },
    navigation: { Content: ["projects", "posts"], About: ["journey"] },
  },

  collections: {
    // Phase 1 — every project card in Projects → "All projects" (the filterable list)
    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "year", "status"],
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } }, slug: { label: "Web address name", description: "Used for the file name. Lowercase words with dashes." } }),
        summary: fields.text({ label: "One-line summary", multiline: true, validation: { isRequired: true, length: { max: 240 } } }),
        types: fields.multiselect({ label: "Type (filter chips)", options: TYPES.map((t) => ({ label: t, value: t })), defaultValue: ["Analytics"] }),
        tools: fields.array(fields.text({ label: "Tool" }), { label: "Tools (filter chips)", itemLabel: (p) => p.value || "Tool" }),
        org: fields.text({ label: "Where / for whom", description: 'e.g. "Saint Louis University" or "Personal project"' }),
        year: fields.integer({ label: "Year", defaultValue: new Date().getFullYear(), validation: { isRequired: true, min: 2015, max: 2100 } }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Shipped", value: "Shipped" },
            { label: "Live", value: "Live" },
            { label: "In progress", value: "In progress" },
          ],
          defaultValue: "Shipped",
        }),
        featured: fields.checkbox({ label: "Featured", description: "Marks the card with ★ Featured. (The two big featured layouts at the top are still edited in the page code.)" }),
        links: fields.object(
          {
            caseStudy: fields.text({ label: "Case study page on this site", description: "e.g. /work/fraud (leave empty if none)" }),
            code: fields.url({ label: "Code (GitHub link)" }),
            live: fields.text({ label: "Live demo or page", description: "A full link, or a page on this site like /stats" }),
          },
          { label: "Links" }
        ),
      },
    }),

    // Phase 2 — blog posts. Each one gets its own page at /writing/<web address name>
    posts: collection({
      label: "Blog posts",
      path: "content/posts/*",
      slugField: "title",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } }, slug: { label: "Web address name", description: "The post lives at /writing/<this>" } }),
        date: fields.date({ label: "Published on", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        draft: fields.checkbox({ label: "Draft (hidden from the site)", defaultValue: true }),
        summary: fields.text({ label: "Summary (shown on the card and in Google)", multiline: true, validation: { isRequired: true, length: { max: 300 } } }),
        topic: fields.text({ label: "Topic", description: 'Small label on the card, e.g. "Data engineering"', defaultValue: "Data engineering" }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags", itemLabel: (p) => p.value || "Tag" }),
        cover: fields.image({ label: "Cover image (optional)", directory: "public/images/posts", publicPath: "/images/posts/" }),
        content: fields.markdoc({
          label: "Post",
          options: { image: { directory: "public/images/posts", publicPath: "/images/posts/" } },
        }),
      },
    }),
  },

  singletons: {
    // Phase 3 — Journey: experience, education and certificates (newest first; drag to reorder)
    journey: singleton({
      label: "Journey",
      path: "content/journey",
      format: { data: "json" },
      schema: {
        experience: fields.array(entry("experience"), { label: "Experience", itemLabel: (p) => `${p.fields.title.value} · ${p.fields.org.value}` }),
        education: fields.array(entry("education"), { label: "Education", itemLabel: (p) => `${p.fields.title.value} · ${p.fields.org.value}` }),
        certificates: fields.array(entry("certificate"), { label: "Certificates", itemLabel: (p) => `${p.fields.title.value} · ${p.fields.org.value}` }),
      },
    }),
  },
});
