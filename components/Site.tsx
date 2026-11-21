"use client";
// Renders the Blueprint page and starts its behaviour once in the browser.
// `open` lets a real URL (e.g. /blog/llm-layers) open a post or case study on load.
import { useEffect } from "react";
import markup from "./markup";
import init from "@/lib/site";

let started = false;

export default function Site({ open }: { open?: string }) {
  useEffect(() => {
    if (started) return; // React dev mode runs effects twice; start only once
    started = true;
    if (open && !location.hash) history.replaceState(null, "", open);
    init();
  }, [open]);
  return <div id="site" dangerouslySetInnerHTML={{ __html: markup }} />;
}
