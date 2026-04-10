import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <div style={{
      padding: "1.25rem 1.5rem",
      border: `1px solid ${accent ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.05)"}`,
      background: accent ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.015)",
      display: "flex", flexDirection: "column", gap: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: accent ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.25)" }}>
          {label}
        </p>
        <span style={{
          width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
          background: accent ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
          color: accent ? "#c9a84c" : "rgba(255,255,255,0.22)",
        }}>
          {icon}
        </span>
      </div>
      <div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.75rem", fontWeight: 300, lineHeight: 1,
          color: accent ? "#c9a84c" : "#f0ede6",
          marginBottom: sub ? "0.4rem" : 0,
        }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em" }}>{sub}</p>}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Pending"  },
  APPROVED: { color: "#34d399", bg: "rgba(52,211,153,0.1)",  label: "Approved" },
  REJECTED: { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Rejected" },
};

async function getDashboardData(userId: string, isAdmin: boolean) {
  const submissionWhere = isAdmin ? {} : { userId };
  const [
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    totalArticles,
    recentSubmissions,
    stripeBalance,
  ] = await Promise.all([
    prisma.submission.count({ where: submissionWhere }),
    prisma.submission.count({ where: { ...submissionWhere, status: "PENDING" } }),
    prisma.submission.count({ where: { ...submissionWhere, status: "APPROVED" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.submission.findMany({
      where: submissionWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, companyName: true, status: true, createdAt: true,
        award: { select: { title: true, category: true } },
        ...(isAdmin ? { user: { select: { name: true, email: true } } } : {}),
      },
    }),
    isAdmin ? stripe.balance.retrieve().catch(() => null) : null,
  ]);

  const totalRevenue = stripeBalance
    ? stripeBalance.available.reduce((s, b) => s + b.amount, 0) / 100
    : null;

  return { totalSubmissions, pendingSubmissions, approvedSubmissions, totalArticles, recentSubmissions, totalRevenue };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

const QUICK_ACTIONS = [
  {
    label: "View Submissions", href: "/dashboard/submissions", description: "Review your award entries",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
  },
  {
    label: "Browse Awards", href: "/awards", description: "Submit a new entry",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>,
  },
  {
    label: "Read Insights", href: "/insights", description: "Latest FDI intelligence",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>,
  },
];

const ADMIN_ACTIONS = [
  {
    label: "Articles", href: "/dashboard/articles", description: "Create & manage content",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>,
  },
  {
    label: "Categories", href: "/dashboard/categories", description: "Manage article categories",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>,
  },
  {
    label: "Awards", href: "/dashboard/awards", description: "Manage award listings",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>,
  },
  {
    label: "Winners", href: "/dashboard/winners", description: "Manage quarterly award winners",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
  },
  {
    label: "Podcasts", href: "/dashboard/podcasts", description: "Upload & manage episodes",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
  {
    label: "Messages", href: "/dashboard/messages", description: "View contact submissions",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
  },
  {
    label: "Users", href: "/dashboard/users", description: "Manage user accounts",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const data = await getDashboardData(session!.user.id, isAdmin);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 900 }}>

      {/* Header */}
      <div style={{ paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.3rem" }}>
          {isAdmin ? "Platform Overview" : "My Account"}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 300, color: "#f0ede6" }}>
            Welcome back,{" "}
            <span style={{ color: "#c9a84c" }}>{session?.user?.name?.split(" ")[0] ?? "there"}</span>
          </h1>
          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>{today}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.04)" }} className="dash-stats">
        <StatCard
          label="Total Submissions"
          value={String(data.totalSubmissions)}
          sub={isAdmin ? "Across all users" : "Your entries"}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
        />
        <StatCard
          label="Pending Review"
          value={String(data.pendingSubmissions)}
          sub="Awaiting decision"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
        <StatCard
          label="Approved"
          value={String(data.approvedSubmissions)}
          sub="Successful entries"
          accent
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
        {isAdmin ? (
          <StatCard
            label="Stripe Balance"
            value={data.totalRevenue !== null ? fmt(data.totalRevenue) : "—"}
            sub="Available balance"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
        ) : (
          <StatCard
            label="Published Articles"
            value={String(data.totalArticles)}
            sub="Platform insights"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>Quick Actions</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {QUICK_ACTIONS.map(({ label, href, description, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
              className="dash-action"
            >
              <span style={{
                width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.14)", color: "#c9a84c",
              }}>
                {icon}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: "0.15rem" }}>{label}</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</p>
              </div>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Tools — only shown to ADMIN role */}
      {isAdmin && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", flexShrink: 0 }}>Admin Tools</span>
            <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.08)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }} className="dash-admin">
            {ADMIN_ACTIONS.map(({ label, href, description, icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.85rem 1rem",
                  background: "rgba(201,168,76,0.03)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  textDecoration: "none",
                }}
                className="dash-admin-action"
              >
                <span style={{
                  width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", color: "#c9a84c",
                }}>
                  {icon}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: "0.15rem" }}>{label}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</p>
                </div>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      {data.recentSubmissions.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>Recent Submissions</span>
              <div style={{ width: 120, height: 1, background: "rgba(255,255,255,0.04)" }} />
            </div>
            <Link href="/dashboard/submissions" style={{ fontSize: "0.7rem", color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              View All →
            </Link>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
            {data.recentSubmissions.map((sub, i) => {
              const s = STATUS_STYLES[sub.status] ?? STATUS_STYLES.PENDING;
              const subWithUser = sub as typeof sub & { user?: { name: string | null; email: string } };
              return (
                <div
                  key={sub.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.85rem 1.25rem",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.companyName}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.28)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.award.title}{isAdmin && subWithUser.user ? ` · ${subWithUser.user.name ?? subWithUser.user.email}` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.color, background: s.bg, padding: "0.2rem 0.6rem", flexShrink: 0 }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", flexShrink: 0, minWidth: 80, textAlign: "right" }}>
                    {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) { .dash-stats { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .dash-stats { grid-template-columns: 1fr !important; } }
        .dash-action:hover { border-color: rgba(201,168,76,0.2) !important; background: rgba(255,255,255,0.03) !important; }
        .dash-admin-action:hover { border-color: rgba(201,168,76,0.25) !important; background: rgba(201,168,76,0.06) !important; }
        @media (max-width: 700px) { .dash-admin { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .dash-admin { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
