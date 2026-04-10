import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Reports" };

const PALETTE = {
  bg: "#0a0a0f",
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

async function getReportStats(userId: string, isAdmin: boolean) {
  const where = isAdmin ? {} : { userId };

  const [total, approved, pending, rejected, totalArticles, totalUsers, totalAwards] =
    await Promise.all([
      prisma.submission.count({ where }),
      prisma.submission.count({ where: { ...where, status: "APPROVED" } }),
      prisma.submission.count({ where: { ...where, status: "PENDING" } }),
      prisma.submission.count({ where: { ...where, status: "REJECTED" } }),
      prisma.article.count(),
      isAdmin ? prisma.user.count() : Promise.resolve(null),
      prisma.award.count(),
    ]);

  return { total, approved, pending, rejected, totalArticles, totalUsers, totalAwards };
}

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
  accentColor?: string;
}

function StatCard({ label, value, sub, accent, accentColor }: StatCardProps) {
  const color = accentColor ?? PALETTE.gold;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.1rem 1.25rem",
        background: accent ? `color-mix(in srgb, ${color} 5%, ${PALETTE.surface})` : PALETTE.surface,
        border: `1px solid ${accent ? `color-mix(in srgb, ${color} 22%, transparent)` : PALETTE.border}`,
        borderRadius: 4,
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: PALETTE.textMuted,
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          fontSize: "1.75rem",
          fontWeight: 300,
          letterSpacing: "0.02em",
          color: accent ? color : PALETTE.textPrimary,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "0.62rem", color: PALETTE.textMuted, margin: 0 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

interface BarRowProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function BarRow({ label, count, total, color }: BarRowProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 500,
            color: PALETTE.textPrimary,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.62rem",
            color: PALETTE.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count} &nbsp;·&nbsp; {pct}%
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: PALETTE.border,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const stats = await getReportStats(session.user.id, isAdmin);

  const statCards: StatCardProps[] = [
    {
      label: "Total Submissions",
      value: stats.total,
      sub: isAdmin ? "Across all users" : "Your entries",
    },
    {
      label: "Approved",
      value: stats.approved,
      sub: "Successful entries",
      accent: true,
      accentColor: PALETTE.gold,
    },
    {
      label: "Pending Review",
      value: stats.pending,
      sub: "Awaiting decision",
      accent: true,
      accentColor: "rgba(180,140,60,0.9)",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      sub: "Did not qualify",
      accent: stats.rejected > 0,
      accentColor: "rgba(200,80,80,0.85)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        maxWidth: 860,
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: PALETTE.gold,
            marginBottom: "0.3rem",
          }}
        >
          Analytics
        </span>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: PALETTE.textPrimary,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          Reports &amp; Insights
        </h1>
      </div>

      {/* Stat Cards — 2x2 inline grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
        }}
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Additional platform stats (admin only) */}
      {isAdmin && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
        >
          <StatCard label="Total Articles" value={stats.totalArticles} sub="All content" />
          <StatCard label="Total Users" value={stats.totalUsers ?? 0} sub="Registered accounts" />
          <StatCard label="Active Awards" value={stats.totalAwards} sub="Award categories" />
        </div>
      )}

      {/* Submission Activity */}
      <div
        style={{
          background: PALETTE.surface,
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 4,
          padding: "1.25rem 1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.25rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: PALETTE.textMuted,
              whiteSpace: "nowrap",
            }}
          >
            Submission Activity
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </div>

        {stats.total === 0 ? (
          <p
            style={{
              fontSize: "0.78rem",
              color: PALETTE.textMuted,
              margin: 0,
              textAlign: "center",
              padding: "1.5rem 0",
            }}
          >
            No submissions yet.{" "}
            {!isAdmin && (
              <a
                href="/awards"
                style={{ color: PALETTE.gold, textDecoration: "none" }}
              >
                Browse awards
              </a>
            )}{" "}
            to get started.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <BarRow
              label="Approved"
              count={stats.approved}
              total={stats.total}
              color={PALETTE.gold}
            />
            <BarRow
              label="Pending"
              count={stats.pending}
              total={stats.total}
              color="rgba(201,168,76,0.45)"
            />
            <BarRow
              label="Rejected"
              count={stats.rejected}
              total={stats.total}
              color="rgba(200,80,80,0.6)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
