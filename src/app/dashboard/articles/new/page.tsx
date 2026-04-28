export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/dashboard/ArticleForm";

export const metadata: Metadata = { title: "New Article" };

const P = {
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
} as const;

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 900 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-faint)" }}>
        <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>
          Content
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, margin: 0 }}>
          New Article
        </h1>
      </div>

      <ArticleForm
        categories={categories}
        tags={tags}
        authorId={session.user.id}
      />
    </div>
  );
}
