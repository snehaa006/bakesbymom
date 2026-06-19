"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#collections", label: "Collections" },
  { href: "#story", label: "Our Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#process", label: "Process" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 transition-all duration-500 ${
        scrolled ? "bg-dark/70 backdrop-blur-xl border-b border-champagne/15" : ""
      }`}
    >
      <a href="#" className="font-serif text-2xl tracking-wide text-cream">
        Velvet <span className="text-champagne">Crumb</span>
      </a>
      <ul className="hidden md:flex gap-10">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              data-cursor-hover
              className="text-xs uppercase tracking-[0.18em] text-cream/80 hover:text-cream transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 right-full h-px bg-champagne group-hover:right-0 transition-all duration-300" />
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#order"
        data-cursor-hover
        className="btn-shine bg-cream text-dark px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em]"
      >
        <span>Order Now</span>
      </a>
    </nav>
  );
}
