/** @type {import('next').NextConfig} */

// Security headers (fixes: cross-site scripting defence, click-jacking defence, MIME sniffing).
// The Content-Security-Policy lists every outside service the site really uses:
// Google Fonts, the GitHub API and Pageclip (contact form).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://api.github.com https://send.pageclip.co",
  "form-action 'self' https://send.pageclip.co",
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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;
