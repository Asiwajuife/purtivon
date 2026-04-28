export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export const metadata: Metadata = { title: "Manage Users" };

const P = { gold: "#c9a84c", textPrimary: "var(--text-hi)" } as const;

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true },
  });

  const serialised = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 900 }}>
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-faint)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>Admin</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, margin: 0 }}>Users</h1>
        </div>
        <span style={{ fontSize: "0.62rem", color: "var(--text-lo)", background: "var(--surface-card)", border: "1px solid var(--border-dim)", borderRadius: 3, padding: "0.3rem 0.7rem" }}>
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </div>
      <UsersClient users={serialised} />
    </div>
  );
}
