"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const P = {
  surface: "var(--surface-card)",
  border: "var(--border-dim)",
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
} as const;

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

const STATUS_STYLES: Record<ArticleStatus, { label: string; color: string; bg: string; border: string }> = {
  DRAFT:     { label: "Draft",      color: P.textMuted, bg: "var(--border-faint)", border: "var(--border-dim)" },
  REVIEW:    { label: "In Review",  color: "#f59e0b",   bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)" },
  PUBLISHED: { label: "Published",  color: P.gold,      bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.25)" },
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.18rem 0.55rem",
      fontSize: "0.56rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      borderRadius: 3,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

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
    padding: "0.7rem 1rem",
    fontSize: "0.72rem",
    color: P.textMuted,
    borderBottom: "1px solid var(--surface-hover)",
    verticalAlign: "middle",
  };

  if (articles.length === 0) {
    return (
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "3rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border-dim)" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
        <p style={{ fontSize: "0.78rem", color: P.textMuted, margin: 0 }}>No articles yet</p>
        <Link href="/dashboard/articles/new" style={{ fontSize: "0.7rem", color: P.gold, marginTop: 4 }}>Create your first article →</Link>
      </div>
    );
  }

  return (
    <>
      {error && <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 3 }}>{error}</p>}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr style={{ background: "var(--surface-subtle)" }}>
                <th style={thStyle}>Title</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Image</th>
                <th style={thStyle}>Category</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                <th style={thStyle}>Author</th>
                <th style={{ ...thStyle, whiteSpace: "nowrap" }}>Date</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, idx) => (
                <tr key={article.id} style={{ background: idx % 2 === 0 ? "transparent" : "var(--surface-subtle)" }}>
                  <td style={{ ...tdStyle, color: P.textPrimary, maxWidth: 260 }}>
                    <p style={{ margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.74rem" }} title={article.title}>{article.title}</p>
                    {article.excerpt && <p style={{ margin: "0.2rem 0 0", fontSize: "0.6rem", color: P.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{article.excerpt}</p>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {article.coverImage
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={article.coverImage} alt="" style={{ width: 44, height: 30, objectFit: "cover", border: "1px solid var(--border-dim)" }} />
                      : <span style={{ color: "var(--text-5)", fontSize: "0.65rem" }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {article.category
                      ? <span style={{ fontSize: "0.64rem", padding: "0.15rem 0.45rem", background: "var(--border-faint)", border: "1px solid var(--border-dim)", borderRadius: 3 }}>{article.category}</span>
                      : <span style={{ color: "var(--text-5)", fontSize: "0.64rem" }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}><StatusBadge status={article.status} /></td>
                  <td style={tdStyle}><span style={{ whiteSpace: "nowrap" }}>{article.author}</span></td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(article.createdAt))}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                      <Link
                        href={`/dashboard/articles/${article.id}/preview`}
                        target="_blank"
                        style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-lo)", background: "var(--surface-hover)", border: "1px solid var(--border-dim)", borderRadius: 3, textDecoration: "none" }}
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/dashboard/articles/${article.id}`}
                        style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: P.gold, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, textDecoration: "none" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deletingId === article.id}
                        style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 3, cursor: "pointer", opacity: deletingId === article.id ? 0.5 : 1 }}
                      >
                        {deletingId === article.id ? "…" : "Delete"}
                      </button>
                    </div>
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
