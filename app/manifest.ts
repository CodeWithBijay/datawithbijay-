import type { MetadataRoute } from "next";

// Web app manifest (served at /manifest.webmanifest): names the site and lists its icons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bijay Paudel · Data Analyst & Analytics Engineer",
    short_name: "Bijay Paudel",
    start_url: "/",
    display: "browser",
    background_color: "#071a2c",
    theme_color: "#071a2c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
