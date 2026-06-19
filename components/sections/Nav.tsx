"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/#collections", label: "Collections" },
  { href: "/#story", label: "Our Story" },
  { href: "/orders", label: "Orders" },
  { href: "/reviews", label: "Reviews" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  // On sub-pages the nav is always solid (there's no hero behind it).
  const solid = !onHome || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-5 transition-all duration-500 ${
        solid ? "bg-dark/80 backdrop-blur-xl border-b border-champagne/15" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Logo />

        <ul className="hidden md:flex gap-9 items-center">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                data-cursor-hover
                className="text-xs uppercase tracking-[0.18em] text-cream/80 hover:text-cream transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 right-full h-px bg-champagne group-hover:right-0 transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            data-cursor-hover
            className="btn-shine hidden sm:inline-block bg-cream text-dark px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em]"
          >
            <span>Order Now</span>
          </Link>
          <button
            aria-label="Toggle menu"
            data-cursor-hover
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className="block h-px w-6 bg-cream" />
            <span className="block h-px w-6 bg-cream" />
            <span className="block h-px w-4 bg-cream" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden flex flex-col gap-4 pt-6 pb-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.18em] text-cream/85"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
