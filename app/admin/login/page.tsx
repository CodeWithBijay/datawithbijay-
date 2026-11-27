import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySession } from "@/lib/adminSession";
import PasswordField from "./PasswordField";

// Login page for the content editor. Sends the form to /api/admin/login.
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  wrong: "That ID or password isn't right. Please try again.",
  locked: "Too many tries. For safety, login is paused for 15 minutes.",
  setup: "Admin login isn't set up yet. Add the three ADMIN_ values in Vercel (see KEYSTATIC.md).",
};

export default async function AdminLogin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const next = q.next && /^\/keystatic(\/|$|\?)/.test(q.next) ? q.next : "/keystatic";
  if (await verifySession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect(next);
  const error = q.error ? MESSAGES[q.error] : null;

  return (
    <main className="adm-wrap">
      <div className="adm-glow" aria-hidden="true" />
      <section className="adm-card" aria-labelledby="adm-title">
        <div className="adm-bot" aria-hidden="true">
          <img src="/tally/happy.webp" alt="" width={84} height={93} />
        </div>
        <p className="adm-kicker">portfolio_db › admin</p>
        <h1 id="adm-title">Welcome back, Bijay</h1>
        <p className="adm-sub">Log in to edit projects, blog posts and your journey.</p>

        {q.bye && !error && <p className="adm-note ok" role="status">You&apos;re logged out. See you soon 👋</p>}
        {error && <p className="adm-note err" role="alert">{error}</p>}

        <form method="post" action="/api/admin/login" className="adm-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="username">Admin ID</label>
          <input id="username" name="username" type="text" autoComplete="username" required maxLength={100} autoFocus placeholder="your admin ID" />
          <label htmlFor="password">Password</label>
          <PasswordField />
          <button type="submit" className="adm-btn">Log in <span aria-hidden="true">→</span></button>
        </form>

        <p className="adm-foot">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          Private area · locks after 5 wrong tries
        </p>
      </section>
      <a className="adm-home" href="/">← Back to bijay-paudel.com.np</a>
    </main>
  );
}
