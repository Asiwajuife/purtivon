"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AWARDS_ITEMS = [
  { label: "Winners",     href: "/winners" },
  { label: "Nominations", href: "/awards" },
];

const INSIGHTS_CATEGORIES = [
  { label: "Featured Insight",               href: "/insights?category=Featured+Insight" },
  { label: "Awards",                         href: "/insights?category=Awards" },
  { label: "Report",                         href: "/insights?category=Report" },
  { label: "Analysis",                       href: "/insights?category=Analysis" },
  { label: "News",                           href: "/insights?category=News" },
  { label: "FDI Intelligence",               href: "/insights?category=FDI+Intelligence" },
  { label: "Financial Services",             href: "/insights?category=Financial+Services+Intelligence" },
  { label: "Banks",                          href: "/insights?category=Banks" },
  { label: "Economy",                        href: "/insights?category=Economy" },
  { label: "Technology",                     href: "/insights?category=Tech" },
  { label: "ESG",                            href: "/insights?category=ESG" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const awardsRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setInsightsOpen(false);
    setAwardsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInsightsOpen(false);
      }
      if (awardsRef.current && !awardsRef.current.contains(e.target as Node)) {
        setAwardsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isInsightsActive = pathname.startsWith("/insights");

  return (
    <>
      {/* ── Header bar ── */}
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          background: scrolled ? "rgba(7,7,16,1)" : "rgba(7,7,16,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.5)" : "none",
          padding: "0.75rem 0",
        }}
      >
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link
            href="/"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.currentTarget.blur()}
            style={{ outline: "none", boxShadow: "none", border: "none", display: "block", userSelect: "none", WebkitTapHighlightColor: "transparent", textDecoration: "none" }}
          >
            <span style={{
              display: "block",
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
              fontSize: "0.875rem",
              fontWeight: 300,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#d4a843",
              userSelect: "none",
            }}>
              Purtivon
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul style={{ display: "flex", alignItems: "center", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }} className="navbar-desktop-links">

            {/* Awards dropdown */}
            <li style={{ position: "relative" }} ref={awardsRef}>
              <button
                onClick={() => setAwardsOpen((v) => !v)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  fontWeight: 500,
                  color: (pathname.startsWith("/awards") || pathname.startsWith("/winners")) ? "#c9a84c" : "var(--nav-link)",
                  padding: 0, position: "relative",
                }}
                className="navbar-link navbar-awards-btn"
                aria-expanded={awardsOpen}
              >
                Awards
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  style={{ transition: "transform 0.2s", transform: awardsOpen ? "rotate(180deg)" : "none", flexShrink: 0, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
                <span style={{ position: "absolute", bottom: -4, left: 0, height: 1, width: (pathname.startsWith("/awards") || pathname.startsWith("/winners")) ? "100%" : 0, background: "#c9a84c", transition: "width 0.3s" }} className="navbar-link-underline" />
              </button>

              {awardsOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 1rem)", left: "50%",
                  transform: "translateX(-50%)", minWidth: 200,
                  background: "var(--nav-dropdown)", border: "1px solid rgba(201,168,76,0.15)",
                  borderTop: "2px solid #c9a84c", backdropFilter: "blur(16px)",
                  padding: "0.5rem 0", zIndex: 60, boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                }}>
                  {AWARDS_ITEMS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      style={{
                        display: "block", padding: "0.6rem 1rem",
                        fontSize: "0.73rem", color: "var(--text-mid)",
                        textDecoration: "none", letterSpacing: "0.03em",
                        transition: "color 0.15s, background 0.15s",
                      }}
                      className="navbar-dropdown-item"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Insights dropdown */}
            <li style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setInsightsOpen((v) => !v)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  fontWeight: 500,
                  color: isInsightsActive ? "#c9a84c" : "var(--nav-link)",
                  padding: 0, position: "relative",
                }}
                className="navbar-link navbar-insights-btn"
                aria-expanded={insightsOpen}
              >
                Insights
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  style={{ transition: "transform 0.2s", transform: insightsOpen ? "rotate(180deg)" : "none", flexShrink: 0, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
                <span style={{ position: "absolute", bottom: -4, left: 0, height: 1, width: isInsightsActive ? "100%" : 0, background: "#c9a84c", transition: "width 0.3s" }} className="navbar-link-underline" />
              </button>

              {insightsOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 1rem)", left: "50%",
                  transform: "translateX(-50%)", minWidth: 240,
                  background: "var(--nav-dropdown)", border: "1px solid rgba(201,168,76,0.15)",
                  borderTop: "2px solid #c9a84c", backdropFilter: "blur(16px)",
                  padding: "0.5rem 0", zIndex: 60, boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                }}>
                  <div style={{ padding: "0.5rem 1rem 0.75rem", borderBottom: "1px solid var(--border-faint)", marginBottom: "0.25rem" }}>
                    <Link href="/insights" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", textDecoration: "none" }}>
                      All Insights →
                    </Link>
                  </div>
                  {INSIGHTS_CATEGORIES.map(({ label, href }) => (
                    <Link key={href} href={href}
                      style={{ display: "block", padding: "0.6rem 1rem", fontSize: "0.73rem", color: "var(--text-mid)", textDecoration: "none", letterSpacing: "0.03em", transition: "color 0.15s, background 0.15s" }}
                      className="navbar-dropdown-item"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* About, Services, Contact */}
            {[{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ position: "relative", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: isActive ? "#c9a84c" : "var(--nav-link)", textDecoration: "none", display: "inline-block" }}
                    className="navbar-link"
                  >
                    {label}
                    <span style={{ position: "absolute", bottom: -4, left: 0, height: 1, width: isActive ? "100%" : 0, background: "#c9a84c", transition: "width 0.3s" }} className="navbar-link-underline" />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="navbar-desktop-actions">
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", background: "linear-gradient(90deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}
              >
                Dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/awards"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", border: "1px solid rgba(201,168,76,0.6)", color: "#c9a84c", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}
                className="navbar-nominate-btn"
              >
                Submit Nomination
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ display: "none", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: 6, width: 32, height: 32, background: "none", border: "none", cursor: "pointer", padding: 0, outline: "none", flexShrink: 0 }}
            className="navbar-hamburger"
          >
            <span style={{ display: "block", width: 24, height: 1, background: "var(--text-hi)", transformOrigin: "right center", transition: "transform 0.3s, width 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(3px)" : "none" }} />
            <span style={{ display: "block", width: 16, height: 1, background: "#c9a84c", transition: "opacity 0.3s, width 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 24, height: 1, background: "var(--text-hi)", transformOrigin: "right center", transition: "transform 0.3s, width 0.3s", transform: menuOpen ? "rotate(45deg) translateY(-3px)" : "none" }} />
          </button>
        </nav>
      </header>

      {/* ── Mobile fullscreen menu overlay ── */}
      <div
        aria-hidden={!menuOpen}
        style={{ position: "fixed", inset: 0, zIndex: 40, display: "none", transition: "opacity 0.5s", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
        className="navbar-mobile-overlay"
      >
        <div style={{ position: "absolute", inset: 0, background: "var(--mobile-overlay)", backdropFilter: "blur(16px)" }} onClick={() => setMenuOpen(false)} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "5rem 2rem 2rem", maxWidth: 480, margin: "0 auto", overflowY: "auto" }}>
          <div style={{ position: "absolute", top: "25%", right: "2rem", width: 128, height: 128, borderRadius: "50%", background: "rgba(201,168,76,0.05)", filter: "blur(40px)", pointerEvents: "none" }} />

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Awards — expandable */}
            <li style={{ transition: `opacity 0.5s ${menuOpen ? 0 * 60 + 100 : 0}ms, transform 0.5s ${menuOpen ? 0 * 60 + 100 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-16px)" }}>
              <div style={{ borderBottom: "1px solid var(--border-faint)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif", fontSize: "1.75rem", fontWeight: 300, letterSpacing: "0.03em", color: (pathname.startsWith("/awards") || pathname.startsWith("/winners")) ? "#c9a84c" : "var(--text-lo)" }}>Awards</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "0.75rem" }}>
                  {AWARDS_ITEMS.map(({ label, href }) => (
                    <Link key={href} href={href}
                      style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", border: "1px solid var(--border-dim)", padding: "0.3rem 0.65rem", textDecoration: "none", borderRadius: 2 }}
                      className="navbar-mobile-cat"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Insights — expandable */}
            <li style={{ transition: `opacity 0.5s ${menuOpen ? 1 * 60 + 100 : 0}ms, transform 0.5s ${menuOpen ? 1 * 60 + 100 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-16px)" }}>
              <div style={{ borderBottom: "1px solid var(--border-faint)" }}>
                <Link href="/insights" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", color: isInsightsActive ? "#c9a84c" : "var(--text-lo)", textDecoration: "none" }} className="navbar-mobile-link">
                  <span style={{ fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif", fontSize: "1.75rem", fontWeight: 300, letterSpacing: "0.03em" }}>Insights</span>
                </Link>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "0.75rem" }}>
                  {INSIGHTS_CATEGORIES.map(({ label, href }) => (
                    <Link key={href} href={href}
                      style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", border: "1px solid var(--border-dim)", padding: "0.3rem 0.65rem", textDecoration: "none", borderRadius: 2 }}
                      className="navbar-mobile-cat"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* About, Services, Contact */}
            {[{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }].map(({ label, href }, i) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href} style={{ transition: `opacity 0.5s ${menuOpen ? (i + 2) * 60 + 100 : 0}ms, transform 0.5s ${menuOpen ? (i + 2) * 60 + 100 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-16px)" }}>
                  <Link href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: `1px solid ${isActive ? "rgba(201,168,76,0.3)" : "var(--border-faint)"}`, color: isActive ? "#c9a84c" : "var(--text-lo)", textDecoration: "none" }} className="navbar-mobile-link">
                    <span style={{ fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif", fontSize: "1.75rem", fontWeight: 300, letterSpacing: "0.03em" }}>{label}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#c9a84c" : "var(--text-4)"} strokeWidth={1.5} style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA + theme toggle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", transition: `opacity 0.5s ${menuOpen ? "400ms" : "0ms"}, transform 0.5s ${menuOpen ? "400ms" : "0ms"}`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(16px)" }}>
            {session ? (
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.875rem", background: "linear-gradient(90deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/awards" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.875rem", background: "linear-gradient(90deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                Submit Nomination
              </Link>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ThemeToggle />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-4)" }}>Toggle theme</span>
            </div>
          </div>

          <p style={{ position: "absolute", bottom: "2rem", left: "2rem", color: "var(--text-5)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Global FDI & Financial Media
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .navbar-desktop-links { display: flex !important; }
          .navbar-desktop-actions { display: flex !important; }
          .navbar-hamburger { display: none !important; }
          .navbar-mobile-overlay { display: none !important; }
        }
        @media (max-width: 767px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-desktop-actions { display: none !important; }
          .navbar-hamburger { display: flex !important; }
          .navbar-mobile-overlay { display: block !important; }
        }
        .navbar-link:hover { color: var(--gold) !important; }
        .navbar-link:hover .navbar-link-underline { width: 100% !important; }
        .navbar-insights-btn:hover { color: var(--gold) !important; }
        .navbar-awards-btn:hover { color: var(--gold) !important; }
        .navbar-nominate-btn:hover { background: rgba(201,168,76,0.1) !important; }
        .navbar-mobile-link:hover { color: var(--gold) !important; }
        .navbar-mobile-cat:hover { color: var(--text-mid) !important; border-color: var(--border-hover) !important; }
        .navbar-dropdown-item:hover { color: var(--text-hi) !important; background: rgba(201,168,76,0.06) !important; }
        .theme-toggle-btn:hover { background: rgba(201,168,76,0.1) !important; border-color: rgba(201,168,76,0.3) !important; }
      `}</style>
    </>
  );
}
