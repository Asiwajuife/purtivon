import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ── Brute-force lockout ────────────────────────────────────────────────────
// In-memory store: resets on cold start (acceptable for serverless).
// Tracks failed attempts per email address.
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes

function recordFailure(email: string): void {
  const now     = Date.now();
  const current = loginAttempts.get(email) ?? { count: 0, lockedUntil: 0 };
  current.count += 1;
  if (current.count >= MAX_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_MS;
  }
  loginAttempts.set(email, current);
}

function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}

function getLockoutMessage(email: string): string | null {
  const entry = loginAttempts.get(email);
  if (!entry || Date.now() >= entry.lockedUntil) return null;
  const mins = Math.ceil((entry.lockedUntil - Date.now()) / 60_000);
  return `ACCOUNT_LOCKED:Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`;
}

// ── Auth options ───────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // 8-hour sessions — short window limits exposure if a token is stolen.
    // Previously 30 days.
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error:  "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const email = credentials.email.toLowerCase().trim();

        // Check lockout before hitting the database
        const lockMsg = getLockoutMessage(email);
        if (lockMsg) throw new Error(lockMsg);

        const user = await prisma.user.findUnique({
          where:  { email },
          select: { id: true, email: true, name: true, password: true, role: true },
        });

        if (!user?.password) {
          // Record failure even for non-existent accounts so enumeration
          // attacks and real failures have identical timing + behaviour.
          recordFailure(email);
          throw new Error("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          recordFailure(email);
          const lockMsgAfter = getLockoutMessage(email);
          // Surface the lockout message immediately when the limit is just hit
          if (lockMsgAfter) throw new Error(lockMsgAfter);
          throw new Error("Invalid email or password.");
        }

        // Successful login — clear the counter
        clearAttempts(email);

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: embed id + role into the token
      if (user) {
        token.id            = user.id;
        token.role          = user.role;
        token.lastDbCheck   = Date.now();
      }

      // Periodically re-validate against the DB (every 15 min) so that:
      //  - deleted or deactivated users are logged out on their next request
      //  - role changes propagate without requiring re-login
      const RECHECK_INTERVAL = 15 * 60 * 1000;
      const lastCheck = (token.lastDbCheck as number | undefined) ?? 0;
      if (token.id && Date.now() - lastCheck > RECHECK_INTERVAL) {
        const dbUser = await prisma.user.findUnique({
          where:  { id: token.id as string },
          select: { role: true },
        });
        if (!dbUser) {
          // User no longer exists — return an empty token to invalidate the session
          return {} as typeof token;
        }
        token.role        = dbUser.role;
        token.lastDbCheck = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
