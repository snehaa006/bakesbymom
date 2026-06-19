"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const TESTIMONIALS = [
  {
    quote:
      "The wedding cake was beyond anything we imagined. Every guest asked for the baker's number. It tasted as magical as it looked — layers of rose lychee with champagne cream.",
    author: "Anjali & Rohan, Delhi",
  },
  {
    quote:
      "I ordered a birthday dessert box for my daughter and she cried — happy tears! The brownies were fudgy perfection and the presentation was Instagram gold.",
    author: "Meera Kapoor, Gurgaon",
  },
  {
    quote:
      "Priya created a three-tier floral cake for our anniversary that left everyone speechless. The attention to detail and the flavours were sublime.",
    author: "Sanjay & Naina, Chandigarh",
  },
  {
    quote:
      "The chocolate truffle cake for our corporate event was a showstopper. Our clients kept asking where we ordered from. Velvet Crumb never disappoints.",
    author: "Vikram Sharma, CEO",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className="relative px-6 py-32">
      <div className="max-w-2xl mx-auto text-center">
        <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
          Love Notes
        </p>
        <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream mb-14">
          What Our <em className="italic text-rose">Clients</em> Say
        </h2>

        <div className="relative min-h-[220px] glass rounded-sm p-10 md:p-14">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center p-10 md:p-14 transition-all duration-600 ${
                i === active
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="text-champagne text-sm mb-5 tracking-[0.2em]">
                ✦ ✦ ✦ ✦ ✦
              </div>
              <p className="font-serif italic text-xl leading-relaxed text-cream mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-champagne/70">
                — {t.author}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2.5 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-cursor-hover
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "bg-champagne scale-150" : "bg-beige/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
