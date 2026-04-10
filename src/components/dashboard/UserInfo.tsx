"use client";
import { signOut } from "next-auth/react";

export default function UserInfo({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <>
      <span className="text-white/25 text-xs hidden sm:block">{user.email}</span>
      <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
        <span className="text-[#c9a84c] text-[11px] font-semibold uppercase">
          {user.name?.charAt(0) ?? "U"}
        </span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        title="Sign out"
        style={{
          display: "flex", alignItems: "center", gap: "0.35rem",
          padding: "0.3rem 0.65rem",
          fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 3,
          cursor: "pointer",
          transition: "color 0.2s, border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.2)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.05)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </>
  );
}
