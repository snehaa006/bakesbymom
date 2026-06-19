"use client";

import { useReveal } from "@/hooks/useReveal";

export default function Story() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  const p1 = useReveal<HTMLParagraphElement>();
  const p2 = useReveal<HTMLParagraphElement>();
  const quote = useReveal<HTMLDivElement>();

  return (
    <section
      id="story"
      className="relative px-6 md:px-20 py-32 min-h-[90vh] flex items-center"
    >
      <div className="max-w-xl ml-auto glass rounded-sm p-10 md:p-14">
        <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-4">
          Our Story
        </p>
        <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
          Baked with <em className="italic text-champagne">Soul,</em>
          <br />
          Served with Love
        </h2>
        <p ref={p1} className="reveal text-sm leading-relaxed text-cream/55 mb-4">
          What began as weekend experiments in a home kitchen became an
          obsession with perfecting every layer, every swirl, every flavour.
          Bakes by Mom is the result of thousands of hours of baking,
          tasting, and falling in love with the art of dessert.
        </p>
        <p ref={p2} className="reveal text-sm leading-relaxed text-cream/55 mb-8">
          We source seasonal ingredients, work with small local farms, and
          believe that a beautiful dessert should taste as extraordinary as
          it looks.
        </p>
        <div ref={quote} className="reveal pt-8 border-t border-champagne/20">
          <blockquote className="font-serif italic text-xl text-champagne leading-relaxed mb-4">
            &ldquo;Every cake I make carries a piece of my heart — and a very
            generous amount of butter.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/35">
            — Priya Sharma, Founder &amp; Head Baker
          </p>
        </div>
      </div>
    </section>
  );
}
