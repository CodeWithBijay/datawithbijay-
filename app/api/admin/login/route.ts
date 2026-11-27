import { NextResponse } from "next/server";
import { scrypt, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";
import { ADMIN_COOKIE, SESSION_DAYS, adminConfigured, adminEnv, createSession } from "@/lib/adminSession";
import { allow, clientKey } from "@/lib/ratelimit";

// Admin login (form on /admin/login). Checks your ID and password, then sets a signed 7-day cookie.
// • The password is never stored: ADMIN_PASSWORD_HASH holds a one-way scrypt hash of it.
// • 5 wrong tries from one visitor → locked for 15 minutes; 30 a day site-wide → locked for the day.
// • Only forms on this site are accepted (blocks login attempts posted from other websites).

export const runtime = "nodejs";
const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;
const sameText = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

async function passwordMatches(password: string) {
  // format: scrypt:N:r:p:<salt base64>:<hash base64>   (made by scripts/admin-password.mjs)
  const [kind, N, r, p, salt, hash] = adminEnv("ADMIN_PASSWORD_HASH").replace(/\s+/g, "").split(":");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const want = Buffer.from(hash, "base64");
  const got = await scryptAsync(password, Buffer.from(salt, "base64"), want.length, { N: +N, r: +r, p: +p, maxmem: 256 * 1024 * 1024 });
  return got.length === want.length && timingSafeEqual(got, want);
}

// the address the visitor's browser actually used (Vercel and local servers can see a different internal one)
const siteBase = (req: Request) => {
  const h = req.headers, u = new URL(req.url);
  const host = h.get("x-forwarded-host") || h.get("host") || u.host;
  const proto = (h.get("x-forwarded-proto") || u.protocol.replace(":", "")).split(",")[0];
  return `${proto}://${host}`;
};

const back = (req: Request, error: string, next: string) => {
  const u = new URL("/admin/login", siteBase(req));
  u.searchParams.set("error", error);
  if (next) u.searchParams.set("next", next);
  return NextResponse.redirect(u, 303);
};

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(siteBase(req)).host) return new NextResponse("Forbidden", { status: 403 });

  const form = await req.formData().catch(() => null);
  const username = String(form?.get("username") || "").trim().slice(0, 100);
  const password = String(form?.get("password") || "").slice(0, 200);
  let next = String(form?.get("next") || "/keystatic");
  if (!/^\/keystatic(\/|$|\?)/.test(next)) next = "/keystatic"; // only ever send you back into the editor

  if (!adminConfigured()) return back(req, "setup", next);

  const who = clientKey(req);
  if (!(await allow("admin-login", who, 5, 900)) || !(await allow("admin-login-all", "all", 30, 86400))) return back(req, "locked", next);

  const ok = sameText(username.toLowerCase(), adminEnv("ADMIN_USERNAME").toLowerCase()) && (await passwordMatches(password));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // slows down guessing
    return back(req, "wrong", next);
  }

  const res = NextResponse.redirect(new URL(next, siteBase(req)), 303);
  res.cookies.set(ADMIN_COOKIE, await createSession(username), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
