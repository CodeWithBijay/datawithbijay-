import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Small live numbers for Tally's chatter: visitors so far today, the top traffic source (30 days)
// and the visitor's own country (from Vercel's edge header, used only for the greeting, never stored).
export const dynamic = "force-dynamic";
const CT = "America/Chicago";
let cache: { t: number; today: number; source: string | null; views30: number; lastRun: string | null } | null = null;

export async function GET(req: Request) {
  if (db && (!cache || Date.now() - cache.t > 5 * 60_000)) {
    try {
      const [a, b, c] = await Promise.all([
        db`SELECT COUNT(DISTINCT visitor_id) u FROM raw.pageviews WHERE ts >= ((now() AT TIME ZONE ${CT})::date)::timestamp AT TIME ZONE ${CT}`,
        db`SELECT source FROM reporting.daily_sources WHERE day > (now() AT TIME ZONE ${CT})::date - 30 AND source <> 'Direct' GROUP BY source ORDER BY SUM(visits) DESC LIMIT 1`,
        db`SELECT (SELECT COUNT(*) FROM raw.pageviews WHERE ts > now() - interval '30 days') AS v30, (SELECT max(finished_at) FROM ops.pipeline_runs WHERE status = 'success') AS last_run`,
      ]);
      cache = { t: Date.now(), today: Number(a[0]?.u || 0), source: (b[0]?.source as string) || null, views30: Number(c[0]?.v30 || 0), lastRun: c[0]?.last_run ? new Date(c[0].last_run as string).toISOString() : null };
    } catch {
      cache = { t: Date.now(), today: 0, source: null, views30: 0, lastRun: null };
    }
  }
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase().slice(0, 2) || null;
  return NextResponse.json({ today: cache?.today || 0, source: cache?.source || null, views30: cache?.views30 || 0, lastRun: cache?.lastRun || null, country }, { headers: { "Cache-Control": "private, no-store" } });
}
