// Admin login for the content editor (/keystatic).
// A signed cookie proves you logged in with your ID and password. It is signed (HMAC-SHA256) with
// ADMIN_SESSION_SECRET, so it can't be faked or edited. Works in both the middleware (edge) and API routes.
//
// Vercel settings (made with: node scripts/admin-password.mjs):
//   ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET

export const ADMIN_COOKIE = "bp_admin";
export const SESSION_DAYS = 7;

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (s: string) => {
  const t = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(t, (c) => c.charCodeAt(0));
};

export function adminConfigured() {
  return !!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(process.env.ADMIN_SESSION_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Makes the cookie value for a fresh login. */
export async function createSession(username: string) {
  const payload = b64url(enc.encode(JSON.stringify({ u: username, exp: Date.now() + SESSION_DAYS * 86400_000 })));
  return `${payload}.${b64url(await hmac(payload))}`;
}

/** True when the cookie is genuine and not expired. */
export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token || !adminConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const expected = await hmac(payload);
    const given = fromB64url(sig);
    if (given.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < given.length; i++) diff |= given[i] ^ expected[i]; // constant-time compare
    if (diff !== 0) return false;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    return data.u === process.env.ADMIN_USERNAME && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
