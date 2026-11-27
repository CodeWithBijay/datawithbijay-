"use client";
// "Tally Runner": the little game on the 404 page.
// Tally runs through a little forest and jumps over trees and flying birds.
// Space / ↑ / click / tap to jump. Score = rows processed; the best score stays in this browser only.
import { useEffect, useRef, useState } from "react";

const W = 760, H = 240, GROUND = 196;            // game size in "game units" (drawn sharp at any screen size)
const TW = 54, TH = 60, TX = 62;                 // Tally's size and x position
const STEP = 1000 / 120;                          // physics runs at a fixed 120 steps a second, drawing is smoothed between steps

type Kind = "pine" | "round" | "bush" | "bird";
type Ob = { kind: Kind; x: number; px: number; y: number; w: number; h: number; flap: number; hit: [number, number, number, number] };

export default function TallyRunner() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"ready" | "running" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const api = useRef<{ jump: () => void }>({ jump: () => {} });

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d", { alpha: true })!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Draw at the real on-screen size × screen density, so nothing is stretched or blurry.
    let scale = 1, dpr = 1;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      const cssW = c.clientWidth || W;
      scale = (cssW / W) * dpr;
      c.width = Math.round(W * scale); c.height = Math.round(H * scale);
      sprites = buildSprites();
    };
    const ro = new ResizeObserver(fit);

    const img = (n: string) => { const i = new Image(); i.decoding = "async"; i.src = `/tally/${n}.webp`; return i; };
    const pose = { happy: img("happy"), neutral: img("neutral"), sad: img("sad") };

    // ---------- trees: drawn once into small off-screen pictures, then just copied each frame ----------
    const SIZES: Record<Exclude<Kind, "bird">, [number, number][]> = {
      pine: [[34, 52], [40, 64], [30, 44]],
      round: [[40, 50], [46, 58]],
      bush: [[46, 28], [60, 32]],
    };
    type Sprite = { img: HTMLCanvasElement; w: number; h: number };
    let sprites: Record<string, Sprite> = {};

    const paintTree = (g: CanvasRenderingContext2D, kind: Exclude<Kind, "bird">, w: number, h: number) => {
      const trunk = "#7c5a3e", trunkDark = "#5b412c";
      if (kind === "pine") {
        const tw = Math.max(6, w * 0.18);
        g.fillStyle = trunkDark; g.fillRect(w / 2 - tw / 2, h - 12, tw, 12);
        g.fillStyle = trunk; g.fillRect(w / 2 - tw / 2, h - 12, tw * 0.55, 12);
        const layers = 3;
        for (let i = 0; i < layers; i++) {
          const top = (h - 10) * (i / layers) * 0.78;
          const bot = top + (h - 10) * 0.48;
          const half = (w / 2) * (0.55 + 0.45 * ((i + 1) / layers));
          const grd = g.createLinearGradient(0, top, 0, bot);
          grd.addColorStop(0, "#34d399"); grd.addColorStop(1, "#0f766e");
          g.fillStyle = grd;
          g.beginPath(); g.moveTo(w / 2, top); g.lineTo(w / 2 + half, bot); g.quadraticCurveTo(w / 2, bot + 4, w / 2 - half, bot); g.closePath(); g.fill();
          g.fillStyle = "rgba(255,255,255,.14)";
          g.beginPath(); g.moveTo(w / 2, top + 2); g.lineTo(w / 2 - half * 0.7, bot - 2); g.lineTo(w / 2 - half * 0.2, bot - 3); g.closePath(); g.fill();
        }
      } else if (kind === "round") {
        const tw = Math.max(7, w * 0.17);
        g.fillStyle = trunkDark; g.fillRect(w / 2 - tw / 2, h * 0.5, tw, h * 0.5);
        g.fillStyle = trunk; g.fillRect(w / 2 - tw / 2, h * 0.5, tw * 0.55, h * 0.5);
        const r = w * 0.36;
        const blobs: [number, number, number][] = [[w / 2, r + 1, r], [w / 2 - r * 0.62, r * 1.55, r * 0.72], [w / 2 + r * 0.62, r * 1.5, r * 0.76]];
        for (const [x, y, rr] of blobs) {
          const grd = g.createRadialGradient(x - rr * 0.35, y - rr * 0.4, rr * 0.1, x, y, rr);
          grd.addColorStop(0, "#6ee7b7"); grd.addColorStop(0.55, "#14b8a6"); grd.addColorStop(1, "#0f5f59");
          g.fillStyle = grd; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
        }
      } else {
        const n = w > 50 ? 4 : 3;
        for (let i = 0; i < n; i++) {
          const rr = h * (0.5 + ((i * 37) % 10) / 40);
          const x = rr + (i * (w - rr * 2)) / (n - 1);
          const y = h - rr * 0.85;
          const grd = g.createRadialGradient(x - rr * 0.3, y - rr * 0.4, 1, x, y, rr);
          grd.addColorStop(0, "#5eead4"); grd.addColorStop(1, "#0f766e");
          g.fillStyle = grd; g.beginPath(); g.arc(x, y, rr, Math.PI, 0); g.lineTo(x + rr, h); g.lineTo(x - rr, h); g.closePath(); g.fill();
        }
      }
    };

    const buildSprites = () => {
      const out: Record<string, Sprite> = {};
      for (const kind of Object.keys(SIZES) as Exclude<Kind, "bird">[]) {
        SIZES[kind].forEach(([w, h], i) => {
          const cv = document.createElement("canvas");
          cv.width = Math.ceil(w * scale); cv.height = Math.ceil(h * scale);
          const g = cv.getContext("2d")!; g.scale(scale, scale);
          paintTree(g, kind, w, h);
          out[`${kind}${i}`] = { img: cv, w, h };
        });
      }
      return out;
    };

    // ---------- distant hills + clouds for depth ----------
    const hills = Array.from({ length: 7 }, (_, i) => ({ x: i * 150 + Math.random() * 60, r: 70 + Math.random() * 60 }));
    const clouds = Array.from({ length: 5 }, () => ({ x: Math.random() * W, y: 26 + Math.random() * 70, s: 0.7 + Math.random() * 0.6 }));
    const grass = Array.from({ length: 40 }, (_, i) => ({ x: i * 19 + Math.random() * 10, h: 3 + Math.random() * 4 }));

    let bestScore = 0;
    try { bestScore = Number(localStorage.getItem("tally-runner-best")) || 0; } catch {}
    setBest(bestScore);

    let mode: "ready" | "running" | "over" = "ready";
    let y = GROUND - TH, py = y, vy = 0, onGround = true, holding = false;
    let speed = 3, dist = 0, pdist = 0, t = 0, nextGap = 300, obs: Ob[] = [];
    let raf = 0, last = 0, acc = 0, cheer = 0, squash = 0;
    // face: where the eyes look (smoothed), blinking, and how close the next tree or bird is
    let lookX = 0.6, lookY = 0, blink = 0, nextBlink = 300, alarm = 0, dizzy = 0;

    const reset = () => { y = py = GROUND - TH; vy = 0; onGround = true; speed = 3; dist = pdist = 0; nextGap = 320; obs = []; cheer = 0; dizzy = 0; };
    const jump = () => {
      if (mode === "ready" || mode === "over") { reset(); mode = "running"; setState("running"); return; }
      if (onGround) { vy = -7.2; onGround = false; holding = true; }
    };
    const release = () => { holding = false; };
    api.current.jump = jump;

    const spawn = () => {
      const bird = dist > 1500 && Math.random() < 0.3;
      if (bird) {
        const high = Math.random() < 0.5;
        const by = high ? GROUND - 104 : GROUND - 70;
        obs.push({ kind: "bird", x: W + 30, px: W + 30, y: by, w: 40, h: 26, flap: Math.random() * 6, hit: [6, 6, 30, 14] });
      } else {
        const r = Math.random();
        const kind: Exclude<Kind, "bird"> = r < 0.45 ? "pine" : r < 0.75 ? "round" : "bush";
        const i = (Math.random() * SIZES[kind].length) | 0;
        const [w, h] = SIZES[kind][i];
        const hit: [number, number, number, number] = kind === "bush" ? [5, 6, w - 10, h - 6] : [w * 0.2, 6, w * 0.6, h - 6];
        obs.push({ kind, x: W + 30, px: W + 30, y: GROUND - h, w, h, flap: i, hit });
        if (dist > 900 && kind !== "bush" && Math.random() < 0.28) {
          const [w2, h2] = SIZES.pine[2];
          obs.push({ kind: "pine", x: W + 34 + w, px: W + 34 + w, y: GROUND - h2, w: w2, h: h2, flap: 2, hit: [w2 * 0.2, 6, w2 * 0.6, h2 - 6] });
        }
      }
      nextGap = 260 + Math.random() * 280 + speed * 16;
    };

    // one fixed physics step (units are per 1/120 s)
    const tick = () => {
      t++;
      for (const cl of clouds) { cl.x -= (mode === "running" ? speed * 0.06 : 0.12); if (cl.x < -80) { cl.x = W + 40; cl.y = 26 + Math.random() * 70; } }
      // --- face: blink now and then, eyes follow the next obstacle ---
      if (--nextBlink <= 0) { blink = 14; nextBlink = 260 + Math.random() * 420; }
      if (blink > 0) blink--;
      if (mode === "over") dizzy += 0.06;
      let tx = 0.6, tyy = 0, near = 0;
      if (mode === "ready") { tx = Math.sin(t / 140) * 0.9; tyy = Math.sin(t / 97) * 0.3; }
      if (mode === "running") {
        const front = obs.filter((o) => o.x + o.w > TX + 10).sort((a, b) => a.x - b.x)[0];
        if (front) {
          const gap = front.x - (TX + TW);
          near = Math.max(0, Math.min(1, 1 - gap / 170));
          tx = 0.4 + near * 0.6;
          tyy = front.kind === "bird" ? (front.y + 12 < y + 20 ? -0.8 : -0.1) : 0.5 * near;
        }
      }
      lookX += (tx - lookX) * 0.12; lookY += (tyy - lookY) * 0.12; alarm += (near - alarm) * 0.15;
      if (mode !== "running") return;
      pdist = dist; py = y;
      for (const o of obs) o.px = o.x;
      dist += speed; speed = Math.min(7.5, 3 + dist / 5200);
      vy += holding && vy < 0 ? 0.2 : 0.34;      // hold to jump a bit higher
      y += vy;
      if (y >= GROUND - TH) { if (!onGround) squash = 1; y = GROUND - TH; vy = 0; onGround = true; }
      nextGap -= speed; if (nextGap <= 0) spawn();
      for (const o of obs) { o.x -= speed * (o.kind === "bird" ? 1.15 : 1); o.flap += o.kind === "bird" ? 0.16 : 0; }
      obs = obs.filter((o) => o.x + o.w > -30);
      if (cheer > 0) cheer--;
      if (squash > 0) squash = Math.max(0, squash - 0.08);
      const s = Math.floor(dist / 10);
      if (s && s % 500 === 0 && cheer <= 0) cheer = 80;
      // forgiving hit box: Tally's body, not the see-through edges of the picture
      const hx = TX + 11, hy = y + 9, hw = TW - 22, hh = TH - 13;
      for (const o of obs) {
        const ox = o.x + o.hit[0], oy = o.y + o.hit[1];
        if (hx < ox + o.hit[2] && hx + hw > ox && hy < oy + o.hit[3] && hy + hh > oy) {
          mode = "over"; setState("over");
          const final = Math.floor(dist / 10);
          setScore(final);
          if (final > bestScore) { bestScore = final; setBest(final); try { localStorage.setItem("tally-runner-best", String(final)); } catch {} }
          pdist = dist; py = y; for (const q of obs) q.px = q.x;
          break;
        }
      }
    };

    const drawBird = (x: number, yy: number, flap: number) => {
      const wing = Math.sin(flap);                       // -1 … 1
      ctx.save(); ctx.translate(x, yy);
      // back wing
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath(); ctx.moveTo(18, 12); ctx.quadraticCurveTo(24, 12 - wing * 14, 30, 10 - wing * 12); ctx.quadraticCurveTo(26, 14, 22, 15); ctx.closePath(); ctx.fill();
      // body
      const grd = ctx.createLinearGradient(0, 6, 0, 22);
      grd.addColorStop(0, "#e2e8f0"); grd.addColorStop(1, "#94a3b8");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.ellipse(20, 15, 14, 7.5, -0.08, 0, Math.PI * 2); ctx.fill();
      // tail
      ctx.beginPath(); ctx.moveTo(32, 13); ctx.lineTo(40, 9); ctx.lineTo(39, 17); ctx.closePath(); ctx.fill();
      // head + beak + eye
      ctx.beginPath(); ctx.arc(8, 11, 6.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.moveTo(2, 10); ctx.lineTo(-5, 12.5); ctx.lineTo(2, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#0b1e33"; ctx.beginPath(); ctx.arc(6.5, 9.5, 1.6, 0, Math.PI * 2); ctx.fill();
      // front wing
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath(); ctx.moveTo(14, 13); ctx.quadraticCurveTo(20, 13 - wing * 16, 27, 11 - wing * 15); ctx.quadraticCurveTo(24, 16, 18, 17); ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    // Tally's face, drawn on the dark visor of the picture (same style as the Tally on the rest of the site)
    const EYE = "#e8fffb", PUPIL = "#0b2238", MINT = "#5eead4";
    const drawFace = (x: number, yy: number, sx: number, sy: number) => {
      ctx.save();
      ctx.translate(x + 25.3 * sx, yy + 18.6 * sy); ctx.scale(sx, sy);
      const ex = 6.4, ey = -1.6;
      const air = !onGround && mode === "running";
      const happy = (air && alarm < 0.5) || cheer > 0;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (mode === "over") {
        // dizzy: spiral-ish X eyes, wobbly frown, a tear
        ctx.strokeStyle = EYE; ctx.lineWidth = 1.6;
        for (const s of [-1, 1]) {
          ctx.save(); ctx.translate(s * ex, ey); ctx.rotate(dizzy * s);
          ctx.beginPath(); ctx.moveTo(-2.8, -2.8); ctx.lineTo(2.8, 2.8); ctx.moveTo(2.8, -2.8); ctx.lineTo(-2.8, 2.8); ctx.stroke();
          ctx.restore();
        }
        ctx.strokeStyle = MINT; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-3.5, 8); ctx.quadraticCurveTo(-1.5, 5.6, 0, 7); ctx.quadraticCurveTo(1.5, 8.4, 3.5, 6.2); ctx.stroke();
        ctx.fillStyle = "#7dd3fc"; ctx.beginPath(); ctx.ellipse(ex + 1, ey + 6 + (dizzy * 3) % 4, 1, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      } else if (happy) {
        // ^ ^ happy eyes, big smile, blush
        ctx.strokeStyle = EYE; ctx.lineWidth = 1.9;
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * ex - 3.4, ey + 1.2); ctx.quadraticCurveTo(s * ex, ey - 3.6, s * ex + 3.4, ey + 1.2); ctx.stroke(); }
        ctx.fillStyle = MINT; ctx.beginPath(); ctx.moveTo(-3.6, 5.2); ctx.quadraticCurveTo(0, 10.5, 3.6, 5.2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(251,113,133,.45)";
        ctx.beginPath(); ctx.ellipse(-ex - 2.6, ey + 4.2, 2.2, 1.2, 0, 0, Math.PI * 2); ctx.ellipse(ex + 2.6, ey + 4.2, 2.2, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        // open eyes that track the next tree or bird; they widen as it gets close
        const wide = 1 + alarm * 0.22;
        const open = blink > 0 ? Math.max(0.1, Math.abs(blink - 7) / 7) : 1;
        for (const s of [-1, 1]) {
          ctx.save(); ctx.translate(s * ex, ey); ctx.scale(wide, wide * open);
          ctx.fillStyle = EYE; ctx.beginPath(); ctx.ellipse(0, 0, 3.7, 4.2, 0, 0, Math.PI * 2); ctx.fill();
          const pr = 2.6 - alarm * 0.7;                // pupils shrink a little when scared
          const px = lookX * 1.1, pyy = lookY * 1.2;
          ctx.fillStyle = PUPIL; ctx.beginPath(); ctx.ellipse(px, pyy, pr, pr * 1.15, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px - 0.9, pyy - 1.3, 0.95, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        if (alarm > 0.45) {
          // worried brows + small "o" mouth
          ctx.strokeStyle = EYE; ctx.lineWidth = 1.1;
          for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * ex - s * 3, ey - 6.4); ctx.lineTo(s * ex + s * 2.6, ey - 5.2 - alarm); ctx.stroke(); }
          ctx.fillStyle = MINT; ctx.beginPath(); ctx.ellipse(0, 7, 1.5, 1.2 + alarm * 1.1, 0, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.strokeStyle = MINT; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(-2.4, 6.4); ctx.quadraticCurveTo(0, 8.2, 2.4, 6.4); ctx.stroke();
        }
      }
      ctx.restore();
    };

    const draw = (a: number) => {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, W, H);
      const d = pdist + (dist - pdist) * a;           // smoothed between physics steps

      // clouds
      for (const cl of clouds) {
        ctx.fillStyle = "rgba(186,230,253,.07)";
        ctx.beginPath();
        ctx.ellipse(cl.x, cl.y, 26 * cl.s, 9 * cl.s, 0, 0, Math.PI * 2);
        ctx.ellipse(cl.x + 16 * cl.s, cl.y - 6 * cl.s, 16 * cl.s, 9 * cl.s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // far hills (slow)
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, GROUND); ctx.clip();
      ctx.fillStyle = "rgba(20,184,166,.05)";
      const span = 7 * 150;
      for (const hl of hills) {
        let hx = (hl.x - d * 0.15) % span; if (hx < -hl.r) hx += span;
        ctx.beginPath(); ctx.arc(hx, GROUND + 20, hl.r, Math.PI, 0); ctx.fill();
      }
      ctx.restore();
      // ground
      const gg = ctx.createLinearGradient(0, GROUND, 0, H);
      gg.addColorStop(0, "rgba(20,184,166,.18)"); gg.addColorStop(1, "rgba(20,184,166,0)");
      ctx.fillStyle = gg; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = "rgba(94,234,212,.55)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 0.75); ctx.lineTo(W, GROUND + 0.75); ctx.stroke();
      // grass tufts + pebbles scrolling with the ground
      const gspan = 40 * 19;
      ctx.strokeStyle = "rgba(94,234,212,.22)"; ctx.lineWidth = 1.1; ctx.lineCap = "round";
      for (const gr of grass) {
        let gx = (gr.x - d) % gspan; if (gx < 0) gx += gspan;
        ctx.beginPath(); ctx.moveTo(gx, GROUND + 9); ctx.lineTo(gx - 2, GROUND + 9 - gr.h); ctx.moveTo(gx, GROUND + 9); ctx.lineTo(gx + 2, GROUND + 9 - gr.h * 0.8); ctx.stroke();
        ctx.fillStyle = "rgba(125,211,252,.18)"; ctx.beginPath(); ctx.arc((gx + 9) % gspan, GROUND + 22, 1.4, 0, Math.PI * 2); ctx.fill();
      }

      // obstacles
      for (const o of obs) {
        const ox = o.px + (o.x - o.px) * a;
        if (o.kind === "bird") {
          ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(ox + 20, GROUND + 3, 12, 2.5, 0, 0, Math.PI * 2); ctx.fill();
          drawBird(ox, o.y + Math.sin(o.flap * 0.5) * 2, reduce ? 0.6 : o.flap);
        } else {
          const sp = sprites[`${o.kind}${o.flap}`];
          ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(ox + o.w / 2, GROUND + 2, o.w * 0.42, 3, 0, 0, Math.PI * 2); ctx.fill();
          if (sp) ctx.drawImage(sp.img, ox, o.y, sp.w, sp.h);
        }
      }

      // Tally: soft shadow, a little bob while running, a squash on landing
      const ty = py + (y - py) * a;
      const air = GROUND - TH - ty;
      const bob = mode === "running" && onGround && !reduce ? Math.sin(t / 7) * 1.4 : 0;
      const sw = Math.max(14, 34 - air / 3);
      ctx.fillStyle = `rgba(0,0,0,${Math.max(0.12, 0.35 - air / 300)})`;
      ctx.beginPath(); ctx.ellipse(TX + TW / 2, GROUND + 3, sw / 2, 4, 0, 0, Math.PI * 2); ctx.fill();
      const sprite = mode === "over" ? pose.sad : cheer > 0 ? pose.happy : pose.neutral;
      const sq = reduce ? 0 : squash * 0.08;
      const dw = TW * (1 + sq), dh = TH * (1 - sq);
      if (sprite.complete && sprite.naturalWidth) ctx.drawImage(sprite, TX - (dw - TW) / 2, ty + bob + (TH - dh), dw, dh);
      else { ctx.fillStyle = "#5eead4"; ctx.beginPath(); ctx.roundRect(TX, ty, TW, TH, 12); ctx.fill(); }
      drawFace(TX - (dw - TW) / 2, ty + bob + (TH - dh), dw / TW, dh / TH);

      // score
      ctx.font = "500 12px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "right";
      ctx.fillStyle = "rgba(143,176,204,.9)"; ctx.fillText(`best ${String(bestScore).padStart(5, "0")}`, W - 16, 24);
      ctx.fillStyle = "#5eead4"; ctx.fillText(`rows ${String(Math.floor(d / 10)).padStart(5, "0")}`, W - 16, 42);
      ctx.textAlign = "start";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      acc += Math.min(100, now - last); last = now;  // after a tab switch, don't jump ahead
      while (acc >= STEP) { tick(); acc -= STEP; }
      draw(acc / STEP);
    };

    fit(); ro.observe(c);
    raf = requestAnimationFrame(frame);
    const onVis = () => { last = 0; acc = 0; };
    document.addEventListener("visibilitychange", onVis);

    const isJumpKey = (e: KeyboardEvent) => e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW";
    const keydown = (e: KeyboardEvent) => {
      if (!isJumpKey(e)) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault(); if (!e.repeat) jump();
    };
    const keyup = (e: KeyboardEvent) => { if (isJumpKey(e)) release(); };
    addEventListener("keydown", keydown); addEventListener("keyup", keyup); addEventListener("pointerup", release);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("keydown", keydown); removeEventListener("keyup", keyup); removeEventListener("pointerup", release);
    };
  }, []);

  return (
    <div className="tr">
      <div className="tr-stage" onPointerDown={(e) => { e.preventDefault(); api.current.jump(); }}>
        <canvas ref={canvas} className="tr-canvas" role="img" aria-label="Tally Runner: help Tally the robot jump over trees and birds. Press Space, the up arrow, or tap to jump." />
        {state !== "running" && (
          <div className="tr-overlay" aria-live="polite">
            {state === "ready" ? (
              <>
                <b>Tally Runner</b>
                <span>Help Tally jump over the trees and dodge the birds</span>
                <kbd>Space</kbd><em>or tap to start · hold to jump higher</em>
              </>
            ) : (
              <>
                <b>Oops, Tally tripped! 🌳</b>
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
