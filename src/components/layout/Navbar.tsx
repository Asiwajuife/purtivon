"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const AWARDS_ITEMS = [
  { label: "Winners",     href: "/winners",  desc: "Hall of recognition" },
  { label: "Nominations", href: "/awards",   desc: "Submit your institution" },
];

const INSIGHTS_CATEGORIES = [
  { label: "Featured Insight",        href: "/insights?category=Featured+Insight" },
  { label: "Awards",                   href: "/insights?category=Awards" },
  { label: "Report",                   href: "/insights?category=Report" },
  { label: "Analysis",                 href: "/insights?category=Analysis" },
  { label: "News",                     href: "/insights?category=News" },
  { label: "FDI Intelligence",         href: "/insights?category=FDI+Intelligence" },
  { label: "Financial Services",       href: "/insights?category=Financial+Services+Intelligence" },
  { label: "Banks",                    href: "/insights?category=Banks" },
  { label: "Economy",                  href: "/insights?category=Economy" },
  { label: "Technology",               href: "/insights?category=Tech" },
  { label: "ESG",                      href: "/insights?category=ESG" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [awardsOpen,   setAwardsOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const awardsRef   = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setInsightsOpen(false);
      if (awardsRef.current   && !awardsRef.current.contains(e.target as Node))   setAwardsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isAwardsActive   = pathname.startsWith("/awards") || pathname.startsWith("/winners");
  const isInsightsActive = pathname.startsWith("/insights");

  const navBg = scrolled
    ? "rgba(5, 7, 18, 0.96)"
    : "rgba(5, 7, 18, 0.82)";

  const boxShadow = scrolled
    ? "0 4px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(201,168,76,0.12) inset"
    : "none";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.06)"}`,
          boxShadow,
          transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        <nav style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}>

          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="Purtivon — Home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              outline: "none",
              flexShrink: 0,
            }}
          >
            <span style={{
              width: 26, height: 26,
              background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ color: "#07071080", fontWeight: 900, fontSize: "0.75rem", lineHeight: 1 }}>P</span>
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#C9A84C",
              transition: "text-shadow 0.3s ease",
            }}
              className="nav-logo-text"
            >
              Purtivon
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: "2.25rem",
            listStyle: "none",
            margin: 0, padding: 0,
          }} className="nb-desktop-links">

            {/* Awards dropdown */}
            <li
              style={{ position: "relative" }}
              ref={awardsRef}
              onMouseEnter={() => { setAwardsOpen(true);  setInsightsOpen(false); }}
              onMouseLeave={() => setAwardsOpen(false)}
            >
              <button
                onClick={() => { setAwardsOpen(v => !v); setInsightsOpen(false); }}
                aria-expanded={awardsOpen}
                aria-haspopup="true"
                className="nb-link nb-btn"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  fontWeight: 500, padding: 0, position: "relative",
                  color: isAwardsActive ? "#C9A84C" : "rgba(255,255,255,0.72)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Awards
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ transition: "transform 0.25s", transform: awardsOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
                <span className="nb-underline" style={{ position: "absolute", bottom: -4, left: 0, height: 1, background: "#C9A84C", transition: "width 0.3s", width: isAwardsActive ? "100%" : "0%" }} />
              </button>

              {/* Invisible hover bridge — prevents gap from closing dropdown */}
              <div aria-hidden="true" style={{ position: "absolute", top: "100%", left: "-20px", right: "-20px", height: 16, background: "transparent" }} />
              <div
                className={`nb-dropdown${awardsOpen ? " open" : ""}`}
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  minWidth: 220,
                  background: "rgba(5,7,18,0.96)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  borderTop: "2px solid #C9A84C",
                  padding: "0.5rem 0",
                  zIndex: 60,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.05)",
                  transformOrigin: "top center",
                  pointerEvents: awardsOpen ? "auto" : "none",
                  opacity: awardsOpen ? 1 : 0,
                  transition: "opacity 0.22s ease, transform 0.22s ease",
                  transform: awardsOpen ? "translateX(-50%) scaleY(1)" : "translateX(-50%) scaleY(0.92)",
                }}
              >
                {AWARDS_ITEMS.map(({ label, href, desc }, i) => (
                  <Link
                    key={href}
                    href={href}
                    className="nb-dd-item"
                    style={{
                      display: "flex", flexDirection: "column",
                      padding: "0.65rem 1.1rem",
                      textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>{label}</span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", marginTop: "0.15rem", letterSpacing: "0.04em" }}>{desc}</span>
                  </Link>
                ))}
              </div>
            </li>

            {/* Insights dropdown */}
            <li
              style={{ position: "relative" }}
              ref={dropdownRef}
              onMouseEnter={() => { setInsightsOpen(true);  setAwardsOpen(false); }}
              onMouseLeave={() => setInsightsOpen(false)}
            >
              <button
                onClick={() => { setInsightsOpen(v => !v); setAwardsOpen(false); }}
                aria-expanded={insightsOpen}
                aria-haspopup="true"
                className="nb-link nb-btn"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  fontWeight: 500, padding: 0, position: "relative",
                  color: isInsightsActive ? "#C9A84C" : "rgba(255,255,255,0.72)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Insights
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ transition: "transform 0.25s", transform: insightsOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
                <span className="nb-underline" style={{ position: "absolute", bottom: -4, left: 0, height: 1, background: "#C9A84C", transition: "width 0.3s", width: isInsightsActive ? "100%" : "0%" }} />
              </button>

              {/* Invisible hover bridge */}
              <div aria-hidden="true" style={{ position: "absolute", top: "100%", left: "-20px", right: "-20px", height: 16, background: "transparent" }} />
              <div
                className={`nb-dropdown${insightsOpen ? " open" : ""}`}
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  transform: insightsOpen ? "translateX(-50%) scaleY(1)" : "translateX(-50%) scaleY(0.92)",
                  minWidth: 260,
                  background: "rgba(5,7,18,0.96)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  borderTop: "2px solid #C9A84C",
                  padding: "0.5rem 0",
                  zIndex: 60,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                  transformOrigin: "top center",
                  pointerEvents: insightsOpen ? "auto" : "none",
                  opacity: insightsOpen ? 1 : 0,
                  transition: "opacity 0.22s ease, transform 0.22s ease",
                }}
              >
                <div style={{ padding: "0.4rem 1.1rem 0.65rem", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "0.25rem" }}>
                  <Link href="/insights" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A84C", textDecoration: "none" }}>
                    All Insights →
                  </Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {INSIGHTS_CATEGORIES.map(({ label, href }, i) => (
                    <Link
                      key={href}
                      href={href}
                      className="nb-dd-item"
                      style={{
                        display: "block",
                        padding: "0.5rem 1.1rem",
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.62)",
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        transition: "color 0.15s, background 0.15s",
                        animationDelay: `${i * 30}ms`,
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Static links */}
            {[{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="nb-link"
                    style={{
                      position: "relative",
                      fontSize: "0.72rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      color: isActive ? "#C9A84C" : "rgba(255,255,255,0.72)",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    {label}
                    <span className="nb-underline" style={{ position: "absolute", bottom: -4, left: 0, height: 1, background: "#C9A84C", transition: "width 0.3s", width: isActive ? "100%" : "0%" }} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }} className="nb-desktop-actions">
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  padding: "0.5rem 1.25rem",
                  background: "linear-gradient(90deg, #C9A84C, #E8C97A)",
                  color: "#07071080",
                  fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                  textDecoration: "none", borderRadius: 2,
                  transition: "box-shadow 0.25s, transform 0.25s",
                }}
                className="nb-cta-btn"
              >
                Dashboard
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  style={{
                    display: "flex", alignItems: "center",
                    padding: "0.5rem 1rem",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                    textDecoration: "none", borderRadius: 2,
                    transition: "color 0.2s",
                  }}
                  className="nb-signin-btn"
                >
                  Sign In
                </Link>
                <Link
                  href="/awards"
                  style={{
                    display: "flex", alignItems: "center", gap: "0.45rem",
                    padding: "0.5rem 1.25rem",
                    border: "1px solid rgba(201,168,76,0.55)",
                    color: "#C9A84C",
                    fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                    textDecoration: "none", borderRadius: 2,
                    transition: "all 0.25s ease",
                  }}
                  className="nb-nominate-btn"
                >
                  Submit Nomination
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="nb-hamburger"
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 6,
              width: 34, height: 34,
              background: "none", border: "none",
              cursor: "pointer", padding: 0, flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(255,255,255,0.9)", transition: "transform 0.3s, width 0.3s", transform: menuOpen ? "rotate(-45deg) translate(0px, 5px)" : "none" }} />
            <span style={{ display: "block", width: 16, height: 1.5, background: "#C9A84C", transition: "opacity 0.2s, width 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(255,255,255,0.9)", transition: "transform 0.3s, width 0.3s", transform: menuOpen ? "rotate(45deg) translate(0px, -5px)" : "none" }} />
          </button>
        </nav>
      </header>

      {/* ── Mobile fullscreen overlay ── */}
      <div
        aria-hidden={!menuOpen}
        className="nb-mobile-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 99,
          display: "none", flexDirection: "column",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,7,18,0.97)", backdropFilter: "blur(20px)" }} onClick={() => setMenuOpen(false)} />

        <div style={{
          position: "relative", flex: 1,
          display: "flex", flexDirection: "column",
          maxWidth: 480, margin: "0 auto", width: "100%",
          overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "20%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "30%", left: "5%", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Scroll area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "5.5rem 2rem 0" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Awards */}
              <li style={{ transition: `opacity 0.5s ${menuOpen ? 80 : 0}ms, transform 0.5s ${menuOpen ? 80 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-20px)" }}>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ padding: "1rem 0 0.6rem" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 300, color: isAwardsActive ? "#C9A84C" : "rgba(255,255,255,0.5)" }}>Awards</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingBottom: "1rem" }}>
                    {AWARDS_ITEMS.map(({ label, href }) => (
                      <Link key={href} href={href} className="nb-mobile-pill" style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.35rem 0.75rem", textDecoration: "none", borderRadius: 2, transition: "color 0.2s, border-color 0.2s" }}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Insights */}
              <li style={{ transition: `opacity 0.5s ${menuOpen ? 160 : 0}ms, transform 0.5s ${menuOpen ? 160 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-20px)" }}>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <Link href="/insights" style={{ display: "block", padding: "1rem 0 0.6rem", color: isInsightsActive ? "#C9A84C" : "rgba(255,255,255,0.5)", textDecoration: "none" }} className="nb-mobile-link">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 300 }}>Insights</span>
                  </Link>
                  <p style={{ fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 0.5rem" }}>Filter by topic</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingBottom: "1rem" }}>
                    {INSIGHTS_CATEGORIES.map(({ label, href }) => (
                      <Link key={href} href={href} className="nb-mobile-pill" style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.35rem 0.75rem", textDecoration: "none", borderRadius: 2, transition: "color 0.2s, border-color 0.2s" }}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Static links */}
              {[{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }].map(({ label, href }, i) => (
                <li key={href} style={{ transition: `opacity 0.5s ${menuOpen ? (i + 2) * 60 + 100 : 0}ms, transform 0.5s ${menuOpen ? (i + 2) * 60 + 100 : 0}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateX(0)" : "translateX(-20px)" }}>
                  <Link href={href} className="nb-mobile-link" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 300 }}>{label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            <div style={{ height: "1rem" }} />
          </div>

          {/* Sticky bottom */}
          <div style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(201,168,76,0.2)",
            padding: "1.25rem 2rem",
            background: "rgba(5,7,18,0.96)",
            transition: `opacity 0.5s ${menuOpen ? "360ms" : "0ms"}, transform 0.5s ${menuOpen ? "360ms" : "0ms"}`,
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
          }}>
            {session ? (
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.9rem", background: "linear-gradient(90deg, #C9A84C, #E8C97A)", color: "#07071080", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                Go to Dashboard
              </Link>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link href="/awards" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.9rem", background: "linear-gradient(90deg, #C9A84C, #E8C97A)", color: "#07071080", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                  Submit Nomination
                </Link>
                <Link href="/admin/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.65rem", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2, transition: "border-color 0.2s, color 0.2s" }}>
                  Sign In to Dashboard
                </Link>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
              <ThemeToggle />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Toggle theme</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nb-desktop-links   { display: flex !important; }
          .nb-desktop-actions { display: flex !important; }
          .nb-hamburger       { display: none !important; }
          .nb-mobile-overlay  { display: none !important; }
        }
        @media (max-width: 767px) {
          .nb-desktop-links   { display: none !important; }
          .nb-desktop-actions { display: none !important; }
          .nb-hamburger       { display: flex !important; }
          .nb-mobile-overlay  { display: flex !important; }
        }
        .nb-link:hover { color: #C9A84C !important; }
        .nb-btn:hover  { color: #C9A84C !important; }
        .nb-link:hover .nb-underline { width: 100% !important; }
        .nb-btn:hover  .nb-underline { width: 100% !important; }
        .nb-dd-item:hover { color: #f0ede6 !important; background: rgba(201,168,76,0.07) !important; }
        .nb-dd-item:hover span:first-child { color: #C9A84C !important; }
        .nb-mobile-link:hover { color: #C9A84C !important; }
        .nb-mobile-pill:hover { color: rgba(255,255,255,0.85) !important; border-color: rgba(255,255,255,0.22) !important; }
        .nb-cta-btn:hover    { box-shadow: 0 0 20px rgba(201,168,76,0.4); transform: translateY(-1px); }
        .nb-nominate-btn:hover { background: rgba(201,168,76,0.08) !important; box-shadow: 0 0 16px rgba(201,168,76,0.25); }
        .nb-signin-btn:hover { color: rgba(255,255,255,0.85) !important; }
        .nav-logo-text:hover { text-shadow: 0 0 24px rgba(201,168,76,0.5) !important; }
      `}</style>
    </>
  );
}
