export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WinnersClient from "./WinnersClient";

export const metadata: Metadata = { title: "Award Winners" };

const P = { gold: "#c9a84c", textPrimary: "var(--text-hi)", textMuted: "var(--text-lo)" } as const;

export default async function WinnersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  type WinnerRow = {
    id: string; name: string; slug: string | null; category: string; year: number;
    quarter: number | null; company: string | null; region: string | null;
    featured: boolean; link: string | null; image: string | null;
    logo: string | null; profile: string | null;
  };

  const raw: WinnerRow[] = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners
     ORDER BY year DESC, name ASC`
  ).catch(() => [] as WinnerRow[]);

  const winners = raw.map((w) => ({
    id:       String(w.id),
    name:     String(w.name),
    slug:     w.slug    != null ? String(w.slug)    : null,
    category: String(w.category),
    year:     Number(w.year),
    quarter:  w.quarter != null ? Number(w.quarter) : null,
    company:  w.company != null ? String(w.company) : null,
    region:   w.region  != null ? String(w.region)  : null,
    featured: Boolean(w.featured),
    link:     w.link    != null ? String(w.link)    : null,
    image:    w.image   != null ? String(w.image)   : null,
    logo:     w.logo    != null ? String(w.logo)    : null,
    profile:  w.profile != null ? String(w.profile) : null,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 1140 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-faint)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>
            Awards
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, letterSpacing: "0.01em", margin: 0 }}>
            Award Winners
          </h1>
          <p style={{ fontSize: "0.65rem", color: P.textMuted, marginTop: 4 }}>
            Manage recipients displayed on the public homepage.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.62rem", color: P.textMuted, background: "var(--surface-card)", border: "1px solid var(--border-dim)", borderRadius: 3, padding: "0.3rem 0.7rem" }}>
            {winners.filter((w) => w.featured).length} featured
          </span>
          <span style={{ fontSize: "0.62rem", color: P.textMuted, background: "var(--surface-card)", border: "1px solid var(--border-dim)", borderRadius: 3, padding: "0.3rem 0.7rem" }}>
            {winners.length} {winners.length === 1 ? "winner" : "winners"} total
          </span>
        </div>
      </div>

      <WinnersClient winners={winners} />
    </div>
  );
}
