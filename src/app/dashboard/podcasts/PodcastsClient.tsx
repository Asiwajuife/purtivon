"use client";
import { useState } from "react";

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
  "FDI Intelligence", "Financial Services", "Investment",
  "Awards", "Interview", "Analysis", "ESG", "Technology", "General",
];

const BLANK: Omit<Podcast, "id" | "videoId"> = {
  title: "", description: "", youtubeUrl: "", thumbnail: "", category: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

// ── Style tokens ──────────────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "var(--text-hi)",
  fontSize: "0.82rem",
  padding: "0.52rem 0.75rem",
  outline: "none",
  borderRadius: 4,
  boxSizing: "border-box",
};

const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: "0.55rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  marginBottom: "0.38rem",
};

// ── Main component ────────────────────────────────────────────────────────────

interface Props { initialPodcasts: Podcast[] }

export default function PodcastsClient({ initialPodcasts }: Props) {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [editing, setEditing]   = useState<Podcast | null>(null);
  const [adding, setAdding]     = useState(false);
  const [form, setForm]         = useState<typeof BLANK>(BLANK);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  function openAdd() {
    setForm({ ...BLANK, publishedAt: new Date().toISOString().slice(0, 10) });
    setEditing(null);
    setAdding(true);
    setError(null);
  }

  function openEdit(p: Podcast) {
    setForm({
      title: p.title, description: p.description ?? "",
      youtubeUrl: p.youtubeUrl, thumbnail: p.thumbnail ?? "",
      category: p.category ?? "", publishedAt: p.publishedAt.slice(0, 10),
    });
    setEditing(p);
    setAdding(false);
    setError(null);
  }

  function closeForm() { setAdding(false); setEditing(null); setError(null); }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.title.trim())      { setError("Title is required.");       return; }
    if (!form.youtubeUrl.trim()) { setError("YouTube URL is required."); return; }
    setSaving(true); setError(null);
    try {
      const body = {
        title:       form.title.trim(),
        description: form.description?.trim() || null,
        youtubeUrl:  form.youtubeUrl.trim(),
        thumbnail:   form.thumbnail?.trim() || null,
        category:    form.category?.trim() || null,
        publishedAt: form.publishedAt || null,
      };
      if (adding) {
        const res  = await fetch("/api/podcasts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed to create podcast."); return; }
        setPodcasts(prev => [data, ...prev]);
      } else if (editing) {
        const res  = await fetch(`/api/podcasts/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed to update podcast."); return; }
        setPodcasts(prev => prev.map(p => p.id === editing.id ? data : p));
      }
      closeForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this episode? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/podcasts/${id}`, { method: "DELETE" });
      setPodcasts(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      {/* ── Top action row ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={openAdd}
          style={{
            padding: "0.44rem 1rem", fontSize: "0.67rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#07070c", border: "none", borderRadius: 5, cursor: "pointer",
          }}
        >
          + Add Episode
        </button>
      </div>

      {/* ── Modal ── */}
      {(adding || editing) && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(4,6,18,0.82)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}>
          <div style={{
            background: "#0d0d14", border: "1px solid rgba(255,255,255,0.09)",
            width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
            borderRadius: 10, boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <span style={{ display: "block", fontSize: "0.54rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.18rem" }}>
                  {adding ? "New" : "Edit"}
                </span>
                <h2 style={{ fontSize: "0.92rem", fontWeight: 500, color: "var(--text-hi)", margin: 0 }}>
                  {adding ? "Add Episode" : "Edit Episode"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)", cursor: "pointer", borderRadius: 5, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelSt}>Title <span style={{ color: "#c9a84c" }}>*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Episode title" style={inputSt} />
              </div>
              <div>
                <label style={labelSt}>YouTube URL <span style={{ color: "#c9a84c" }}>*</span></label>
                <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=…" style={inputSt} />
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", marginTop: "0.3rem" }}>
                  Thumbnail is auto-generated from YouTube if not provided
                </p>
              </div>
              <div>
                <label style={labelSt}>Thumbnail URL (optional)</label>
                <input name="thumbnail" value={form.thumbnail ?? ""} onChange={handleChange} placeholder="https://…" style={inputSt} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div>
                  <label style={labelSt}>Category</label>
                  <select name="category" value={form.category ?? ""} onChange={handleChange} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Publish Date</label>
                  <input name="publishedAt" type="date" value={form.publishedAt} onChange={handleChange} style={inputSt} />
                </div>
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <textarea name="description" value={form.description ?? ""} onChange={handleChange} placeholder="Brief episode description…" rows={3} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
              </div>

              {error && (
                <p style={{ fontSize: "0.76rem", color: "#f87171", padding: "0.65rem 0.85rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 5, margin: 0 }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "0.65rem", paddingTop: "0.25rem" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1, background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070c", border: "none", padding: "0.62rem", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, borderRadius: 5 }}
                >
                  {saving ? "Saving…" : (adding ? "Create Episode" : "Save Changes")}
                </button>
                <button
                  onClick={closeForm}
                  style={{ padding: "0.62rem 1.25rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", cursor: "pointer", borderRadius: 5 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Episode list ── */}
      {podcasts.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8,
          background: "rgba(255,255,255,0.012)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", margin: 0 }}>No episodes yet</p>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", margin: 0 }}>Click &quot;Add Episode&quot; to publish your first podcast</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
          {podcasts.map((p, i) => (
            <div
              key={p.id}
              className="pod-row"
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "0.85rem 1.25rem",
                borderBottom: i < podcasts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 80, height: 46, flexShrink: 0, borderRadius: 5, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnail ?? `https://img.youtube.com/vi/${p.videoId}/mqdefault.jpg`}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.8rem", color: "var(--text-hi)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                  {p.title}
                </p>
                <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem", alignItems: "center" }}>
                  {p.category && (
                    <span style={{ fontSize: "0.57rem", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 3, padding: "0.12rem 0.45rem" }}>
                      {p.category}
                    </span>
                  )}
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>
                    {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.45rem", flexShrink: 0 }}>
                <a
                  href={p.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.26rem 0.65rem", borderRadius: 4, textDecoration: "none" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                  </svg>
                  Watch
                </a>
                <button
                  onClick={() => openEdit(p)}
                  style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", padding: "0.26rem 0.65rem", cursor: "pointer", borderRadius: 4 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.14)", padding: "0.26rem 0.65rem", cursor: "pointer", borderRadius: 4, opacity: deleting === p.id ? 0.5 : 1 }}
                >
                  {deleting === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.pod-row:hover { background: rgba(255,255,255,0.018) !important; }`}</style>
    </>
  );
}
