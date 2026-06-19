"use client";

import { useReveal } from "@/hooks/useReveal";

export default function Order() {
  const eyebrow = useReveal<HTMLParagraphElement>();
  const title = useReveal<HTMLHeadingElement>();
  const sub = useReveal<HTMLParagraphElement>();
  const contact = useReveal<HTMLDivElement>();
  const form = useReveal<HTMLFormElement>();

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
              velvetcrumb@gmail.com
              <br />
              +91 99999 00000
              <br />
              Panipat, Haryana
            </p>
          </div>
        </div>

        <form
          ref={form}
          onSubmit={(e) => e.preventDefault()}
          className="reveal flex flex-col gap-5"
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Your Name">
              <input type="text" placeholder="Full name" className="field-input" />
            </Field>
            <Field label="Phone">
              <input type="tel" placeholder="+91 00000 00000" className="field-input" />
            </Field>
          </div>
          <Field label="Email Address">
            <input type="email" placeholder="your@email.com" className="field-input" />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Event Date">
              <input type="date" className="field-input" />
            </Field>
            <Field label="Occasion">
              <select className="field-input">
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
              <select className="field-input">
                <option value="">Select product</option>
                <option>Custom Cake</option>
                <option>Wedding Cake</option>
                <option>Cupcakes</option>
                <option>Brownies</option>
                <option>Cookies</option>
                <option>Dessert Box</option>
              </select>
            </Field>
            <Field label="Serves (approx.)">
              <select className="field-input">
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
              placeholder="Describe your vision, favourite flavours, colour palette..."
              className="field-input min-h-[100px] resize-y"
            />
          </Field>
          <label
            htmlFor="refImg"
            data-cursor-hover
            className="border border-dashed border-champagne/30 hover:border-champagne hover:bg-champagne/5 transition-all p-6 text-center cursor-none block"
          >
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-champagne">
              Upload Reference Images
            </span>
            <input type="file" id="refImg" accept="image/*" multiple className="hidden" />
            <p className="text-xs text-cream/35 mt-1.5">
              JPG, PNG, PDF — up to 10MB each
            </p>
          </label>
          <button
            type="submit"
            data-cursor-hover
            className="btn-shine bg-champagne text-dark py-4 text-xs font-medium uppercase tracking-[0.2em] mt-2"
          >
            <span>Send My Enquiry →</span>
          </button>
        </form>
      </div>

      <style jsx global>{`
        .field-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(201, 169, 110, 0.2);
          color: #f8f4ee;
          padding: 0.85rem 1rem;
          font-size: 0.88rem;
          font-weight: 300;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .field-input:focus {
          border-color: #c9a96e;
          background: rgba(201, 169, 110, 0.05);
        }
        .field-input option {
          background: #16100a;
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
