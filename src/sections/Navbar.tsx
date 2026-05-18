import { siteContent } from '../content/siteContent';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-8 py-6 max-w-7xl mx-auto">
      {/* Logo */}
      <a href="#top" className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.78)]">
        <span style={{ fontFamily: "'Instrument Serif', serif" }}>
          {siteContent.brand}
        </span>
        <span className="text-[10px] tracking-[0.16em] text-white/64">
          {siteContent.hero.motto}
        </span>
      </a>

    </nav>
  );
}
