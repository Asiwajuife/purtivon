"use client";
import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "Winning the Purtivon FDI Award was a pivotal moment for our agency. The recognition opened doors with sovereign wealth funds and institutional investors we had been targeting for years.",
    name: "Adaeze Okonkwo",
    role: "Director General, West Africa Investment Authority",
    initials: "AO",
    region: "West Africa",
    color: "#C9A84C",
  },
  {
    quote: "The media coverage Purtivon orchestrated following our award win reached over forty financial publications across three continents. The ROI on our sponsorship was extraordinary.",
    name: "Henrik Brandt",
    role: "Head of Investor Relations, Nordic Capital Partners",
    initials: "HB",
    region: "Nordics",
    color: "#3B82F6",
  },
  {
    quote: "Their FDI intelligence reports are required reading for our investment committee. The depth of analysis on Southeast Asian markets is genuinely world-class.",
    name: "Priya Subramaniam",
    role: "Chief Investment Officer, Meridian Asset Management",
    initials: "PS",
    region: "Singapore",
    color: "#C9A84C",
  },
  {
    quote: "The Purtivon Global Awards gave our brand the credibility to enter new markets with confidence. Within six months of our win we had signed three new institutional mandates.",
    name: "Carlos Ybarra",
    role: "Managing Director, Ibero-American Infrastructure Fund",
    initials: "CY",
    region: "Latin America",
    color: "#3B82F6",
  },
  {
    quote: "In a noisy market, Purtivon's recognition stands out as genuinely independent. Our clients and prospects take it seriously — it has materially strengthened our pitch book.",
    name: "Amira Khalil",
    role: "CEO, Levant Capital Advisory",
    initials: "AK",
    region: "Middle East",
    color: "#C9A84C",
  },
  {
    quote: "The nomination process itself was insightful — it forced us to articulate our impact in ways that now inform our investor communications year-round.",
    name: "James Oduya",
    role: "CFO, Pan-African Development Bank",
    initials: "JO",
    region: "East Africa",
    color: "#3B82F6",
  },
];

const CARD_W = 300;
const GAP    = 20;
const ITEMS  = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsCarousel() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      style={{ overflow: "hidden", position: "relative", background: "#06080E" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Client testimonials"
    >
      {/* Gradient mesh background */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 70% 60% at 10% 30%, rgba(59,130,246,0.07) 0%, transparent 55%)",
          "radial-gradient(ellipse 60% 50% at 90% 70%, rgba(201,168,76,0.06) 0%, transparent 55%)",
          "rgba(6,8,14,1)",
        ].join(","),
      }} />

      {/* Dot matrix */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 2, padding: "4.5rem 0 3.5rem" }}>
        {/* Header */}
        <div className="container" style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 28, height: 1, background: "var(--gold-dim)", display: "block" }} />
                Client Voices
              </div>
              <h2 className="display-md">
                Trusted by those who <em>lead</em>
              </h2>
            </div>

            {/* Dot pagination */}
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", paddingBottom: "0.2rem" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === active ? 20 : 5,
                    height: 5,
                    borderRadius: 3,
                    background: i === active ? "var(--gold)" : "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.35s var(--ease-out), background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling marquee track */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Edge fades */}
          <div aria-hidden="true" className="testi-fade-left" style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, rgba(6,8,14,1), transparent)", pointerEvents: "none", zIndex: 2 }} />
          <div aria-hidden="true" className="testi-fade-right" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg, rgba(6,8,14,1), transparent)", pointerEvents: "none", zIndex: 2 }} />

          <div
            className={paused ? "testi-track testi-paused" : "testi-track"}
            style={{ display: "flex", gap: `${GAP}px`, padding: "0.5rem 0 1.5rem" }}
          >
            {ITEMS.map((t, i) => (
              <blockquote
                key={i}
                className="testi-card"
                style={{
                  flexShrink: 0,
                  width: CARD_W,
                  background: "rgba(10, 12, 22, 0.80)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: `2px solid ${t.color === "#C9A84C" ? "rgba(201,168,76,0.55)" : "rgba(59,130,246,0.45)"}`,
                  padding: "1.35rem 1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  margin: 0,
                  cursor: "default",
                  transition: "transform 0.28s var(--ease-out), box-shadow 0.28s var(--ease-out), border-color 0.28s",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}
              >
                {/* Opening quotation mark */}
                <p aria-hidden="true" style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.4rem",
                  color: `${t.color}30`,
                  lineHeight: 0.7,
                  userSelect: "none",
                  margin: 0,
                }}>
                  &ldquo;
                </p>

                {/* Quote text */}
                <p style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.87rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(240,237,230,0.88)",
                  flex: 1,
                  margin: 0,
                }}>
                  {t.quote}
                </p>

                {/* Author row */}
                <footer style={{ display: "flex", alignItems: "center", gap: "0.7rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: "50%",
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.6rem", fontWeight: 700,
                    color: t.color,
                    flexShrink: 0,
                    letterSpacing: "0.05em",
                  }}>
                    {t.initials}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 500, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.name}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(240,237,230,0.45)", margin: "0.1rem 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.role}
                    </p>
                  </div>

                  {/* Region tag */}
                  <span style={{
                    fontSize: "0.52rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: `${t.color}80`,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    border: `1px solid ${t.color}25`,
                    padding: "0.2rem 0.5rem",
                    borderRadius: 2,
                  }}>
                    {t.region}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .testi-track {
          animation: testi-scroll 42s linear infinite;
        }
        .testi-paused {
          animation-play-state: paused !important;
        }
        @keyframes testi-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-${CARD_W}px * ${TESTIMONIALS.length} - ${GAP}px * ${TESTIMONIALS.length})); }
        }
        .testi-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.25) !important;
          border-color: rgba(201,168,76,0.28) !important;
        }
        @media (max-width: 640px) {
          .testi-fade-left, .testi-fade-right { width: 28px !important; }
        }
      `}</style>
    </section>
  );
}
