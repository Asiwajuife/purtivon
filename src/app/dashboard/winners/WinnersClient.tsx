"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const P = {
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
} as const;

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
  "FDI Excellence",
  "Financial Services",
  "Investment Promotion",
  "Banking & Finance",
  "Capital Markets",
  "ESG Leadership",
  "Economic Development",
  "Technology & Innovation",
  "Leadership",
  "Media & Communications",
];

const REGION_OPTIONS = [
  "Global",
  "Africa",
  "Asia Pacific",
  "Central & Eastern Europe",
  "Latin America",
  "Middle East",
  "North America",
  "South Asia",
  "Southeast Asia",
  "Western Europe",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);
const QUARTER_OPTIONS = [1, 2, 3, 4];

function blankForm() {
  return {
    name: "", slug: "", category: "", year: CURRENT_YEAR,
    quarter: "" as string, company: "", region: "",
    featured: false, link: "", image: "", logo: "", profile: "",
  };
}
type FormState = ReturnType<typeof blankForm>;

// ── Logo uploader ────────────────────────────────────────────────────────────

function LogoUpload({
  value,
  onChange,
  label = "Company Logo",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setUploadErr(d.error ?? "Upload failed.");
      return;
    }
    const { url } = await res.json();
    onChange(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${P.border}`,
    borderRadius: 3, padding: "0.45rem 0.7rem",
    fontSize: "0.78rem", color: P.textPrimary, outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted }}>
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="logo preview"
            style={{ width: 56, height: 56, objectFit: "contain", background: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "0.25rem" }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ fontSize: "0.62rem", color: "#f87171", background: "transparent", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            Remove
          </button>
        </div>
      )}

      {/* URL input */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload below"
        style={inputStyle}
      />

      {/* File upload button */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            padding: "0.35rem 0.8rem", fontSize: "0.62rem", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            background: "rgba(201,168,76,0.08)", color: P.gold,
            border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 3,
            cursor: "pointer", opacity: uploading ? 0.6 : 1, whiteSpace: "nowrap",
          }}
        >
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        {uploadErr && <span style={{ fontSize: "0.65rem", color: "#f87171" }}>{uploadErr}</span>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WinnersClient({ winners: initial }: { winners: Winner[] }) {
  const router = useRouter();
  const [winners, setWinners] = useState<Winner[]>(initial);
  const [form, setForm] = useState<FormState>(blankForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(blankForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${P.border}`,
    borderRadius: 3, padding: "0.45rem 0.7rem",
    fontSize: "0.78rem", color: P.textPrimary, outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  function field(
    label: string,
    value: string | number,
    onChange: (v: string) => void,
    opts?: { type?: string; placeholder?: string; required?: boolean; options?: (string | number)[]; allowEmpty?: boolean }
  ) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted }}>
          {label}{opts?.required && <span style={{ color: P.gold, marginLeft: 2 }}>*</span>}
        </label>
        {opts?.options ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {opts.allowEmpty && <option value="">—</option>}
            {opts.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={opts?.type ?? "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={opts?.placeholder}
            style={inputStyle}
          />
        )}
      </div>
    );
  }

  function textareaField(label: string, value: string, onChange: (v: string) => void, placeholder?: string) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted }}>
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
        />
      </div>
    );
  }

  function checkboxField(label: string, checked: boolean, onChange: (v: boolean) => void) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <label style={{ fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted }}>
          {label}
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", height: "2.1rem" }}>
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 14, height: 14, accentColor: P.gold }} />
          <span style={{ fontSize: "0.72rem", color: checked ? P.gold : P.textMuted }}>{checked ? "Yes" : "No"}</span>
        </label>
      </div>
    );
  }

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

  // ── create ────────────────────────────────────────────────────────────────

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
    setWinners((prev) => [created, ...prev].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name)));
    setForm(blankForm());
    router.refresh();
  }

  // ── edit ──────────────────────────────────────────────────────────────────

  function startEdit(w: Winner) {
    setEditId(w.id);
    setEditForm({
      name:     w.name,
      slug:     w.slug     ?? "",
      category: w.category,
      year:     w.year,
      quarter:  w.quarter ? String(w.quarter) : "",
      company:  w.company  ?? "",
      region:   w.region   ?? "",
      featured: w.featured,
      link:     w.link     ?? "",
      image:    w.image    ?? "",
      logo:     w.logo     ?? "",
      profile:  w.profile  ?? "",
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
    setWinners((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setEditId(null);
    router.refresh();
  }

  // ── delete ────────────────────────────────────────────────────────────────

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete winner "${name}"? This cannot be undone.`)) return;
    setDeletingId(id); setError("");
    const res = await fetch(`/api/admin/winners/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to delete."); return; }
    setWinners((prev) => prev.filter((w) => w.id !== id));
    router.refresh();
  }

  const thStyle: React.CSSProperties = {
    padding: "0.6rem 1rem", fontSize: "0.58rem", fontWeight: 600,
    letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted,
    textAlign: "left", borderBottom: `1px solid ${P.border}`, whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "0.7rem 1rem", fontSize: "0.74rem", color: P.textMuted,
    borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "middle",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {error && (
        <p style={{ fontSize: "0.78rem", color: "#f87171", padding: "0.65rem 1rem", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)", borderRadius: 3 }}>{error}</p>
      )}

      {/* ── Create form ── */}
      <section style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "1.5rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: "1rem" }}>
          Add Winner
        </p>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Row 1: core fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 80px", gap: "0.75rem" }} className="winners-row">
            {field("Company Name *", form.name, (v) => setForm((f) => ({ ...f, name: v })), { placeholder: "Organisation name", required: true })}
            {field("Slug (URL)", form.slug, (v) => setForm((f) => ({ ...f, slug: v })), { placeholder: "company-name-slug" })}
            {field("Category *", form.category, (v) => setForm((f) => ({ ...f, category: v })), { options: CATEGORY_OPTIONS, required: true })}
            {field("Year *", form.year, (v) => setForm((f) => ({ ...f, year: Number(v) })), { options: YEAR_OPTIONS, required: true })}
            {field("Quarter", form.quarter, (v) => setForm((f) => ({ ...f, quarter: v })), { options: QUARTER_OPTIONS, allowEmpty: true })}
          </div>
          {/* Row 2: location + flags */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "0.75rem" }} className="winners-row">
            {field("Location (City, Country)", form.company, (v) => setForm((f) => ({ ...f, company: v })), { placeholder: "e.g. Frankfurt, Germany" })}
            {field("Region", form.region, (v) => setForm((f) => ({ ...f, region: v })), { options: REGION_OPTIONS, allowEmpty: true })}
            {field("External Link", form.link, (v) => setForm((f) => ({ ...f, link: v })), { placeholder: "https://…", type: "url" })}
            {checkboxField("Featured", form.featured, (v) => setForm((f) => ({ ...f, featured: v })))}
          </div>
          {/* Row 3: logo upload */}
          <LogoUpload
            value={form.logo}
            onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
          />
          {/* Row 4: company profile */}
          {textareaField(
            "Company Profile / Bio",
            form.profile,
            (v) => setForm((f) => ({ ...f, profile: v })),
            "Write a full description of the company and why they won this award…"
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: "0.5rem 1.4rem", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", borderRadius: 3, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving…" : "+ Add Winner"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Winners table ── */}
      {winners.length === 0 ? (
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "3rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "0.78rem", color: P.textMuted }}>No winners yet. Add one above.</p>
        </div>
      ) : (
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.015)" }}>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Category</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Period</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Region</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Logo</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Featured</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((w, idx) =>
                  editId === w.id ? (
                    <tr key={w.id} style={{ background: "rgba(201,168,76,0.04)" }}>
                      <td colSpan={8} style={{ padding: "1.25rem" }}>
                        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 80px", gap: "0.6rem" }} className="winners-row">
                            {field("Company Name", editForm.name, (v) => setEditForm((f) => ({ ...f, name: v })))}
                            {field("Slug", editForm.slug, (v) => setEditForm((f) => ({ ...f, slug: v })), { placeholder: "company-name-slug" })}
                            {field("Category", editForm.category, (v) => setEditForm((f) => ({ ...f, category: v })), { options: CATEGORY_OPTIONS })}
                            {field("Year", editForm.year, (v) => setEditForm((f) => ({ ...f, year: Number(v) })), { options: YEAR_OPTIONS })}
                            {field("Quarter", editForm.quarter, (v) => setEditForm((f) => ({ ...f, quarter: v })), { options: QUARTER_OPTIONS, allowEmpty: true })}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", gap: "0.6rem" }} className="winners-row">
                            {field("Location", editForm.company, (v) => setEditForm((f) => ({ ...f, company: v })), { placeholder: "City, Country" })}
                            {field("Region", editForm.region, (v) => setEditForm((f) => ({ ...f, region: v })), { options: REGION_OPTIONS, allowEmpty: true })}
                            {field("External Link", editForm.link, (v) => setEditForm((f) => ({ ...f, link: v })), { type: "url", placeholder: "https://…" })}
                            {checkboxField("Featured", editForm.featured, (v) => setEditForm((f) => ({ ...f, featured: v })))}
                          </div>
                          <LogoUpload
                            value={editForm.logo}
                            onChange={(url) => setEditForm((f) => ({ ...f, logo: url }))}
                          />
                          {textareaField(
                            "Company Profile / Bio",
                            editForm.profile,
                            (v) => setEditForm((f) => ({ ...f, profile: v })),
                            "Write a full description of the company…"
                          )}
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.4rem 0.9rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", borderRadius: 3, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                              {saving ? "…" : "Save"}
                            </button>
                            <button type="button" onClick={() => setEditId(null)} style={{ padding: "0.4rem 0.9rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", color: P.textMuted, border: `1px solid ${P.border}`, borderRadius: 3, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={w.id} style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)" }}>
                      <td style={{ ...tdStyle, color: P.textPrimary, fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {(w.logo || w.image)
                            ? /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={w.logo ?? w.image!} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "contain", background: "#fff", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, padding: "2px" }} />
                            : <div style={{ width: 28, height: 28, borderRadius: 4, background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 700, color: P.gold, flexShrink: 0 }}>{w.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}</div>
                          }
                          <div>
                            <div>{w.name}</div>
                            {w.slug && <div style={{ fontSize: "0.6rem", color: P.textMuted, marginTop: 1 }}>/{w.slug}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.62rem", padding: "0.15rem 0.5rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: P.gold, borderRadius: 3 }}>{w.category}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                        {w.quarter ? `Q${w.quarter} ` : ""}{w.year}
                      </td>
                      <td style={tdStyle}>{w.company ?? <span style={{ color: "rgba(255,255,255,0.15)" }}>—</span>}</td>
                      <td style={tdStyle}>{w.region ?? <span style={{ color: "rgba(255,255,255,0.15)" }}>—</span>}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {(w.logo || w.image)
                          ? <span style={{ color: P.gold, fontSize: "0.7rem" }}>✓</span>
                          : <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>—</span>
                        }
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {w.featured
                          ? <span style={{ color: P.gold, fontSize: "0.7rem" }}>★</span>
                          : <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>—</span>
                        }
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                          <button onClick={() => startEdit(w)} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: P.gold, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 3, cursor: "pointer" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(w.id, w.name)} disabled={deletingId === w.id} style={{ padding: "0.28rem 0.6rem", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 3, cursor: "pointer", opacity: deletingId === w.id ? 0.5 : 1 }}>
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
        @media (max-width: 900px) {
          .winners-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .winners-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
