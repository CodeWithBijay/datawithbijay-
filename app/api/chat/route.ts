import { NextResponse } from "next/server";
import { FACTS, RULES } from "@/lib/pixelBrain";

// Pixel's answers. The Gemini key stays on the server (GEMINI_API_KEY in .env.local / your host's settings).
// If the key is missing or Gemini fails, the browser falls back to Pixel's built-in answers.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const hits = new Map<string, number[]>(); // tiny per-IP limit: 20 questions / 10 min

type Turn = { role: "visitor" | "pixel"; text: string };

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 20) return NextResponse.json({ error: "slow down" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let body: { question?: unknown; history?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 400) : "";
  if (!question) return NextResponse.json({ error: "empty" }, { status: 400 });
  const history: Turn[] = Array.isArray(body.history)
    ? (body.history as Turn[]).slice(-8).filter((t) => t && typeof t.text === "string").map((t) => ({ role: t.role === "pixel" ? "pixel" : "visitor", text: t.text.slice(0, 600) }))
    : [];

  const convo = history.map((t) => (t.role === "visitor" ? "Visitor: " : "Pixel: ") + t.text).join("\n");
  const prompt = `${RULES}\n\nFACTS:\n${FACTS}\n\n${convo ? "CONVERSATION SO FAR:\n" + convo + "\n\n" : ""}Visitor: ${question}\nPixel:`;

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 300, temperature: 0.4 } }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!r.ok) return NextResponse.json({ error: "upstream " + r.status }, { status: 502 });
    const data = await r.json();
    const text: string = (data?.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || "").join("").trim();
    if (!text) return NextResponse.json({ error: "empty answer" }, { status: 502 });
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "timeout" }, { status: 504 });
  }
}
