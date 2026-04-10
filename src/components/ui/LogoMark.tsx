"use client";
import { useId } from "react";

interface LogoMarkProps {
  size?: number;
}

/**
 * Purtivon mark — thin diamond frame + filled P/V geometric monogram.
 *
 * ViewBox: 200 × 200
 *
 * Diamond vertices: (100,12) (188,100) (100,188) (12,100)  radius = 88
 * Diamond stroke  : 4.5 px
 *
 * P monogram (fill-rule="evenodd"):
 *   Outer path  x 72–128, y 48–152   (bowl closes at y=104)
 *   Bar width   : 13 px throughout
 *   Inner counter (bowl hollow / "V pocket"): x 85–115, y 61–91  (30 × 30 px)
 *
 * Corner distance checks from centre (100,100):
 *   top-left  (72, 48) → |28|+|52| = 80 < 88 ✓
 *   top-right (128,48) → |28|+|52| = 80 < 88 ✓
 *   bot-left  (72,152) → |28|+|52| = 80 < 88 ✓
 *
 * Gradient: diagonal light-gold (#F5DC7E) → mid (#D4AF37) → dark (#B8922A)
 * No shadows. No heavy textures.
 */
export default function LogoMark({ size = 36 }: LogoMarkProps) {
  // Unique IDs so multiple instances on the same page don't clash.
  const uid = useId().replace(/:/g, "");
  const pg  = `pg-${uid}`;
  const dg  = `dg-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      <defs>
        {/* P monogram: light top-left → dark bottom-right */}
        <linearGradient id={pg} x1="72" y1="48" x2="128" y2="152" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F5DC7E" />
          <stop offset="45%"  stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8922A" />
        </linearGradient>

        {/* Diamond frame: full diagonal sweep */}
        <linearGradient id={dg} x1="12" y1="12" x2="188" y2="188" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F5DC7E" />
          <stop offset="50%"  stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8922A" />
        </linearGradient>
      </defs>

      {/* ── Diamond frame ── */}
      <polygon
        points="100,12 188,100 100,188 12,100"
        stroke={`url(#${dg})`}
        strokeWidth="4.5"
        strokeLinejoin="miter"
        fill="none"
      />

      {/*
        ── P / V monogram ──

        Outer path (clockwise) creates the overall P silhouette:
          (72,48) → (128,48)                   top bar
                 → (128,104)                   bowl right side
                 → (85,104) → (85,152)         step in → tail bar right edge
                 → (72,152) → close            tail bar bottom + left edge

        Inner path (clockwise — evenodd punches a hole):
          (85,61) → (115,61) → (115,91) → (85,91) → close
          This is the hollow bowl counter — the "V pocket".

        Resulting uniform 13 px bar thickness everywhere:
          top:        y 48–61  (13 px)
          left bar:   x 72–85  (13 px, full height y 48–152)
          bowl right: x 115–128 (13 px, y 61–104)
          bowl btm:   y 91–104  (13 px)
      */}
      <path
        fillRule="evenodd"
        fill={`url(#${pg})`}
        d="M 72,48 L 128,48 L 128,104 L 85,104 L 85,152 L 72,152 Z M 85,61 L 115,61 L 115,91 L 85,91 Z"
      />
    </svg>
  );
}
