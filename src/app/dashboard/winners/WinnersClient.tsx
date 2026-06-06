"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Winner {
  id: string;
  name: string;
  slug: string | null;
  category: string;
  year: number;
  quarter: number | null;
  company: string | null;
  region: string | null;
  featured: boolean;
  link: string | null;
  image: string | null;
  logo: string | null;
  profile: string | null;
}

const CATEGORY_OPTIONS = [
  "FDI Excellence", "Financial Services", "Investment Promotion",
  "Banking & Finance", "Capital Markets", "ESG Leadership",
  "Economic Development", "Technology & Innovation", "Leadership", "Media & Communications",
];
const REGION_OPTIONS = [
  "Global", "Africa", "Asia Pacific", "Central & Eastern Europe",
  "Latin America", "Middle East", "North America", "South Asia",
  "Southeast Asia", "Western Europe",
];
const CURRENT_YEAR  = new Date().getFullYear();
const YEAR_OPTIONS  = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);
const QUARTER_OPTIONS = [1, 2, 3, 4];

function blankForm() {
  return {
    name: "", slug: "", category: "", year: CURRENT_YEAR,
    quarter: "" as string, company: "", region: "",
    featured: false, link: "", image: "", logo: "", profile: "",
  };
}
type FormState = ReturnType<typeof blankForm>;

// ── Style tokens ──────────────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
  color: "var(--text-hi)", fontSize: "0.82rem", padding: "0.52rem 0.75rem",
  outline: "none", borderRadius: 4, width: "100%", boxSizing: "border-box",
};
const labelSt: React.CSSProperties = {
  fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
  marginBottom: "0.38rem", display: "block",
};
const th: React.CSSProperties = {
  padding: "0.62rem 1rem", fontSize: "0.52rem", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "rgba(255,255,255,0.28)", textAlign: "left",
  background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)",
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "0.88rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.48)",
  borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle",
};

// ── Logo uploader ─────────────────────────────────────────────────────────────

function LogoUpload({ value, onChange, label = "Company Logo" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setUploadErr(d.error ?? "Upload failed."); return; }
    const { url } = await res.json();
    onChange(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={labelSt}>{label}</label>
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.2rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" style={{ width: 52, height: 52, objectFit: "contain", background: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "0.2rem" }} />
          <button type="button" onClick={() => onChange("")} style={{ fontSize: "0.62rem", color: "#f87171", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Remove
          </button>
        </div>
      )}
      <input type="url" value={value} onChange={e => onChange(e.target.value)} placeholder="https://… or upload below" style={inputSt} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "0.35rem 0.8rem", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(201,168,76,0.08)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.22)", borderRadius: 4, cursor: "pointer", opacity: uploading ? 0.6 : 1, whiteSpace: "nowrap" }}>
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        {uploadErr && <span style={{ fontSize: "0.63rem", color: "#f87171" }}>{uploadErr}</span>}
      </div>
    </div>
  );
}

// ── Form fields helper ────────────────────────────────────────────────────────

function Field({ label, value, onChange, opts }: {
  label: string; value: string | number;
  onChange: (v: string) => void;
  opts?: { type?: string; placeholder?: string; required?: boolean; options?: (string | number)[]; allowEmpty?: boolean };
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={labelSt}>{label}{opts?.required && <span style={{ color: "#c9a84c", marginLeft: 2 }}>*</span>}</label>
      {opts?.options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputSt, cursor: "pointer" }}>
          {opts.allowEmpty && <option value="">—</option>}
          {opts.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts?.type ?? "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={opts?.placeholder} style={inputSt} />
      )}
    </div>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={labelSt}>{label}</label>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", height: "2.1rem" }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 14, height: 14, accentColor: "#c9a84c" }} />
        <span style={{ fontSize: "0.72rem", color: checked ? "#c9a84c" : "rgba(255,255,255,0.4)" }}>{checked ? "Yes" : "No"}</span>
      </label>
    </div>
  );
}

// ── Inline form (used for both create and edit) ───────────────────────────────

