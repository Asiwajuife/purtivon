"use client";
import { motion } from "framer-motion";

export default function HomeHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "28vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#070710",
        paddingTop: "64px",
      }}
    >
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://static.independent.co.uk/2025/03/04/14/03/iStock-2054112501.jpeg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          zIndex: 0,
        }}
      />

      {/* Dark base scrim — ensures sufficient contrast everywhere */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "rgba(7,7,16,0.62)",
      }} />
      {/* Top-to-bottom gradient — darkens top (navbar join) and bottom */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(7,7,16,0.55) 0%, rgba(7,7,16,0.1) 40%, rgba(7,7,16,0.55) 100%)",
      }} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1160,
          margin: "0 auto",
          padding: "1.75rem 2.5rem",
          textAlign: "center",
        }}
      >
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "1rem", marginBottom: "0.75rem",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
          }}
        >
          <span style={{ width: 36, height: 1, background: "var(--gold-dim)", display: "block" }} />
          Global FDI & Financial Services Awards
          <span style={{ width: 36, height: 1, background: "var(--gold-dim)", display: "block" }} />
        </motion.div>

        <motion.h1
          className="display-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: "0.65rem", color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}
        >
          Recognising the World&apos;s
          <br />
          <em>Investment Leaders</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            maxWidth: 500, margin: "0 auto",
            fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          Purtivon is the global standard for FDI and financial services recognition —
          connecting excellence, capital, and ambition across 48 countries.
        </motion.p>

      </div>
    </section>
  );
}
