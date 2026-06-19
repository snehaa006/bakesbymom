"use client";

import { useReveal } from "@/hooks/useReveal";

const ITEMS = [
  { title: "Rose Lychee Layer Cake", h: "h-72", from: "from-rose/30", to: "to-choco/60" },
  { title: "Dark Chocolate Truffles", h: "h-96", from: "from-cocoa/40", to: "to-dark/70" },
  { title: "Champagne Cupcakes", h: "h-64", from: "from-champagne/30", to: "to-choco/60" },
  { title: "Wedding Tier Cake", h: "h-[22rem]", from: "from-beige/30", to: "to-dark/70" },
  { title: "Matcha Brownies", h: "h-80", from: "from-[#4A7060]/30", to: "to-dark/70" },
  { title: "Berry Tart Collection", h: "h-[24rem]", from: "from-[#8B2050]/30", to: "to-choco/70" },
  { title: "Caramel Cookies", h: "h-60", from: "from-gold/30", to: "to-dark/70" },
  { title: "Floral Fondant Cake", h: "h-[26rem]", from: "from-rose/30", to: "to-choco/70" },
];

function GalleryCard({ title, h, from, to }: (typeof ITEMS)[number]) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-cursor-hover
      className={`reveal relative ${h} mb-2 rounded-sm overflow-hidden glass group cursor-none`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${from} ${to} transition-transform duration-700 group-hover:scale-110`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-choco/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
        <p className="font-serif text-lg text-cream">{title}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  return (
    <section id="gallery" className="relative px-4 md:px-12 py-32">
      <div className="text-center mb-14 px-4">
        <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
          Signature Creations
        </p>
        <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream">
          The <em className="italic text-rose">Gallery</em>
        </h2>
      </div>
      <div className="columns-2 md:columns-4 gap-2">
        {ITEMS.map((item) => (
          <GalleryCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
