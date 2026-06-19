"use client";

import { useMemo, useState } from "react";
import { MODULES, allProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import OrderModal, { type OrderTarget } from "@/components/OrderModal";

const FILTERS = [
  { slug: "all", label: "All" },
  ...MODULES.map((m) => ({ slug: m.slug, label: m.short })),
];

export default function OrdersClient() {
  const [filter, setFilter] = useState("all");
  const [target, setTarget] = useState<OrderTarget | null>(null);

  const items = useMemo(() => {
    const all = allProducts();
    return filter === "all"
      ? all
      : all.filter((p) => p.categorySlug === filter);
  }, [filter]);

  return (
    <section className="px-6 md:px-16 pb-28">
      <header className="max-w-3xl mb-12">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
          The Bakery — Order Online
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4">
          Our <em className="italic text-rose">Menu</em>
        </h1>
        <p className="text-sm md:text-base text-cream/55 leading-relaxed">
          Browse the collection, pick what you love, and place your order in a
          few taps. Every bake is made fresh to order — prices start from the
          figures shown and vary with size, flavour and detailing.
        </p>
      </header>

      {/* category filter */}
      <div className="flex flex-wrap gap-2.5 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.slug}
            onClick={() => setFilter(f.slug)}
            data-cursor-hover
            className={`px-5 py-2 text-[0.68rem] uppercase tracking-[0.16em] rounded-full border transition-all ${
              filter === f.slug
                ? "bg-champagne text-dark border-champagne"
                : "border-champagne/25 text-cream/70 hover:border-champagne hover:text-cream"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            onOrder={() =>
              setTarget({ product: p.name, category: p.category })
            }
          />
        ))}
      </div>

      <OrderModal target={target} onClose={() => setTarget(null)} />
    </section>
  );
}
