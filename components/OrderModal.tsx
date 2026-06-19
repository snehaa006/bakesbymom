"use client";

import { useEffect, useState } from "react";
import { submitOrder } from "@/lib/supabase";

export interface OrderTarget {
  product: string;
  category?: string;
}

export default function OrderModal({
  target,
  onClose,
}: {
  target: OrderTarget | null;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  // Reset state whenever a new product is opened.
  useEffect(() => {
    if (target) {
      setStatus("idle");
      setErrorMsg("");
    }
  }, [target]);

  if (!target) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      await submitOrder({
        name: String(fd.get("name") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        email: String(fd.get("email") || "").trim() || null,
        product: target!.product,
        category: target!.category ?? null,
        occasion: String(fd.get("occasion") || "") || null,
        event_date: String(fd.get("event_date") || "") || null,
        servings: String(fd.get("servings") || "") || null,
        message: String(fd.get("message") || "").trim() || null,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-espresso/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass rounded-sm p-7 md:p-9">
        <button
          onClick={onClose}
          aria-label="Close"
          data-cursor-hover
          className="absolute top-4 right-4 text-cream/60 hover:text-cream text-xl leading-none"
        >
          ✕
        </button>

        {status === "done" ? (
          <div className="text-center py-10">
            <div className="text-champagne text-3xl mb-4">✦</div>
            <h3 className="font-serif text-3xl text-cream mb-3">Order received</h3>
            <p className="text-sm text-cream/60 leading-relaxed max-w-xs mx-auto">
              Thank you! Your request for{" "}
              <span className="text-champagne">{target.product}</span> is in. We&rsquo;ll
              reach out shortly to confirm the details.
            </p>
            <button
              onClick={onClose}
              data-cursor-hover
              className="btn-shine bg-champagne text-dark px-7 py-3 text-xs uppercase tracking-[0.18em] mt-8"
            >
              <span>Done</span>
            </button>
          </div>
        ) : (
          <>
            <p className="text-[0.66rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Place Your Order
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-cream mb-1">
              {target.product}
            </h3>
            {target.category && (
              <p className="text-xs uppercase tracking-[0.18em] text-cream/45 mb-6">
                {target.category}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <input name="name" required placeholder="Full name *" className="om-input" />
                <input name="phone" required placeholder="Phone *" className="om-input" />
              </div>
              <input name="email" type="email" placeholder="Email" className="om-input" />
              <div className="grid grid-cols-2 gap-4">
                <input name="event_date" type="date" className="om-input" />
                <select name="occasion" className="om-input" defaultValue="">
                  <option value="">Occasion</option>
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Anniversary</option>
                  <option>Baby Shower</option>
                  <option>Corporate</option>
                  <option>Just because</option>
                </select>
              </div>
              <select name="servings" className="om-input" defaultValue="">
                <option value="">Serves (approx.)</option>
                <option>1–10 people</option>
                <option>10–25 people</option>
                <option>25–50 people</option>
                <option>50–100 people</option>
                <option>100+ people</option>
              </select>
              <textarea
                name="message"
                placeholder="Flavours, colours, theme, reference ideas…"
                className="om-input min-h-[90px] resize-y"
              />

              {status === "error" && (
                <p className="text-xs text-rose">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-hover
                className="btn-shine bg-champagne text-dark py-3.5 text-xs font-medium uppercase tracking-[0.2em] disabled:opacity-60"
              >
                <span>{status === "sending" ? "Sending…" : "Send Order →"}</span>
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx global>{`
        .om-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(201, 160, 116, 0.25);
          color: #f3e5ce;
          padding: 0.8rem 1rem;
          font-size: 0.88rem;
          font-weight: 300;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .om-input:focus {
          border-color: #c9a074;
          background: rgba(201, 160, 116, 0.06);
        }
        .om-input option {
          background: #1a120b;
        }
      `}</style>
    </div>
  );
}
