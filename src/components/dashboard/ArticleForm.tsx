"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Load TipTap editor client-side only (it uses browser APIs)
const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: 380,
      border: "1px solid var(--border-dim)",
      borderRadius: 4,
      background: "var(--surface-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-4)" }}>Loading editor…</span>
    </div>
  ),
});

const P = {
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
} as const;

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

type ArticleStatus = "DRAFT" | "REVIEW" | "PUBLISHED";

interface ArticleFormProps {
  categories: Category[];
  tags: Tag[];
  authorId: string;
  initial?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: object | null;
    coverImage: string | null;
    categoryIds: string[];
    readTime: number | null;
    status: ArticleStatus;
    tagIds: string[];
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.58rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: P.textMuted,
  marginBottom: "0.4rem",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border-dim)",
  color: P.textPrimary,
  fontSize: "0.82rem",
  padding: "0.6rem 0.85rem",
  width: "100%",
  outline: "none",
  borderRadius: 3,
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};

const btnPrimary: React.CSSProperties = {
  padding: "0.6rem 1.4rem",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
  color: "var(--surface-page)",
  border: "none",
  borderRadius: 3,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const btnOutline: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  background: "transparent",
  color: P.textMuted,
  border: "1px solid var(--border-dim)",
  borderRadius: 3,
  cursor: "pointer",
  whiteSpace: "nowrap",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string; bg: string; border: string }> = {
  DRAFT:     { label: "Draft",      color: P.textMuted, bg: "var(--surface-hover)", border: "var(--border-dim)" },
  REVIEW:    { label: "In Review",  color: "#f59e0b",   bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.25)" },
  PUBLISHED: { label: "Published",  color: P.gold,      bg: "rgba(201,168,76,0.06)",  border: "rgba(201,168,76,0.25)" },
};

