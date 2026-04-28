"use client";
import { useState } from "react";

const P = {
  surface: "var(--surface-card)",
  border: "var(--border-dim)",
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
} as const;

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string | null;
  category: string | null;
  publishedAt: string;
}

const CATEGORY_OPTIONS = [
  "FDI Intelligence",
  "Financial Services",
  "Investment",
  "Awards",
  "Interview",
  "Analysis",
  "ESG",
  "Technology",
  "General",
];

const BLANK: Omit<Podcast, "id" | "videoId"> = {
  title: "",
  description: "",
  youtubeUrl: "",
  thumbnail: "",
  category: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

const input: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-hover)",
  border: "1px solid var(--border-dim)",
  color: P.textPrimary,
  fontSize: "0.82rem",
  padding: "0.6rem 0.75rem",
  outline: "none",
  borderRadius: 2,
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: P.textMuted,
  marginBottom: "0.35rem",
};

interface Props {
  initialPodcasts: Podcast[];
}

export default function PodcastsClient({ initialPodcasts }: Props) {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [editing, setEditing] = useState<Podcast | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<typeof BLANK>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openAdd() {
    setForm({ ...BLANK, publishedAt: new Date().toISOString().slice(0, 10) });
    setEditing(null);
    setAdding(true);
    setError(null);
  }

  function openEdit(p: Podcast) {
    setForm({
      title: p.title,
      description: p.description ?? "",
      youtubeUrl: p.youtubeUrl,
      thumbnail: p.thumbnail ?? "",
      category: p.category ?? "",
      publishedAt: p.publishedAt.slice(0, 10),
    });
    setEditing(p);
    setAdding(false);
    setError(null);
  }

  function closeForm() {
    setAdding(false);
    setEditing(null);
    setError(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.youtubeUrl.trim()) { setError("YouTube URL is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        youtubeUrl: form.youtubeUrl.trim(),
        thumbnail: form.thumbnail?.trim() || null,
        category: form.category?.trim() || null,
        publishedAt: form.publishedAt || null,
      };

      if (adding) {
        const res = await fetch("/api/podcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed to create podcast."); return; }
        setPodcasts((prev) => [data, ...prev]);
      } else if (editing) {
        const res = await fetch(`/api/podcasts/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed to update podcast."); return; }
        setPodcasts((prev) => prev.map((p) => p.id === editing.id ? data : p));
      }
      closeForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this podcast? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
      setPodcasts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ padding: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1rem", fontWeight: 500, color: P.textPrimary, letterSpacing: "0.04em" }}>Podcasts</h1>
          <p style={{ fontSize: "0.72rem", color: P.textMuted, marginTop: 2 }}>{podcasts.length} episode{podcasts.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: P.gold, color: "var(--surface-page)", border: "none", padding: "0.5rem 1rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}
        >
          + Add Episode
        </button>
      </div>

      {/* Form modal */}
      {(adding || editing) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: P.surface, border: `1px solid ${P.border}`, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", borderRadius: 4 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 500, color: P.textPrimary }}>{adding ? "Add Episode" : "Edit Episode"}</h2>
              <button onClick={closeForm} style={{ background: "none", border: "none", color: P.textMuted, cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={label}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Episode title" style={input} />
              </div>
              <div>
                <label style={label}>YouTube URL *</label>
                <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." style={input} />
                <p style={{ fontSize: "0.65rem", color: P.textMuted, marginTop: "0.3rem" }}>Thumbnail will be auto-generated if left blank</p>
              </div>
              <div>
                <label style={label}>Thumbnail URL (optional)</label>
                <input name="thumbnail" value={form.thumbnail ?? ""} onChange={handleChange} placeholder="https://..." style={input} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={label}>Category</label>
                  <select name="category" value={form.category ?? ""} onChange={handleChange} style={{ ...input, cursor: "pointer" }}>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Publish Date</label>
                  <input name="publishedAt" type="date" value={form.publishedAt} onChange={handleChange} style={input} />
                </div>
              </div>
              <div>
                <label style={label}>Description</label>
                <textarea name="description" value={form.description ?? ""} onChange={handleChange} placeholder="Brief episode description..." rows={3} style={{ ...input, resize: "vertical" }} />
              </div>
              {error && (
                <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 0.85rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 2 }}>
                  {error}
                </p>
              )}
              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1, background: P.gold, color: "var(--surface-page)", border: "none", padding: "0.65rem", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, borderRadius: 2 }}
                >
                  {saving ? "Saving…" : (adding ? "Create Episode" : "Save Changes")}
                </button>
                <button
                  onClick={closeForm}
                  style={{ padding: "0.65rem 1.25rem", background: "none", border: `1px solid ${P.border}`, color: P.textMuted, fontSize: "0.72rem", cursor: "pointer", borderRadius: 2 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podcast list */}
      {podcasts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", border: `1px solid ${P.border}`, borderRadius: 4, color: P.textMuted }}>
          <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>No episodes yet</p>
          <p style={{ fontSize: "0.72rem" }}>Click &quot;Add Episode&quot; to publish your first podcast.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {podcasts.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4 }}>
              {/* Thumbnail */}
              <div style={{ width: 80, height: 45, flexShrink: 0, background: "var(--border-faint)", borderRadius: 2, overflow: "hidden" }}>
                <img
                  src={p.thumbnail ?? `https://img.youtube.com/vi/${p.videoId}/mqdefault.jpg`}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.82rem", color: P.textPrimary, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: 2 }}>
                  {p.category && (
                    <span style={{ fontSize: "0.62rem", color: P.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.category}</span>
                  )}
                  <span style={{ fontSize: "0.62rem", color: P.textMuted }}>
                    {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <a
                  href={p.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.65rem", color: P.textMuted, border: `1px solid ${P.border}`, padding: "0.3rem 0.6rem", borderRadius: 2, textDecoration: "none" }}
                >
                  ▶ Watch
                </a>
                <button
                  onClick={() => openEdit(p)}
                  style={{ fontSize: "0.65rem", color: P.textMuted, background: "none", border: `1px solid ${P.border}`, padding: "0.3rem 0.6rem", cursor: "pointer", borderRadius: 2 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  style={{ fontSize: "0.65rem", color: "#f87171", background: "none", border: "1px solid rgba(248,113,113,0.2)", padding: "0.3rem 0.6rem", cursor: "pointer", borderRadius: 2, opacity: deleting === p.id ? 0.5 : 1 }}
                >
                  {deleting === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
