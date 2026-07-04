"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { submitOrder } from "@/lib/supabase";
import { CONTACT } from "@/lib/products";

export default function Order() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  const sub = useReveal<HTMLParagraphElement>();
  const contact = useReveal<HTMLDivElement>();
  const form = useReveal<HTMLFormElement>();

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const fd = new FormData(el);
    setStatus("sending");
    try {
      await submitOrder({
        name: String(fd.get("name") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        email: String(fd.get("email") || "").trim() || null,
        product: String(fd.get("product") || "") || "Custom enquiry",
        category: null,
        occasion: String(fd.get("occasion") || "") || null,
        event_date: String(fd.get("event_date") || "") || null,
        servings: String(fd.get("servings") || "") || null,
        message: String(fd.get("message") || "").trim() || null,
      });
      setStatus("done");
      el.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section id="order" className="relative px-6 md:px-16 py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <p ref={eyebrow} className="reveal text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
            Place Your Order
          </p>
          <h2 ref={title} className="reveal font-serif text-4xl md:text-5xl text-cream mb-6 leading-tight">
            Let&rsquo;s Create
            <br />
            <em className="italic text-champagne">Something</em>
            <br />
            Beautiful
          </h2>
          <p ref={sub} className="reveal text-sm leading-relaxed text-cream/55 max-w-sm">
            Share your vision and we&rsquo;ll craft a dessert that tells your
            story. Every order begins with a conversation.
          </p>
          <div ref={contact} className="reveal mt-12 pt-8 border-t border-champagne/20">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-champagne/70 mb-3">
              Contact
            </p>
            <p className="text-sm leading-loose text-cream/55">
              {CONTACT.email}
              <br />
              <a href={CONTACT.instagram} className="hover:text-champagne transition-colors">
                @bakesbymom on Instagram
              </a>
              <br />
              {CONTACT.city}
            </p>
          </div>
        </div>

        <form
          ref={form}
          onSubmit={handleSubmit}
          className="reveal flex flex-col gap-5"
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Your Name">
              <input name="name" required type="text" placeholder="Full name" className="field-input" />
            </Field>
            <Field label="Phone">
              <input name="phone" required type="tel" placeholder="+91 00000 00000" className="field-input" />
            </Field>
          </div>
          <Field label="Email Address">
            <input name="email" type="email" placeholder="your@email.com" className="field-input" />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Event Date">
              <input name="event_date" type="date" className="field-input" />
            </Field>
            <Field label="Occasion">
              <select name="occasion" className="field-input" defaultValue="">
                <option value="">Select occasion</option>
                <option>Birthday</option>
                <option>Wedding</option>
                <option>Anniversary</option>
                <option>Baby Shower</option>
                <option>Corporate Event</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Product Type">
              <select name="product" className="field-input" defaultValue="">
                <option value="">Select product</option>
                <option>Wedding Cake</option>
                <option>Birthday Cake</option>
                <option>Anniversary Cake</option>
                <option>Cupcakes</option>
                <option>Brownies</option>
                <option>Cookies</option>
                <option>Dessert Box</option>
              </select>
            </Field>
            <Field label="Serves (approx.)">
              <select name="servings" className="field-input" defaultValue="">
                <option value="">Select size</option>
                <option>1–10 people</option>
                <option>10–25 people</option>
                <option>25–50 people</option>
                <option>50–100 people</option>
                <option>100+ people</option>
              </select>
            </Field>
          </div>
          <Field label="Design Ideas / Message">
            <textarea
              name="message"
              placeholder="Describe your vision, favourite flavours, colour palette..."
              className="field-input min-h-[100px] resize-y"
            />
          </Field>

          {status === "error" && <p className="text-xs text-rose">{errorMsg}</p>}
          {status === "done" && (
            <p className="text-xs text-champagne">
              Thank you! Your enquiry has been received — we&rsquo;ll be in touch soon. ✦
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            className="btn-shine bg-champagne text-dark py-4 text-xs font-medium uppercase tracking-[0.2em] mt-2 disabled:opacity-60"
          >
            <span>{status === "sending" ? "Sending…" : "Send My Enquiry →"}</span>
          </button>
        </form>
      </div>

      <style jsx global>{`
        .field-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 92, 138, 0.22);
          color: #fcefc7;
          padding: 0.85rem 1rem;
          font-size: 0.88rem;
          font-weight: 300;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .field-input:focus {
          border-color: #ff5c8a;
          background: rgba(255, 92, 138, 0.06);
        }
        .field-input option {
          background: #1a0710;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.68rem] uppercase tracking-[0.2em] text-champagne/70">
        {label}
      </label>
      {children}
    </div>
  );
}
