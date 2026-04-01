"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
const NAV_LINKS = [
  { label: "Insights", href: "/insights" },
  { label: "Reports", href: "/reports" },
  { label: "Awards", href: "/awards" },
  { label: "Services", href: "/services" },
];
export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5 select-none">
            <span className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute inset-0 rounded-sm bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] opacity-90" />
              <span className="relative text-[#0a0a0f] font-black text-sm tracking-tighter leading-none">
                P
              </span>
            </span>
            <span
              className="text-white font-light tracking-[0.25em] uppercase text-sm"
              style={{
                fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
              }}
            >
              Purtivon
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200 group ${
                      isActive
                        ? "text-[#c9a84c]"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-[#c9a84c] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-semibold tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity duration-200"
              >
                Dashboard
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs tracking-[0.18em] uppercase font-medium text-white/60 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-5 py-2 border border-[#c9a84c]/60 text-[#c9a84c] text-xs font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-[#c9a84c]/10 transition-all duration-200"
                >
                  Get Access
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 focus:outline-none"
          >
            <span
              className={`block h-px bg-white transition-all duration-300 origin-right ${
                menuOpen ? "w-6 rotate-[-45deg] translate-y-[3px]" : "w-6"
              }`}
            />
            <span
              className={`block h-px bg-[#c9a84c] transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-4"
              }`}
            />
            <span
              className={`block h-px bg-white transition-all duration-300 origin-right ${
                menuOpen ? "w-6 rotate-[45deg] -translate-y-[3px]" : "w-6"
              }`}
            />
          </button>
        </nav>
      </header>
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0a0a0f]/98 backdrop-blur-lg"
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative flex flex-col justify-center h-full px-8 pt-20">
          <div className="absolute top-1/4 right-8 w-32 h-32 rounded-full bg-[#c9a84c]/5 blur-3xl pointer-events-none" />
          <ul className="flex flex-col gap-2 mb-12">
            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = pathname.startsWith(href);
              return (
                <li
                  key={href}
                  className={`transition-all duration-500 ${
                    menuOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${i * 60 + 100}ms` : "0ms",
                  }}
                >
                  <Link
                    href={href}
                    className={`flex items-center justify-between py-4 border-b group ${
                      isActive
                        ? "border-[#c9a84c]/30 text-[#c9a84c]"
                        : "border-white/5 text-white/50 hover:text-white hover:border-white/20"
                    } transition-all duration-200`}
                  >
                    <span
                      className="text-2xl font-light tracking-wide"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Didot', 'Georgia', serif",
                      }}
                    >
                      {label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                        isActive ? "text-[#c9a84c]" : "text-white/20"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div
            className={`flex flex-col gap-3 transition-all duration-500 ${
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menuOpen ? "360ms" : "0ms" }}
          >
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center justify-center py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm"
                >
                  Get Access
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center py-3.5 border border-white/10 text-white/60 text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:border-white/30 hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <p className="absolute bottom-8 left-8 text-white/20 text-xs tracking-widest uppercase">
            Global FDI & Financial Media
          </p>
        </div>
      </div>
    </>
  );
}
