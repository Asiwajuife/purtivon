"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const P = {
  surface: "var(--surface-card)",
  border: "var(--border-dim)",
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
} as const;

const inputStyle: React.CSSProperties = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border-dim)",
  color: P.textPrimary,
  fontSize: "0.82rem",
  padding: "0.55rem 0.85rem",
  outline: "none",
  borderRadius: 3,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.58rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: P.textMuted,
  marginBottom: "0.35rem",
  display: "block",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

interface Category {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export default function CategoriesClient({ categories: initial }: { categories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  function handleNewName(v: string) {
    setNewName(v);
    if (!slugManual) setNewSlug(slugify(v));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim() }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setCreateError(data.error ?? "Failed to create."); return; }
    setCategories((prev) => [...prev, { ...data.category, articleCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName(""); setNewSlug(""); setSlugManual(false);
  }

  function startEdit(c: Category) {
    setEditId(c.id);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || !editSlug.trim() || !editId) return;
    setSaving(true);
    setEditError("");
    const res = await fetch(`/api/admin/categories/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), slug: editSlug.trim() }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setEditError(data.error ?? "Save failed."); return; }
    setCategories((prev) => prev.map((c) => c.id === editId ? { ...c, name: data.category.name, slug: data.category.slug } : c));
    setEditId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string, count: number) {
    if (count > 0) { setDeleteError(`Cannot delete "${name}" — ${count} article(s) are linked to it.`); return; }
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeletingId(id);
    setDeleteError("");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setDeleteError(d.error ?? "Delete failed."); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const thStyle: React.CSSProperties = { padding: "0.6rem 1rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted, textAlign: "left", borderBottom: `1px solid ${P.border}` };
  const tdStyle: React.CSSProperties = { padding: "0.7rem 1rem", fontSize: "0.78rem", color: P.textMuted, borderBottom: "1px solid var(--surface-hover)", verticalAlign: "middle" };

  return (
    <>
      {/* Create form */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: "1rem" }}>
          New Category
        </p>
        <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "flex-end" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={newName} onChange={(e) => handleNewName(e.target.value)} placeholder="e.g. FDI Intelligence" required />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input style={inputStyle} value={newSlug} onChange={(e) => { setSlugManual(true); setNewSlug(slugify(e.target.value)); }} placeholder="fdi-intelligence" required />
          </div>
          <button type="submit" disabled={creating} style={{ padding: "0.55rem 1.1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", border: "none", borderRadius: 3, cursor: "pointer", opacity: creating ? 0.7 : 1, whiteSpace: "nowrap" }}>
            {creating ? "Adding…" : "Add"}
          </button>
        </form>
        {createError && <p style={{ fontSize: "0.72rem", color: "#f87171", marginTop: "0.65rem" }}>{createError}</p>}
      </div>

      {/* Errors */}
      {deleteError && <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 3 }}>{deleteError}</p>}

      {/* Table */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
        {categories.length === 0 ? (
          <p style={{ padding: "2.5rem", textAlign: "center", color: P.textMuted, fontSize: "0.78rem", margin: 0 }}>No categories yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-subtle)" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Articles</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  {editId === c.id ? (
                    <td colSpan={4} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--surface-hover)" }}>
                      <form onSubmit={handleSaveEdit} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <label style={labelStyle}>Name</label>
                          <input style={inputStyle} value={editName} onChange={(e) => setEditName(e.target.value)} required />
                        </div>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <label style={labelStyle}>Slug</label>
                          <input style={inputStyle} value={editSlug} onChange={(e) => setEditSlug(slugify(e.target.value))} required />
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button type="submit" disabled={saving} style={{ padding: "0.5rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", border: "none", borderRadius: 3, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                            {saving ? "…" : "Save"}
                          </button>
                          <button type="button" onClick={() => setEditId(null)} style={{ padding: "0.5rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: P.textMuted, border: "1px solid var(--border-dim)", borderRadius: 3, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                        {editError && <p style={{ width: "100%", fontSize: "0.7rem", color: "#f87171", margin: 0 }}>{editError}</p>}
                      </form>
                    </td>
                  ) : (
                    <>
                      <td style={{ ...tdStyle, color: P.textPrimary, fontWeight: 500 }}>{c.name}</td>
                      <td style={tdStyle}>
                        <code style={{ fontSize: "0.7rem", color: "var(--text-lo)", background: "var(--surface-hover)", padding: "0.15rem 0.4rem", borderRadius: 2 }}>{c.slug}</code>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: c.articleCount > 0 ? P.gold : "var(--text-4)" }}>{c.articleCount}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button onClick={() => startEdit(c)} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: P.gold, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, cursor: "pointer" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(c.id, c.name, c.articleCount)} disabled={deletingId === c.id} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: c.articleCount > 0 ? "var(--text-5)" : "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: 3, cursor: c.articleCount > 0 ? "not-allowed" : "pointer", opacity: deletingId === c.id ? 0.5 : 1 }}>
                            {deletingId === c.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
