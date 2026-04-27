export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Contact Messages" };

const P = {
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

const SUBJECT_LABELS: Record<string, string> = {
  "award-nomination": "Award Nomination",
  "media-pr": "Media & PR",
  "fdi-intelligence": "FDI Intelligence",
  "general": "General Enquiry",
};

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const thStyle: React.CSSProperties = {
    padding: "0.6rem 1rem",
    fontSize: "0.58rem",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: P.textMuted,
    textAlign: "left",
    borderBottom: `1px solid ${P.border}`,
    whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "0.85rem 1rem",
    fontSize: "0.72rem",
    color: P.textMuted,
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    verticalAlign: "top",
  };

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

      {messages.length === 0 ? (
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <p style={{ fontSize: "0.78rem", color: P.textMuted, margin: 0 }}>No messages yet</p>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.18)", margin: 0 }}>Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.015)" }}>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>Subject</th>
                  <th style={thStyle}>Message</th>
                  <th style={{ ...thStyle, whiteSpace: "nowrap" }}>Received</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, idx) => (
                  <tr key={msg.id} style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)" }}>
                    <td style={{ ...tdStyle, minWidth: 200 }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: "0.75rem", color: P.textPrimary }}>{msg.name}</p>
                      <a href={`mailto:${msg.email}`} style={{ fontSize: "0.65rem", color: P.gold, textDecoration: "none" }}>{msg.email}</a>
                      {msg.organisation && (
                        <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: "rgba(255,255,255,0.25)" }}>{msg.organisation}</p>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.65rem", padding: "0.18rem 0.5rem", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 3, color: P.gold }}>
                        {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 420 }}>
                      <p style={{ margin: 0, fontSize: "0.72rem", lineHeight: 1.6, color: "rgba(255,255,255,0.5)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                        {msg.message}
                      </p>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", fontSize: "0.65rem" }}>
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
