export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessagesClient from "./MessagesClient";

export const metadata: Metadata = { title: "Contact Messages" };

const P = {
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
  surface: "var(--surface-card)",
  border: "var(--border-dim)",
} as const;

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 1040 }}>
      {/* Header */}
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.gold, marginBottom: "0.3rem" }}>
            Admin
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: P.textPrimary, margin: 0 }}>
            Contact Messages
          </h1>
        </div>
        <span style={{ fontSize: "0.62rem", color: P.textMuted, background: P.surface, border: `1px solid ${P.border}`, borderRadius: 3, padding: "0.3rem 0.7rem" }}>
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      <MessagesClient messages={messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))} />
    </div>
  );
}
