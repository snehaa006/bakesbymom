"use client";

import { useEffect, useState } from "react";
import { fetchReviews, submitReview, type ReviewRow } from "@/lib/supabase";
import { MODULES } from "@/lib/products";

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={onChange ? () => onChange(n) : undefined}
          data-cursor-hover={onChange ? true : undefined}
          className={`text-lg leading-none ${
            n <= value ? "text-champagne" : "text-cream/25"
          } ${onChange ? "cursor-none" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewsClient() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((r) => active && setReviews(r))
      .catch(() => active && setReviews([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const review: ReviewRow = {
      name: String(fd.get("name") || "").trim(),
      product: String(fd.get("product") || "") || null,
      message: String(fd.get("message") || "").trim(),
      rating,
    };
    if (!review.name || !review.message) return;

    setStatus("sending");
    try {
      await submitReview(review);
      // optimistic: show it immediately at the top
      setReviews((prev) => [
        { ...review, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setStatus("done");
      form.reset();
      setRating(5);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Could not save your review."
      );
    }
  }

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="px-6 md:px-16 pb-28">
      <header className="max-w-3xl mb-12">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-champagne mb-3">
          Love Notes
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4">
          Customer <em className="italic text-rose">Reviews</em>
        </h1>
        <p className="text-sm md:text-base text-cream/55 leading-relaxed">
          Real words from real celebrations. Tasted something you loved? We&rsquo;d
          be honoured if you left a note below.
        </p>
        {avg && (
          <div className="flex items-center gap-3 mt-5">
            <Stars value={Math.round(Number(avg))} />
            <span className="text-sm text-cream/70">
              {avg} average · {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
        {/* reviews list */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-cream/45">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-cream/45">
              No reviews yet — be the first to leave one!
            </p>
          ) : (
            reviews.map((r, i) => (
              <article
                key={r.id ?? i}
                className="glass rounded-sm p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <Stars value={r.rating} />
                  {r.product && (
                    <span className="text-[0.6rem] uppercase tracking-[0.16em] text-cream/40">
                      {r.product}
                    </span>
                  )}
                </div>
                <p className="font-serif italic text-lg text-cream leading-relaxed mb-3">
                  &ldquo;{r.message}&rdquo;
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-champagne/70">
                  — {r.name}
                </p>
              </article>
            ))
          )}
        </div>

        {/* submit form */}
        <form
          onSubmit={handleSubmit}
          className="glass rounded-sm p-6 md:p-7 flex flex-col gap-4 lg:sticky lg:top-28"
        >
          <h2 className="font-serif text-2xl text-cream">Leave a review</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.66rem] uppercase tracking-[0.18em] text-champagne/70">
              Your rating
            </label>
            <Stars value={rating} onChange={setRating} />
          </div>

          <input name="name" required placeholder="Your name *" className="rv-input" />
          <select name="product" className="rv-input" defaultValue="">
            <option value="">What did you order? (optional)</option>
            {MODULES.map((m) => (
              <option key={m.slug}>{m.name}</option>
            ))}
          </select>
          <textarea
            name="message"
            required
            placeholder="Tell us about your experience *"
            className="rv-input min-h-[110px] resize-y"
          />

          {status === "error" && <p className="text-xs text-rose">{errorMsg}</p>}
          {status === "done" && (
            <p className="text-xs text-champagne">
              Thank you! Your review is live. ✦
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            className="btn-shine bg-champagne text-dark py-3.5 text-xs font-medium uppercase tracking-[0.2em] disabled:opacity-60"
          >
            <span>{status === "sending" ? "Posting…" : "Post Review →"}</span>
          </button>
        </form>
      </div>

      <style jsx global>{`
        .rv-input {
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
        .rv-input:focus {
          border-color: #c9a074;
          background: rgba(201, 160, 116, 0.06);
        }
        .rv-input option {
          background: #1a120b;
        }
      `}</style>
    </section>
  );
}
