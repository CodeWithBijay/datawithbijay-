import { NextResponse, type NextRequest } from "next/server";
import { AI_TRAINING_BOTS } from "./app/robots";
import { ADMIN_COOKIE, adminConfigured, verifySession } from "./lib/adminSession";

// 1. Turns away AI training crawlers even if they ignore robots.txt.
//    They can still read /robots.txt, which tells them the same thing politely.
// 2. Guards the content editor (/keystatic and its API): only someone logged in at /admin/login gets through.
const BLOCK = new RegExp(AI_TRAINING_BOTS.map((b) => b.replace(/[-]/g, "\\-")).join("|"), "i");

export async function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (BLOCK.test(ua)) {
    return new NextResponse("AI training crawlers are not permitted on this site. See /robots.txt.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8", "X-Robots-Tag": "noai, noimageai" },
    });
  }

  const path = req.nextUrl.pathname;
  const isEditor = path === "/keystatic" || path.startsWith("/keystatic/") || path.startsWith("/api/keystatic/");
  if (isEditor) {
    // On your own computer (npm run dev) without a password set up, the editor stays open, like before.
    const openLocally = process.env.NODE_ENV === "development" && !adminConfigured();
    if (!openLocally && !(await verifySession(req.cookies.get(ADMIN_COOKIE)?.value))) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Please log in at /admin/login" }, { status: 401 });
      }
      const login = new URL("/admin/login", req.url);
      login.searchParams.set("next", path + req.nextUrl.search);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

export const config = {
  // every page except Next's static files and robots.txt
  matcher: ["/((?!_next/static|_next/image|robots.txt|favicon.ico|icon.svg|icon-192.png|icon-512.png|apple-touch-icon.png|manifest.webmanifest).*)"],
};
