"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string | null;
  submissionCount: number;
}

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
const emptyForm = { title: "", category: "", year: String(CURRENT_YEAR), description: "" };

// ── Shared style tokens ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "var(--text-hi)",
  fontSize: "0.82rem",
  padding: "0.52rem 0.75rem",
  outline: "none",
  borderRadius: 4,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.55rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  marginBottom: "0.38rem",
  display: "block",
};

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
  fontSize: "0.76rem",
  color: "rgba(255,255,255,0.48)",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "top",
};

function FormGrid({ form, setForm, label = "Add Award" }: {
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  label?: string;
}) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 110px", gap: "0.75rem" }} className="aw-form-grid">
        <div>
          <label style={labelStyle}>Title <span style={{ color: "#c9a84c" }}>*</span></label>
          <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Best FDI Destination" required />
        </div>
        <div>
          <label style={labelStyle}>Category <span style={{ color: "#c9a84c" }}>*</span></label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
            <option value="">Select…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Year <span style={{ color: "#c9a84c" }}>*</span></label>
          <input type="number" min={2000} max={2100} style={inputStyle} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} required />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this award…" />
      </div>
    </>
  );
}

export default function AwardsClient({ awards: initial }: { awards: Award[] }) {
  const router = useRouter();
  const [awards, setAwards] = useState(initial);

  const [showCreate, setShowCreate]   = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState("");

  const [editId, setEditId]     = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState("");
  const [saving, setSaving]     = useState(false);

  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.year) return;
    setCreating(true); setCreateError("");
    const res = await fetch("/api/awards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title.trim(), category: form.category, year: parseInt(form.year, 10), description: form.description.trim() || null }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setCreateError(data.error ?? "Failed to create."); return; }
    setAwards(prev => [{ ...data.award, submissionCount: 0 }, ...prev]);
    setForm(emptyForm);
    setShowCreate(false);
  }

  function startEdit(a: Award) {
    setEditId(a.id);
    setEditForm({ title: a.title, category: a.category, year: String(a.year), description: a.description ?? "" });
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setSaving(true); setEditError("");
    const res = await fetch(`/api/admin/awards/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editForm.title.trim(), category: editForm.category, year: parseInt(editForm.year, 10), description: editForm.description.trim() || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setEditError(data.error ?? "Save failed."); return; }
    setAwards(prev => prev.map(a => a.id === editId ? { ...a, ...data.award } : a));
    setEditId(null);
    router.refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete award "${title}"? This will also delete all associated submissions.`)) return;
    setDeletingId(id); setDeleteError("");
    const res = await fetch(`/api/admin/awards/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setDeleteError(d.error ?? "Delete failed."); return; }
    setAwards(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Collapsible create form ── */}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
        <button
          type="button"
          onClick={() => { setShowCreate(v => !v); setCreateError(""); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.9rem 1.25rem",
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: showCreate ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: showCreate ? "#c9a84c" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {showCreate ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            )}
            New Award
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showCreate ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
          </svg>
        </button>

        {showCreate && (
          <form onSubmit={handleCreate} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <FormGrid form={form} setForm={setForm} />
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button type="submit" disabled={creating} style={{ padding: "0.48rem 1.1rem", fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070c", border: "none", borderRadius: 5, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1 }}>
                {creating ? "Adding…" : "Add Award"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} style={{ padding: "0.48rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.38)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 5, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
            {createError && <p style={{ fontSize: "0.7rem", color: "#f87171", margin: 0 }}>{createError}</p>}
          </form>
        )}
      </div>

      {deleteError && (
        <p style={{ fontSize: "0.76rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 6, margin: 0 }}>
          {deleteError}
        </p>
      )}

      {/* ── Awards table ── */}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
        {awards.length === 0 ? (
          <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
              </svg>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", margin: 0 }}>No awards yet — add one above</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Category</th>
                  <th style={{ ...th, textAlign: "center" }}>Year</th>
                  <th style={{ ...th, textAlign: "center" }}>Submissions</th>
                  <th style={{ ...th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((a) =>
                  editId === a.id ? (
                    <tr key={a.id} style={{ background: "rgba(201,168,76,0.03)" }}>
                      <td colSpan={5} style={{ padding: "1.25rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <FormGrid form={editForm} setForm={setEditForm} />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.44rem 0.9rem", fontSize: "0.64rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070c", border: "none", borderRadius: 5, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                              {saving ? "Saving…" : "Save"}
                            </button>
                            <button type="button" onClick={() => setEditId(null)} style={{ padding: "0.44rem 0.9rem", fontSize: "0.64rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.38)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 5, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                          {editError && <p style={{ fontSize: "0.7rem", color: "#f87171", margin: 0 }}>{editError}</p>}
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={a.id} className="aw-row">
                      <td style={{ ...td, color: "var(--text-hi)" }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: "0.78rem" }}>{a.title}</p>
                        {a.description && <p style={{ margin: "0.22rem 0 0", fontSize: "0.62rem", color: "rgba(255,255,255,0.32)", lineHeight: 1.5, maxWidth: 380 }}>{a.description}</p>}
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: "0.6rem", padding: "0.2rem 0.55rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 3, color: "#c9a84c", whiteSpace: "nowrap" }}>
                          {a.category}
                        </span>
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--text-hi)", letterSpacing: "0.02em" }}>{a.year}</span>
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{ fontSize: "0.76rem", fontWeight: 500, color: a.submissionCount > 0 ? "#c9a84c" : "rgba(255,255,255,0.25)" }}>
                          {a.submissionCount}
                        </span>
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button onClick={() => startEdit(a)} style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, cursor: "pointer" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(a.id, a.title)} disabled={deletingId === a.id} style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.14)", borderRadius: 4, cursor: "pointer", opacity: deletingId === a.id ? 0.5 : 1 }}>
                            {deletingId === a.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .aw-row:hover td { background: rgba(255,255,255,0.018) !important; }
        .aw-row:last-child td { border-bottom: none !important; }
        @media (max-width: 640px) { .aw-form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
