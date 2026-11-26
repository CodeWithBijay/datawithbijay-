"use client";
import { useEffect } from "react";

// Count the numbers in the /stats KPI tiles up from 0 (skipped for reduced-motion users).
export default function CountUpKpis() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll<HTMLElement>(".st-kpis b").forEach((b) => {
      const m = b.textContent?.match(/^([\d,.]+)(.*)$/);
      if (!m) return;
      const target = parseFloat(m[1].replace(/,/g, "")), suffix = m[2], dec = (m[1].split(".")[1] || "").length;
      const t0 = performance.now();
      const f = (t: number) => {
        const k = Math.min(1, (t - t0) / 1200), v = target * (1 - Math.pow(1 - k, 3));
        b.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suffix;
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    });
  }, []);
  return null;
}
