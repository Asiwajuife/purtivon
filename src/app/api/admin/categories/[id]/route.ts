import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function adminOnly() {
  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const { id } = await params;
  const body = await req.json();
  const { name, slug } = body;
  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required." }, { status: 400 });
  }

  const conflict = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
  if (conflict) {
    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: name.trim(), slug: slug.trim() },
  });
  return NextResponse.json({ category }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const { id } = await params;
  const count = await prisma.article.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${count} article(s) are assigned to this category.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
