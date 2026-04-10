import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/dashboard/ArticleForm";

export const metadata: Metadata = { title: "Edit Article" };

const P = { gold: "#c9a84c", textPrimary: "#f0ede6" } as const;

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  interface AcRow { categoryId: string }

  const [article, categories, tags, acRows] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: { select: { tagId: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.$queryRawUnsafe<AcRow[]>(
      `SELECT "categoryId" FROM article_categories WHERE "articleId" = $1`,
      id
    ).catch(() => [] as AcRow[]),
  ]);

  if (!article) notFound();

  // Use join table if populated, fall back to legacy single categoryId
  const categoryIds = acRows.length > 0
    ? acRows.map((r) => r.categoryId)
    : article.categoryId ? [article.categoryId] : [];

  const initial = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    content: article.content as object | null,
    coverImage: article.coverImage ?? null,
    categoryIds,
    readTime: article.readTime ?? null,
    status: article.status as "DRAFT" | "REVIEW" | "PUBLISHED",
    tagIds: article.tags.map((t) => t.tagId),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 900 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>
          Content
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, margin: 0 }}>
          Edit Article
        </h1>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", marginTop: 4 }}>{article.title}</p>
      </div>

      <ArticleForm
        categories={categories}
        tags={tags}
        authorId={session.user.id}
        initial={initial}
      />
    </div>
  );
}
