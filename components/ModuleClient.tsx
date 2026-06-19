"use client";

import { useState } from "react";
import Link from "next/link";
import type { Module } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import OrderModal, { type OrderTarget } from "@/components/OrderModal";

export default function ModuleClient({ module }: { module: Module }) {
  const [target, setTarget] = useState<OrderTarget | null>(null);

  return (
    <section className="px-6 md:px-16 pb-28">
      {/* module hero */}
      <div
        className="relative rounded-sm overflow-hidden mb-14 px-7 py-16 md:px-14 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${module.accentFrom}, ${module.accentTo})`,
        }}
      >
        <div className="absolute inset-0 bg-espresso/45" />
        <div className="relative max-w-2xl">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cream/85 mb-3">
            Portfolio Module
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4 leading-tight">
            {module.name}
          </h1>
          <p className="font-serif italic text-xl md:text-2xl text-cream/90 mb-4">
            {module.tagline}
          </p>
          <p className="text-sm md:text-base text-cream/75 leading-relaxed max-w-xl">
            {module.description}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-cream">
          The Collection
        </h2>
        <Link
          href="/orders"
          data-cursor-hover
          className="text-xs uppercase tracking-[0.16em] text-champagne hover:text-cream transition-colors"
        >
          View full menu →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {module.products.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            onOrder={() =>
              setTarget({ product: p.name, category: module.name })
            }
          />
        ))}
      </div>

      <OrderModal target={target} onClose={() => setTarget(null)} />
    </section>
  );
}
