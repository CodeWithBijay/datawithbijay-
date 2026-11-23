import { NextResponse } from "next/server";
import { FACTS, RULES, JD_RULES } from "@/lib/pixelBrain";
import { db } from "@/lib/db";

// Tally's answers. The Gemini key stays on the server (GEMINI_API_KEY in .env.local / your host's settings).
// If the key is missing or Gemini fails, the browser falls back to Tally's built-in answers.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const hits = new Map<string, number[]>(); // tiny per-IP limit: 20 questions / 10 min

type Turn = { role: "visitor" | "pixel"; text: string };

// What people ask about, for the "What visitors ask Tally" chart on /stats. Only the topic and length are stored, never the question.
const TOPICS: [string, RegExp][] = [
  ["greetings", /^(hi|hey|hello|yo|sup|thanks?|thank you)\b/i],
  ["work authorization", /visa|sponsor|\bopt\b|stem|f-?1|h-?1b|authori[sz]|green card|citizen/i],
  ["projects", /project|fraud|help|nonprofit|dashboard|case stud|pipeline|built|portfolio/i],
  ["skills & tools", /skill|stack|tool|sql|python|power ?bi|azure|fabric|tech|postgres|excel|tableau|\br\b/i],
  ["education", /educat|degree|school|universit|master|graduat|slu|study|gpa|course/i],
  ["hiring & availability", /hire|hiring|role|job|open to|availab|recruit|position|salary|relocat|remote|start/i],
  ["contact & résumé", /contact|email|reach|linkedin|github|resume|résumé|cv|call|phone/i],
  ["experience", /experience|intern|volunteer|worked|employ/i],
  ["about Bijay", /who|about|background|hobb|nepal|from|personal|fun/i],
];
const topicOf = (q: string, mode: string) => (mode === "jd" ? "job description match" : TOPICS.find(([, r]) => r.test(q))?.[0] || "other");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 20) return NextResponse.json({ error: "slow down" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let body: { question?: unknown; history?: unknown; mode?: unknown; nostats?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const mode = body.mode === "jd" ? "jd" : "chat";
  const question = typeof body.question === "string" ? body.question.trim().slice(0, mode === "jd" ? 4000 : 400) : "";
  if (!question) return NextResponse.json({ error: "empty" }, { status: 400 });

  // log the topic (not the text); never let analytics break the chat
  const logged = db && body.nostats !== true
    ? db`INSERT INTO raw.chat_questions (topic, len, mode) VALUES (${topicOf(question, mode)}, ${question.length}, ${mode})`.catch(() => null)
    : Promise.resolve(null);

  const key = process.env.GEMINI_API_KEY;
  if (!key) { await logged; return NextResponse.json({ error: "not configured" }, { status: 503 }); }
  const history: Turn[] = Array.isArray(body.history)
    ? (body.history as Turn[]).slice(-8).filter((t) => t && typeof t.text === "string").map((t) => ({ role: t.role === "pixel" ? "pixel" : "visitor", text: t.text.slice(0, 600) }))
    : [];

  const convo = history.map((t) => (t.role === "visitor" ? "Visitor: " : "Tally: ") + t.text).join("\n");
  const prompt = mode === "jd"
    ? `${JD_RULES}\n\nFACTS:\n${FACTS}\n\nJOB DESCRIPTION:\n${question}\n\nTally:`
    : `${RULES}\n\nFACTS:\n${FACTS}\n\n${convo ? "CONVERSATION SO FAR:\n" + convo + "\n\n" : ""}Visitor: ${question}\nTally:`;

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: mode === "jd" ? 1200 : 300, temperature: 0.4 } }),
      signal: AbortSignal.timeout(25_000),
    });
    await logged;
    if (!r.ok) return NextResponse.json({ error: "upstream " + r.status }, { status: 502 });
    const data = await r.json();
    const text: string = (data?.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || "").join("").trim();
    if (!text) return NextResponse.json({ error: "empty answer" }, { status: 502 });
    return NextResponse.json({ text });
  } catch {
    await logged;
    return NextResponse.json({ error: "timeout" }, { status: 504 });
  }
}
