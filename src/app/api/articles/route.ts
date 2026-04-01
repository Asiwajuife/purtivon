import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 100);
    const skip = (page - 1) * limit;
    const where = {
      published: true,
      ...(category ? { category } : {}),
    };
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          readTime: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);
    return NextResponse.json(
      {
        articles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json(
      { error: "Failed to fetch articles." },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    const body = await req.json();
    const { title, slug, excerpt, content, category, readTime, published } = body;
    if (!title || !slug || !content || !category) {
      return NextResponse.json(
        { error: "title, slug, content, and category are required." },
        { status: 400 }
      );
    }
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An article with this slug already exists." },
        { status: 409 }
      );
    }
    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt?.trim() ?? null,
        content: content.trim(),
        category: category.trim(),
        readTime: readTime ? parseInt(readTime, 10) : null,
        published: published ?? false,
        authorId: session.user.id,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        readTime: true,
        published: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/articles]", error);
    return NextResponse.json(
      { error: "Failed to create article." },
      { status: 500 }
    );
  }
}
