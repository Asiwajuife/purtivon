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
  const { title, category, year, description } = body;
  if (!title || !category || !year) {
    return NextResponse.json({ error: "title, category, and year are required." }, { status: 400 });
  }

  const award = await prisma.award.update({
    where: { id },
    data: {
      title: title.trim(),
      category: category.trim(),
      year: parseInt(year, 10),
      description: description?.trim() ?? null,
    },
  });
  return NextResponse.json({ award }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const { id } = await params;
  await prisma.award.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
