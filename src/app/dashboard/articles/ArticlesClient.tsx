"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ArticleStatus = "DRAFT" | "REVIEW" | "PUBLISHED";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: ArticleStatus;
  category: string | null;
  author: string | null;
  createdAt: string;
}

const STATUS_CFG: Record<ArticleStatus, { label: string; color: string; bg: string; border: string }> = {
  DRAFT:     { label: "Draft",      color: "rgba(255,255,255,0.4)",  bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" },
  REVIEW:    { label: "In Review",  color: "#f59e0b",                bg: "rgba(245,158,11,0.09)",  border: "rgba(245,158,11,0.22)" },
  PUBLISHED: { label: "Published",  color: "#c9a84c",                bg: "rgba(201,168,76,0.09)",  border: "rgba(201,168,76,0.22)" },
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.2rem 0.6rem", fontSize: "0.54rem", fontWeight: 700,
      letterSpacing: "0.14em", textTransform: "uppercase",
      borderRadius: 4, background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

const th: React.CSSProperties = {
  padding: "0.62rem 1rem",
  fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.28)",
  textAlign: "left",
  background: "rgba(255,255,255,0.02)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "0.88rem 1rem",
  fontSize: "0.75rem", color: "rgba(255,255,255,0.48)",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "middle",
};

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError("");
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Delete failed."); return; }
    router.refresh();
  }

  if (articles.length === 0) {
    return (
      <div style={{
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8,
        padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
        background: "rgba(255,255,255,0.012)",
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
        </div>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>No articles yet</p>
        <Link href="/dashboard/articles/new" style={{ fontSize: "0.68rem", color: "#c9a84c", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          Create your first article
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p style={{ fontSize: "0.76rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 6, margin: 0 }}>
          {error}
        </p>
      )}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr>
                <th style={th}>Title</th>
                <th style={{ ...th, textAlign: "center", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>Cover</th>
                <th style={th}>Category</th>
                <th style={{ ...th, textAlign: "center" }}>Status</th>
                <th style={th}>Author</th>
                <th style={{ ...th, whiteSpace: "nowrap" }}>Date</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="art-row">
                  {/* Title + excerpt */}
                  <td style={{ ...td, color: "rgba(255,255,255,0.82)", maxWidth: 280 }}>
                    <p style={{ margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.76rem", color: "var(--text-hi)" }}>
                      {a.title}
                    </p>
                    {a.excerpt && (
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.excerpt}
                      </p>
                    )}
                  </td>

                  {/* Cover thumbnail */}
                  <td style={{ ...td, textAlign: "center", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                    {a.coverImage
                      ? /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={a.coverImage} alt="" style={{ width: 52, height: 34, objectFit: "cover", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", display: "block", margin: "0 auto" }} />
                      : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>—</span>
                    }
                  </td>

                  {/* Category */}
                  <td style={td}>
                    {a.category
                      ? <span style={{ fontSize: "0.6rem", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 3, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{a.category}</span>
                      : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>—</span>
                    }
                  </td>

                  {/* Status */}
                  <td style={{ ...td, textAlign: "center" }}>
                    <StatusBadge status={a.status} />
                  </td>

                  {/* Author */}
                  <td style={td}>
                    <span style={{ whiteSpace: "nowrap", fontSize: "0.72rem" }}>{a.author}</span>
                  </td>

                  {/* Date */}
                  <td style={{ ...td, whiteSpace: "nowrap", fontSize: "0.7rem" }}>
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(a.createdAt))}
                  </td>

                  {/* Actions */}
                  <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                      <Link
                        href={`/dashboard/articles/${a.id}/preview`}
                        target="_blank"
                        style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        Preview
                      </Link>
                      <Link
                        href={`/dashboard/articles/${a.id}`}
                        style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        disabled={deletingId === a.id}
                        style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.14)", borderRadius: 4, cursor: deletingId === a.id ? "not-allowed" : "pointer", opacity: deletingId === a.id ? 0.5 : 1, display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        {deletingId === a.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .art-row:hover td { background: rgba(255,255,255,0.018) !important; }
        .art-row:last-child td { border-bottom: none !important; }
      `}</style>
    </>
  );
}
