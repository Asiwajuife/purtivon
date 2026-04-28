"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";

const STATS = [
  { value: "48",   label: "Countries Covered" },
  { value: "500+", label: "Institutions Featured" },
  { value: "5",    label: "Years of Excellence" },
] as const;

function getCurrentQuarterLabel() {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "4.5rem 2.5rem 3rem",
      }}
    >
      {/* Parallax background image */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: bgY,
          scale: 1.15,
        }}
      >
        <Image
          src="/images/hero-home.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </motion.div>

      {/* Dark overlay gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 50%, rgba(0,0,0,0.80) 100%)",
          zIndex: 1,
        }}
      />

      {/* Subtle gold radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 820, zIndex: 3 }}>
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          <span style={{ width: 40, height: 1, background: "var(--gold-dim)", display: "block" }} />
          Global FDI & Financial Services Awards
          <span style={{ width: 40, height: 1, background: "var(--gold-dim)", display: "block" }} />
        </motion.div>

        <motion.h1
          className="display-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            marginBottom: "1.5rem",
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          Recognising the World&apos;s
          <br />
          <em>Investment Leaders</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            maxWidth: 520,
            margin: "0 auto 3rem",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            fontWeight: 300,
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Purtivon is the global standard for FDI and financial services recognition —
          connecting excellence, capital, and ambition across 48 countries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
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
          <Link href="/insights" className="btn btn-outline-white btn-lg">
            Latest Intelligence
          </Link>
        </motion.div>

        {/* Stats with count-up animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            flexWrap: "wrap",
          }}
        >
          {STATS.map(({ value, label }) => (
            <AnimatedCounter
              key={label}
              value={value}
              label={label}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.1rem",
                fontWeight: 300,
                color: "var(--gold)",
                lineHeight: 1,
                marginBottom: "0.4rem",
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              }}
              labelStyle={{ color: "rgba(240,237,230,0.7)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
