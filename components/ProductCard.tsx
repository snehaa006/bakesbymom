"use client";

import type { Product } from "@/lib/products";

export default function ProductCard({
  product,
  category,
  onOrder,
}: {
  product: Product;
  category?: string;
  onOrder: () => void;
}) {
  return (
    <div className="group glass rounded-sm overflow-hidden flex flex-col transition-transform duration-500 hover:-translate-y-1.5">
      {/* swatch "image" built from the logo palette */}
      <div
        className="relative h-44 md:h-52"
        style={{
          background: `linear-gradient(135deg, ${product.from}, ${product.to})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 to-transparent" />
        <span className="absolute top-3 left-3 text-[0.6rem] uppercase tracking-[0.18em] text-cream/90 bg-espresso/40 backdrop-blur px-2.5 py-1 rounded-full">
          {product.tags[0]}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-cream leading-tight">
          {product.name}
        </h3>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-champagne/70 mt-1">
          {product.blurb}
        </p>
        <p className="text-sm text-cream/55 leading-relaxed mt-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-5 pt-4 border-t border-champagne/15">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-cream/40">
              From
            </p>
            <p className="font-serif text-xl text-cream">
              ₹{product.priceFrom.toLocaleString("en-IN")}
              <span className="text-[0.62rem] uppercase tracking-[0.12em] text-cream/45 ml-1.5">
                {product.unit}
              </span>
            </p>
          </div>
          <button
            onClick={onOrder}
            data-cursor-hover
            className="btn-shine bg-champagne text-dark px-5 py-2.5 text-[0.66rem] font-medium uppercase tracking-[0.16em]"
          >
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
