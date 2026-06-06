export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WinnersClient from "./WinnersClient";

export const metadata: Metadata = { title: "Award Winners" };

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

  const featured = winners.filter(w => w.featured).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 1200 }}>
      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: "1rem", flexWrap: "wrap",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.3rem" }}>
            Awards
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: "var(--text-hi)", letterSpacing: "0.01em", margin: 0, lineHeight: 1.1 }}>
            Award Winners
          </h1>
          <p style={{ fontSize: "0.64rem", color: "rgba(255,255,255,0.32)", marginTop: "0.3rem", marginBottom: 0 }}>
            Manage recipients displayed on the public homepage.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {featured} featured
          </span>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {winners.length} total
          </span>
        </div>
      </div>

      <WinnersClient winners={winners} />
    </div>
  );
}
