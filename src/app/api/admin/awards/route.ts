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

  const awards = await prisma.award.findMany({
    orderBy: [{ year: "desc" }, { title: "asc" }],
    include: { _count: { select: { submissions: true } } },
  });
  return NextResponse.json({ awards }, { status: 200 });
}
