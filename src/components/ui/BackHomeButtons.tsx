"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  variant?: "floating" | "inline";
}

export default function BackHomeButtons({ variant = "floating" }: Props) {
  const router = useRouter();

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.35rem 0.75rem",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 2,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.15s, border-color 0.15s",
    whiteSpace: "nowrap",
  };

  const darkBtn: React.CSSProperties = {
    ...btnBase,
    background: "rgba(7,7,16,0.85)",
    color: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(8px)",
  };

  const inlineBtn: React.CSSProperties = {
    ...btnBase,
    background: "rgba(201,168,76,0.05)",
    color: "var(--text-4)",
  };

  const style = variant === "floating" ? darkBtn : inlineBtn;

  if (variant === "floating") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "44px",
          left: "1.25rem",
          zIndex: 998,
          display: "flex",
          gap: "0.4rem",
        }}
      >
        <button onClick={() => router.back()} style={style} className="nav-util-btn">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <Link href="/" style={style} className="nav-util-btn">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </Link>
        <style>{`
          .nav-util-btn:hover { background: rgba(201,168,76,0.12) !important; border-color: rgba(201,168,76,0.4) !important; color: #c9a84c !important; }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <button onClick={() => router.back()} style={style} className="nav-util-btn">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>
      <Link href="/" style={style} className="nav-util-btn">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Home
      </Link>
      <style>{`
        .nav-util-btn:hover { background: rgba(201,168,76,0.1) !important; border-color: rgba(201,168,76,0.35) !important; color: #c9a84c !important; }
      `}</style>
    </div>
  );
}
