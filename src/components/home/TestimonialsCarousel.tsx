"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "Winning the Purtivon FDI Award was a pivotal moment for our agency. The recognition opened doors with sovereign wealth funds and institutional investors we had been targeting for years.",
    name: "Adaeze Okonkwo",
    role: "Director General, West Africa Investment Authority",
    initials: "AO",
    region: "West Africa",
  },
  {
    quote:
      "The media coverage Purtivon orchestrated following our award win reached over forty financial publications across three continents. The ROI on our sponsorship was extraordinary.",
    name: "Henrik Brandt",
    role: "Head of Investor Relations, Nordic Capital Partners",
    initials: "HB",
    region: "Nordics",
  },
  {
    quote:
      "Their FDI intelligence reports are required reading for our investment committee. The depth of analysis on Southeast Asian markets is genuinely world-class.",
    name: "Priya Subramaniam",
    role: "Chief Investment Officer, Meridian Asset Management",
    initials: "PS",
    region: "Singapore",
  },
  {
    quote:
      "The Purtivon Global Awards gave our brand the credibility to enter new markets with confidence. Within six months of our win we had signed three new institutional mandates.",
    name: "Carlos Ybarra",
    role: "Managing Director, Ibero-American Infrastructure Fund",
    initials: "CY",
    region: "Latin America",
  },
  {
    quote:
      "In a noisy market, Purtivon's recognition stands out as genuinely independent. Our clients and prospects take it seriously — it has materially strengthened our pitch book.",
    name: "Amira Khalil",
    role: "CEO, Levant Capital Advisory",
    initials: "AK",
    region: "Middle East",
  },
  {
    quote:
      "The nomination process itself was insightful — it forced us to articulate our impact in ways that now inform our investor communications year-round.",
    name: "James Oduya",
    role: "CFO, Pan-African Development Bank",
    initials: "JO",
    region: "East Africa",
  },
];

// Triplicate for seamless infinite scroll
const ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  // Auto-advance dot indicator every 5s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      style={{ overflow: "hidden", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      <Image
        src="/images/testimonial-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top" }}
      />
      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }} className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div
                className="eyebrow"
                style={{ marginBottom: "0.5rem", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                Client Voices
              </div>
              <h2
                className="display-md"
                style={{ color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
              >
                Trusted by those who <em>lead</em>
              </h2>
            </div>
            {/* Dot indicators */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                alignItems: "center",
                paddingBottom: "0.35rem",
              }}
            >
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === active ? "#c9a84c" : "rgba(255,255,255,0.25)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.3s, background 0.3s",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling track — full bleed */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            ref={trackRef}
            className={paused ? "testi-track testi-paused" : "testi-track"}
            style={{ display: "flex", gap: "1.25rem", padding: "0.5rem 0 1.5rem" }}
          >
            {ITEMS.map((t, i) => (
              <blockquote
                key={i}
                className="testi-card"
                style={{
                  flexShrink: 0,
                  width: 360,
                  background: "rgba(10,10,15,0.75)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderTop: "2px solid rgba(201,168,76,0.45)",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  margin: 0,
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.5rem",
                    color: "rgba(201,168,76,0.35)",
                    lineHeight: 0.8,
                    userSelect: "none",
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.98rem",
                    fontStyle: "italic",
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: "#f0ede6",
                    flex: 1,
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  {t.quote}
                </p>
                <footer
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(201,168,76,0.15)",
                      border: "1px solid rgba(201,168,76,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#fff",
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.55)",
                        margin: "0.15rem 0 0",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.58rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(201,168,76,0.65)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.region}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Fade masks */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(-90deg, rgba(0,0,0,0.5), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        .testi-track {
          animation: testi-scroll 45s linear infinite;
        }
        .testi-paused {
          animation-play-state: paused !important;
        }
        @keyframes testi-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-360px * ${TESTIMONIALS.length} - 1.25rem * ${TESTIMONIALS.length})); }
        }
        .testi-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.3) !important;
        }
      `}</style>
    </section>
  );
}
