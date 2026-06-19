"use client";

import { useReveal } from "@/hooks/useReveal";

const COLLECTIONS = [
  { title: "Signature Cakes", tag: "Custom & Celebration", big: true },
  { title: "Dream Brownies", tag: "Rich & Fudgy" },
  { title: "Cupcakes", tag: "Seasonal Flavours" },
  { title: "Artisan Cookies", tag: "Handpressed & Iced" },
  { title: "Dessert Boxes", tag: "Gift & Gifting Sets" },
];

function Card({
  title,
  tag,
  big,
}: {
  title: string;
  tag: string;
  big?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-cursor-hover
      className={`reveal group relative overflow-hidden glass rounded-sm transition-transform duration-500 hover:-translate-y-2 ${
        big ? "row-span-2 min-h-[420px] md:min-h-[520px]" : "min-h-[240px] md:min-h-[252px]"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-choco/80 via-transparent to-transparent" />
      <div className="absolute top-5 right-5 w-9 h-9 rounded-full border border-champagne/70 flex items-center justify-center text-champagne opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
        ↗
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-2xl text-cream mb-1">{title}</h3>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-cream/55">
          {tag}
        </p>
      </div>
    </div>
  );
}

export default function Collections() {
  const headerRef = useReveal<HTMLDivElement>();
  return (
    <section id="collections" className="relative px-6 md:px-16 py-28">
      <div
        ref={headerRef}
        className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
            Featured Collections
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream">
            Sweet by <em className="italic text-rose">Design</em>
          </h2>
        </div>
        <a
          href="#order"
          data-cursor-hover
          className="btn-shine bg-champagne text-dark px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] w-fit"
        >
          <span>View All</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card title={COLLECTIONS[0].title} tag={COLLECTIONS[0].tag} big />
        {COLLECTIONS.slice(1).map((c) => (
          <Card key={c.title} title={c.title} tag={c.tag} />
        ))}
      </div>
    </section>
  );
}
