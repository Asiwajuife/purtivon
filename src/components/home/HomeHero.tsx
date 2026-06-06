"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type React from "react";
import type { HomepageArticle } from "./FeaturedArticles";

interface HomeHeroProps {
  articles?: HomepageArticle[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const HEADLINE_WORDS = ["Recognising", "the", "World's"];
const HEADLINE_ITALIC = "Investment Leaders";
const TOPICS = ["FDI Intelligence", "Awards", "ESG", "Analysis", "Financial Services", "Economy", "Tech", "Banks"];

export default function HomeHero({ articles = [] }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const globeY    = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "18%"]);
  const contentY  = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "10%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 0.12]);

  const heroArticle       = articles[0] ?? null;
  const secondaryArticles = articles.slice(1, 3);
  const hasArticles       = !!heroArticle;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#06070f",
        paddingTop: 68,
      }}
      aria-label="Hero: Purtivon Global FDI and Financial Services Awards"
    >
      {/* ── Background ── */}
      <motion.div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, opacity: bgOpacity }}
      >
        {/* Directional gold light — emanates from lower-left, guiding eye toward headline */}
        <div style={{
          position: "absolute", inset: 0,
          background: [
            "radial-gradient(ellipse 110% 85% at -8% 95%, rgba(201,168,76,0.13) 0%, transparent 52%)",
            "radial-gradient(ellipse 55% 45% at 28% 62%, rgba(201,168,76,0.055) 0%, transparent 50%)",
            "radial-gradient(ellipse 38% 28% at 92% 8%,  rgba(59,130,246,0.04) 0%, transparent 55%)",
          ].join(","),
        }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://static.independent.co.uk/2025/03/04/14/03/iStock-2054112501.jpeg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
            opacity: 0.32,
          }}
        />

        <div style={{ position: "absolute", inset: 0, background: "rgba(6,7,15,0.60)" }} />

        {/* Strong bottom vignette, lighter top */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(6,7,15,0.28) 0%, transparent 22%, transparent 52%, rgba(6,7,15,0.98) 100%)",
        }} />

        {/* Subtle noise grain */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: [
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          ].join(","),
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.45,
          mixBlendMode: "overlay",
        }} />

        {/* Fine dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.016) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }} />
      </motion.div>

      {/* ── Globe wireframe (fallback when no articles) ── */}
      {!hasArticles && (
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", right: "-8%", top: "50%",
            translateY: "-50%", width: "min(680px, 62vw)", aspectRatio: "1",
            y: globeY, opacity: 0.14, pointerEvents: "none", zIndex: 1,
          }}
        >
          <svg viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <circle cx="350" cy="350" r="320"  stroke="#C9A84C" strokeWidth="0.8"/>
            <circle cx="350" cy="350" r="220"  stroke="#C9A84C" strokeWidth="0.6"/>
            <circle cx="350" cy="350" r="120"  stroke="#C9A84C" strokeWidth="0.5"/>
            <circle cx="350" cy="350" r="50"   stroke="#C9A84C" strokeWidth="0.4"/>
            <ellipse cx="350" cy="350" rx="320" ry="110"  stroke="#C9A84C" strokeWidth="0.6"/>
            <ellipse cx="350" cy="350" rx="320" ry="200"  stroke="#C9A84C" strokeWidth="0.5"/>
            <ellipse cx="350" cy="350" rx="320" ry="280"  stroke="#C9A84C" strokeWidth="0.4"/>
            <ellipse cx="350" cy="350" rx="180" ry="320"  stroke="#3B82F6" strokeWidth="0.4"/>
            <path d="M30 350 Q350 100 670 350 Q350 600 30 350Z"  stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
            <path d="M350 30 Q600 350 350 670 Q100 350 350 30Z"  stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
            <line x1="30"  y1="350" x2="670" y2="350" stroke="#C9A84C" strokeWidth="0.35"/>
            <line x1="350" y1="30"  x2="350" y2="670" stroke="#C9A84C" strokeWidth="0.35"/>
            <path d="M200 200 L280 200 L280 240" stroke="#3B82F6" strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
            <path d="M420 450 L500 450 L500 490" stroke="#3B82F6" strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
            <circle cx="280" cy="240" r="3" fill="#3B82F6" opacity="0.5"/>
            <circle cx="200" cy="200" r="2" fill="#C9A84C" opacity="0.6"/>
            <circle cx="500" cy="490" r="3" fill="#3B82F6" opacity="0.5"/>
          </svg>
        </motion.div>
      )}

      {/* ── Main content ── */}
      <motion.div
        style={{
          position: "relative", zIndex: 2,
          flex: 1, display: "flex", flexDirection: "column",
          y: contentY,
        }}
      >
        {/* ── Edition / live strip ── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.05 }}
          className="hero-edition-strip"
          style={{
            borderTop: "1px solid rgba(201,168,76,0.08)",
            borderBottom: "1px solid rgba(201,168,76,0.10)",
            padding: "0.68rem 2.5rem",
            display: "flex", alignItems: "center", gap: "1.25rem",
            maxWidth: 1200, width: "100%", alignSelf: "center",
          }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.42rem",
            fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.24em",
            textTransform: "uppercase", color: "#c9a84c", flexShrink: 0,
          }}>
            <span aria-hidden="true" className="hero-live-dot"
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", display: "inline-block" }}
            />
            Live
          </span>

          <span aria-hidden="true" style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

          <span style={{
            fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.27)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            Global FDI &amp; Financial Services Awards &nbsp;·&nbsp; Volume V &nbsp;·&nbsp; Q2 2026 &nbsp;·&nbsp; 48 Countries
          </span>

          <Link href="/awards" className="hero-strip-link" style={{
            marginLeft: "auto",
            fontSize: "0.48rem", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)", textDecoration: "none",
            whiteSpace: "nowrap", flexShrink: 0, transition: "color 0.2s",
          }}>
            Nominations Open →
          </Link>
        </motion.div>

        {/* ── Two-column editorial grid ── */}
        <div
          className="hero-grid"
          style={{
            flex: 1, display: "grid",
            gridTemplateColumns: hasArticles ? "56% 44%" : "1fr",
            maxWidth: 1200, width: "100%", alignSelf: "center",
            padding: "0 2.5rem", alignItems: "center", minHeight: 0,
          }}
        >
          {/* ── LEFT: Brand identity ── */}
          <div
            className="hero-left-col"
            style={{
              padding: hasArticles ? "3.5rem 4.5rem 3.5rem 0" : "3.5rem 0",
              display: "flex", flexDirection: "column", justifyContent: "center",
              maxWidth: hasArticles ? undefined : 680,
            }}
          >
            {/* Eyebrow — tighter to headline for visual grouping */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.1rem" }}
            >
              <span style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, #C9A84C)", flexShrink: 0 }} />
              <span className="eyebrow" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}>
                Global FDI &amp; Financial Services Awards
              </span>
            </motion.div>

            {/* H1 — slower stagger for dramatic reveal */}
            <h1 className="display-xl" style={{ marginBottom: 0, maxWidth: 600, lineHeight: 1.04 }}>
              <span style={{ display: "block", overflow: "hidden" }}>
                {HEADLINE_WORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={prefersReducedMotion ? false : { y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.78, delay: 0.28 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: "inline-block", marginRight: "0.28em", color: "#fff" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span style={{ display: "block", overflow: "hidden", marginTop: "0.04em" }}>
                <motion.em
                  initial={prefersReducedMotion ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.78, delay: 0.28 + HEADLINE_WORDS.length * 0.14, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "inline-block", color: "#C9A84C" }}
                >
                  {HEADLINE_ITALIC}
                </motion.em>
              </span>
            </h1>

            {/* Gold rule — editorial separator between headline and body copy */}
            <motion.div
              initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.88, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 42, height: 2,
                background: "linear-gradient(90deg, #c9a84c, #e8c97a)",
                margin: "1.6rem 0",
                transformOrigin: "left",
              }}
            />

            {/* Subline */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.65, delay: 0.92, ease: [0.16, 1, 0.3, 1] }}
              style={{
                maxWidth: 458,
                fontSize: "0.94rem", lineHeight: 1.72,
                fontWeight: 300, color: "rgba(240,237,230,0.66)",
                marginBottom: "2.5rem",
              }}
            >
              The global standard for FDI and financial services recognition —
              connecting excellence, capital, and ambition across{" "}
              <strong style={{ color: "#C9A84C", fontWeight: 500 }}>48 countries</strong>.
            </motion.p>

            {/* CTAs — primary button + minimal text link for clear hierarchy */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1.02, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap", alignItems: "center" }}
            >
              <Link href="/awards" className="btn btn-primary btn-lg hero-cta-glow">
                Submit a Nomination
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link href="/insights" className="hero-explore-link" style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                fontSize: "0.76rem", letterSpacing: "0.11em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.48)", textDecoration: "none", fontWeight: 400,
                transition: "color 0.25s",
              }}>
                Explore Intelligence
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Article preview ── */}
          {hasArticles && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="hero-right-col"
              style={{
                padding: "3rem 0 3rem 3rem",
                display: "flex", flexDirection: "column", gap: "0.85rem",
                borderLeft: "1px solid rgba(201,168,76,0.12)",
                alignSelf: "stretch", justifyContent: "center",
              }}
            >
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "0.46rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.20)" }}>
                  Featured Intelligence
                </span>
                <Link href="/insights" className="hero-view-all" style={{
                  fontSize: "0.46rem", letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(201,168,76,0.58)", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: "0.28rem",
                  transition: "color 0.22s",
                }}>
                  View all
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* Primary article card — taller, better overlay, framed */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.72, delay: 0.80, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/insights/${heroArticle.slug}`} className="hero-article-main" style={{ display: "block", textDecoration: "none" }}>
                  <article style={{
                    position: "relative",
                    height: "min(368px, 39vh)",
                    borderRadius: 5, overflow: "hidden",
                    background: "#0c0d18",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    {heroArticle.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={heroArticle.coverImage}
                        alt={heroArticle.title}
                        className="hero-art-img"
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%", objectFit: "cover",
                          transition: "transform 0.72s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    ) : (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, #0D1020, #14183A, rgba(201,168,76,0.04))",
                      }} />
                    )}

                    {/* Overlay — shows more image in the upper half */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,7,15,0.97) 0%, rgba(6,7,15,0.52) 38%, rgba(6,7,15,0.10) 68%, rgba(6,7,15,0.02) 100%)" }} />

                    {/* Gold accent line on hover */}
                    <div className="hero-art-line" style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                      background: "linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)",
                      transform: "scaleX(0)", transformOrigin: "left",
                      transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
                    }} />

                    {/* Category badge */}
                    <div style={{ position: "absolute", top: "1.1rem", left: "1.2rem" }}>
                      <span className="badge badge--glass" style={{ fontSize: "0.5rem" }}>{heroArticle.category}</span>
                    </div>

                    {/* Content */}
                    <div style={{ position: "absolute", inset: 0, padding: "1.25rem 1.45rem", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.05rem, 1.6vw, 1.28rem)",
                        fontWeight: 300, lineHeight: 1.22,
                        color: "#F0EDE6", marginBottom: "0.45rem",
                      }}>
                        {heroArticle.title}
                      </h3>

                      {heroArticle.excerpt && (
                        <p style={{
                          fontSize: "0.75rem", color: "rgba(240,237,230,0.46)",
                          lineHeight: 1.62, marginBottom: "0.85rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        } as React.CSSProperties}>
                          {heroArticle.excerpt}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.57rem", color: "rgba(240,237,230,0.30)" }}>{fmtDate(heroArticle.publishedAt)}</span>
                        {heroArticle.readTime && (
                          <span style={{ fontSize: "0.57rem", color: "rgba(201,168,76,0.56)" }}>{heroArticle.readTime} min read</span>
                        )}
                        <span className="hero-art-cta" style={{
                          marginLeft: "auto",
                          fontSize: "0.53rem", letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "#c9a84c", opacity: 0, transform: "translateX(-8px)",
                          transition: "opacity 0.28s, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
                          display: "flex", alignItems: "center", gap: "0.3rem",
                        }}>
                          Read Article
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>

              {/* Secondary strips — staggered entrance, editorial index numbers */}
              {secondaryArticles.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.92 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/insights/${a.slug}`} className="hero-sec-link" style={{ display: "block", textDecoration: "none" }}>
                    <div className="hero-sec-row" style={{
                      display: "flex", gap: "0.95rem", alignItems: "center",
                      padding: "0.82rem 0.95rem", borderRadius: 5,
                      background: "rgba(255,255,255,0.012)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "background 0.22s, border-color 0.22s",
                    }}>
                      {/* Index */}
                      <span style={{
                        fontSize: "0.62rem", fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300, color: "rgba(201,168,76,0.28)",
                        flexShrink: 0, minWidth: "1.4rem", lineHeight: 1,
                      }}>
                        0{i + 2}
                      </span>

                      {/* Thumbnail */}
                      <div style={{
                        width: 58, height: 42, flexShrink: 0,
                        borderRadius: 3, overflow: "hidden",
                        background: "linear-gradient(135deg, #0D1020, #1A1E30)",
                      }}>
                        {a.coverImage && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={a.coverImage} alt="" aria-hidden="true" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: "0.46rem", letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "#c9a84c", display: "block", marginBottom: "0.22rem",
                        }}>
                          {a.category}
                        </span>
                        <p style={{
                          fontSize: "0.8rem",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 400, lineHeight: 1.28,
                          color: "rgba(240,237,230,0.75)",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        } as React.CSSProperties}>
                          {a.title}
                        </p>
                      </div>

                      <svg
                        width="10" height="10" viewBox="0 0 24 24"
                        fill="none" strokeWidth={2} aria-hidden="true"
                        style={{ flexShrink: 0, transition: "stroke 0.22s" }}
                        className="hero-sec-arrow"
                        stroke="rgba(201,168,76,0.28)"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Topics navigation strip ── */}
        <motion.nav
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1.5 }}
          aria-label="Content topics"
          className="hero-topics-strip"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "0.85rem 2.5rem",
            display: "flex", alignItems: "center",
            overflowX: "auto",
            maxWidth: 1200, width: "100%", alignSelf: "center",
            scrollbarWidth: "none",
          }}
        >
          <span aria-hidden="true" style={{
            fontSize: "0.44rem", letterSpacing: "0.24em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.17)", flexShrink: 0, marginRight: "1.5rem",
          }}>
            Topics
          </span>

          {TOPICS.map((topic, i) => (
            <span key={topic} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span aria-hidden="true" style={{
                  width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(255,255,255,0.09)", margin: "0 0.9rem", flexShrink: 0,
                }} />
              )}
              <Link href="/insights" className="hero-topic-link" style={{
                fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.30)", textDecoration: "none",
                whiteSpace: "nowrap", transition: "color 0.2s",
              }}>
                {topic}
              </Link>
            </span>
          ))}

          <span style={{ marginLeft: "auto", paddingLeft: "2rem", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.44rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Scroll</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="rgba(201,168,76,0.38)" strokeWidth={1.5} className="animate-bounce-down">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </span>
        </motion.nav>
      </motion.div>

      <style>{`
        .hero-live-dot {
          animation: hero-live-pulse 2.6s ease-in-out infinite;
        }
        @keyframes hero-live-pulse {
          0%, 100% { opacity: 1;    box-shadow: 0 0 8px rgba(201,168,76,1.0); }
          50%       { opacity: 0.32; box-shadow: 0 0 2px rgba(201,168,76,0.12); }
        }
        .hero-strip-link:hover     { color: rgba(255,255,255,0.55) !important; }
        .hero-view-all:hover       { color: #e8c97a !important; }
        .hero-explore-link:hover   { color: rgba(255,255,255,0.84) !important; }
        .hero-article-main:hover .hero-art-img  { transform: scale(1.04); }
        .hero-article-main:hover .hero-art-line { transform: scaleX(1) !important; }
        .hero-article-main:hover .hero-art-cta  { opacity: 1 !important; transform: translateX(0) !important; }
        .hero-sec-row:hover        { background: rgba(201,168,76,0.03) !important; border-color: rgba(201,168,76,0.14) !important; }
        .hero-sec-link:hover .hero-sec-arrow { stroke: rgba(201,168,76,0.68) !important; }
        .hero-topic-link:hover     { color: rgba(201,168,76,0.82) !important; }
        .hero-topics-strip::-webkit-scrollbar { display: none; }
        @media (max-width: 960px) {
          .hero-grid           { grid-template-columns: 1fr !important; }
          .hero-edition-strip  { padding: 0.55rem 1.5rem !important; }
          .hero-topics-strip   { padding: 0.65rem 1.5rem !important; }
          .hero-right-col      { border-left: none !important; border-top: 1px solid rgba(201,168,76,0.12) !important; padding: 2rem 0 !important; }
        }
        @media (max-width: 600px) {
          .hero-grid         { padding: 0 1.25rem !important; }
          .hero-left-col     { padding: 2rem 0 !important; }
          .hero-topics-strip { display: none !important; }
        }
      `}</style>
    </section>
  );
}
