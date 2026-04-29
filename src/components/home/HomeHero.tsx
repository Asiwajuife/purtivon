"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";

const STATS = [
  { value: "48",   label: "Countries Covered" },
  { value: "500+", label: "Institutions Featured" },
  { value: "5",    label: "Years of Excellence" },
] as const;

function FDIIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <radialGradient id="rg-globe" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(201,168,76,0.2)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0)"   />
        </radialGradient>
        <radialGradient id="rg-chart" cx="70%" cy="60%" r="55%">
          <stop offset="0%"   stopColor="rgba(201,168,76,0.07)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0)"    />
        </radialGradient>
        <pattern id="hero-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="0.9" fill="rgba(255,255,255,0.09)" />
        </pattern>
        <clipPath id="globe-clip">
          <circle cx="250" cy="268" r="182" />
        </clipPath>
      </defs>

      {/* Dot grid — full canvas */}
      <rect width="1440" height="560" fill="url(#hero-dots)" />

      {/* ── GLOBE (left) ── */}
      <ellipse cx="250" cy="268" rx="240" ry="240" fill="url(#rg-globe)" />
      {/* outer ring */}
      <circle cx="250" cy="268" r="182" fill="none" stroke="rgba(201,168,76,0.28)" strokeWidth="1.2" />
      {/* meridians */}
      <ellipse cx="250" cy="268" rx="48"  ry="182" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />
      <ellipse cx="250" cy="268" rx="95"  ry="182" fill="none" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8" />
      <ellipse cx="250" cy="268" rx="145" ry="182" fill="none" stroke="rgba(201,168,76,0.1)"  strokeWidth="0.8" />
      {/* lit meridian */}
      <ellipse cx="250" cy="268" rx="72"  ry="182" fill="none" stroke="rgba(201,168,76,0.24)" strokeWidth="1.5" clipPath="url(#globe-clip)" />
      {/* parallels */}
      <ellipse cx="250" cy="130" rx="167" ry="34"  fill="none" stroke="rgba(201,168,76,0.08)"  strokeWidth="0.8" />
      <ellipse cx="250" cy="180" rx="179" ry="26"  fill="none" stroke="rgba(201,168,76,0.09)"  strokeWidth="0.8" />
      <ellipse cx="250" cy="268" rx="182" ry="18"  fill="none" stroke="rgba(201,168,76,0.13)"  strokeWidth="0.9" />
      <ellipse cx="250" cy="356" rx="179" ry="26"  fill="none" stroke="rgba(201,168,76,0.09)"  strokeWidth="0.8" />
      <ellipse cx="250" cy="406" rx="167" ry="34"  fill="none" stroke="rgba(201,168,76,0.08)"  strokeWidth="0.8" />

      {/* ── NETWORK LINES from globe ── */}
      <line x1="410" y1="142" x2="540" y2="108" stroke="rgba(201,168,76,0.3)"  strokeWidth="1" />
      <line x1="432" y1="268" x2="580" y2="234" stroke="rgba(201,168,76,0.24)" strokeWidth="1" />
      <line x1="418" y1="378" x2="555" y2="428" stroke="rgba(201,168,76,0.22)" strokeWidth="1" />
      <line x1="338" y1="88"  x2="415" y2="52"  stroke="rgba(201,168,76,0.18)" strokeWidth="0.8" />
      {/* long-range dashed */}
      <line x1="540" y1="108" x2="870" y2="72"  stroke="rgba(255,255,255,0.055)" strokeWidth="0.8" strokeDasharray="6,6" />
      <line x1="580" y1="234" x2="960" y2="176" stroke="rgba(255,255,255,0.055)" strokeWidth="0.8" strokeDasharray="6,6" />
      <line x1="555" y1="428" x2="880" y2="454" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.8" strokeDasharray="6,6" />
      <line x1="870" y1="72"  x2="1180" y2="52" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" strokeDasharray="6,6" />

      {/* Capital flow arcs */}
      <path d="M 425 198 Q 688 96  960 158" fill="none" stroke="rgba(201,168,76,0.14)" strokeWidth="1.5" />
      <path d="M 425 328 Q 702 428 998 366" fill="none" stroke="rgba(201,168,76,0.1)"  strokeWidth="1.2" />
      <path d="M 395 138 Q 648 50  898 88"  fill="none" stroke="rgba(201,168,76,0.1)"  strokeWidth="1"   />

      {/* Network nodes */}
      <circle cx="540"  cy="108" r="4.5" fill="#c9a84c" fillOpacity="0.6" />
      <circle cx="580"  cy="234" r="3.5" fill="#c9a84c" fillOpacity="0.5" />
      <circle cx="555"  cy="428" r="3"   fill="#c9a84c" fillOpacity="0.45" />
      <circle cx="415"  cy="52"  r="2.5" fill="#c9a84c" fillOpacity="0.4" />
      <circle cx="870"  cy="72"  r="5"   fill="#c9a84c" fillOpacity="0.55" />
      <circle cx="960"  cy="176" r="3.5" fill="#c9a84c" fillOpacity="0.5" />
      <circle cx="880"  cy="454" r="3"   fill="#c9a84c" fillOpacity="0.4" />
      <circle cx="1180" cy="52"  r="4"   fill="#c9a84c" fillOpacity="0.45" />
      <circle cx="1280" cy="88"  r="3"   fill="#c9a84c" fillOpacity="0.35" />

      {/* ── CHART AREA (right side) ── */}
      <ellipse cx="1200" cy="340" rx="300" ry="260" fill="url(#rg-chart)" />

      {/* Chart grid lines */}
      <line x1="1002" y1="490" x2="1432" y2="490" stroke="rgba(201,168,76,0.13)"  strokeWidth="0.9" />
      <line x1="1002" y1="440" x2="1432" y2="440" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="390" x2="1432" y2="390" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="340" x2="1432" y2="340" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="290" x2="1432" y2="290" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="240" x2="1432" y2="240" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="190" x2="1432" y2="190" stroke="rgba(255,255,255,0.04)"  strokeWidth="0.5" strokeDasharray="4,6" />
      <line x1="1002" y1="140" x2="1432" y2="140" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" strokeDasharray="4,6" />

      {/* Ascending bars */}
      <rect x="1010" y="450" width="26" height="40"  fill="rgba(201,168,76,0.1)"  rx="1" />
      <rect x="1046" y="420" width="26" height="70"  fill="rgba(201,168,76,0.11)" rx="1" />
      <rect x="1082" y="388" width="26" height="102" fill="rgba(201,168,76,0.12)" rx="1" />
      <rect x="1118" y="356" width="26" height="134" fill="rgba(201,168,76,0.13)" rx="1" />
      <rect x="1154" y="318" width="26" height="172" fill="rgba(201,168,76,0.14)" rx="1" />
      <rect x="1190" y="282" width="26" height="208" fill="rgba(201,168,76,0.15)" rx="1" />
      <rect x="1226" y="248" width="26" height="242" fill="rgba(201,168,76,0.17)" rx="1" />
      <rect x="1262" y="210" width="26" height="280" fill="rgba(201,168,76,0.18)" rx="1" />
      <rect x="1298" y="176" width="26" height="314" fill="rgba(201,168,76,0.2)"  rx="1" />
      <rect x="1334" y="144" width="26" height="346" fill="rgba(201,168,76,0.22)" rx="1" />
      <rect x="1370" y="116" width="26" height="374" fill="rgba(201,168,76,0.25)" rx="1" />

      {/* Trend line */}
      <polyline
        points="1023,446 1059,416 1095,384 1131,352 1167,314 1203,278 1239,244 1275,206 1311,172 1347,140 1383,112"
        fill="none" stroke="#c9a84c" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Data point rings */}
      <circle cx="1131" cy="352" r="4"   fill="#070710" stroke="#c9a84c" strokeWidth="2" />
      <circle cx="1203" cy="278" r="4"   fill="#070710" stroke="#c9a84c" strokeWidth="2" />
      <circle cx="1275" cy="206" r="4"   fill="#070710" stroke="#c9a84c" strokeWidth="2" />
      <circle cx="1347" cy="140" r="4"   fill="#070710" stroke="#c9a84c" strokeWidth="2" />
      <circle cx="1383" cy="112" r="5.5" fill="#c9a84c" />

      {/* ── CITY SILHOUETTE ── */}
      <path
        d="M0,528 L0,542 L38,542 L38,514 L58,514 L58,492 L72,492 L72,504 L88,504 L88,518 L118,518 L118,536 L138,536 L138,506 L158,506 L158,486 L178,486 L178,468 L194,468 L194,486 L210,486 L210,506 L238,506 L238,526 L268,526 L268,496 L292,496 L292,476 L314,476 L314,496 L348,496 L348,528 L400,528 L400,560 L0,560 Z"
        fill="rgba(255,255,255,0.04)"
      />
      <path
        d="M820,538 L848,508 L858,508 L858,474 L888,474 L888,494 L918,494 L918,508 L950,508 L950,484 L970,484 L970,462 L990,462 L990,484 L1014,484 L1014,538 L1440,538 L1440,560 L820,560 Z"
        fill="rgba(255,255,255,0.03)"
      />

      {/* ── HEXAGONAL GRID (top-right accent) ── */}
      <polygon points="1358,18 1378,30 1378,54 1358,66 1338,54 1338,30"  fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="0.9" />
      <polygon points="1398,18 1418,30 1418,54 1398,66 1378,54 1378,30"  fill="none" stroke="rgba(201,168,76,0.1)"  strokeWidth="0.9" />
      <polygon points="1378,62 1398,74 1398,98 1378,110 1358,98 1358,74" fill="none" stroke="rgba(201,168,76,0.1)"  strokeWidth="0.9" />
      <polygon points="1418,62 1438,74 1438,98 1418,110 1398,98 1398,74" fill="none" stroke="rgba(201,168,76,0.07)" strokeWidth="0.9" />
      <polygon points="1338,62 1358,74 1358,98 1338,110 1318,98 1318,74" fill="none" stroke="rgba(201,168,76,0.07)" strokeWidth="0.9" />

      {/* ── CURRENCY SYMBOLS ── */}
      <text x="698"  y="128" fontSize="20" fill="rgba(201,168,76,0.11)" fontFamily="Georgia,serif">$</text>
      <text x="788"  y="348" fontSize="16" fill="rgba(201,168,76,0.09)" fontFamily="Georgia,serif">€</text>
      <text x="848"  y="198" fontSize="18" fill="rgba(201,168,76,0.08)" fontFamily="Georgia,serif">£</text>
      <text x="928"  y="418" fontSize="14" fill="rgba(201,168,76,0.09)" fontFamily="Georgia,serif">¥</text>
      <text x="648"  y="388" fontSize="13" fill="rgba(201,168,76,0.08)" fontFamily="Georgia,serif">₣</text>
    </svg>
  );
}

