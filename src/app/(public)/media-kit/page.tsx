import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Media Kit",
  description:
    "Purtivon press resources, brand guidelines, and media contact information.",
};

const BRAND_COLOURS = [
  { name: "Gold", hex: "#C9A84C", usage: "Primary accent, CTAs, logo mark" },
  { name: "Gold Light", hex: "#E8C97A", usage: "Hover states, gradients" },
  { name: "Dark", hex: "#0A0A0F", usage: "Page background" },
  { name: "Surface", hex: "#141420", usage: "Cards and panels" },
  { name: "Text Primary", hex: "#F0EDE6", usage: "Headings and body copy" },
];

const FACTS = [
  { value: "180+", label: "Awards Presented" },
  { value: "48", label: "Countries Covered" },
  { value: "£2.4B", label: "Capital Recognised" },
  { value: "12", label: "Years of Excellence" },
];

export default function MediaKitPage() {
  return (
    <div className="flex-1 pt-24">
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 2.5rem 8rem" }}>
        {/* Header */}
        <div className="eyebrow" style={{ marginBottom: "1.25rem" }}>Press & Media</div>
        <h1
          className="display-lg"
          style={{ marginBottom: "1rem" }}
        >
          Media Kit
        </h1>
        <p className="body-lg" style={{ maxWidth: 560, marginBottom: "3.5rem" }}>
          Everything you need to write about Purtivon — brand assets, key facts,
          boilerplate copy, and press contact details.
        </p>

        <div style={{ height: 1, background: "var(--border)", marginBottom: "4rem" }} />

        {/* About / Boilerplate */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            className="heading"
            style={{ marginBottom: "1.25rem", color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            About Purtivon
          </h2>
          <div
            style={{
              padding: "2rem",
              border: "1px solid var(--border-gold)",
              background: "rgba(201,168,76,0.03)",
              marginBottom: "1rem",
            }}
          >
            <p className="body-sm" style={{ lineHeight: 1.85 }}>
              Purtivon is the leading global awards and media PR consultancy for
              foreign direct investment and international financial services.
              Established over twelve years ago, Purtivon recognises excellence
              across capital markets, ESG, infrastructure, and sovereign investment
              through its annual Global Awards programme. The company serves
              governments, investment promotion agencies, financial institutions, and
              multinational corporations across 48 countries.
            </p>
          </div>
          <p className="label" style={{ color: "var(--text-muted)" }}>
            ↑ Approved boilerplate — please use this verbatim in press coverage.
          </p>
        </section>

        {/* Key Facts */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            className="heading"
            style={{ marginBottom: "1.5rem", color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Key Facts
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {FACTS.map(({ value, label }) => (
              <div
                key={label}
                style={{ padding: "1.75rem", background: "var(--dark-100)" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.25rem",
                    fontWeight: 300,
                    color: "var(--gold)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {value}
                </p>
                <p className="label">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Colours */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            className="heading"
            style={{ marginBottom: "1.5rem", color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Brand Colours
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {BRAND_COLOURS.map(({ name, hex, usage }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1rem 1.25rem",
                  border: "1px solid var(--border)",
                  background: "var(--dark-100)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: hex,
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                    {name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{usage}</p>
                </div>
                <code
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "var(--gold)",
                    background: "rgba(201,168,76,0.08)",
                    padding: "0.2rem 0.6rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {hex}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            className="heading"
            style={{ marginBottom: "1.5rem", color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Typography
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ padding: "1.75rem", background: "var(--dark-100)" }}>
              <p className="label" style={{ marginBottom: "1rem" }}>Serif — Display</p>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: "var(--text-primary)",
                }}
              >
                Cormorant Garamond
              </p>
              <p className="body-sm" style={{ marginTop: "0.5rem" }}>
                Headings, display text, pull quotes
              </p>
            </div>
            <div style={{ padding: "1.75rem", background: "var(--dark-100)" }}>
              <p className="label" style={{ marginBottom: "1rem" }}>Sans — Body</p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.1rem",
                  fontWeight: 300,
                  color: "var(--text-primary)",
                }}
              >
                DM Sans
              </p>
              <p className="body-sm" style={{ marginTop: "0.5rem" }}>
                Body copy, labels, UI elements
              </p>
            </div>
          </div>
        </section>

        {/* Press Contact */}
        <section style={{ marginBottom: "2rem" }}>
          <h2
            className="heading"
            style={{ marginBottom: "1.5rem", color: "var(--gold)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Press Contact
          </h2>
          <div
            style={{
              padding: "2rem",
              border: "1px solid var(--border)",
              background: "var(--dark-100)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>Press & Media Enquiries</p>
            <p className="body-sm">
              For interview requests, comment, photography, or any other press
              enquiry, please contact our communications team.
            </p>
            <a
              href="mailto:press@purtivon.com"
              style={{ fontSize: "0.85rem", color: "var(--gold)", marginTop: "0.25rem" }}
            >
              press@purtivon.com
            </a>
          </div>
        </section>

        <div
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/about" className="btn btn-outline btn-sm">
            About Us →
          </Link>
          <Link href="/contact" className="btn btn-ghost btn-sm">
            Contact the Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
