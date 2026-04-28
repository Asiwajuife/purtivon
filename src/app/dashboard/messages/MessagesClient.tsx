"use client";
import { useState } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  "award-nomination": "Award Nomination",
  "media-pr": "Media & PR",
  "fdi-intelligence": "FDI Intelligence",
  "general": "General Enquiry",
};

const thStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  fontSize: "0.58rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--text-lo)",
  textAlign: "left",
  borderBottom: "1px solid var(--border-dim)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  fontSize: "0.72rem",
  color: "var(--text-lo)",
  borderBottom: "1px solid var(--border-faint)",
  verticalAlign: "top",
};

export default function MessagesClient({ messages: initial }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete message from "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError("");

    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Delete failed.");
      return;
    }

    setMessages(prev => prev.filter(m => m.id !== id));
  }

  if (messages.length === 0) {
    return (
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-dim)", borderRadius: 4, padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        <p style={{ fontSize: "0.78rem", color: "var(--text-lo)", margin: 0 }}>No messages yet</p>
        <p style={{ fontSize: "0.65rem", color: "var(--text-5)", margin: 0 }}>Contact form submissions will appear here.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p style={{ fontSize: "0.72rem", color: "#f87171", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 3, padding: "0.5rem 0.75rem" }}>
          {error}
        </p>
      )}
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-dim)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-subtle)" }}>
                <th style={thStyle}>From</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Message</th>
                <th style={{ ...thStyle, whiteSpace: "nowrap" }}>Received</th>
                <th style={{ ...thStyle, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, idx) => (
                <tr key={msg.id} style={{ background: idx % 2 === 0 ? "transparent" : "var(--surface-subtle)" }}>
                  <td style={{ ...tdStyle, minWidth: 200 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "0.75rem", color: "var(--text-hi)" }}>{msg.name}</p>
                    <a href={`mailto:${msg.email}`} style={{ fontSize: "0.65rem", color: "var(--gold)", textDecoration: "none" }}>{msg.email}</a>
                    {msg.organisation && (
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: "var(--text-5)" }}>{msg.organisation}</p>
                    )}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "0.65rem", padding: "0.18rem 0.5rem", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 3, color: "var(--gold)" }}>
                      {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 420 }}>
                    <p style={{ margin: 0, fontSize: "0.72rem", lineHeight: 1.6, color: "var(--text-mid)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                      {msg.message}
                    </p>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontSize: "0.65rem" }}>
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(msg.createdAt))}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      disabled={deletingId === msg.id}
                      style={{
                        padding: "4px 10px", fontSize: "0.62rem", fontWeight: 700,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: "rgba(248,113,113,0.8)", border: "1px solid rgba(248,113,113,0.2)",
                        background: "rgba(248,113,113,0.06)", borderRadius: 2,
                        cursor: deletingId === msg.id ? "not-allowed" : "pointer",
                        opacity: deletingId === msg.id ? 0.4 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      {deletingId === msg.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
