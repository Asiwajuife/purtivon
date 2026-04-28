"use client";
import { useState } from "react";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Award { id: string; title: string; category: string; year: number; }
interface Submission {
  id: string; companyName: string; contactName: string; contactEmail: string;
  status: SubmissionStatus; createdAt: string; award: Award;
  user?: { id: string; name: string; email: string };
}
interface SubmissionTableProps {
  submissions: Submission[];
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: SubmissionStatus) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const STATUS: Record<SubmissionStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
  PENDING:  { label: "Pending",  bg: "rgba(234,179,8,0.07)",    text: "rgba(234,179,8,0.85)",    dot: "#eab308", border: "rgba(234,179,8,0.18)"   },
  APPROVED: { label: "Approved", bg: "rgba(52,211,153,0.07)",   text: "rgba(52,211,153,0.85)",   dot: "#34d399", border: "rgba(52,211,153,0.18)"  },
  REJECTED: { label: "Rejected", bg: "rgba(248,113,113,0.07)",  text: "rgba(248,113,113,0.80)",  dot: "#f87171", border: "rgba(248,113,113,0.18)" },
};

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const s = STATUS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", border: `1px solid ${s.border}`,
      background: s.bg, borderRadius: 2,
      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em",
      textTransform: "uppercase", color: s.text, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type Filter = typeof FILTERS[number];

