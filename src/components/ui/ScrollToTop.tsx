"use client";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="scroll-top-btn"
        style={{
          position: "fixed",
          bottom: "2.5rem",
          right: "1.75rem",
          zIndex: 80,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "rgba(10,10,15,0.88)",
          border: "1px solid rgba(201,168,76,0.35)",
          color: "#C9A84C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.08)",
          transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
          animation: "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
      </button>
      <style>{`
        .scroll-top-btn:hover {
          border-color: rgba(201,168,76,0.65) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 16px rgba(201,168,76,0.25) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
