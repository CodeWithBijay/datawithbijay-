import { createHash } from "crypto";
import { db } from "@/lib/db";

// Rate limits that survive server restarts.
// Counts live in Neon (ops.rate_limits), so a fresh serverless copy of the site can't be used to reset them.
// The visitor's address is never stored: it's turned into a one-way hash first (same idea as the visit counter).
// If the database can't be reached, a per-server in-memory count is used instead, so the site keeps working.

const mem = new Map<string, number[]>();

export function clientKey(req: Request): string {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  return createHash("sha256").update(`${ip}|${process.env.STATS_SALT || "dwb"}`).digest("hex").slice(0, 24);
}

/**
 * Records one hit and says whether it is allowed.
 * bucket: what is being limited ("contact", "chat", "chat-all")
 * key: who (a hashed visitor key, or "all" for a site-wide cap)
 * max hits are allowed per windowSec seconds.
 */
export async function allow(bucket: string, key: string, max: number, windowSec: number): Promise<boolean> {
  if (db) {
    try {
      const rows = (await db`
        WITH recent AS (
          SELECT COUNT(*)::int AS n FROM ops.rate_limits
          WHERE bucket = ${bucket} AND key = ${key} AND ts > now() - make_interval(secs => ${windowSec})
        ), ins AS (
          INSERT INTO ops.rate_limits (bucket, key)
          SELECT ${bucket}, ${key} WHERE (SELECT n FROM recent) < ${max}
          RETURNING 1
        )
        SELECT (SELECT n FROM recent) AS n`) as { n: number }[];
      // now and then, clear rows older than a day so the table stays tiny
      if (Math.random() < 0.02) db`DELETE FROM ops.rate_limits WHERE ts < now() - interval '1 day'`.catch(() => null);
      return rows[0].n < max;
    } catch {
      /* fall through to the in-memory count */
    }
  }
  const k = `${bucket}|${key}`, now = Date.now();
  const recent = (mem.get(k) || []).filter((t) => now - t < windowSec * 1000);
  if (recent.length >= max) return false;
  mem.set(k, [...recent, now]);
  return true;
}
