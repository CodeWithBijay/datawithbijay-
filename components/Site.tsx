// The one-page site. On the server it reads the content you edit in Keystatic (projects, blog posts, Journey)
// and hands it to the browser as JSON; lib/site.js reads that JSON (#cms-data) to draw the cards and lists.
import SiteClient from "./SiteClient";
import { siteData } from "@/lib/content";

export default async function Site() {
  const data = await siteData();
  // "<" is escaped so text inside the content can never close the script tag
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <>
      <script id="cms-data" type="application/json" dangerouslySetInnerHTML={{ __html: json }} />
      <SiteClient />
    </>
  );
}
