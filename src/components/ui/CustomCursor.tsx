"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const raf     = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    // Only hide native cursor after JS has confirmed the custom one is live.
    // This prevents a blank cursor if the component fails or is slow to mount.
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive =
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        t.tagName === "SELECT" ||
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.closest("a") !== null ||
        t.closest("button") !== null ||
        t.getAttribute("role") === "button" ||
        window.getComputedStyle(t).cursor === "pointer";
      setHovering(isInteractive);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover",  onOver, { passive: true });

    // Use transform: translate() — no layout, GPU-composited, no jank
    const animate = () => {
      const lerp = 0.12;
      ring.current.x += (pos.current.x - ring.current.x) * lerp;
      ring.current.y += (pos.current.y - ring.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Don't render on touch/pointer:coarse devices
  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return null;

  return (
    <>
      {/* Inject cursor:none only after JS confirms cursor is live */}
      {mounted && (
        <style>{`
          @media (pointer: fine) {
            *, *::before, *::after { cursor: none !important; }
          }
        `}</style>
      )}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#C9A84C",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transform: "translate(-200px, -200px)",
          marginLeft: -3, marginTop: -3,
          transition: "opacity 0.3s",
          opacity: mounted ? 1 : 0,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.45)"}`,
          background: hovering ? "rgba(201,168,76,0.08)" : "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transform: "translate(-200px, -200px)",
          marginLeft: hovering ? -22 : -14,
          marginTop:  hovering ? -22 : -14,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease, margin 0.2s ease, opacity 0.3s",
          opacity: mounted ? 1 : 0,
        }}
      />
    </>
  );
}
