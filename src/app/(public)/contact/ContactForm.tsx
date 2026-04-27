"use client";
import { useState } from "react";

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

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm placeholder-white/20 px-4 py-3.5 rounded-sm focus:outline-none focus:border-[#c9a84c]/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass = "block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5";

  return (
    <div className="flex-1 pt-24">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2.5rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }} className="contact-split">
          {/* Left */}
          <div>
            <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>Get in Touch</div>
            <h1 className="display-xl" style={{ marginBottom: '1.5rem' }}>Let&apos;s talk about <em>recognition</em></h1>
            <p className="body-lg" style={{ marginBottom: '3rem' }}>
              Whether you are interested in submitting a nomination, discussing a PR retainer,
              commissioning research, or exploring sponsorship opportunities — our team is ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Award Enquiries', value: 'awards@purtivon.com', icon: '◈' },
                { label: 'General Enquiries', value: 'hello@purtivon.com', icon: '⬡' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: 36, height: 36, border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '0.9rem', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p className="label" style={{ marginBottom: '0.2rem' }}>{label}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--dark-200)' }}>
              <p className="label" style={{ marginBottom: '0.75rem' }}>Office Hours</p>
              <p className="body-sm">Monday – Friday, 09:00 – 18:00 GMT</p>
              <p className="body-sm" style={{ marginTop: '0.25rem' }}>London, United Kingdom</p>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ border: '1px solid var(--border)', background: 'var(--dark-200)', padding: '2.5rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: 48, height: 48, border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--gold)' }}>
                  ✓
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.75rem' }}>Message received</h2>
                <p className="body-sm">Thank you for reaching out. A member of our team will respond within two business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="name" className={labelClass}>Full Name <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Jane Smith" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email <span style={{ color: 'var(--gold)' }}>*</span></label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="organisation" className={labelClass}>Organisation</label>
                  <input id="organisation" name="organisation" type="text" value={form.organisation} onChange={handleChange} placeholder="Your company or institution" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange} className={inputClass} style={{ cursor: 'pointer' }}>
                    <option value="">Select a topic</option>
                    <option value="award-nomination">Award Nomination</option>
                    <option value="media-pr">Media & PR Services</option>
                    <option value="fdi-intelligence">FDI Intelligence / Research</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message <span style={{ color: 'var(--gold)' }}>*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    rows={5}
                    className={inputClass}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                {error && (
                  <p style={{ fontSize: '0.8rem', color: '#f87171', padding: '0.75rem 1rem', border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', textAlign: 'center' }}>
                  We respond to all enquiries within two business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .contact-split { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </div>
  )
}
