"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard":              "Overview",
  "/dashboard/submissions":  "Submissions",
  "/dashboard/reports":      "Reports",
  "/dashboard/billing":      "Billing",
  "/dashboard/settings":     "Settings",
  "/dashboard/articles":     "Articles",
  "/dashboard/categories":   "Categories",
  "/dashboard/awards":       "Awards",
  "/dashboard/winners":      "Winners",
  "/dashboard/podcasts":     "Podcasts",
  "/dashboard/messages":     "Messages",
  "/dashboard/users":        "Users",
};

function getPageLabel(pathname: string): string {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  // Prefix match for nested routes (e.g. /dashboard/articles/123)
  const match = Object.keys(ROUTE_LABELS).find(
    (key) => key !== "/dashboard" && pathname.startsWith(key)
  );
  return match ? ROUTE_LABELS[match] : "Dashboard";
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const pageLabel = getPageLabel(pathname);
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      suppressHydrationWarning
      style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: isDesktop ? 260 : 0 }}
    >
      {/* ── Top header ── */}
      <header
        suppressHydrationWarning
        style={{
          position: "sticky", top: 0, zIndex: 30,
          height: 58,
          paddingLeft: isDesktop ? "1.75rem" : "3.75rem",
          paddingRight: "1.5rem",
          background: "rgba(7,7,12,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Left: breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
            Purtivon
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
            {pageLabel}
          </span>
        </div>

        {/* Right: controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          {/* User email — hidden on small screens */}
          <span suppressHydrationWarning style={{
            fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: 160,
            display: isDesktop ? "block" : "none",
          }}>
            {user.email}
          </span>
          {/* User avatar */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))",
            border: "1px solid rgba(201,168,76,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#c9a84c", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em" }}>
              {initials}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "2rem 1.75rem", minWidth: 0 }}>{children}</main>
    </div>
  );
}
