"use client";
import { useEffect } from "react";

/** Starts all the browser-side behaviour (canvas animations, Pixel, nav, form…) after the page mounts. */
export default function Effects() {
  useEffect(() => {
    import("@/lib/effects").then((m) => m.default());
  }, []);
  return null;
}
