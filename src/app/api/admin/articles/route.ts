import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function adminOnly() {
  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const existing = await prisma.article.findFirst({
    where: { slug: base, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  if (!existing) return base;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

async function syncCategories(articleId: string, categoryIds: string[]) {
  // Delete existing, then insert new
  await prisma.$queryRawUnsafe(
    `DELETE FROM article_categories WHERE "articleId" = $1`,
    articleId
  );
  for (const categoryId of categoryIds) {
    await prisma.$queryRawUnsafe(
      `INSERT INTO article_categories ("articleId", "categoryId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      articleId,
      categoryId
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const body = await req.json();
  const { title, slug, excerpt, content, coverImage, categories, readTime, status, tags } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "title and slug are required." }, { status: 400 });
  }

  const categoryIds: string[] = Array.isArray(categories) ? categories : [];
  const primaryCategoryId = categoryIds[0] ?? null;
  const finalSlug = await uniqueSlug(slug.trim());

  const article = await prisma.article.create({
    data: {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() ?? null,
      content: content ?? { type: "doc", content: [] },
      coverImage: coverImage ?? null,
      categoryId: primaryCategoryId,
      readTime: readTime ? parseInt(String(readTime), 10) : null,
      status: status ?? "DRAFT",
      authorId: session.user.id,
    },
  });

  if (tags && Array.isArray(tags) && tags.length > 0) {
    await prisma.articleTag.createMany({
      data: tags.map((tagId: string) => ({ articleId: article.id, tagId })),
      skipDuplicates: true,
    });
  }

  if (categoryIds.length > 0) {
    await syncCategories(article.id, categoryIds);
  }

  return NextResponse.json({ article }, { status: 201 });
}
