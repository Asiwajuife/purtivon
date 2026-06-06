"use client";
import { useState } from "react";
import type React from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Unable to send your message. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function isInvalid(field: string) {
    return touched[field] && !form[field as keyof typeof form];
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: isInvalid(field) ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${isInvalid(field) ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 2,
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    padding: "0.825rem 1rem",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "0.5rem",
  };

  const contactPoints = [
    {
      label: "Award Enquiries",
      value: "awards@purtivon.com",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
        </svg>
      ),
    },
    {
      label: "General Enquiries",
      value: "hello@purtivon.com",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: "Office Hours",
      value: "Mon – Fri · 09:00 – 18:00 GMT",
      sub: "London, United Kingdom",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Page header ── */}
      <div className="contact-header" style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #060812, var(--dark))",
        borderBottom: "1px solid var(--border)",
        padding: "5rem 0 3rem",
      }}>
        {/* Gradient mesh */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse 40% 50% at 20% 60%, rgba(59,130,246,0.04) 0%, transparent 60%)",
          ].join(","),
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", position: "relative" }}>
          <div className="eyebrow" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 28, height: 1, background: "var(--gold-dim)", display: "block" }} />
            Get in Touch
          </div>
          <h1 className="display-lg" style={{ maxWidth: 520 }}>
            Let&apos;s talk about <em>recognition</em>
          </h1>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="contact-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.45fr", gap: "4rem", alignItems: "start" }} className="contact-split">

          {/* ── Left: info panel ── */}
          <div>
            <p className="body-lg" style={{ marginBottom: "2.75rem", color: "var(--text-lo)", lineHeight: 1.8 }}>
              Whether you are interested in submitting a nomination, discussing a PR retainer,
              commissioning research, or exploring sponsorship opportunities — our team is ready to help.
            </p>

            {/* Contact points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2.5rem" }}>
              {contactPoints.map(({ label, value, sub, icon }) => (
                <div key={label} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1.1rem 1.25rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.2s, background 0.2s",
                }} className="contact-info-row">
                  <div style={{
                    width: 36, height: 36, borderRadius: 2,
                    border: "1px solid rgba(201,168,76,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--gold)", flexShrink: 0, marginTop: 2,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: "0.25rem" }}>{label}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{value}</p>
                    {sub && <p style={{ fontSize: "0.78rem", color: "var(--text-lo)", marginTop: "0.1rem" }}>{sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Globe wireframe decoration */}
            <div aria-hidden="true" style={{ position: "relative", height: 220, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
              <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
                <circle cx="160" cy="110" r="96" stroke="#C9A84C" strokeWidth="0.7"/>
                <circle cx="160" cy="110" r="68" stroke="#C9A84C" strokeWidth="0.5"/>
                <circle cx="160" cy="110" r="40" stroke="#C9A84C" strokeWidth="0.5"/>
                <ellipse cx="160" cy="110" rx="96" ry="35" stroke="#C9A84C" strokeWidth="0.6"/>
                <ellipse cx="160" cy="110" rx="96" ry="64" stroke="#C9A84C" strokeWidth="0.5"/>
                <path d="M64 110 Q160 30 256 110 Q160 190 64 110Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
                <path d="M160 14 Q240 110 160 206 Q80 110 160 14Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
                <line x1="64" y1="110" x2="256" y2="110" stroke="#3B82F6" strokeWidth="0.35" opacity="0.6"/>
                <line x1="160" y1="14" x2="160" y2="206" stroke="#3B82F6" strokeWidth="0.35" opacity="0.6"/>
                {/* Glowing dots */}
                <circle cx="160" cy="110" r="2.5" fill="#C9A84C" opacity="0.8"/>
                <circle cx="206" cy="78" r="1.8" fill="#C9A84C" opacity="0.6"/>
                <circle cx="125" cy="142" r="1.5" fill="#3B82F6" opacity="0.7"/>
                <circle cx="195" cy="138" r="1.5" fill="#3B82F6" opacity="0.6"/>
                <circle cx="118" cy="82" r="1.8" fill="#C9A84C" opacity="0.5"/>
                {/* Circuit traces */}
                <path d="M160 110 L206 78" stroke="#C9A84C" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.5"/>
                <path d="M160 110 L125 142" stroke="#3B82F6" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.4"/>
                <path d="M160 110 L195 138" stroke="#3B82F6" strokeWidth="0.4" strokeDasharray="3 4" opacity="0.4"/>
              </svg>
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                <p style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)" }}>48 Countries · 500+ Institutions</p>
              </div>
            </div>
          </div>

          {/* ── Right: form panel ── */}
          <div style={{
            background: "rgba(10,12,22,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "2px solid rgba(201,168,76,0.35)",
            padding: "2.5rem",
          }}>
            <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-faint)" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 300, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                Send us a message
              </p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-4)" }}>
                We respond to all enquiries within two business days.
              </p>
            </div>

            {sent ? (
              <div style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
                <div style={{
                  width: 52, height: 52,
                  border: "1.5px solid rgba(201,168,76,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  background: "rgba(201,168,76,0.06)",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.65rem" }}>Message received</h2>
                <p className="body-sm" style={{ color: "var(--text-lo)", maxWidth: 320, margin: "0 auto" }}>
                  Thank you for reaching out. A member of our team will respond within two business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Row: Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="contact-row-2">
                  <div>
                    <label htmlFor="name" style={labelStyle}>
                      Full Name <span style={{ color: "var(--gold)" }}>*</span>
                    </label>
                    <input
                      id="name" name="name" type="text"
                      value={form.name} onChange={handleChange} onBlur={handleBlur}
                      required placeholder="Jane Smith"
                      style={inputStyle("name")}
                      className="contact-input"
                      aria-invalid={isInvalid("name")}
                      aria-describedby={isInvalid("name") ? "name-err" : undefined}
                    />
                    {isInvalid("name") && <span id="name-err" style={{ fontSize: "0.65rem", color: "#f87171", marginTop: "0.3rem", display: "block" }}>Required</span>}
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address <span style={{ color: "var(--gold)" }}>*</span>
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange} onBlur={handleBlur}
                      required placeholder="you@company.com"
                      style={inputStyle("email")}
                      className="contact-input"
                      aria-invalid={isInvalid("email")}
                      aria-describedby={isInvalid("email") ? "email-err" : undefined}
                    />
                    {isInvalid("email") && <span id="email-err" style={{ fontSize: "0.65rem", color: "#f87171", marginTop: "0.3rem", display: "block" }}>Required</span>}
                  </div>
                </div>

                {/* Organisation */}
                <div>
                  <label htmlFor="organisation" style={labelStyle}>Organisation</label>
                  <input
                    id="organisation" name="organisation" type="text"
                    value={form.organisation} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Your company or institution"
                    style={inputStyle("organisation")}
                    className="contact-input"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" style={labelStyle}>
                    Subject <span style={{ color: "var(--gold)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      id="subject" name="subject"
                      value={form.subject} onChange={handleChange} onBlur={handleBlur}
                      style={{ ...inputStyle("subject"), cursor: "pointer", appearance: "none", paddingRight: "2.75rem" }}
                      className="contact-input"
                      aria-invalid={isInvalid("subject")}
                    >
                      <option value="">Select a topic</option>
                      <option value="award-nomination">Award Nomination</option>
                      <option value="media-pr">Media &amp; PR Services</option>
                      <option value="fdi-intelligence">FDI Intelligence / Research</option>
                      <option value="sponsorship">Sponsorship &amp; Partnership</option>
                      <option value="general">General Enquiry</option>
                    </select>
                    {/* Custom chevron */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} aria-hidden="true" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  {isInvalid("subject") && <span style={{ fontSize: "0.65rem", color: "#f87171", marginTop: "0.3rem", display: "block" }}>Please select a topic</span>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message <span style={{ color: "var(--gold)" }}>*</span>
                  </label>
                  <textarea
                    id="message" name="message"
                    value={form.message} onChange={handleChange} onBlur={handleBlur}
                    required placeholder="How can we help?"
                    rows={5}
                    style={{ ...inputStyle("message"), resize: "vertical" }}
                    className="contact-input"
                    aria-invalid={isInvalid("message")}
                  />
                  {isInvalid("message") && <span style={{ fontSize: "0.65rem", color: "#f87171", marginTop: "0.3rem", display: "block" }}>Required</span>}
                </div>

                {/* Error banner */}
                {error && (
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: "0.65rem",
                    fontSize: "0.78rem", color: "#fca5a5",
                    padding: "0.75rem 1rem",
                    border: "1px solid rgba(248,113,113,0.25)",
                    background: "rgba(248,113,113,0.05)",
                  }} role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer", marginTop: "0.35rem", gap: "0.65rem" }}
                >
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-input:focus {
          border-color: rgba(201,168,76,0.5) !important;
          background: rgba(255,255,255,0.05) !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08) !important;
          outline: none !important;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.18); }
        .contact-input option { background: #0f1020; color: #e8e4db; }
        .contact-info-row:hover { border-color: rgba(201,168,76,0.18) !important; background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 960px) {
          .contact-split { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
        @media (max-width: 640px) {
          .contact-header { padding: 3rem 0 2rem !important; }
          .contact-content { padding: 2.5rem 1.25rem 4rem !important; }
        }
        @media (max-width: 560px) {
          .contact-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
