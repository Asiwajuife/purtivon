import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function adminOnly() {
  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

async function syncCategories(articleId: string, categoryIds: string[]) {
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const { id } = await params;
  const body = await req.json();
  const { title, slug, excerpt, content, coverImage, categories, readTime, status, tags } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "title and slug are required." }, { status: 400 });
  }

  const conflict = await prisma.article.findFirst({ where: { slug: slug.trim(), NOT: { id } } });
  if (conflict) {
    return NextResponse.json({ error: "Slug already in use by another article." }, { status: 409 });
  }

  const categoryIds: string[] = Array.isArray(categories) ? categories : [];
  const primaryCategoryId = categoryIds[0] ?? null;

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt?.trim() ?? null,
      content: content ?? { type: "doc", content: [] },
      coverImage: coverImage ?? null,
      categoryId: primaryCategoryId,
      readTime: readTime ? parseInt(String(readTime), 10) : null,
      status: status ?? "DRAFT",
    },
  });

  // Replace tags
  if (tags && Array.isArray(tags)) {
    await prisma.articleTag.deleteMany({ where: { articleId: id } });
    if (tags.length > 0) {
      await prisma.articleTag.createMany({
        data: tags.map((tagId: string) => ({ articleId: id, tagId })),
        skipDuplicates: true,
      });
    }
  }

  // Replace categories
  await syncCategories(id, categoryIds);

  return NextResponse.json({ article }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const { id } = await params;
  await prisma.articleTag.deleteMany({ where: { articleId: id } });
  await prisma.$queryRawUnsafe(`DELETE FROM article_categories WHERE "articleId" = $1`, id).catch(() => null);
  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
