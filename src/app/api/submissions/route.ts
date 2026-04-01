import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit an entry." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const {
      awardId,
      companyName,
      companyWebsite,
      contactName,
      contactEmail,
      details,
      additionalInfo,
    } = body;
    if (!awardId || !companyName || !contactName || !contactEmail || !details) {
      return NextResponse.json(
        {
        },
          error:
            "awardId, companyName, contactName, contactEmail, and details are required.",
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: "contactEmail must be a valid email address." },
        { status: 400 }
      );
    }
    const award = await prisma.award.findUnique({
      where: { id: awardId },
      select: { id: true },
    });
    if (!award) {
      return NextResponse.json({ error: "Award not found." }, { status: 404 });
    }
    const existing = await prisma.submission.findFirst({
      where: { awardId, userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted an entry for this award." },
        { status: 409 }
      );
    }
    const submission = await prisma.submission.create({
      data: {
        awardId,
        userId: session.user.id,
        companyName: companyName.trim(),
        companyWebsite: companyWebsite?.trim() ?? null,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        details: details.trim(),
        additionalInfo: additionalInfo?.trim() ?? null,
        status: "PENDING",
      },
      select: {
        id: true,
        awardId: true,
        userId: true,
        companyName: true,
        companyWebsite: true,
        contactName: true,
        contactEmail: true,
        details: true,
        additionalInfo: true,
        status: true,
        createdAt: true,
        award: {
          select: { id: true, title: true, category: true, year: true },
        },
      },
    });
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/submissions]", error);
    return NextResponse.json(
      { error: "Failed to submit award entry." },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? "10", 10),
      100
    );
    const skip = (page - 1) * limit;
    const isAdmin = session.user.role === "ADMIN";
    const where = isAdmin ? {} : { userId: session.user.id };
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          companyName: true,
          companyWebsite: true,
          contactName: true,
          contactEmail: true,
          details: true,
          additionalInfo: true,
          status: true,
          createdAt: true,
          award: {
            select: { id: true, title: true, category: true, year: true },
          },
          ...(isAdmin
            ? { user: { select: { id: true, name: true, email: true } } }
            : {}),
        },
      }),
      prisma.submission.count({ where }),
    ]);
    return NextResponse.json(
      {
        submissions,
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
    console.error("[GET /api/submissions]", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}
