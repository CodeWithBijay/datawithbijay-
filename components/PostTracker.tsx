"use client";
// Counts a visit to a blog post page for /stats (no cookies; same rules as the rest of the site).
import { useEffect } from "react";

export default function PostTracker() {
  useEffect(() => {
    try {
      if (/[?&]nostats/.test(location.search)) localStorage.setItem("nostats", "1");
      if (localStorage.getItem("nostats")) return;
      const body = JSON.stringify({ path: location.pathname, ref: document.referrer });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body, keepalive: true });
    } catch {}
  }, []);
  return null;
}
