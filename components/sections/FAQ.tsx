"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const FAQS = [
  {
    q: "How far in advance should I order?",
    a: "We recommend booking at least 2–3 weeks ahead for custom cakes and 1 week for standard orders. During peak seasons, please book 4–6 weeks in advance to avoid disappointment.",
  },
  {
    q: "Do you deliver?",
    a: "Yes! We deliver across Panipat, Karnal, Kurukshetra, and Sonipat. Delivery fees vary by distance. For Delhi NCR orders, please contact us for special arrangements.",
  },
  {
    q: "Can you accommodate dietary requirements?",
    a: "Absolutely. We offer eggless, vegan, and gluten-sensitive options for most of our products. Please mention your requirements when placing an order.",
  },
  {
    q: "How do I share my cake design ideas?",
    a: "You can upload reference images in our order form below, or share photos via WhatsApp after placing your enquiry. We love Pinterest boards and rough sketches!",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, bank transfer, and cash. A 50% advance is required to confirm your booking, with the balance due 48 hours before delivery.",
  },
  {
    q: "Do you do tasting sessions?",
    a: "For wedding and large event cakes, we offer private tasting consultations at our studio, redeemable upon placing a full order.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-cursor-hover
      onClick={() => setOpen((o) => !o)}
      className="reveal border-t border-champagne/15 py-6 cursor-none"
    >
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-serif text-lg text-cream">{q}</h3>
        <span className="relative w-5 h-5 flex-shrink-0">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-champagne" />
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-champagne transition-transform duration-300 ${
              open ? "scale-y-0" : ""
            }`}
          />
        </span>
      </div>
      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? "200px" : "0px", marginTop: open ? "16px" : "0px" }}
      >
        <p className="text-sm leading-relaxed text-cream/55">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  return (
    <section id="faq" className="relative px-6 md:px-16 py-32">
      <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
        Questions
      </p>
      <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream mb-14">
        Everything You <em className="italic text-rose">Need to Know</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {FAQS.map((f) => (
          <FaqItem key={f.q} {...f} />
        ))}
      </div>
    </section>
  );
}
