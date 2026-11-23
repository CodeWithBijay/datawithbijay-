import { NextResponse, type NextRequest } from "next/server";
import { AI_TRAINING_BOTS } from "./app/robots";

// Turns away AI training crawlers even if they ignore robots.txt.
// They can still read /robots.txt, which tells them the same thing politely.
const BLOCK = new RegExp(AI_TRAINING_BOTS.map((b) => b.replace(/[-]/g, "\\-")).join("|"), "i");

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (BLOCK.test(ua)) {
    return new NextResponse("AI training crawlers are not permitted on this site. See /robots.txt.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8", "X-Robots-Tag": "noai, noimageai" },
    });
  }
  return NextResponse.next();
}

export const config = {
  // every page except Next's static files and robots.txt
  matcher: ["/((?!_next/static|_next/image|robots.txt|favicon.ico|icon.svg|apple-icon.png).*)"],
};
