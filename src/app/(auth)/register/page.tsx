import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: "Access Restricted" };

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--surface-page)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: "2rem", textDecoration: "none" }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            fontWeight: 300,
            color: "#d4a843",
          }}>
            Purtivon
          </span>
        </Link>

        <div style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-dim)",
          borderRadius: 4,
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}>
          <div style={{
            width: 48, height: 48,
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#c9a84c" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>

          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem", fontWeight: 300,
              color: "var(--text-hi)", marginBottom: "0.4rem",
            }}>
              Access by Invitation
            </h1>
            <p style={{ fontSize: "0.72rem", color: "var(--text-lo)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
              Purtivon accounts are created by administrators only. Contact your administrator to request access.
            </p>
          </div>
        </div>

        <p style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "var(--text-4)" }}>
          Already have an account?{" "}
          <Link href="/admin/login" style={{ color: "#c9a84c", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
