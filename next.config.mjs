/** @type {import('next').NextConfig} */

// Security headers (fixes: cross-site scripting defence, click-jacking defence, MIME sniffing).
// The Content-Security-Policy lists every outside service the browser talks to: Google Fonts and the GitHub API.
// (Email, Gemini and the database are only reached from the server, so the browser never needs them.)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://api.github.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Not for AI training: "noai" tags plus the W3C text-and-data-mining reservation
  { key: "X-Robots-Tag", value: "noai, noimageai" },
  { key: "tdm-reservation", value: "1" },
];

// The content editor at /keystatic needs a little more: it reads and saves through the GitHub API
// and shows GitHub profile pictures. Everything else stays locked down. It is also kept out of search engines.
const editorCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  "connect-src 'self' https://api.github.com",
  "form-action 'self' https://github.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");
const editorHeaders = [
  ...securityHeaders.filter((h) => h.key !== "Content-Security-Policy" && h.key !== "X-Robots-Tag"),
  { key: "Content-Security-Policy", value: editorCsp },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // the section was renamed from Blog to Writing; old links keep working
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug", destination: "/writing/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      // the whole site, except the content editor
      { source: "/:path((?!keystatic|api/keystatic).*)", headers: securityHeaders },
      // the content editor (/keystatic): same protections, but it may talk to GitHub and show GitHub avatars
      { source: "/keystatic/:path*", headers: editorHeaders },
      { source: "/keystatic", headers: editorHeaders },
      { source: "/api/keystatic/:path*", headers: editorHeaders },
    ];
  },
};
export default nextConfig;
