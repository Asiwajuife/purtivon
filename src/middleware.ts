import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware — runs before any page or API route handler.
 *
 * Rules:
 *  /dashboard/**   → must have a valid session; redirects to login otherwise
 *  /api/admin/**   → must have a valid session AND role === ADMIN (defence-in-depth
 *                    on top of the per-route checks already in each handler)
 *  /admin/login    → already-authenticated users are bounced to /dashboard
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // getToken decodes the JWT cookie without a DB round-trip — safe at the edge
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ── /dashboard/** ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── /api/admin/** ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (token.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ── /admin/login ─────────────────────────────────────────────────────────
  // Send already-authenticated users directly to the dashboard
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/admin/login",
  ],
};
