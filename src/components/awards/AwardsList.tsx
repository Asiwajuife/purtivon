interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string | null;
  createdAt: string;
}

export default function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "6rem 2rem", textAlign: "center",
        border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)",
      }}>
        <div style={{
          width: 48, height: 48, border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem" }}>
          No awards published yet
        </p>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      {years.map((year) => (
        <div key={year}>
          {/* Year heading */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem", fontWeight: 300,
              color: "rgba(255,255,255,0.15)", letterSpacing: "0.08em",
              flexShrink: 0,
            }}>
              {year}
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", flexShrink: 0 }}>
              {grouped[year].length} {grouped[year].length === 1 ? "Category" : "Categories"}
            </span>
          </div>

          {/* Award cards — gapless grid with 1px separators */}
          <div style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", display: "flex", flexDirection: "column" }}>
            {grouped[year].map((award, i) => (
              <div
                key={award.id}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  display: "flex", alignItems: "flex-start", gap: "1.25rem",
                  transition: "background 0.2s",
                }}
                className="award-row"
              >
                {/* Index number */}
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem", fontWeight: 300,
                  color: "rgba(255,255,255,0.12)",
                  minWidth: 28, paddingTop: "0.1rem",
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Category badge */}
                  <span style={{
                    display: "inline-block",
                    fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "#c9a84c",
                    background: "rgba(201,168,76,0.08)", padding: "0.2rem 0.6rem",
                    marginBottom: "0.6rem",
                  }}>
                    {award.category}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.4,
                    color: "rgba(255,255,255,0.82)",
                    marginBottom: award.description ? "0.5rem" : 0,
                  }}>
                    {award.title}
                  </h3>

                  {award.description && (
                    <p style={{
                      fontSize: "0.85rem", color: "rgba(255,255,255,0.28)",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    } as React.CSSProperties}>
                      {award.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: "0.35rem" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        .award-row:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>
    </div>
  );
}