export default function SubmissionTable({ submissions, isAdmin = false, onStatusChange, onDelete }: SubmissionTableProps) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "ALL" ? submissions : submissions.filter(s => s.status === filter);

  async function handleStatusChange(id: string, status: SubmissionStatus) {
    if (!onStatusChange) return;
    setUpdatingId(id);
    try { await onStatusChange(id, status); } finally { setUpdatingId(null); }
  }

  async function handleDelete(id: string, companyName: string) {
    if (!onDelete) return;
    if (!confirm(`Delete submission from "${companyName}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try { await onDelete(id); } catch { /* error surfaced by parent */ } finally { setDeletingId(null); }
  }

  if (submissions.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "5rem 2rem", border: "1px solid var(--border-faint)",
        background: "var(--surface-subtle)", textAlign: "center",
      }}>
        <div style={{
          width: 44, height: 44, border: "1px solid var(--border-dim)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "1.25rem",
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-5)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <p style={{ fontFamily: "var(--font-serif, serif)", fontSize: "1.2rem", fontWeight: 300, color: "var(--text-4)", marginBottom: "0.4rem" }}>
          No submissions yet
        </p>
        <p style={{ fontSize: "0.72rem", color: "var(--text-5)", letterSpacing: "0.08em" }}>
          Submissions will appear here once entries are made.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const count = f === "ALL" ? submissions.length : submissions.filter(s => s.status === f).length;
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px",
              border: active ? "1px solid rgba(201,168,76,0.3)" : "1px solid var(--border-faint)",
              background: active ? "rgba(201,168,76,0.08)" : "var(--surface-subtle)",
              borderRadius: 2, cursor: "pointer",
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: active ? "#c9a84c" : "var(--text-4)",
              transition: "all 0.15s ease",
            }}>
              {f === "ALL" ? "All" : STATUS[f as SubmissionStatus].label}
              <span style={{
                fontSize: "0.6rem", fontWeight: 700,
                padding: "1px 6px", borderRadius: 2,
                background: active ? "rgba(201,168,76,0.15)" : "var(--border-faint)",
                color: active ? "#c9a84c" : "var(--text-5)",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table header (desktop) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isAdmin && (onStatusChange || onDelete)
          ? "1fr 1.2fr auto auto auto auto"
          : "1fr 1.2fr auto auto auto",
        gap: "0 1.5rem", alignItems: "center",
        padding: "0 1.25rem",
        borderBottom: "1px solid var(--border-faint)",
        paddingBottom: "0.6rem",
      }} className="submission-header">
        {["Company", "Award", "Category", "Status", "Date", ...(isAdmin && (onStatusChange || onDelete) ? ["Actions"] : [])].map(col => (
          <span key={col} style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--text-5)",
          }}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <div style={{ padding: "3rem 1.25rem", textAlign: "center", color: "var(--text-5)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          No {filter.toLowerCase()} submissions
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map(s => {
            const isExpanded = expandedId === s.id;
            const isUpdating = updatingId === s.id;
            return (
              <div key={s.id} style={{
                border: "1px solid var(--border-faint)",
                background: isExpanded ? "var(--surface-hover)" : "var(--surface-subtle)",
                transition: "background 0.15s ease",
              }}>
                {/* Main row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isAdmin && (onStatusChange || onDelete)
                      ? "1fr 1.2fr auto auto auto auto"
                      : "1fr 1.2fr auto auto auto",
                    gap: "0 1.5rem", alignItems: "center",
                    padding: "0.9rem 1.25rem",
                    cursor: "pointer",
                  }}
                  className="submission-row"
                >
                  {/* Company */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-hi)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.companyName}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text-4)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.contactName} · {s.contactEmail}
                    </p>
                  </div>

                  {/* Award */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-mid)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.award.title}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-5)", marginTop: 2 }}>
                      {s.award.year}
                    </p>
                  </div>

                  {/* Category */}
                  <span style={{
                    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "#c9a84c", background: "rgba(201,168,76,0.08)",
                    padding: "3px 8px", whiteSpace: "nowrap",
                    border: "1px solid rgba(201,168,76,0.12)",
                  }}>
                    {s.award.category}
                  </span>

                  {/* Status */}
                  <StatusBadge status={s.status} />

                  {/* Date */}
                  <span style={{ fontSize: "0.7rem", color: "var(--text-4)", whiteSpace: "nowrap" }}>
                    {formatDate(s.createdAt)}
                  </span>

                  {/* Actions */}
                  {isAdmin && (onStatusChange || onDelete) && (
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {onStatusChange && s.status === "PENDING" && (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); handleStatusChange(s.id, "APPROVED"); }}
                            disabled={isUpdating || deletingId === s.id}
                            style={{
                              padding: "5px 12px", fontSize: "0.62rem", fontWeight: 700,
                              letterSpacing: "0.14em", textTransform: "uppercase",
                              color: "rgba(52,211,153,0.85)", border: "1px solid rgba(52,211,153,0.2)",
                              background: "rgba(52,211,153,0.06)", cursor: isUpdating ? "not-allowed" : "pointer",
                              opacity: isUpdating ? 0.4 : 1, transition: "all 0.15s", borderRadius: 2,
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleStatusChange(s.id, "REJECTED"); }}
                            disabled={isUpdating || deletingId === s.id}
                            style={{
                              padding: "5px 12px", fontSize: "0.62rem", fontWeight: 700,
                              letterSpacing: "0.14em", textTransform: "uppercase",
                              color: "rgba(248,113,113,0.8)", border: "1px solid rgba(248,113,113,0.2)",
                              background: "rgba(248,113,113,0.06)", cursor: isUpdating ? "not-allowed" : "pointer",
                              opacity: isUpdating ? 0.4 : 1, transition: "all 0.15s", borderRadius: 2,
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {onDelete && (
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(s.id, s.companyName); }}
                          disabled={isUpdating || deletingId === s.id}
                          style={{
                            padding: "5px 12px", fontSize: "0.62rem", fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: "rgba(248,113,113,0.7)", border: "1px solid rgba(248,113,113,0.15)",
                            background: "rgba(248,113,113,0.05)", cursor: deletingId === s.id ? "not-allowed" : "pointer",
                            opacity: deletingId === s.id ? 0.4 : 1, transition: "all 0.15s", borderRadius: 2,
                          }}
                        >
                          {deletingId === s.id ? "…" : "Delete"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{
                    borderTop: "1px solid var(--border-faint)",
                    padding: "1rem 1.25rem 1.25rem",
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: 5 }}>Contact Email</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-lo)" }}>{s.contactEmail}</p>
                    </div>
                    {isAdmin && s.user && (
                      <div>
                        <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: 5 }}>Account</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-lo)" }}>{s.user.name}</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--text-4)", marginTop: 2 }}>{s.user.email}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: 5 }}>Submission ID</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-4)", fontFamily: "monospace" }}>{s.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: 5 }}>Submitted</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-lo)" }}>{formatDate(s.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .submission-header { display: none !important; }
          .submission-row {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto;
          }
          .submission-row > *:nth-child(3),
          .submission-row > *:nth-child(5) { display: none; }
          .submission-row > *:nth-child(4) { grid-row: 1; }
          .submission-row > *:nth-child(6) { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  );
}
