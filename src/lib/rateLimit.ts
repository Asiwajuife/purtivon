import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — resets on cold start.
// For multi-instance/serverless deployments this provides per-instance limiting,
// which is meaningful protection without requiring an external Redis dependency.
const store = new Map<string, RateLimitEntry>();

// Periodically evict expired entries so the Map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 60_000);
}

/**
 * Check whether a request is within the allowed rate limit.
 * Returns a 429 Response if the limit is exceeded, or null if allowed.
 *
 * @param req       The incoming Next.js request
 * @param limit     Maximum number of requests allowed in the window
 * @param windowMs  Window length in milliseconds
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const key = `${req.nextUrl.pathname}::${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  entry.count++;
  return null;
}
