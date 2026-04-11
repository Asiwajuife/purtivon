import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit",
  description: "Purtivon Magazine — coming soon.",
};

export default function MediaKitPage() {
  return (
    <div className="flex-1 pt-24" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>

        {/* Magazine cover placeholder */}
        <div style={{
          width: 260,
          height: 340,
          margin: "0 auto 3rem",
          position: "relative",
          background: "linear-gradient(160deg, #141420 0%, #0f0f16 60%, #1a1608 100%)",
          border: "1px solid rgba(201,168,76,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Spine line */}
          <div style={{
            position: "absolute", left: 18, top: 0, bottom: 0,
            width: 1, background: "rgba(201,168,76,0.15)",
          }} />

          {/* Top bar */}
          <div style={{
            padding: "1.1rem 1.25rem 0.75rem 1.6rem",
            borderBottom: "1px solid rgba(201,168,76,0.1)",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem", fontWeight: 400, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "#c9a84c",
              lineHeight: 1,
            }}>
              Purtivon
            </p>
            <p style={{
              fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.35em",
              textTransform: "uppercase", color: "rgba(201,168,76,0.45)",
              marginTop: 4,
            }}>
              Magazine
            </p>
          </div>

          {/* Cover art area */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Background geometric */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", right: 20, top: 20,
              width: 80, height: 80, border: "1px solid rgba(201,168,76,0.08)",
              transform: "rotate(15deg)",
            }} />
            <div style={{
              position: "absolute", right: 30, top: 30,
              width: 60, height: 60, border: "1px solid rgba(201,168,76,0.05)",
              transform: "rotate(15deg)",
            }} />

            {/* Centre mark */}
            <div style={{
              width: 40, height: 40,
              border: "1px solid rgba(201,168,76,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                width: 16, height: 16,
                border: "1px solid rgba(201,168,76,0.6)",
                transform: "rotate(45deg)",
              }} />
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{
            padding: "0.75rem 1.25rem 1rem 1.6rem",
            borderTop: "1px solid rgba(201,168,76,0.1)",
            background: "rgba(201,168,76,0.03)",
          }}>
            <p style={{
              fontSize: "0.42rem", fontWeight: 700, letterSpacing: "0.3em",
              textTransform: "uppercase", color: "rgba(201,168,76,0.35)",
            }}>
              FDI · Finance · Leadership
            </p>
          </div>
        </div>

        {/* Text */}
        <p style={{
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(201,168,76,0.55)",
          marginBottom: "1.1rem",
        }}>
          Purtivon Magazine
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
          fontWeight: 300, letterSpacing: "0.06em",
          color: "#f0ede6", lineHeight: 1.2,
          marginBottom: "1.5rem",
        }}>
          Coming Soon
        </h1>

        <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.4)", margin: "0 auto" }} />
      </div>
    </div>
  );
}
