import type React from "react";

interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string | null;
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Financial Services": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  "FDI": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  "Leadership": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
  </svg>
);

function getIcon(category: string) {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return DEFAULT_ICON;
}

export default function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "6rem 2rem", textAlign: "center",
        border: "1px solid var(--border-faint)", background: "rgba(255,255,255,0.01)",
      }}>
        <div style={{
          width: 52, height: 52, border: "1px solid rgba(201,168,76,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "1.5rem", color: "rgba(201,168,76,0.45)",
        }}>
          {DEFAULT_ICON}
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--text-4)", marginBottom: "0.5rem" }}>
          No awards published yet
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-5)" }}>
          Check back soon for our latest award recognitions.
        </p>
      </div>
    );
  }

  const grouped = awards.reduce<Record<number, Award[]>>((acc, award) => {
    if (!acc[award.year]) acc[award.year] = [];
    acc[award.year].push(award);
    return acc;
  }, {});

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
      {years.map((year) => (
        <div key={year}>
          {/* Year heading */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.25rem", fontWeight: 300,
              color: "rgba(201,168,76,0.3)", letterSpacing: "0.08em",
              flexShrink: 0,
            }}>
              {year}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
            <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-5)", flexShrink: 0 }}>
              {grouped[year].length} {grouped[year].length === 1 ? "Category" : "Categories"}
            </span>
          </div>

          {/* Card grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }} className="award-card-grid">
            {grouped[year].map((award, i) => (
              <div
                key={award.id}
                className="award-card"
                style={{
                  background: "rgba(10,12,22,0.7)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  transition: "background 0.25s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle number watermark */}
                <span aria-hidden="true" style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 300,
                  color: "rgba(255,255,255,0.04)", lineHeight: 1,
                  userSelect: "none",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon + category */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 36, height: 36, border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--gold)", flexShrink: 0,
                  }}>
                    {getIcon(award.category)}
                  </div>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "var(--gold)",
                  }}>
                    {award.category}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.1rem", fontWeight: 400, lineHeight: 1.4,
                  color: "var(--text-hi)",
                }}>
                  {award.title}
                </h3>

                {award.description && (
                  <p style={{
                    fontSize: "0.8rem", color: "var(--text-4)",
                    lineHeight: 1.7,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}>
                    {award.description}
                  </p>
                )}

                {/* Bottom gold accent */}
                <div className="award-card-accent" style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim))",
                  opacity: 0, transition: "opacity 0.3s",
                }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        .award-card:hover { background: rgba(201,168,76,0.04) !important; }
        .award-card:hover .award-card-accent { opacity: 1 !important; }
        @media (max-width: 640px) {
          .award-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
