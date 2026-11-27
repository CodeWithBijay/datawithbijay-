import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminSession";

// Logs you out of the content editor.
export async function POST(req: Request) {
  const h = req.headers, u = new URL(req.url);
  const base = `${(h.get("x-forwarded-proto") || u.protocol.replace(":", "")).split(",")[0]}://${h.get("x-forwarded-host") || h.get("host") || u.host}`;
  const res = NextResponse.redirect(new URL("/admin/login?bye=1", base), 303);
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
