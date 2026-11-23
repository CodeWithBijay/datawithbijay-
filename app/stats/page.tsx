import type { Metadata } from "next";
import { db } from "@/lib/db";

// Public stats for this website, served from the reporting layer that GitHub Actions rebuilds every night.
export const revalidate = 600; // refresh at most every 10 minutes

const title = "Site stats · the pipeline behind this portfolio";
const description =
  "Live traffic stats for bijay-paudel.com.np, built by its own data pipeline: page views → Postgres raw layer → nightly GitHub Actions rollup → reporting tables → this page.";
export const metadata: Metadata = {
  title: `${title} · Bijay Paudel`,
  description,
  alternates: { canonical: "/stats" },
  openGraph: { type: "website", url: "/stats", title, description, images: [{ url: "/og-card.png", width: 1200, height: 630 }] },
};

type Row = Record<string, unknown>;
const CT = "America/Chicago";
const NAMES: Record<string, string> = {
  "/": "Home", "/about": "About", "/stack": "Stack", "/work": "Work", "/activity": "GitHub activity", "/journey": "Journey",
  "/writing": "Writing", "/writing/llm-layers": "Post · 1 API call → 8 layers", "/contact": "Contact", "/resume": "Résumé",
  "/work/fraud": "Case study · Fraud Ops", "/work/help": "Case study · St. Louis HELP", "/query": "SQL playground", "/stats": "Stats",
};
const FLAGS: Record<string, string> = { US: "United States", NP: "Nepal", IN: "India", GB: "United Kingdom", CA: "Canada", DE: "Germany", AU: "Australia" };
const n = (v: unknown) => Number(v || 0);
const fmt = (v: number) => v.toLocaleString("en-US");

async function load() {
  if (!db) return null;
  try {
    const [kpi, series, pages, sources, countries, devices, today, run, since] = await Promise.all([
      db`SELECT COALESCE(SUM(views),0) v, COALESCE(SUM(visitors),0) u FROM reporting.daily_traffic WHERE day > (now() AT TIME ZONE ${CT})::date - 30`,
      db`SELECT d::date AS day, COALESCE(t.views,0) views FROM generate_series((now() AT TIME ZONE ${CT})::date - 30, (now() AT TIME ZONE ${CT})::date - 1, interval '1 day') d
         LEFT JOIN reporting.daily_traffic t ON t.day = d::date ORDER BY 1`,
      db`SELECT path, SUM(views) v FROM reporting.daily_pages WHERE day > (now() AT TIME ZONE ${CT})::date - 30 GROUP BY path ORDER BY v DESC LIMIT 8`,
      db`SELECT source, SUM(visits) v FROM reporting.daily_sources WHERE day > (now() AT TIME ZONE ${CT})::date - 30 GROUP BY source ORDER BY v DESC LIMIT 8`,
      db`SELECT country, SUM(visitors) v FROM reporting.daily_countries WHERE day > (now() AT TIME ZONE ${CT})::date - 30 GROUP BY country ORDER BY v DESC LIMIT 6`,
      db`SELECT device, SUM(visitors) v FROM reporting.daily_devices WHERE day > (now() AT TIME ZONE ${CT})::date - 30 GROUP BY device ORDER BY v DESC`,
      db`SELECT COUNT(*) v, COUNT(DISTINCT visitor_id) u FROM raw.pageviews WHERE ts >= ((now() AT TIME ZONE ${CT})::date)::timestamp AT TIME ZONE ${CT}`,
      db`SELECT status, finished_at, started_at, raw_rows, days_built, triggered_by FROM ops.pipeline_runs ORDER BY id DESC LIMIT 1`,
      db`SELECT MIN(ts) t, COUNT(*) total FROM raw.pageviews`,
    ]);
    // topics may not exist yet on an older database, so this one can fail on its own
    const topics = await db`SELECT topic, SUM(questions) v FROM reporting.daily_topics WHERE day > (now() AT TIME ZONE ${CT})::date - 30 GROUP BY topic ORDER BY v DESC LIMIT 8`.catch(() => []);
    return { topics, kpi: kpi[0], series, pages, sources, countries, devices, today: today[0], run: run[0] as Row | undefined, since: since[0] };
  } catch {
    return null;
  }
}

function Bars({ rows, label, value, name }: { rows: Row[]; label: string; value: string; name?: (s: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => n(r[value])));
  if (!rows.length) return <p className="st-empty">No data yet</p>;
  return (
    <ul className="st-bars">
      {rows.map((r) => {
        const k = String(r[label]);
        return (
          <li key={k}>
            <span className="st-bl">{name ? name(k) : k}</span>
            <span className="st-bt"><i style={{ width: `${(n(r[value]) / max) * 100}%` }} /></span>
            <b>{fmt(n(r[value]))}</b>
          </li>
        );
      })}
    </ul>
  );
}

