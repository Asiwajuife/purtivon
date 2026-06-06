"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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
  return `${getCurrentQuarterLabel()} · Nominations close 30 ${monthName} ${year} · Results ${resultsMonth} ${year}`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function HomeCTABanner() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        minHeight: 480,
        display: "flex",
        alignItems: "center",
      }}
      aria-label="Call to action: Submit a nomination"
    >
      {/* Background image */}
      <Image
        src="/images/globe-routes.jpg"
        alt=""
        fill
        sizes="100vw"
        priority={false}
        style={{ objectFit: "cover", objectPosition: "center", opacity: 0.22 }}
      />

      {/* Dark overlay */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(4,6,18,0.78)", zIndex: 1 }} />

      {/* Gradient mesh */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: [
          "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 65%)",
          "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 50%)",
        ].join(","),
        pointerEvents: "none",
      }} />

      {/* Globe wireframe */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(800px, 90vw)",
        opacity: 0.09,
        pointerEvents: "none",
        zIndex: 1,
        animation: "spin-slow 40s linear infinite",
      }}>
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="360" stroke="#C9A84C" strokeWidth="0.8"/>
          <circle cx="400" cy="400" r="260" stroke="#C9A84C" strokeWidth="0.6"/>
          <circle cx="400" cy="400" r="160" stroke="#C9A84C" strokeWidth="0.5"/>
          <ellipse cx="400" cy="400" rx="360" ry="130" stroke="#C9A84C" strokeWidth="0.6"/>
          <ellipse cx="400" cy="400" rx="360" ry="240" stroke="#C9A84C" strokeWidth="0.5"/>
          <path d="M40 400 Q400 120 760 400 Q400 680 40 400Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
          <path d="M400 40 Q680 400 400 760 Q120 400 400 40Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
          <line x1="40" y1="400" x2="760" y2="400" stroke="#C9A84C" strokeWidth="0.35"/>
          <line x1="400" y1="40" x2="400" y2="760" stroke="#C9A84C" strokeWidth="0.35"/>
        </svg>
      </div>

      {/* Top + bottom gold lines */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)", zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)", zIndex: 2 }} />

      <div className="container" style={{ position: "relative", zIndex: 3, paddingTop: "4.5rem", paddingBottom: "4.5rem" }}>
        {/* Gold decorative line */}
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          style={{
            width: 56, height: 1,
            background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
            margin: "0 auto 2rem",
          }}
        />

        {/* Eyebrow */}
        <motion.div
          className="eyebrow"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
          style={{ marginBottom: "1rem", justifyContent: "center", display: "flex" }}
        >
          {getCurrentQuarterLabel()} Awards Open
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="display-lg"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fadeUp}
          style={{ marginBottom: "1.25rem", color: "#fff", maxWidth: 600, margin: "0 auto 1.25rem" }}
        >
          Ready to be recognised
          <br />
          <em>globally?</em>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="body-lg"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          variants={fadeUp}
          style={{
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            color: "rgba(240,237,230,0.82)",
          }}
        >
          Submit your nomination for the {getCurrentQuarterLabel()} Purtivon Global Awards and
          join the institutions shaping the future of international investment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          variants={fadeUp}
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
          <Link href="/contact" className="btn btn-border-glow btn-lg">
            Speak to Our Team
          </Link>
        </motion.div>

        {/* Meta line */}
        <motion.p
          className="label"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          custom={5}
          variants={fadeUp}
          style={{ marginTop: "2rem", color: "rgba(240,237,230,0.38)" }}
        >
          {getNominationsCloseLabel()}
        </motion.p>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
