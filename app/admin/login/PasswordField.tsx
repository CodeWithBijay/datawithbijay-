"use client";
import { useState } from "react";

// Password box with a show/hide eye.
export default function PasswordField() {
  const [show, setShow] = useState(false);
  return (
    <div className="adm-pw">
      <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required maxLength={200} placeholder="••••••••••••" />
      <button type="button" className="adm-eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
        {show ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.6 9.6 0 0112 5c5 0 9 4.5 10 7-.4 1-1.2 2.3-2.4 3.5M6.2 6.3C4 7.7 2.6 9.8 2 12c1 2.5 5 7 10 7 1.6 0 3.1-.4 4.4-1.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        )}
      </button>
    </div>
  );
}
