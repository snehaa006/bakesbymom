"use client";

import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Tell us about your occasion, flavour preferences, and the vision you have in mind. We listen carefully to every detail.",
  },
  {
    num: "02",
    title: "Design",
    desc: "We sketch your cake concept, choose colour palettes and textures, and share a detailed mood board for your approval.",
  },
  {
    num: "03",
    title: "Baking",
    desc: "Every element is baked fresh to order using premium ingredients — no preservatives, no shortcuts, only love.",
  },
  {
    num: "04",
    title: "Delivery",
    desc: "Carefully packaged and delivered to your door, or collected from our studio, on the date that matters most.",
  },
];

function Step({ num, title, desc }: (typeof STEPS)[number]) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-cursor-hover
      className="reveal glass rounded-sm p-7 hover:bg-cream/10 transition-colors duration-400 group"
    >
      <div className="font-serif text-5xl text-champagne/25 group-hover:text-champagne/50 transition-colors duration-400 mb-4">
        {num}
      </div>
      <h3 className="font-serif text-xl text-cream mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-cream/55">{desc}</p>
    </div>
  );
}

export default function Process() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  return (
    <section id="process" className="relative px-6 md:px-16 py-32">
      <div className="text-center mb-16">
        <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
          How It Works
        </p>
        <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream">
          From <em className="italic text-rose">Dream</em> to Dessert
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {STEPS.map((s) => (
          <Step key={s.num} {...s} />
        ))}
      </div>
    </section>
  );
}
