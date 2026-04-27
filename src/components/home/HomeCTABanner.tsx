"use client";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

function getCurrentQuarterLabel() {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

function getNominationsCloseLabel() {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  const year = now.getFullYear();
  const closeMonth = q * 3;
  const monthName = new Date(year, closeMonth - 1, 1).toLocaleString("en-GB", { month: "long" });
  const resultsMonth = new Date(year, closeMonth, 1).toLocaleString("en-GB", { month: "long" });
  return `Q${q} ${year} · Nominations close 30 ${monthName} ${year} · Independent judging panel · Results announced ${resultsMonth} ${year}`;
}

export default function HomeCTABanner() {
  return (
    <section
      style={{
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Background image */}
      <Image
        src="/images/globe-routes.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      />

      {/* Gold radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div className="container section" style={{ position: "relative", zIndex: 3 }}>
        <ScrollReveal>
          <div
            aria-hidden="true"
            style={{
              width: 64,
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              margin: "0 auto 3rem",
            }}
          />

          <h2
            className="display-lg"
            style={{
              marginBottom: "1.25rem",
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            Ready to be recognised
            <br />
            <em>globally?</em>
          </h2>

          <p
            className="body-lg"
            style={{
              maxWidth: 460,
              margin: "0 auto 3rem",
              color: "rgba(240,237,230,0.92)",
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            Submit your nomination for the {getCurrentQuarterLabel()} Purtivon Global Awards and
            join the institutions shaping the future of international investment.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            <Link href="/awards" className="btn btn-primary btn-lg hero-cta-glow">
              Submit a Nomination
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-lg">
              Speak to Our Team
            </Link>
          </div>

          <p
            className="label"
            style={{
              marginTop: "2rem",
              color: "rgba(240,237,230,0.55)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {getNominationsCloseLabel()}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
