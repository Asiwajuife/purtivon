"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Award { id: string; title: string; category: string; year: number; }
interface FormState {
  awardId: string; companyName: string; companyWebsite: string;
  contactName: string; contactEmail: string; details: string; additionalInfo: string;
}
const INITIAL: FormState = {
  awardId: "", companyName: "", companyWebsite: "",
  contactName: "", contactEmail: "", details: "", additionalInfo: "",
};

const field: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#f0ede6",
  fontSize: "0.82rem",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  padding: "0.7rem 0.9rem",
  outline: "none",
  appearance: "none",
  borderRadius: 0,
  transition: "border-color 0.2s, background 0.2s",
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.28)",
  marginBottom: "0.45rem",
};
const req = <span style={{ color: "#c9a84c", marginLeft: 2 }}>*</span>;

export default function SubmissionForm({ awards }: { awards: Award[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setSuccess(true);
      setForm(INITIAL);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function fieldStyle(name: string): React.CSSProperties {
    return {
      ...field,
      borderColor: focused === name ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)",
      background: focused === name ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
    };
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div style={{
        border: "1px solid rgba(201,168,76,0.2)",
        background: "rgba(201,168,76,0.03)",
        padding: "2.5rem 1.5rem",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center",
      }}>
        <div style={{
          width: 44, height: 44,
          border: "1px solid rgba(201,168,76,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 300, color: "rgba(255,255,255,0.85)", marginBottom: "0.4rem" }}>
            Entry Submitted
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
            Your submission has been received and is under review by our judging panel.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          style={{
            marginTop: "0.25rem",
            fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase",
            color: "rgba(201,168,76,0.55)", background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Submit another entry
        </button>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} style={{
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.015)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Form fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0", padding: "1.5rem", paddingBottom: 0 }}>

        {/* Award select */}
        <div style={{ marginBottom: "1.1rem" }}>
          <label htmlFor="awardId" style={label}>Award Category {req}</label>
          <div style={{ position: "relative" }}>
            <select
              id="awardId" name="awardId" value={form.awardId}
              onChange={handleChange} required
              onFocus={() => setFocused("awardId")}
              onBlur={() => setFocused(null)}
              style={{ ...fieldStyle("awardId"), width: "100%", paddingRight: "2rem", cursor: "pointer" }}
            >
              <option value="" disabled style={{ background: "#0f0f16" }}>Select an award category…</option>
              {awards.map((a) => (
                <option key={a.id} value={a.id} style={{ background: "#0f0f16" }}>
                  {a.title}
                </option>
              ))}
            </select>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Two-col row: company + website */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.1rem" }}>
          <div>
            <label htmlFor="companyName" style={label}>Company {req}</label>
            <input id="companyName" name="companyName" type="text" value={form.companyName}
              onChange={handleChange} required placeholder="Acme Corp"
              onFocus={() => setFocused("companyName")} onBlur={() => setFocused(null)}
              style={fieldStyle("companyName")} />
          </div>
          <div>
            <label htmlFor="companyWebsite" style={label}>Website</label>
            <input id="companyWebsite" name="companyWebsite" type="url" value={form.companyWebsite}
              onChange={handleChange} placeholder="https://…"
              onFocus={() => setFocused("companyWebsite")} onBlur={() => setFocused(null)}
              style={fieldStyle("companyWebsite")} />
          </div>
        </div>

        {/* Two-col row: contact name + email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.1rem" }}>
          <div>
            <label htmlFor="contactName" style={label}>Contact Name {req}</label>
            <input id="contactName" name="contactName" type="text" value={form.contactName}
              onChange={handleChange} required placeholder="Jane Smith"
              onFocus={() => setFocused("contactName")} onBlur={() => setFocused(null)}
              style={fieldStyle("contactName")} />
          </div>
          <div>
            <label htmlFor="contactEmail" style={label}>Contact Email {req}</label>
            <input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail}
              onChange={handleChange} required placeholder="jane@acme.com"
              onFocus={() => setFocused("contactEmail")} onBlur={() => setFocused(null)}
              style={fieldStyle("contactEmail")} />
          </div>
        </div>

        {/* Details */}
        <div style={{ marginBottom: "1.1rem" }}>
          <label htmlFor="details" style={label}>Why do you deserve this award? {req}</label>
          <textarea id="details" name="details" value={form.details}
            onChange={handleChange} required rows={4}
            placeholder="Describe the impact, scale, and innovation of your organisation's work…"
            onFocus={() => setFocused("details")} onBlur={() => setFocused(null)}
            style={{ ...fieldStyle("details"), resize: "none" }} />
        </div>

        {/* Additional info */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="additionalInfo" style={label}>Supporting Evidence <span style={{ color: "rgba(255,255,255,0.18)", fontWeight: 400, letterSpacing: "0.05em", textTransform: "none" }}>(optional)</span></label>
          <textarea id="additionalInfo" name="additionalInfo" value={form.additionalInfo}
            onChange={handleChange} rows={2}
            placeholder="Links, data, or any additional context…"
            onFocus={() => setFocused("additionalInfo")} onBlur={() => setFocused(null)}
            style={{ ...fieldStyle("additionalInfo"), resize: "none" }} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          margin: "0 1.5rem 1.25rem",
          padding: "0.75rem 1rem",
          border: "1px solid rgba(248,113,113,0.15)",
          background: "rgba(248,113,113,0.05)",
          fontSize: "0.72rem", color: "rgba(248,113,113,0.85)", lineHeight: 1.6,
        }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1rem 1.5rem" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            padding: "0.85rem 1rem",
            background: loading ? "rgba(201,168,76,0.5)" : "#c9a84c",
            color: "#0a0a0f",
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s, opacity 0.2s",
          }}
        >
          {loading ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Submitting…
            </>
          ) : "Submit Entry →"}
        </button>
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: "0.75rem", lineHeight: 1.6 }}>
          All entries are reviewed by an independent judging panel. Submissions close 30 June 2026.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
