"use client";
// "Tally Runner": the little game on the 404 page.
// Tally runs along a data pipeline and jumps over broken records (NULL, NaN, 404 …) and flying bugs.
// Space / ↑ / click / tap to jump. Score = rows processed; the best score stays in this browser only.
import { useEffect, useRef, useState } from "react";

const W = 760, H = 240, GROUND = 196;            // game size in "game pixels" (scaled to fit the screen)
const TW = 54, TH = 60;                          // Tally's size
const BLOCKS = ["NULL", "NaN", "404", "ERR", "null", "#N/A", "DROP", "0/0"];

type Ob = { x: number; y: number; w: number; h: number; label: string; bug: boolean; flap: number };

export default function TallyRunner() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"ready" | "running" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const api = useRef<{ jump: () => void }>({ jump: () => {} });

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const img = (n: string) => { const i = new Image(); i.src = `/tally/${n}.webp`; return i; };
    const pose = { happy: img("happy"), neutral: img("neutral"), sad: img("sad") };

    let bestScore = 0;
    try { bestScore = Number(localStorage.getItem("tally-runner-best")) || 0; } catch {}
    setBest(bestScore);

    let mode: "ready" | "running" | "over" = "ready";
    let y = GROUND - TH, vy = 0, onGround = true;
    let speed = 6, dist = 0, t = 0, nextGap = 300, obs: Ob[] = [], bits: { x: number; y: number; s: string; v: number }[] = [];
    let raf = 0, last = 0, shown = -1, cheer = 0;

    for (let i = 0; i < 14; i++) bits.push({ x: Math.random() * W, y: 18 + Math.random() * 120, s: Math.random() < 0.5 ? "0" : "1", v: 0.15 + Math.random() * 0.5 });

    const reset = () => { y = GROUND - TH; vy = 0; onGround = true; speed = 6; dist = 0; nextGap = 320; obs = []; cheer = 0; };
    const jump = () => {
      if (mode === "ready" || mode === "over") { reset(); mode = "running"; setState("running"); return; }
      if (onGround) { vy = -12.6; onGround = false; }
    };
    api.current.jump = jump;

    const spawn = () => {
      const bug = dist > 1400 && Math.random() < 0.28;
      if (bug) {
        const high = Math.random() < 0.5;
        obs.push({ x: W + 20, y: high ? GROUND - 112 : GROUND - 74, w: 34, h: 22, label: "bug", bug: true, flap: 0 });
      } else {
        const label = BLOCKS[(Math.random() * BLOCKS.length) | 0];
        const tall = Math.random() < 0.35;
        const w = Math.max(38, label.length * 10 + 16), h = tall ? 46 : 32;
        obs.push({ x: W + 20, y: GROUND - h, w, h, label, bug: false, flap: 0 });
        if (dist > 900 && Math.random() < 0.25) obs.push({ x: W + 24 + w, y: GROUND - 30, w: 36, h: 30, label: "NaN", bug: false, flap: 0 });
      }
      nextGap = 230 + Math.random() * 260 + speed * 14;
    };

    const rr = (x: number, yy: number, w: number, h: number, r: number) => {
      ctx.beginPath(); ctx.moveTo(x + r, yy); ctx.arcTo(x + w, yy, x + w, yy + h, r); ctx.arcTo(x + w, yy + h, x, yy + h, r);
      ctx.arcTo(x, yy + h, x, yy, r); ctx.arcTo(x, yy, x + w, yy, r); ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // floating data bits (slow parallax)
      ctx.font = "12px 'JetBrains Mono', ui-monospace, monospace";
      for (const b of bits) { ctx.fillStyle = "rgba(125,211,252,.18)"; ctx.fillText(b.s, b.x, b.y); }
      // ground: the pipeline
      ctx.strokeStyle = "rgba(125,211,252,.45)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 0.5); ctx.lineTo(W, GROUND + 0.5); ctx.stroke();
      ctx.strokeStyle = "rgba(94,234,212,.35)"; ctx.setLineDash([10, 14]); ctx.lineDashOffset = dist % 24;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 14); ctx.lineTo(W, GROUND + 14); ctx.stroke(); ctx.setLineDash([]);
      // obstacles
      for (const o of obs) {
        if (o.bug) {
          const wing = Math.sin(o.flap) * 5;
          ctx.fillStyle = "#fb7185";
          ctx.beginPath(); ctx.ellipse(o.x + 17, o.y + 12, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(251,113,133,.45)";
          ctx.beginPath(); ctx.ellipse(o.x + 11, o.y + 4 - wing, 8, 4, -0.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(o.x + 23, o.y + 4 - wing, 8, 4, 0.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#061626"; ctx.fillRect(o.x + 9, o.y + 10, 3, 3); ctx.fillRect(o.x + 15, o.y + 9, 3, 3);
        } else {
          rr(o.x, o.y, o.w, o.h, 6);
          ctx.fillStyle = "#1b1530"; ctx.fill();
          ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = "#fbbf24"; ctx.font = "600 12px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "center";
          ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 4); ctx.textAlign = "start";
        }
      }
      // Tally (a soft shadow, then the sprite; little bob while running)
      const bob = mode === "running" && onGround && !reduce ? Math.sin(t / 3) * 1.5 : 0;
      const shadowW = onGround ? 34 : Math.max(16, 34 - (GROUND - TH - y) / 4);
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(62 + TW / 2, GROUND + 3, shadowW / 2, 4, 0, 0, Math.PI * 2); ctx.fill();
      const sprite = mode === "over" ? pose.sad : !onGround || cheer > 0 ? pose.happy : pose.neutral;
      if (sprite.complete && sprite.naturalWidth) ctx.drawImage(sprite, 62, y + bob, TW, TH);
      else { ctx.fillStyle = "#5eead4"; rr(62, y, TW, TH, 12); ctx.fill(); }
      // HUD
      ctx.font = "500 12px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "right";
      ctx.fillStyle = "rgba(143,176,204,.9)"; ctx.fillText(`best ${String(bestScore).padStart(5, "0")}`, W - 16, 24);
      ctx.fillStyle = "#5eead4"; ctx.fillText(`rows ${String(Math.floor(dist / 10)).padStart(5, "0")}`, W - 16, 42);
      ctx.textAlign = "start";
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const k = last ? Math.min(2.2, (now - last) / 16.67) : 1; // steady speed on 60 Hz and 120 Hz screens
      last = now; t += k;
      for (const b of bits) { b.x -= b.v * (mode === "running" ? speed / 6 : 0.4) * k; if (b.x < -10) { b.x = W + 10; b.y = 18 + Math.random() * 120; } }
      if (mode === "running") {
        dist += speed * k; speed = Math.min(15, 6 + dist / 2600);
        vy += 0.68 * k; y += vy * k;
        if (y >= GROUND - TH) { y = GROUND - TH; vy = 0; onGround = true; }
        nextGap -= speed * k; if (nextGap <= 0) spawn();
        for (const o of obs) { o.x -= speed * k * (o.bug ? 1.12 : 1); o.flap += 0.45 * k; }
        obs = obs.filter((o) => o.x + o.w > -20);
        if (cheer > 0) cheer -= k;
        const s = Math.floor(dist / 10);
        if (s && s % 500 === 0 && cheer <= 0) cheer = 40;
        // forgiving hit box: Tally's body, not the transparent edges of the picture
        const hx = 62 + 10, hy = y + 8, hw = TW - 20, hh = TH - 12;
        if (obs.some((o) => hx < o.x + o.w - 3 && hx + hw > o.x + 3 && hy < o.y + o.h - 2 && hy + hh > o.y + 3)) {
          mode = "over"; setState("over");
          const final = Math.floor(dist / 10);
          if (final > bestScore) { bestScore = final; setBest(final); try { localStorage.setItem("tally-runner-best", String(final)); } catch {} }
        }
        const sc = Math.floor(dist / 10);
        if (sc !== shown) { shown = sc; setScore(sc); }
      }
      draw();
    };
    raf = requestAnimationFrame(step);

    const key = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "A" || tag === "BUTTON" || tag === "INPUT") return;
        e.preventDefault(); jump();
      }
    };
    addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); removeEventListener("keydown", key); };
  }, []);

  return (
    <div className="tr">
      <div className="tr-stage" onPointerDown={(e) => { e.preventDefault(); api.current.jump(); }}>
        <canvas ref={canvas} className="tr-canvas" role="img" aria-label="Tally Runner: help Tally the robot jump over broken records. Press Space, the up arrow, or tap to jump." />
        {state !== "running" && (
          <div className="tr-overlay" aria-live="polite">
            {state === "ready" ? (
              <>
                <b>Tally Runner</b>
                <span>Help Tally jump over the broken records</span>
                <kbd>Space</kbd><em>or tap to start</em>
              </>
            ) : (
              <>
                <b>Query failed 💥</b>
                <span>{score.toLocaleString()} rows processed{score >= best && score > 0 ? " · new best! 🎉" : ""}</span>
                <kbd>Space</kbd><em>or tap to retry</em>
              </>
            )}
          </div>
        )}
      </div>
      <p className="tr-help">Jump: <kbd>Space</kbd> <kbd>↑</kbd> or tap · Best: {best.toLocaleString()} rows</p>
    </div>
  );
}
