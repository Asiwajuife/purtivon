import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "12", 10), 100);
    const skip = (page - 1) * limit;
    const where = {
      ...(year ? { year: parseInt(year, 10) } : {}),
      ...(category ? { category } : {}),
    };
    const [awards, total] = await Promise.all([
      prisma.award.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          recipient: true,
          year: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.award.count({ where }),
    ]);
    return NextResponse.json(
      {
        awards,
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
    console.error("[GET /api/awards]", error);
    return NextResponse.json(
      { error: "Failed to fetch awards." },
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { title, category, recipient, year, description } = body;
    if (!title || !category || !recipient || !year) {
      return NextResponse.json(
        { error: "title, category, recipient, and year are required." },
        { status: 400 }
      );
    }
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return NextResponse.json(
        { error: "year must be a valid 4-digit year." },
        { status: 400 }
      );
    }
    const award = await prisma.award.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        recipient: recipient.trim(),
        year: parsedYear,
        description: description?.trim() ?? null,
      },
    });
    return NextResponse.json({ award }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/awards]", error);
    return NextResponse.json(
      { error: "Failed to create award." },
      { status: 500 }
    );
  }
}
