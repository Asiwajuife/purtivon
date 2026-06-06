"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}
interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}
interface SidebarContentProps {
  user: DashboardSidebarProps["user"];
  isAdmin: boolean;
  mainItems: NavItem[];
  adminItems: NavItem[];
  pathname: string;
  onNavigate: () => void;
  confirmSignOut: boolean;
  setConfirmSignOut: (v: boolean) => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    label: "Submissions",
    href: "/dashboard/submissions",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: "Articles",
    href: "/dashboard/articles",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  {
    label: "Awards",
    href: "/dashboard/awards",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
  },
  {
    label: "Winners",
    href: "/dashboard/winners",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    label: "Podcasts",
    href: "/dashboard/podcasts",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/dashboard/users",
    adminOnly: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
];

function SidebarNavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`db-nav-link${isActive ? " db-nav-link--active" : ""}`}
      style={{
        display: "flex", alignItems: "center", gap: "0.65rem",
        padding: "8px 12px",
        borderRadius: 6,
        borderLeft: `2px solid ${isActive ? "#c9a84c" : "transparent"}`,
        background: isActive ? "rgba(201,168,76,0.09)" : "transparent",
        color: isActive ? "#d4a843" : "rgba(255,255,255,0.46)",
        textDecoration: "none",
        fontSize: "0.75rem",
        fontWeight: isActive ? 500 : 400,
        letterSpacing: "0.02em",
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
    >
      <span style={{ color: isActive ? "#c9a84c" : "rgba(255,255,255,0.32)", display: "flex", alignItems: "center", flexShrink: 0, transition: "color 0.15s" }}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function SectionLabel({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", marginBottom: 4 }}>
      <span style={{
        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
        color: accent ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.2)",
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: accent ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

function SidebarContent({ user, isAdmin, mainItems, adminItems, pathname, onNavigate, confirmSignOut, setConfirmSignOut }: SidebarContentProps) {
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── Logo ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 60, flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Diamond glyph */}
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <div style={{ width: 8, height: 8, background: "#c9a84c", transform: "rotate(45deg)", borderRadius: 1 }} />
          </div>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond','Didot','Georgia',serif",
              letterSpacing: "0.28em", fontSize: "0.82rem", fontWeight: 400,
              textTransform: "uppercase", color: "#d4a843", display: "block",
            }}>
              Purtivon
            </span>
            <span style={{ fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", display: "block", lineHeight: 1.3 }}>
              Admin Portal
            </span>
          </div>
        </div>
        {isAdmin && (
          <span style={{
            fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#c9a84c", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)",
            padding: "2px 7px", borderRadius: 3, flexShrink: 0,
          }}>
            Admin
          </span>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: "16px 10px 8px", overflowY: "auto" }}>
        <SectionLabel label="General" />
        <ul style={{ display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: "0 0 16px", padding: 0 }}>
          {mainItems.map((item) => (
            <li key={item.href}>
              <SidebarNavLink item={item} pathname={pathname} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <SectionLabel label="Admin Tools" accent />
            <ul style={{ display: "flex", flexDirection: "column", gap: 2, listStyle: "none", margin: 0, padding: 0 }}>
              {adminItems.map((item) => (
                <li key={item.href}>
                  <SidebarNavLink item={item} pathname={pathname} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        {/* User card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", marginBottom: 8,
          borderRadius: 8,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#c9a84c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>
              {initials}
            </span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "0.73rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4 }}>
              {user.name ?? "User"}
            </p>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.28)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4 }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign-out */}
        {!confirmSignOut ? (
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            className="db-signout-btn"
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              minHeight: 36, padding: "0 12px", borderRadius: 6,
              background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", color: "rgba(255,255,255,0.32)",
              fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)",
            borderRadius: 6, padding: "6px 10px", minHeight: 36,
          }}>
            <span style={{ flex: 1, fontSize: "0.68rem", color: "rgba(255,255,255,0.42)" }}>Sign out?</span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ padding: "4px 12px", fontSize: "0.68rem", fontWeight: 600, color: "#f87171", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 4, cursor: "pointer", letterSpacing: "0.04em" }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmSignOut(false)}
              style={{ padding: "4px 12px", fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, cursor: "pointer" }}
            >
              No
            </button>
          </div>
        )}
      </div>

      <style>{`
        .db-nav-link:hover:not(.db-nav-link--active) {
          background: rgba(255,255,255,0.04) !important;
          color: rgba(255,255,255,0.72) !important;
        }
        .db-nav-link:hover:not(.db-nav-link--active) span {
          color: rgba(255,255,255,0.5) !important;
        }
        .db-signout-btn:hover {
          border-color: rgba(248,113,113,0.22) !important;
          color: rgba(248,113,113,0.7) !important;
          background: rgba(248,113,113,0.04) !important;
        }
        nav::-webkit-scrollbar { width: 3px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>
    </div>
  );
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setConfirmSignOut(false); }, [pathname]);
  useEffect(() => { if (!mobileOpen) setConfirmSignOut(false); }, [mobileOpen]);

  const isAdmin = user.role === "ADMIN";
  const mainItems = NAV_ITEMS.filter((i) => !i.adminOnly);
  const adminItems = NAV_ITEMS.filter((i) => i.adminOnly);
  const handleNavigate = () => setMobileOpen(false);

  const contentProps: SidebarContentProps = {
    user, isAdmin, mainItems, adminItems, pathname,
    onNavigate: handleNavigate, confirmSignOut, setConfirmSignOut,
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        suppressHydrationWarning
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 40,
          width: 260,
          background: "#07070c",
          borderRight: "1px solid rgba(255,255,255,0.055)",
          display: isDesktop ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile hamburger */}
      <button
        suppressHydrationWarning
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 35,
          width: 52, height: 58,
          color: "rgba(255,255,255,0.5)",
          background: "rgba(7,7,12,0.95)",
          border: "none", borderRight: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
          display: !isDesktop && !mobileOpen ? "flex" : "none",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      <div
        suppressHydrationWarning
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(2px)",
          display: !isDesktop ? "block" : "none",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Mobile sidebar */}
      <aside
        suppressHydrationWarning
        style={{
          position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
          width: 280,
          background: "#07070c",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: !isDesktop ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          style={{
            position: "absolute", top: 14, right: 12, zIndex: 60,
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6, cursor: "pointer", color: "rgba(255,255,255,0.4)",
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent {...contentProps} />
      </aside>
    </>
  );
}