function Chart({ series }: { series: Row[] }) {
  const W = 760, H = 180, P = 28;
  const vals = series.map((r) => n(r.views));
  const max = Math.max(4, ...vals);
  const x = (i: number) => P + (i * (W - P * 2)) / Math.max(1, vals.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const line = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(vals.length - 1)} ${H - P} L${x(0)} ${H - P} Z`;
  const day = (r: Row) => new Date(String(r.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Page views per day, last 30 days">
      {[0, 0.5, 1].map((k) => (
        <g key={k}>
          <line x1={P} x2={W - P} y1={y(max * k)} y2={y(max * k)} stroke="rgba(125,211,252,.15)" />
          <text x={P - 6} y={y(max * k) + 4} textAnchor="end" fontSize="10" fill="#5f84a3" fontFamily="JetBrains Mono, monospace">{Math.round(max * k)}</text>
        </g>
      ))}
      <path d={area} fill="rgba(94,234,212,.10)" />
      <path d={line} fill="none" stroke="#5eead4" strokeWidth="2" />
      {series.map((r, i) => (i % 5 === 0 || i === series.length - 1) && (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#5f84a3" fontFamily="JetBrains Mono, monospace">{day(r)}</text>
      ))}
      {vals.length > 0 && <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="3.5" fill="#5eead4" />}
    </svg>
  );
}

export default async function Stats() {
  const d = await load();
  const run = d?.run;
  const when = (t: unknown) => (t ? new Date(String(t)).toLocaleString("en-US", { timeZone: CT, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " CT" : "—");
  const totalDevices = Math.max(1, ...[0], (d?.devices || []).reduce((a, r) => a + n(r.v), 0));
  return (
    <main className="st">
      <header className="st-top">
        <a href="/" className="st-back">← bijay-paudel.com.np</a>
        <span className="st-tag">SHEET S · SITE STATS</span>
      </header>

      <section className="st-head">
        <div className="lbl">Appendix B · Stats</div>
        <h1>This page is fed by its own data pipeline</h1>
        <p>Every page view on this site lands in Postgres. Each night a GitHub Actions job rolls the raw events into reporting tables, and this page reads them. It&apos;s the same raw → reporting design I use at St. Louis HELP, running on my own portfolio.</p>
      </section>

      <div className="st-flow" aria-label="Pipeline">
        {[["Browser", "page view"], ["/api/track", "Next.js on Vercel"], ["raw.pageviews", "Neon Postgres"], ["rollup.sql", "GitHub Actions · 2:15 AM CT"], ["reporting.daily_*", "5 tables"], ["/stats", "you are here"]].map(([a, b], i, all) => (
          <div key={a} className="st-node"><b>{a}</b><span>{b}</span>{i < all.length - 1 && <i aria-hidden="true">→</i>}</div>
        ))}
      </div>

      {!d ? (
        <p className="st-empty st-box">The stats database isn&apos;t connected yet. Check back soon.</p>
      ) : (
        <>
          <div className="st-kpis">
            <div><small>Page views · 30 days</small><b>{fmt(n(d.kpi.v))}</b></div>
            <div><small>Visitors · 30 days</small><b>{fmt(n(d.kpi.u))}</b><span>counted once per day</span></div>
            <div><small>Today so far · live</small><b>{fmt(n(d.today.v))}</b><span>{fmt(n(d.today.u))} visitors, from raw</span></div>
            <div><small>Last pipeline run</small><b className={run?.status === "success" ? "ok" : ""}>{run ? (run.status === "success" ? "✓ success" : String(run.status)) : "tonight"}</b><span>{run ? `${when(run.finished_at || run.started_at)} · ${n(run.raw_rows)} rows` : "first run at 2:15 AM CT"}</span></div>
          </div>

          <div className="st-box">
            <div className="st-h"><span>FIG. S1 — PAGE VIEWS PER DAY · LAST 30 DAYS</span><span>reporting.daily_traffic</span></div>
            <Chart series={d.series} />
          </div>

          <div className="st-grid">
            <div className="st-box"><div className="st-h"><span>TOP PAGES</span><span>daily_pages</span></div><Bars rows={d.pages} label="path" value="v" name={(p) => NAMES[p] || p} /></div>
            <div className="st-box"><div className="st-h"><span>WHERE VISITORS COME FROM</span><span>daily_sources</span></div><Bars rows={d.sources} label="source" value="v" /></div>
            <div className="st-box"><div className="st-h"><span>COUNTRIES</span><span>daily_countries</span></div><Bars rows={d.countries} label="country" value="v" name={(c) => FLAGS[c] || c} /></div>
            <div className="st-box"><div className="st-h"><span>DEVICES</span><span>daily_devices</span></div>
              {d.devices.length ? (
                <>
                  <div className="st-split">{d.devices.map((r) => <i key={String(r.device)} className={`dv-${r.device}`} style={{ width: `${(n(r.v) / totalDevices) * 100}%` }} />)}</div>
                  <ul className="st-legend">{d.devices.map((r) => <li key={String(r.device)}><i className={`dv-${r.device}`} />{String(r.device)} <b>{Math.round((n(r.v) / totalDevices) * 100)}%</b></li>)}</ul>
                </>
              ) : <p className="st-empty">No data yet</p>}
            </div>
          </div>

          <div className="st-box">
            <div className="st-h"><span>WHAT VISITORS ASK TALLY · 30 DAYS</span><span>daily_topics</span></div>
            <Bars rows={d.topics} label="topic" value="v" />
            <p className="st-note">Tally, the robot on every page, logs only the topic of each question (never the text) into raw.chat_questions.</p>
          </div>

          <p className="st-foot">
            Collecting since {d.since?.t ? when(d.since.t) : "today"} · raw events kept 90 days · no cookies, no IP addresses stored ·
            the SQL behind this page is <code>db/rollup.sql</code>
          </p>
        </>
      )}
    </main>
  );
}
