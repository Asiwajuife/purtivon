"use client";
import { useState } from "react";
import type React from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    borderRadius: 2,
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  };

  return (
    <div style={{ flex: 1, paddingTop: '6rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="contact-split">

          {/* Left — info */}
          <div>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Get in Touch</div>
            <h1 className="display-xl" style={{ marginBottom: '1.25rem' }}>
              Let&apos;s talk about <em>recognition</em>
            </h1>
            <p className="body-lg" style={{ marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
              Whether you are interested in submitting a nomination, discussing a PR retainer,
              commissioning research, or exploring sponsorship opportunities — our team is ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Award Enquiries', value: 'awards@purtivon.com', icon: '◈' },
                { label: 'General Enquiries', value: 'hello@purtivon.com', icon: '⬡' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 34, height: 34, border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '0.85rem', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderLeft: '2px solid var(--border-gold)', background: 'rgba(201,168,76,0.03)' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.5rem' }}>Office Hours</p>
              <p className="body-sm">Monday – Friday, 09:00 – 18:00 GMT</p>
              <p className="body-sm" style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>London, United Kingdom</p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text-secondary)', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              Send us a message
            </p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: 44, height: 44, border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--gold)', fontSize: '1.1rem' }}>
                  ✓
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, marginBottom: '0.65rem' }}>Message received</h2>
                <p className="body-sm" style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. A member of our team will respond within two business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>Full Name <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Jane Smith" style={inputStyle} className="contact-input" />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" style={inputStyle} className="contact-input" />
                  </div>
                </div>

                <div>
                  <label htmlFor="organisation" style={labelStyle}>Organisation</label>
                  <input id="organisation" name="organisation" type="text" value={form.organisation} onChange={handleChange} placeholder="Your company or institution" style={inputStyle} className="contact-input" />
                </div>

                <div>
                  <label htmlFor="subject" style={labelStyle}>Subject <span style={{ color: 'var(--gold)' }}>*</span></label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} className="contact-input">
                    <option value="">Select a topic</option>
                    <option value="award-nomination">Award Nomination</option>
                    <option value="media-pr">Media & PR Services</option>
                    <option value="fdi-intelligence">FDI Intelligence / Research</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>Message <span style={{ color: 'var(--gold)' }}>*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    className="contact-input"
                  />
                </div>

                {error && (
                  <p style={{ fontSize: '0.8rem', color: '#f87171', padding: '0.65rem 0.9rem', border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)', borderRadius: 2 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>

                <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textAlign: 'center' }}>
                  We respond to all enquiries within two business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-input:focus { border-color: rgba(201,168,76,0.4) !important; background: rgba(255,255,255,0.05) !important; }
        .contact-input::placeholder { color: rgba(255,255,255,0.18); }
        .contact-input option { background: #111118; color: #e8e4db; }
        @media (max-width: 900px) { .contact-split { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </div>
  );
}
