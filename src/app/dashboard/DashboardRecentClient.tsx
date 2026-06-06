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
        color: "rgba(248,113,113,0.7)",
        border: "1px solid rgba(248,113,113,0.15)",
        background: "rgba(248,113,113,0.05)",
        borderRadius: 4,
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

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
          {title}
        </span>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", width: 64 }} />
      </div>
      <Link href={href} style={{ fontSize: "0.62rem", color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, opacity: 0.8 }} className="recent-viewall">
        View All
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
      </Link>
    </div>
  );
}

function TableColHeaders({ cols }: { cols: string[] }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "0.5rem 1.25rem",
      background: "rgba(255,255,255,0.02)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      {cols.map((col, i) => (
        <span key={col} style={{
          fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.22)",
          flex: i === 0 ? 1 : undefined,
          minWidth: i === 0 ? 0 : undefined,
          flexShrink: i > 0 ? 0 : undefined,
        }}>
          {col}
        </span>
      ))}
    </div>
  );
}

export default function DashboardRecentClient({ initialSubmissions, initialMessages, isAdmin }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [messages, setMessages]       = useState(initialMessages);
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
          <SectionHeader title="Recent Submissions" href="/dashboard/submissions" />
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)", borderRadius: 10, overflow: "hidden" }}>
            <TableColHeaders cols={isAdmin
              ? ["Company · Award", "Submitted By", "Status", "Date", ...(isAdmin ? [""] : [])]
              : ["Company · Award", "Status", "Date"]
            } />
            {submissions.map((sub, i) => {
              const s = STATUS_STYLES[sub.status] ?? STATUS_STYLES.PENDING;
              return (
                <div
                  key={sub.id}
                  className="recent-row"
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "0.82rem 1.25rem",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0, boxShadow: `0 0 5px ${s.color}60` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.76rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "0.14rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.companyName}
                    </p>
                    <p style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.28)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.award.title}
                    </p>
                  </div>
                  {isAdmin && sub.user && (
                    <p style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.32)", flexShrink: 0, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.user.name ?? sub.user.email}
                    </p>
                  )}
                  <span style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: s.color, background: s.bg, padding: "3px 8px", borderRadius: 4, flexShrink: 0, border: `1px solid ${s.color}25` }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.26)", flexShrink: 0, minWidth: 54, textAlign: "right" }}>
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
          <SectionHeader title="Recent Messages" href="/dashboard/messages" />
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)", borderRadius: 10, overflow: "hidden" }}>
            <TableColHeaders cols={["From · Email", "Subject", "Date", ""]} />
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className="recent-row"
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.82rem 1.25rem",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(201,168,76,0.45)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.76rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: "0.14rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.name}
                  </p>
                  <p style={{ fontSize: "0.63rem", color: "rgba(201,168,76,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.email}
                  </p>
                </div>
                <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", flexShrink: 0, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {SUBJECT_LABELS[msg.subject] ?? msg.subject}
                </span>
                <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.26)", flexShrink: 0, minWidth: 54, textAlign: "right" }}>
                  {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                <DeleteBtn onClick={() => deleteMessage(msg.id, msg.name)} busy={deletingMsgId === msg.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .recent-row:hover { background: rgba(255,255,255,0.018) !important; }
        .recent-viewall:hover { opacity: 1 !important; }
      `}</style>
    </>
  );
}