export default function ArticleForm({ categories, tags, authorId, initial }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState<object | null>(initial?.content ?? null);
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initial?.categoryIds ?? []);
  const [readTime, setReadTime] = useState(initial?.readTime?.toString() ?? "");
  const [status, setStatus] = useState<ArticleStatus>(initial?.status ?? "DRAFT");
  const [selectedTags, setSelectedTags] = useState<string[]>(initial?.tagIds ?? []);
  const [slugManual, setSlugManual] = useState(isEdit);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleContentChange = useCallback((json: object) => setContent(json), []);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugManual) setSlug(slugify(v));
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setUploadError(data.error ?? "Upload failed."); return; }
    setCoverImage(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content ?? { type: "doc", content: [] },
      coverImage: coverImage || null,
      categories: selectedCategories,
      readTime: readTime ? parseInt(readTime, 10) : null,
      status,
      tags: selectedTags,
    };

    const url = isEdit ? `/api/admin/articles/${initial!.id}` : "/api/admin/articles";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
    router.push("/dashboard/articles");
    router.refresh();
  }

  const currentStatus = STATUS_CONFIG[status];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 900 }}>

      {/* Title */}
      <div>
        <label style={labelStyle}>Title <span style={{ color: P.gold }}>*</span></label>
        <input
          style={{ ...inputStyle, fontSize: "1.05rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label style={labelStyle}>Slug <span style={{ color: P.gold }}>*</span></label>
        <input
          style={inputStyle}
          value={slug}
          onChange={(e) => { setSlugManual(true); setSlug(slugify(e.target.value)); }}
          placeholder="auto-generated-from-title"
          required
        />
        <p style={{ fontSize: "0.62rem", color: "var(--text-4)", marginTop: 4 }}>
          URL: /insights/{slug || "…"}
          {!slugManual && <span style={{ marginLeft: 8, color: "rgba(201,168,76,0.5)" }}>Auto-generated</span>}
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label style={labelStyle}>
          Excerpt{" "}
          <span style={{ color: "var(--text-4)", fontWeight: 400, letterSpacing: "0.05em", textTransform: "none" }}>
            (shown on cards)
          </span>
        </label>
        <textarea
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown in article cards and search results…"
          rows={3}
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label style={labelStyle}>Content</label>
        <RichTextEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Write your article… Use the toolbar to add headings, lists, images, and more."
        />
      </div>

      {/* Cover Image */}
      <div>
        <label style={labelStyle}>Cover Image</label>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt="Cover preview"
              style={{ width: 120, height: 80, objectFit: "cover", border: "1px solid var(--border-dim)", borderRadius: 3, flexShrink: 0 }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ ...btnOutline, opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? "Uploading…" : coverImage ? "Replace Image" : "Upload Image"}
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                style={{ ...btnOutline, fontSize: "0.62rem", padding: "0.35rem 0.8rem", color: "#f87171", borderColor: "rgba(248,113,113,0.2)" }}
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverUpload} />
        </div>
        {uploadError && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: 6 }}>{uploadError}</p>}
        {!coverImage && (
          <div style={{ marginTop: "0.5rem" }}>
            <input
              style={{ ...inputStyle, fontSize: "0.75rem" }}
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste an image URL directly"
            />
          </div>
        )}
      </div>

      {/* Categories multi-select */}
      {categories.length > 0 && (
        <div>
          <label style={labelStyle}>
            Categories
            {selectedCategories.length > 0 && (
              <span style={{ marginLeft: 8, color: P.gold, fontWeight: 400, letterSpacing: "0.05em", textTransform: "none" }}>
                {selectedCategories.length} selected
              </span>
            )}
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {categories.map((c) => {
              const active = selectedCategories.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCategory(c.id)}
                  style={{
                    padding: "0.25rem 0.7rem",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: 3,
                    cursor: "pointer",
                    background: active ? "rgba(201,168,76,0.12)" : "var(--surface-hover)",
                    color: active ? P.gold : P.textMuted,
                    border: `1px solid ${active ? "rgba(201,168,76,0.3)" : "var(--border-dim)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {active && <span style={{ marginRight: 4 }}>✓</span>}
                  {c.name}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: "0.6rem", color: "var(--text-4)", marginTop: 4 }}>
            The first selected category is used for filtering on the homepage.
          </p>
        </div>
      )}

      {/* Read Time + Status row */}
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Read Time (min)</label>
          <input
            type="number"
            min={1}
            max={60}
            style={inputStyle}
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="5"
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={{
              ...inputStyle,
              cursor: "pointer",
              color: currentStatus.color,
              borderColor: currentStatus.border,
              background: currentStatus.bg,
              fontWeight: 500,
            }}
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
          >
            {(Object.keys(STATUS_CONFIG) as ArticleStatus[]).map((s) => (
              <option key={s} value={s} style={{ background: "var(--dark-100)", color: "var(--text-hi)" }}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: "0.6rem", color: "var(--text-4)", marginTop: 4 }}>
            {status === "PUBLISHED"
              ? "Visible on public Insights page"
              : status === "REVIEW"
              ? "Flagged for editorial review"
              : "Hidden from public view"}
          </p>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {tags.map((t) => {
              const active = selectedTags.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  style={{
                    padding: "0.25rem 0.7rem",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: 3,
                    cursor: "pointer",
                    background: active ? "rgba(201,168,76,0.12)" : "var(--surface-hover)",
                    color: active ? P.gold : P.textMuted,
                    border: `1px solid ${active ? "rgba(201,168,76,0.3)" : "var(--border-dim)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 3 }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Article"}
        </button>
        {isEdit && (
          <a
            href={`/dashboard/articles/${initial!.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...btnOutline, color: P.gold, borderColor: "rgba(201,168,76,0.25)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ marginRight: 5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Preview
          </a>
        )}
        <button type="button" onClick={() => router.back()} style={btnOutline}>
          Cancel
        </button>
      </div>

    </form>
  );
}
