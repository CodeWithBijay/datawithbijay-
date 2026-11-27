import "../globals.css";
import { Analytics } from "@vercel/analytics/next";

const SITE = "https://www.bijay-paudel.com.np";
const DESC = "Data analyst and analytics engineer who turns messy data into clear answers and builds the pipelines behind them with SQL, Python and Power BI.";

// Structured data: tells search engines who this site is about.
const PERSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Bijay Paudel",
      url: SITE,
      image: `${SITE}/photo.jpg`,
      jobTitle: "Data Analyst & Analytics Engineer",
      description: DESC,
      address: { "@type": "PostalAddress", addressLocality: "St. Louis", addressRegion: "MO", addressCountry: "US" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Saint Louis University" },
        { "@type": "CollegeOrUniversity", name: "Pokhara University" },
      ],
      knowsAbout: ["Data analysis", "Analytics engineering", "Data engineering", "SQL", "Python", "PostgreSQL", "Power BI", "Microsoft Fabric", "Statistics"],
      sameAs: ["https://www.linkedin.com/in/b-paudel/", "https://github.com/CodeWithBijay"],
    },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "DataWithBijay", publisher: { "@id": `${SITE}/#person` }, inLanguage: "en-US" },
  ],
};

// Everything visitors see: site styles, structured data for search engines, and analytics.
// (The folder name "(site)" does not appear in any web address.)
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      <Analytics />
    </>
  );
}
