"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";
import { MODULES } from "@/lib/products";

function Card({
  slug,
  title,
  tag,
  from,
  to,
  big,
}: {
  slug: string;
  title: string;
  tag: string;
  from: string;
  to: string;
  big?: boolean;
}) {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <Link
      href={`/collections/${slug}`}
      ref={ref}
      data-cursor-hover
      className={`reveal group relative overflow-hidden glass rounded-sm transition-transform duration-500 hover:-translate-y-2 block ${
        big
          ? "row-span-2 min-h-[420px] md:min-h-[520px]"
          : "min-h-[240px] md:min-h-[252px]"
      }`}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
      <div className="absolute top-5 right-5 w-9 h-9 rounded-full border border-champagne/70 flex items-center justify-center text-champagne opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
        ↗
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-2xl text-cream mb-1">{title}</h3>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-cream/60">
          {tag}
        </p>
      </div>
    </Link>
  );
}

export default function Collections() {
  const headerRef = useReveal<HTMLDivElement>();
  const [first, ...rest] = MODULES;
  return (
    <section id="collections" className="relative px-6 md:px-16 py-28">
      <div
        ref={headerRef}
        className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
            Portfolio Modules
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream">
            Sweet by <em className="italic text-rose">Design</em>
          </h2>
        </div>
        <Link
          href="/orders"
          data-cursor-hover
          className="btn-shine bg-champagne text-dark px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] w-fit"
        >
          <span>View All</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card
          slug={first.slug}
          title={first.name}
          tag={first.tagline}
          from={first.accentFrom}
          to={first.accentTo}
          big
        />
        {rest.map((m) => (
          <Card
            key={m.slug}
            slug={m.slug}
            title={m.name}
            tag={m.short}
            from={m.accentFrom}
            to={m.accentTo}
          />
        ))}
      </div>
    </section>
  );
}
