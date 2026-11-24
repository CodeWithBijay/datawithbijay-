import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Contact form → your inbox, with no form service in between.
// 1. Spam checks run here on the server (bots can't skip them).
// 2. A backup copy is saved in Neon (raw.contact_messages), so nothing is lost if an email fails.
// 3. Resend delivers the email to CONTACT_TO with Reply-To set to the visitor, so "Reply" answers them.
// Vercel settings: RESEND_API_KEY (required), CONTACT_TO and CONTACT_FROM (optional, defaults below).

export const maxDuration = 30;
const TO = process.env.CONTACT_TO || ["hello", "bijay-paudel.com.np"].join("@");
const FROM = process.env.CONTACT_FROM || "Bijay's website <website@bijay-paudel.com.np>";
const hits = new Map<string, number[]>(); // per-IP limit: 5 messages / hour

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const ok = () => NextResponse.json({ ok: true });

export async function POST(req: Request) {
  let b: { name?: unknown; email?: unknown; message?: unknown; website?: unknown; t?: unknown };
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const str = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const name = str(b.name, 100), email = str(b.email, 200), message = str(b.message, 5000);

  // --- spam checks: bots get a normal-looking "ok" so they don't learn anything ---
  if (str(b.website, 200)) return ok();                                   // hidden trap field was filled
  if (typeof b.t !== "number" || b.t < 3000) return ok();                 // sent within 3 s of opening the page
  if ((message.match(/https?:\/\/|www\./gi) || []).length > 3) return ok(); // link-stuffed spam

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message)
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60 * 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  // --- backup copy ---
  let saved = false;
  if (db) {
    try { await db`INSERT INTO raw.contact_messages (name, email, message) VALUES (${name}, ${email}, ${message})`; saved = true; } catch { /* keep going */ }
  }

  // --- email it ---
  let sent = false;
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          reply_to: email,
          subject: `New message from ${name.replace(/[\r\n]+/g, " ")} · bijay-paudel.com.np`,
          text: `${message}\n\n— ${name} <${email}>\nSent from the contact form on bijay-paudel.com.np`,
          html: `<div style="font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#0b2238;max-width:560px">
<p style="margin:0 0 6px;color:#64748b;font-size:12px;letter-spacing:.08em;text-transform:uppercase">New message · bijay-paudel.com.np</p>
<p style="margin:0 0 16px"><b>${esc(name)}</b> &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;</p>
<div style="white-space:pre-wrap;border-left:3px solid #5eead4;padding:4px 0 4px 14px">${esc(message)}</div>
<p style="margin:20px 0 0;color:#64748b;font-size:13px">Hit <b>Reply</b> to answer ${esc(name.split(" ")[0])} directly.</p></div>`,
        }),
        signal: AbortSignal.timeout(12_000),
      });
      sent = r.ok;
      if (sent && saved && db) await db`UPDATE raw.contact_messages SET emailed = true WHERE id = (SELECT max(id) FROM raw.contact_messages WHERE email = ${email})`.catch(() => null);
    } catch { /* fall through */ }
  }

  if (sent || saved) return ok();   // saved-but-not-emailed is still safe: it's in the database
  return NextResponse.json({ error: "Could not send just now." }, { status: 502 });
}
