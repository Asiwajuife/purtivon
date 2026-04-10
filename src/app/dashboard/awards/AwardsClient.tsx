"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const P = {
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
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

const CATEGORIES = [
  "Financial Services",
  "Foreign Direct Investment",
  "Leadership",
  "ESG & Sustainability",
  "Infrastructure",
  "Emerging Markets",
  "Transactions",
  "Technology",
];

const CURRENT_YEAR = new Date().getFullYear();

interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string | null;
  submissionCount: number;
}

const emptyForm = { title: "", category: "", year: String(CURRENT_YEAR), description: "" };

export default function AwardsClient({ awards: initial }: { awards: Award[] }) {
  const router = useRouter();
  const [awards, setAwards] = useState(initial);

  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.year) return;
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/awards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title.trim(), category: form.category, year: parseInt(form.year, 10), description: form.description.trim() || null }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setCreateError(data.error ?? "Failed to create."); return; }
    setAwards((prev) => [{ ...data.award, submissionCount: 0 }, ...prev]);
    setForm(emptyForm);
  }

  function startEdit(a: Award) {
    setEditId(a.id);
    setEditForm({ title: a.title, category: a.category, year: String(a.year), description: a.description ?? "" });
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    setEditError("");
    const res = await fetch(`/api/admin/awards/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editForm.title.trim(), category: editForm.category, year: parseInt(editForm.year, 10), description: editForm.description.trim() || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setEditError(data.error ?? "Save failed."); return; }
    setAwards((prev) => prev.map((a) => a.id === editId ? { ...a, ...data.award } : a));
    setEditId(null);
    router.refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete award "${title}"? This will also delete all associated submissions.`)) return;
    setDeletingId(id);
    setDeleteError("");
    const res = await fetch(`/api/admin/awards/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setDeleteError(d.error ?? "Delete failed."); return; }
    setAwards((prev) => prev.filter((a) => a.id !== id));
  }

  const thStyle: React.CSSProperties = { padding: "0.6rem 1rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted, textAlign: "left", borderBottom: `1px solid ${P.border}` };
  const tdStyle: React.CSSProperties = { padding: "0.7rem 1rem", fontSize: "0.78rem", color: P.textMuted, borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "top" };

  return (
    <>
      {/* Create form */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: "1rem" }}>
          New Award
        </p>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 120px", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Title <span style={{ color: P.gold }}>*</span></label>
              <input style={inputStyle} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Best FDI Destination" required />
            </div>
            <div>
              <label style={labelStyle}>Category <span style={{ color: P.gold }}>*</span></label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year <span style={{ color: P.gold }}>*</span></label>
              <input type="number" min={2000} max={2100} style={inputStyle} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description of this media recognition award…" />
          </div>
          <div>
            <button type="submit" disabled={creating} style={{ padding: "0.55rem 1.2rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", border: "none", borderRadius: 3, cursor: "pointer", opacity: creating ? 0.7 : 1 }}>
              {creating ? "Adding…" : "Add Award"}
            </button>
          </div>
          {createError && <p style={{ fontSize: "0.72rem", color: "#f87171", margin: 0 }}>{createError}</p>}
        </form>
      </div>

      {deleteError && <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 3 }}>{deleteError}</p>}

      {/* Awards table */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
        {awards.length === 0 ? (
          <p style={{ padding: "2.5rem", textAlign: "center", color: P.textMuted, fontSize: "0.78rem", margin: 0 }}>No awards yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.015)" }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Year</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Submissions</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((a) => (
                  <tr key={a.id}>
                    {editId === a.id ? (
                      <td colSpan={5} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 110px", gap: "0.65rem" }}>
                            <div>
                              <label style={labelStyle}>Title</label>
                              <input style={inputStyle} value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div>
                              <label style={labelStyle}>Category</label>
                              <select style={{ ...inputStyle, cursor: "pointer" }} value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} required>
                                <option value="">Select…</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={labelStyle}>Year</label>
                              <input type="number" min={2000} max={2100} style={inputStyle} value={editForm.year} onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))} required />
                            </div>
                          </div>
                          <div>
                            <label style={labelStyle}>Description</label>
                            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                          </div>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.45rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", border: "none", borderRadius: 3, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                              {saving ? "Saving…" : "Save"}
                            </button>
                            <button type="button" onClick={() => setEditId(null)} style={{ padding: "0.45rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: P.textMuted, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                          {editError && <p style={{ fontSize: "0.7rem", color: "#f87171", margin: 0 }}>{editError}</p>}
                        </form>
                      </td>
                    ) : (
                      <>
                        <td style={{ ...tdStyle, color: P.textPrimary }}>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: "0.78rem" }}>{a.title}</p>
                          {a.description && <p style={{ margin: "0.2rem 0 0", fontSize: "0.62rem", color: P.textMuted, lineHeight: 1.5 }}>{a.description}</p>}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 3, color: P.gold, whiteSpace: "nowrap" }}>
                            {a.category}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: P.textPrimary }}>{a.year}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: a.submissionCount > 0 ? P.gold : "rgba(255,255,255,0.2)" }}>{a.submissionCount}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                            <button onClick={() => startEdit(a)} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: P.gold, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, cursor: "pointer" }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(a.id, a.title)} disabled={deletingId === a.id} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: 3, cursor: "pointer", opacity: deletingId === a.id ? 0.5 : 1 }}>
                              {deletingId === a.id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
