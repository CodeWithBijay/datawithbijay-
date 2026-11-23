"use client";
// Renders the Blueprint page and starts its behaviour once in the browser.
// lib/site.js reads the address (/work, /blog/llm-layers, /resume …) to decide what to show.
import { useEffect } from "react";
import markup from "./markup";
import init from "@/lib/site";

let started = false;

export default function Site() {
  useEffect(() => {
    if (started) return; // React dev mode runs effects twice; start only once
    started = true;
    init();
  }, []);
  return <div id="site" dangerouslySetInnerHTML={{ __html: markup }} />;
}
