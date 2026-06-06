export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AwardsClient from "./AwardsClient";

export const metadata: Metadata = { title: "Manage Awards" };

export default async function AdminAwardsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const awards = await prisma.award.findMany({
    orderBy: [{ year: "desc" }, { title: "asc" }],
    include: { _count: { select: { submissions: true } } },
  });

  const serialised = awards.map((a) => ({
    id:              a.id,
    title:           a.title,
    category:        a.category,
    year:            a.year,
    description:     a.description,
    submissionCount: a._count.submissions,
  }));

  const totalSubmissions = serialised.reduce((sum, a) => sum + a.submissionCount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 960 }}>
      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: "1rem", flexWrap: "wrap",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.3rem" }}>
            Recognition
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: "var(--text-hi)", letterSpacing: "0.01em", margin: 0, lineHeight: 1.1 }}>
            Awards
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {serialised.length} {serialised.length === 1 ? "award" : "awards"}
          </span>
          <span style={{ fontSize: "0.6rem", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {totalSubmissions} submissions
          </span>
        </div>
      </div>

      <AwardsClient awards={serialised} />
    </div>
  );
}
