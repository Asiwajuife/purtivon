import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function adminOnly() {
  return NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ tags }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return adminOnly();

  const body = await req.json();
  const { name, slug } = body;
  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required." }, { status: 400 });
  }

  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ tag: existing }, { status: 200 });

  const tag = await prisma.tag.create({ data: { name: name.trim(), slug: slug.trim() } });
  return NextResponse.json({ tag }, { status: 201 });
}
