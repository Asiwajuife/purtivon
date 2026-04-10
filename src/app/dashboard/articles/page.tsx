import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = { title: "Articles" };

const PALETTE = {
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  const serialised = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? null,
    coverImage: a.coverImage ?? null,
    status: a.status as "DRAFT" | "REVIEW" | "PUBLISHED",
    category: a.category?.name ?? null,
    author: a.author.name ?? a.author.email,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 1020 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: PALETTE.gold, marginBottom: "0.3rem" }}>
            Content
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: PALETTE.textPrimary, letterSpacing: "0.01em", margin: 0 }}>
            Articles
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.62rem", color: PALETTE.textMuted, background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 3, padding: "0.3rem 0.7rem" }}>
            {serialised.length} {serialised.length === 1 ? "article" : "articles"}
          </span>
          <Link href="/dashboard/articles/new" style={{ padding: "0.45rem 1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", borderRadius: 3, textDecoration: "none", whiteSpace: "nowrap" }}>
            + New Article
          </Link>
        </div>
      </div>

      <ArticlesClient articles={serialised} />
    </div>
  );
}