export default function HomeHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "55vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#070710",
      }}
    >
      <FDIIllustration />

      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(7,7,16,0.72) 100%)",
      }} />
      {/* Left-side fade so text sits clearly */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, rgba(7,7,16,0.55) 0%, rgba(7,7,16,0.25) 55%, transparent 100%)",
      }} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1160,
          margin: "0 auto",
          padding: "5rem 2.5rem",
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
            gap: "1rem", marginBottom: "1.75rem",
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
          style={{ marginBottom: "1.4rem", color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}
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
            maxWidth: 500, margin: "0 auto 2.5rem",
            fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 300,
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
          }}
        >
          Purtivon is the global standard for FDI and financial services recognition —
          connecting excellence, capital, and ambition across 48 countries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <Link href="/awards" className="btn btn-primary btn-lg hero-cta-glow">
            Submit a Nomination
          </Link>
          <Link href="/insights" className="btn btn-outline-white btn-lg">
            Latest Intelligence
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: "flex", justifyContent: "center", gap: "2.5rem",
            marginTop: "3rem", paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
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
                fontSize: "2rem", fontWeight: 300,
                color: "var(--gold)", lineHeight: 1, marginBottom: "0.4rem",
                textShadow: "0 1px 6px rgba(0,0,0,0.7)",
              }}
              labelStyle={{
                color: "rgba(255,255,255,0.65)",
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                fontSize: "0.72rem", letterSpacing: "0.1em",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
