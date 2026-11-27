import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { allow, clientKey } from "@/lib/ratelimit";

// Contact form → your inbox, with no form service in between.
// 1. Spam checks run here on the server (bots can't skip them).
// 2. A backup copy is saved in Neon (raw.contact_messages), so nothing is lost if an email fails.
// 3. Resend delivers the email to CONTACT_TO with Reply-To set to the visitor, so "Reply" answers them.
// 4. The visitor gets a short "thanks, I got your message" email (set CONTACT_AUTOREPLY=off in Vercel to stop it).
// Vercel settings: RESEND_API_KEY (required), CONTACT_TO and CONTACT_FROM (optional, defaults below).

export const maxDuration = 30;
const TO = process.env.CONTACT_TO || ["hello", "bijay-paudel.com.np"].join("@");
const FROM = process.env.CONTACT_FROM || "Bijay's website <website@bijay-paudel.com.np>";

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

  // 5 messages an hour per visitor, plus 50 a day for the whole site (counts kept in Neon, see lib/ratelimit.ts)
  const who = clientKey(req);
  if (!(await allow("contact", who, 5, 3600)) || !(await allow("contact-all", "all", 50, 86400)))
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });

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

    // Confirmation to the visitor. It never repeats their message (so bots can't use it to send spam to strangers)
    // and only goes out for messages that passed every spam check above.
    if (sent && process.env.CONTACT_AUTOREPLY !== "off") {
      const first = name.split(/\s+/)[0].replace(/[^\p{L}\p{N}'’-]/gu, "").slice(0, 40) || "there";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM.replace(/^[^<]*</, "Bijay Paudel <").replace(/<website@/, "<hello@"),
          to: [email],
          reply_to: TO,
          subject: "Thanks for your message · Bijay Paudel",
          text: `Hi ${first},\n\nThanks for reaching out through my website. I got your message and will reply within a day or two.\n\nIf it's urgent, you can reply to this email directly.\n\nBijay Paudel\nData Analyst & Analytics Engineer\nhttps://www.bijay-paudel.com.np`,
          html: `<div style="font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#0b2238;max-width:520px">
<p>Hi ${esc(first)},</p>
<p>Thanks for reaching out through my website. I got your message and will reply within a day or two.</p>
<p>If it's urgent, you can reply to this email directly.</p>
<p style="margin-top:22px">Bijay Paudel<br><span style="color:#64748b">Data Analyst &amp; Analytics Engineer</span><br><a href="https://www.bijay-paudel.com.np" style="color:#0f766e">bijay-paudel.com.np</a></p></div>`,
        }),
        signal: AbortSignal.timeout(8_000),
      }).catch(() => null);
    }
  }

  if (sent || saved) return ok();   // saved-but-not-emailed is still safe: it's in the database
  return NextResponse.json({ error: "Could not send just now." }, { status: 502 });
}
