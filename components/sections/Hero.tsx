"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const btns = useRef<HTMLDivElement>(null);
  const scrollInd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => eyebrow.current?.classList.add("visible"), 200),
      setTimeout(() => heading.current?.classList.add("visible"), 500),
      setTimeout(() => sub.current?.classList.add("visible"), 800),
      setTimeout(() => {
        btns.current?.classList.add("visible");
        scrollInd.current?.classList.add("visible");
      }, 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center px-8 md:px-20">
      <div className="relative z-10 max-w-2xl">
        <p
          ref={eyebrow}
          className="reveal text-xs uppercase tracking-[0.3em] text-champagne mb-6"
        >
          Artisan Bakery — Est. 2019
        </p>
        <h1
          ref={heading}
          className="reveal font-serif text-[3.2rem] md:text-[5.5rem] leading-[1.02] text-cream mb-6 font-light"
        >
          Crafting Sweet
          <br />
          <em className="italic text-champagne">Moments,</em>
          <br />
          One Dessert
        </h1>
        <p
          ref={sub}
          className="reveal text-base leading-relaxed text-cream/65 max-w-md mb-10 font-light"
        >
          Handcrafted cakes and desserts made with love, seasonal ingredients,
          and obsessive attention to beauty — for every celebration that
          deserves to be remembered.
        </p>
        <div ref={btns} className="reveal flex gap-4 flex-wrap">
          <a
            href="#collections"
            data-cursor-hover
            className="btn-shine bg-champagne text-dark px-9 py-4 text-xs font-medium uppercase tracking-[0.18em]"
          >
            <span>Explore Collection</span>
          </a>
          <a
            href="/orders"
            data-cursor-hover
            className="border border-cream/35 text-cream px-9 py-4 text-xs uppercase tracking-[0.18em] hover:bg-cream/8 hover:border-champagne transition-all"
          >
            Order Now
          </a>
        </div>
      </div>

      <div
        ref={scrollInd}
        className="reveal absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-cream/40">
          Scroll
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-champagne to-transparent animate-pulse" />
      </div>
    </section>
  );
}
