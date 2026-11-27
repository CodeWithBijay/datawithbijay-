import { NextResponse } from "next/server";
import { FACTS, RULES, JD_RULES } from "@/lib/pixelBrain";
import { db } from "@/lib/db";
import { allow, clientKey } from "@/lib/ratelimit";

// Tally's answers. Newer Gemini models spend part of maxOutputTokens on hidden "thinking", so the limit is generous;
// the RULES keep the visible answer short.
// If the key is missing or Gemini fails, the browser falls back to Tally's built-in answers.

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
// backups when the main model is busy (set GEMINI_FALLBACKS="model-a,model-b" in Vercel to change them)
const FALLBACKS = (process.env.GEMINI_FALLBACKS || "gemini-3.1-flash-lite,gemini-3.5-flash").split(",").map((s) => s.trim()).filter(Boolean);
export const maxDuration = 60;

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
  // 20 questions per 10 minutes per visitor, plus 500 a day for the whole site so the Gemini bill can't run away
  // (counts kept in Neon, see lib/ratelimit.ts; change CHAT_DAILY_CAP in Vercel to adjust the daily cap)
  const who = clientKey(req), daily = Number(process.env.CHAT_DAILY_CAP) || 500;
  if (!(await allow("chat", who, 20, 600)) || !(await allow("chat-all", "all", daily, 86400)))
    return NextResponse.json({ error: "slow down" }, { status: 429 });

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

  // Busy Gemini models answer 503/429/500. Try the main model, wait and try it once more, then use a lighter backup model.
  const body2 = JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: mode === "jd" ? 4096 : 2048, temperature: 0.4 } });
  const attempts = [MODEL, MODEL, ...FALLBACKS.filter((m) => m !== MODEL)];
  let lastErr = "no answer";
  for (let i = 0; i < attempts.length; i++) {
    if (i > 0) await new Promise((res) => setTimeout(res, i === 1 ? 1200 : 300));
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${attempts[i]}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: body2,
        signal: AbortSignal.timeout(15_000),
      });
      if (!r.ok) {
        lastErr = `upstream ${r.status} (${attempts[i]})`;
        if (r.status === 503 || r.status === 429 || r.status === 500 || r.status === 404) continue; // busy or retired: try the next one
        break;
      }
      const data = await r.json();
      const text: string = (data?.candidates?.[0]?.content?.parts || []).filter((p: { thought?: boolean }) => !p.thought).map((p: { text?: string }) => p.text || "").join("").trim();
      if (!text) { lastErr = `empty answer (${attempts[i]})`; continue; }
      await logged;
      return NextResponse.json({ text });
    } catch {
      lastErr = `timeout (${attempts[i]})`;
    }
  }
  await logged;
  return NextResponse.json({ error: lastErr }, { status: 502 });
}
