"use client";
import { useState } from "react";
import Link from "next/link";

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Pending"  },
  APPROVED: { color: "#34d399", bg: "rgba(52,211,153,0.1)",  label: "Approved" },
  REJECTED: { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Rejected" },
};

const SUBJECT_LABELS: Record<string, string> = {
  "award-nomination": "Award Nomination",
  "media-pr":         "Media & PR",
  "fdi-intelligence": "FDI Intelligence",
  "general":          "General Enquiry",
};

interface Submission {
  id: string;
  companyName: string;
  status: string;
  createdAt: string;
  award: { title: string };
  user?: { name: string | null; email: string };
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

interface Props {
  initialSubmissions: Submission[];
  initialMessages: Message[];
  isAdmin: boolean;
}

function DeleteBtn({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      style={{
        padding: "3px 9px",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(248,113,113,0.8)",
        border: "1px solid rgba(248,113,113,0.2)",
        background: "rgba(248,113,113,0.06)",
        borderRadius: 2,
        cursor: busy ? "not-allowed" : "pointer",
        opacity: busy ? 0.4 : 1,
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {busy ? "…" : "Delete"}
    </button>
  );
}

export default function DashboardRecentClient({ initialSubmissions, initialMessages, isAdmin }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [messages, setMessages] = useState(initialMessages);
  const [deletingSubId, setDeletingSubId] = useState<string | null>(null);
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);

  async function deleteSubmission(id: string, name: string) {
    if (!confirm(`Delete submission from "${name}"? This cannot be undone.`)) return;
    setDeletingSubId(id);
    await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    setDeletingSubId(null);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  }

  async function deleteMessage(id: string, name: string) {
    if (!confirm(`Delete message from "${name}"? This cannot be undone.`)) return;
    setDeletingMsgId(id);
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setDeletingMsgId(null);
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  return (
    <>
      {/* Recent Submissions */}
      {submissions.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-4)", flexShrink: 0 }}>Recent Submissions</span>
              <div style={{ width: 120, height: 1, background: "var(--border-faint)" }} />
            </div>
            <Link href="/dashboard/submissions" style={{ fontSize: "0.7rem", color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              View All →
            </Link>
          </div>
          <div style={{ border: "1px solid var(--border-faint)", background: "var(--surface-subtle)" }}>
            {submissions.map((sub, i) => {
              const s = STATUS_STYLES[sub.status] ?? STATUS_STYLES.PENDING;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.85rem 1.25rem",
                    borderTop: i > 0 ? "1px solid var(--border-faint)" : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-mid)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.companyName}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.award.title}{isAdmin && sub.user ? ` · ${sub.user.name ?? sub.user.email}` : ""}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.color, background: s.bg, padding: "0.2rem 0.6rem", flexShrink: 0 }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-4)", flexShrink: 0, minWidth: 60, textAlign: "right" }}>
                    {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  {isAdmin && (
                    <DeleteBtn onClick={() => deleteSubmission(sub.id, sub.companyName)} busy={deletingSubId === sub.id} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Messages — admin only */}
      {isAdmin && messages.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-4)", flexShrink: 0 }}>Recent Messages</span>
              <div style={{ width: 120, height: 1, background: "var(--border-faint)" }} />
            </div>
            <Link href="/dashboard/messages" style={{ fontSize: "0.7rem", color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              View All →
            </Link>
          </div>
          <div style={{ border: "1px solid var(--border-faint)", background: "var(--surface-subtle)" }}>
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.85rem 1.25rem",
                  borderTop: i > 0 ? "1px solid var(--border-faint)" : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-mid)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.name}
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {SUBJECT_LABELS[msg.subject] ?? msg.subject} · <span style={{ color: "var(--gold-dim)" }}>{msg.email}</span>
                  </p>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-4)", flexShrink: 0, minWidth: 60, textAlign: "right" }}>
                  {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                <DeleteBtn onClick={() => deleteMessage(msg.id, msg.name)} busy={deletingMsgId === msg.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
