import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Small live numbers for Tally's chatter: visitors so far today, the top traffic source (30 days)
// and the visitor's own country (from Vercel's edge header, used only for the greeting, never stored).
export const dynamic = "force-dynamic";
const CT = "America/Chicago";
let cache: { t: number; today: number; source: string | null } | null = null;

export async function GET(req: Request) {
  if (db && (!cache || Date.now() - cache.t > 5 * 60_000)) {
    try {
      const [a, b] = await Promise.all([
        db`SELECT COUNT(DISTINCT visitor_id) u FROM raw.pageviews WHERE ts >= ((now() AT TIME ZONE ${CT})::date)::timestamp AT TIME ZONE ${CT}`,
        db`SELECT source FROM reporting.daily_sources WHERE day > (now() AT TIME ZONE ${CT})::date - 30 AND source <> 'Direct' GROUP BY source ORDER BY SUM(visits) DESC LIMIT 1`,
      ]);
      cache = { t: Date.now(), today: Number(a[0]?.u || 0), source: (b[0]?.source as string) || null };
    } catch {
      cache = { t: Date.now(), today: 0, source: null };
    }
  }
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase().slice(0, 2) || null;
  return NextResponse.json({ today: cache?.today || 0, source: cache?.source || null, country }, { headers: { "Cache-Control": "private, no-store" } });
}
