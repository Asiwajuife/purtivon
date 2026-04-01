import Link from "next/link";
const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Newsletter", href: "/newsletter" },
];
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <span className="relative flex items-center justify-center w-6 h-6">
            <span className="absolute inset-0 rounded-sm bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] opacity-90" />
            <span className="relative text-[#0a0a0f] font-black text-xs leading-none">
              P
            </span>
          </span>
          <span
            className="text-white/50 group-hover:text-white/80 font-light tracking-[0.25em] uppercase text-xs transition-colors duration-200"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            }}
          >
            Purtivon
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-xs tracking-[0.15em] uppercase text-white/30 hover:text-[#c9a84c] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-white/20 text-xs tracking-widest uppercase">
          &copy; {year} Purtivon
        </p>
      </div>
    </footer>
  );
}
