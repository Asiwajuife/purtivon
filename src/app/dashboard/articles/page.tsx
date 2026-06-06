export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = { title: "Articles" };

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  const serialised = articles.map((a) => ({
    id:         a.id,
    title:      a.title,
    slug:       a.slug,
    excerpt:    a.excerpt ?? null,
    coverImage: a.coverImage ?? null,
    status:     a.status as "DRAFT" | "REVIEW" | "PUBLISHED",
    category:   a.category?.name ?? null,
    author:     a.author.name ?? a.author.email,
    createdAt:  a.createdAt.toISOString(),
  }));

  const published = serialised.filter(a => a.status === "PUBLISHED").length;
  const draft     = serialised.filter(a => a.status === "DRAFT").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 1080 }}>
      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: "1rem", flexWrap: "wrap",
        paddingBottom: "0.85rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.3rem" }}>
            Content
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: "var(--text-hi)", letterSpacing: "0.01em", margin: 0, lineHeight: 1.1 }}>
            Articles
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {published} published
          </span>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0.3rem 0.7rem", whiteSpace: "nowrap" }}>
            {draft} draft
          </span>
          <Link
            href="/dashboard/articles/new"
            style={{
              padding: "0.44rem 1rem", fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070c",
              borderRadius: 5, textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            + New Article
          </Link>
        </div>
      </div>

      <ArticlesClient articles={serialised} />
    </div>
  );
}
