import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required." },
        { status: 400 }
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
