"use client";
import Link from "next/link";

const NAV_COLS = [
  {
    heading: "Company",
    links: [
      { label: "About Us",  href: "/about" },
      { label: "Services",  href: "/services" },
      { label: "Media Kit", href: "/media-kit" },
      { label: "Contact",   href: "/contact" },
    ],
  },
  {
    heading: "Awards",
    links: [
      { label: "Browse Awards",        href: "/awards" },
      { label: "Submit a Nomination",  href: "/awards" },
      { label: "Award Categories",     href: "/awards" },
      { label: "Past Winners",         href: "/winners" },
    ],
  },
  {
    heading: "Intelligence",
    links: [
      { label: "Global Insights", href: "/insights" },
      { label: "FDI Reports",     href: "/insights?category=Report" },
      { label: "ESG Analysis",    href: "/insights?category=ESG" },
      { label: "Analysis",        href: "/insights?category=Analysis" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",  href: "/privacy" },
      { label: "Terms of Service",href: "/terms" },
    ],
  },
];

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/purtivon",
    label: "LinkedIn",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: "https://x.com/Purtivon",
    label: "X (Twitter)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.259 5.63L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/purtivon",
    label: "Instagram",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ position: "relative", background: "#050712", overflow: "hidden" }}>
      {/* Globe wireframe background */}
      <div aria-hidden="true" style={{
        position: "absolute",
        right: -120, bottom: -80,
        width: 520, height: 520,
        opacity: 0.12,
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="260" cy="260" r="240" stroke="#C9A84C" strokeWidth="1"/>
          <circle cx="260" cy="260" r="160" stroke="#C9A84C" strokeWidth="0.75"/>
          <circle cx="260" cy="260" r="80"  stroke="#C9A84C" strokeWidth="0.5"/>
          <ellipse cx="260" cy="260" rx="240" ry="90"  stroke="#C9A84C" strokeWidth="0.75"/>
          <ellipse cx="260" cy="260" rx="240" ry="165" stroke="#C9A84C" strokeWidth="0.5"/>
          <path d="M20 260 Q260 80 500 260 Q260 440 20 260Z"   stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
          <path d="M260 20 Q440 260 260 500 Q80 260 260 20Z"   stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
          <line x1="20" y1="260" x2="500" y2="260" stroke="#C9A84C" strokeWidth="0.4"/>
          <line x1="260" y1="20"  x2="260" y2="500" stroke="#C9A84C" strokeWidth="0.4"/>
        </svg>
      </div>

      {/* Top gold gradient line */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C97A 50%, #C9A84C 70%, transparent 100%)" }} />

      {/* Main grid */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1200,
        margin: "0 auto",
        padding: "4rem 2.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr",
        gap: "3rem",
      }} className="footer-main-grid">

        {/* Brand column */}
        <div>
          {/* Wordmark */}
          <Link href="/" style={{ display: "inline-flex", flexDirection: "column", gap: "0.1rem", marginBottom: "1.5rem", textDecoration: "none" }} className="footer-wordmark">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{
                width: 28, height: 28,
                background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "#05071280", fontWeight: 900, fontSize: "0.8rem", lineHeight: 1 }}>P</span>
              </span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.25rem",
                fontWeight: 400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#C9A84C",
                transition: "text-shadow 0.3s ease",
              }} className="footer-wordmark-text">
                Purtivon
              </span>
            </div>
            <span style={{
              fontSize: "0.55rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.45)",
              paddingLeft: "2.2rem",
            }}>
              Global Awards & Intelligence
            </span>
          </Link>

          <p style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.85,
            maxWidth: 230,
            marginBottom: "2rem",
          }}>
            The global standard for FDI and financial services recognition. Connecting capital, excellence, and ambition across 48 countries.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
            {SOCIALS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                style={{
                  width: 34, height: 34,
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.35)",
                  borderRadius: 2,
                  transition: "border-color 0.25s, color 0.25s, transform 0.25s, box-shadow 0.25s",
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Stats mini */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { n: "48", label: "Countries" },
              { n: "500+", label: "Institutions" },
              { n: "5", label: "Years" },
            ].map(({ n, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 300, color: "#C9A84C", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {NAV_COLS.map(({ heading, links }) => (
          <div key={heading}>
            <p style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              marginBottom: "1.25rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              {heading}
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="footer-link"
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.03em",
                      transition: "color 0.2s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 2.5rem" }} />

      {/* Bottom bar */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1200,
        margin: "0 auto",
        padding: "1.25rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
          &copy; {year} Purtivon Limited. All rights reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }].map(({ label, href }) => (
            <Link key={label} href={href} className="footer-bottom-link" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}>
              {label}
            </Link>
          ))}
          <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)", display: "block" }} />
          <a
            href="mailto:press@purtivon.com"
            className="footer-email-link"
            style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", transition: "color 0.2s" }}
          >
            press@purtivon.com
          </a>
        </div>
      </div>

      <style>{`
        .footer-wordmark:hover .footer-wordmark-text { text-shadow: 0 0 28px rgba(201,168,76,0.6) !important; }
        .footer-social:hover { border-color: rgba(201,168,76,0.45) !important; color: #C9A84C !important; transform: translateY(-3px) !important; box-shadow: 0 4px 16px rgba(201,168,76,0.2) !important; }
        .footer-link:hover { color: #C9A84C !important; }
        .footer-bottom-link:hover { color: rgba(255,255,255,0.65) !important; }
        .footer-email-link:hover { color: #C9A84C !important; }
        @media (max-width: 1024px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 400px) {
          .footer-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
