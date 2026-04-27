export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AwardsClient from "./AwardsClient";

export const metadata: Metadata = { title: "Manage Awards" };

const P = { gold: "#c9a84c", textPrimary: "#f0ede6" } as const;

export default async function AdminAwardsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const awards = await prisma.award.findMany({
    orderBy: [{ year: "desc" }, { title: "asc" }],
    include: { _count: { select: { submissions: true } } },
  });

  const serialised = awards.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    year: a.year,
    description: a.description,
    submissionCount: a._count.submissions,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 900 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>
          Recognition
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, margin: 0 }}>
          Awards
        </h1>
      </div>
      <AwardsClient awards={serialised} />
    </div>
  );
}
