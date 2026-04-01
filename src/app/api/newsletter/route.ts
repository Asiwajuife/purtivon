import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, unsubscribedAt: true },
    });
    if (existing) {
      if (existing.unsubscribedAt) {
        await prisma.newsletterSubscriber.update({
          where: { email: normalizedEmail },
          data: {
            unsubscribedAt: null,
            name: name?.trim() ?? undefined,
            resubscribedAt: new Date(),
          },
        });
        return NextResponse.json(
          { message: "You have been successfully resubscribed." },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail, name: name?.trim() ?? null },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(
      { message: "Successfully subscribed to the newsletter.", subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, unsubscribedAt: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Email address not found." },
        { status: 404 }
      );
    }
    if (existing.unsubscribedAt) {
      return NextResponse.json(
        { error: "This email is already unsubscribed." },
        { status: 409 }
      );
    }
    await prisma.newsletterSubscriber.update({
      where: { email: normalizedEmail },
      data: { unsubscribedAt: new Date() },
    });
    return NextResponse.json(
      { message: "Successfully unsubscribed from the newsletter." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/newsletter]", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again." },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? "20", 10),
      100
    );
    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where: { unsubscribedAt: null },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, email: true, name: true, createdAt: true },
      }),
      prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
    ]);
    return NextResponse.json(
      {
        subscribers,
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
    console.error("[GET /api/newsletter]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers." },
      { status: 500 }
    );
  }
}
