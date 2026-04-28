"use client";
import Link from "next/link";

const NAV_COLS = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Awards",
    links: [
      { label: "Browse Awards", href: "/awards" },
      { label: "Submit a Nomination", href: "/awards" },
      { label: "Award Categories", href: "/awards" },
    ],
  },
  {
    heading: "Intelligence",
    links: [
      { label: "Global Insights", href: "/insights" },
      { label: "FDI Reports", href: "/insights" },
      { label: "ESG Analysis", href: "/insights" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--surface-page)", borderTop: "1px solid var(--border-faint)" }}>
      {/* Gold accent line */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #c9a84c 30%, #c9a84c 70%, transparent)" }} />

      {/* Main grid */}
      <div style={{
        maxWidth: 1160,
        margin: "0 auto",
        padding: "3.5rem 2.5rem 2.5rem",
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
        gap: "3rem",
      }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <span style={{
              position: "relative",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
              flexShrink: 0,
            }}>
              <span style={{ color: "var(--surface-page)", fontWeight: 900, fontSize: "0.7rem", lineHeight: 1 }}>P</span>
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-mid)",
            }}>
              Purtivon
            </span>
          </Link>

          <p style={{
            fontSize: "0.78rem",
            color: "var(--text-4)",
            lineHeight: 1.8,
            maxWidth: 220,
            marginBottom: "1.75rem",
          }}>
            The global standard for FDI and financial services recognition. Connecting capital, excellence, and ambition across 48 countries.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {[
              {
                href: "https://www.linkedin.com/company/purtivon",
                label: "LinkedIn",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
              },
              {
                href: "https://x.com/Purtivon",
                label: "X (Twitter)",
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.259 5.63L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ),
              },
              {
                href: "https://www.instagram.com/purtivon?igsh=MW1kMmJyemtlenhwNw==",
                label: "Instagram",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 32, height: 32,
                  border: "1px solid var(--border-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-4)",
                  transition: "border-color 0.2s, color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#c9a84c";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-dim)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-4)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {NAV_COLS.map(({ heading, links }) => (
          <div key={heading}>
            <p style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--text-5)",
              marginBottom: "1.1rem",
            }}>
              {heading}
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-lo)",
                      letterSpacing: "0.02em",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c9a84c")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-lo)")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid var(--border-faint)",
        maxWidth: 1160,
        margin: "0 auto",
        padding: "1.25rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <p style={{ fontSize: "0.72rem", color: "var(--text-5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          &copy; {year} Purtivon Limited. All rights reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/privacy"
            style={{ fontSize: "0.72rem", color: "var(--text-5)", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-lo)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-5)")}
          >
            Privacy
          </Link>
          <span style={{ width: 1, height: 10, background: "var(--border-dim)", display: "block" }} />
          <Link
            href="/terms"
            style={{ fontSize: "0.72rem", color: "var(--text-5)", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-lo)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-5)")}
          >
            Terms
          </Link>
          <span style={{ width: 1, height: 10, background: "var(--border-dim)", display: "block" }} />
          <a
            href="mailto:press@purtivon.com"
            style={{ fontSize: "0.72rem", color: "var(--text-5)", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c9a84c")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-5)")}
          >
            press@purtivon.com
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