function WinnerForm({ f, setF, onSubmit, onCancel, saving, submitLabel }: {
  f: FormState; setF: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent) => void; onCancel: () => void;
  saving: boolean; submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Row 1: identity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 80px", gap: "0.65rem" }} className="win-form-row">
        <Field label="Name *"    value={f.name}     onChange={v => setF(p => ({ ...p, name: v }))}     opts={{ placeholder: "Organisation name", required: true }} />
        <Field label="Slug"      value={f.slug}     onChange={v => setF(p => ({ ...p, slug: v }))}     opts={{ placeholder: "org-name-slug" }} />
        <Field label="Category *" value={f.category} onChange={v => setF(p => ({ ...p, category: v }))} opts={{ options: CATEGORY_OPTIONS, required: true }} />
        <Field label="Year *"    value={f.year}     onChange={v => setF(p => ({ ...p, year: Number(v) }))} opts={{ options: YEAR_OPTIONS, required: true }} />
        <Field label="Quarter"   value={f.quarter}  onChange={v => setF(p => ({ ...p, quarter: v }))}  opts={{ options: QUARTER_OPTIONS, allowEmpty: true }} />
      </div>
      {/* Row 2: location + flags */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "0.65rem" }} className="win-form-row">
        <Field label="Location"      value={f.company} onChange={v => setF(p => ({ ...p, company: v }))} opts={{ placeholder: "e.g. Frankfurt, Germany" }} />
        <Field label="Region"        value={f.region}  onChange={v => setF(p => ({ ...p, region: v }))}  opts={{ options: REGION_OPTIONS, allowEmpty: true }} />
        <Field label="External Link" value={f.link}    onChange={v => setF(p => ({ ...p, link: v }))}    opts={{ type: "url", placeholder: "https://…" }} />
        <CheckField label="Featured" checked={f.featured} onChange={v => setF(p => ({ ...p, featured: v }))} />
      </div>
      {/* Logo */}
      <LogoUpload value={f.logo} onChange={url => setF(p => ({ ...p, logo: url }))} />
      {/* Profile bio */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label style={labelSt}>Company Profile / Bio</label>
        <textarea value={f.profile} onChange={e => setF(p => ({ ...p, profile: e.target.value }))} placeholder="Write a description of the company and why they won this award…" rows={3} style={{ ...inputSt, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }} />
      </div>
      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={saving} style={{ padding: "0.48rem 1.1rem", fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#07070c", border: "none", borderRadius: 5, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: "0.48rem 0.9rem", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.38)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 5, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WinnersClient({ winners: initial }: { winners: Winner[] }) {
  const router = useRouter();
  const [winners, setWinners]     = useState<Winner[]>(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]           = useState<FormState>(blankForm());
  const [editId, setEditId]       = useState<string | null>(null);
  const [editForm, setEditForm]   = useState<FormState>(blankForm());
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError]         = useState("");

  function buildBody(f: FormState) {
    return {
      name:     f.name.trim(),
      slug:     f.slug.trim() || null,
      category: f.category,
      year:     Number(f.year),
      quarter:  f.quarter ? Number(f.quarter) : null,
      company:  f.company.trim() || null,
      region:   f.region || null,
      featured: f.featured,
      link:     f.link.trim() || null,
      image:    f.image.trim() || null,
      logo:     f.logo.trim() || null,
      profile:  f.profile.trim() || null,
    };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) { setError("Name and category are required."); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/winners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(form)),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to create."); return; }
    const created: Winner = await res.json();
    setWinners(prev => [created, ...prev].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name)));
    setForm(blankForm());
    setShowCreate(false);
    router.refresh();
  }

  function startEdit(w: Winner) {
    setEditId(w.id);
    setEditForm({
      name: w.name, slug: w.slug ?? "", category: w.category, year: w.year,
      quarter: w.quarter ? String(w.quarter) : "", company: w.company ?? "",
      region: w.region ?? "", featured: w.featured, link: w.link ?? "",
      image: w.image ?? "", logo: w.logo ?? "", profile: w.profile ?? "",
    });
    setError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.category.trim()) { setError("Name and category are required."); return; }
    setSaving(true); setError("");
    const res = await fetch(`/api/admin/winners/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(editForm)),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to update."); return; }
    const updated: Winner = await res.json();
    setWinners(prev => prev.map(w => w.id === updated.id ? updated : w));
    setEditId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete winner "${name}"? This cannot be undone.`)) return;
    setDeletingId(id); setError("");
    const res = await fetch(`/api/admin/winners/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to delete."); return; }
    setWinners(prev => prev.filter(w => w.id !== id));
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && (
        <p style={{ fontSize: "0.76rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 6, margin: 0 }}>
          {error}
        </p>
      )}

      {/* ── Collapsible create form ── */}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
        <button
          type="button"
          onClick={() => { setShowCreate(v => !v); setError(""); }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.25rem", background: "transparent", border: "none", cursor: "pointer", borderBottom: showCreate ? "1px solid rgba(255,255,255,0.06)" : "none" }}
        >
          <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: showCreate ? "#c9a84c" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {showCreate
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            }
            Add Winner
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={showCreate ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
          </svg>
        </button>
        {showCreate && (
          <div style={{ padding: "1.25rem" }}>
            <WinnerForm f={form} setF={setForm} onSubmit={handleCreate} onCancel={() => setShowCreate(false)} saving={saving} submitLabel="+ Add Winner" />
          </div>
        )}
      </div>

      {/* ── Winners table ── */}
      {winners.length === 0 ? (
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.012)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.6)" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", margin: 0 }}>No winners yet — add one above</p>
        </div>
      ) : (
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.012)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Company</th>
                  <th style={th}>Category</th>
                  <th style={{ ...th, textAlign: "center" }}>Period</th>
                  <th style={th}>Location</th>
                  <th style={th}>Region</th>
                  <th style={{ ...th, textAlign: "center" }}>Featured</th>
                  <th style={{ ...th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((w) =>
                  editId === w.id ? (
                    <tr key={w.id} style={{ background: "rgba(201,168,76,0.03)" }}>
                      <td colSpan={7} style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <WinnerForm f={editForm} setF={setEditForm} onSubmit={handleSaveEdit} onCancel={() => setEditId(null)} saving={saving} submitLabel="Save Changes" />
                      </td>
                    </tr>
                  ) : (
                    <tr key={w.id} className="win-row">
                      {/* Company + logo avatar */}
                      <td style={{ ...td, color: "var(--text-hi)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          {(w.logo || w.image)
                            ? /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={w.logo ?? w.image!} alt="" style={{ width: 30, height: 30, borderRadius: 5, objectFit: "contain", background: "#fff", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, padding: "2px" }} />
                            : <div style={{ width: 30, height: 30, borderRadius: 5, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.54rem", fontWeight: 700, color: "#c9a84c", flexShrink: 0 }}>
                                {w.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                          }
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                            {w.slug && <div style={{ fontSize: "0.59rem", color: "rgba(255,255,255,0.3)", marginTop: 1 }}>/{w.slug}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: "0.59rem", padding: "0.2rem 0.5rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", color: "#c9a84c", borderRadius: 3, whiteSpace: "nowrap" }}>
                          {w.category}
                        </span>
                      </td>
                      <td style={{ ...td, textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--text-hi)" }}>
                          {w.quarter ? `Q${w.quarter} ` : ""}{w.year}
                        </span>
                      </td>
                      <td style={td}>{w.company ?? <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}</td>
                      <td style={td}>{w.region ?? <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        {w.featured ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c" aria-label="Featured" role="img">
                            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.7rem" }}>—</span>
                        )}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button onClick={() => startEdit(w)} style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, cursor: "pointer" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(w.id, w.name)} disabled={deletingId === w.id} style={{ padding: "0.26rem 0.65rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.14)", borderRadius: 4, cursor: "pointer", opacity: deletingId === w.id ? 0.5 : 1 }}>
                            {deletingId === w.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .win-row:hover td { background: rgba(255,255,255,0.018) !important; }
        .win-row:last-child td { border-bottom: none !important; }
        @media (max-width: 900px) { .win-form-row { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .win-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
