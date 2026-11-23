import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";

// Receives one page view from the website and lands it in raw.pageviews.
// No cookies and no IP address stored: visitor_id is a hash of (IP + browser + today's date + a secret),
// so the same person can be counted once per day but can't be followed across days.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|vercel|curl|wget|python|axios|node-fetch/i;
const PATHS = /^\/[a-z0-9/_-]{0,80}$/i;
const SITE = "bijay-paudel.com.np";

export async function POST(req: Request) {
  if (!db) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") || "";
  if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: { path?: string; ref?: string } = {};
  try {
    body = JSON.parse((await req.text()).slice(0, 2000));
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const path = (body.path || "/").split("?")[0].replace(/\/+$/, "") || "/";
  if (!PATHS.test(path)) return new NextResponse(null, { status: 400 });

  let referrer: string | null = null;
  try {
    if (body.ref) {
      const h = new URL(body.ref).hostname.replace(/^www\./, "");
      if (!h.endsWith(SITE) && !h.endsWith("vercel.app") && h !== "localhost") referrer = h.slice(0, 120);
    }
  } catch {}

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHash("sha256").update(`${ip}|${ua}|${day}|${process.env.STATS_SALT || "dwb"}`).digest("hex").slice(0, 16);
  const country = req.headers.get("x-vercel-ip-country") || null;
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";

  try {
    await db`INSERT INTO raw.pageviews (path, referrer_host, country, device, visitor_id)
             VALUES (${path}, ${referrer}, ${country}, ${device}, ${visitor})`;
  } catch {
    // never break the website because of analytics
  }
  return new NextResponse(null, { status: 204 });
}
