"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import UserInfo from "@/components/dashboard/UserInfo";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);

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
      className="flex-1 flex flex-col min-w-0"
      style={{ marginLeft: isDesktop ? 200 : 0 }}
    >
      <header
        suppressHydrationWarning
        style={{
          paddingLeft: isDesktop ? "1.25rem" : "3.5rem",
          paddingRight: "1.25rem",
          position: "sticky", top: 0, zIndex: 30, height: 44,
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          boxShadow: "0 1px 20px rgba(0,0,0,0.2)",
          background: "var(--nav-backdrop)", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-4)" }}>
            Dashboard
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <UserInfo user={user} />
        </div>
      </header>

      <main style={{ flex: 1, padding: "1.25rem" }}>{children}</main>
    </div>
  );
}
