import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
  // Always cache — without this, production creates a new client (and connection
  // pool) on every request, exhausting the DB connection limit after a few navigations.
  globalForPrisma.prisma = client;
  return client;
}

// Lazy proxy — only instantiates PrismaClient on first property access at
// request time, not at module-load time (which would crash the build if
// DATABASE_URL is absent from the build environment).
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});
