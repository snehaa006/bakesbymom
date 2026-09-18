import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";
import { resolvePhotoUrl } from "../lib/api";

/**
 * What the kitchen actually sends out, in the order the catalog lists it.
 * Held here rather than fetched so the strip paints with the rest of the page
 * instead of popping in after an API round trip — every cover is a real photo
 * out of the same R2 bucket the catalog reads, so swapping one later is a
 * one-line change here.
 */
const PRODUCTS = [
  { name: "Kids & Character Birthdays", photo: "/api/photos/uploads/IMG-20260913-WA0002.png" },
  { name: "Birthdays for Mom & Dad", photo: "/api/photos/uploads/IMG-20260913-WA0007.png" },
  { name: "Birthdays for Your Partner", photo: "/api/photos/uploads/IMG-20260913-WA0009.png" },
  { name: "Classic Birthday", photo: "/api/photos/uploads/IMG-20260206-WA0062.png" },
  { name: "Engagement & Bride-to-Be", photo: "/api/photos/uploads/IMG-20251128-WA0019.png" },
  { name: "Anniversary", photo: "/api/photos/uploads/IMG-20260913-WA0003.png" },
  { name: "Mother's Day & Father's Day", photo: "/api/photos/uploads/IMG-20260808-WA0046.png" },
  { name: "Romantic & Just Because", photo: "/api/photos/uploads/IMG-20260913-WA0006.png" },
  { name: "Farewell & Send-off", photo: "/api/photos/uploads/IMG-20251130-WA0023.png" },
  { name: "Festival Specials", photo: "/api/photos/uploads/IMG-20260913-WA0013.png" },
  { name: "Teacher's Day", photo: "/api/photos/uploads/IMG-20260913-WA0014.png" },
];

/** Drift of the strip, in pixels per second. Slow enough to read a caption. */
const SPEED = 38;

/**
 * The products shelf: a heading over a strip of covers that drifts right to
 * left on its own, loops forever, holds still while you hover or tab into it,
 * and takes a shove from either arrow.
 *
 * The list is rendered twice and the track is translated by one copy's width,
 * so the wrap lands on an identical frame and reads as one endless belt.
 */
export function Products() {
  const trackRef = useRef<HTMLDivElement>(null);
  /** How far the belt has travelled, always folded back into one copy's width. */
  const offset = useRef(0);
  /** Pixels still owed to an arrow press, eased out over the frames that follow. */
  const nudge = useRef(0);
  const paused = useRef(false);

  /** One copy's width: where the second copy starts, gaps included. */
  const period = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[PRODUCTS.length] as HTMLElement | undefined;
    return first?.offsetLeft ?? 0;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      // Clamped so a backgrounded tab doesn't jump the belt on its way back.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const span = period();
      if (span > 0) {
        const chunk = nudge.current * Math.min(1, dt * 5);
        nudge.current -= chunk;
        const drift = paused.current || reduced.matches ? 0 : SPEED * dt;
        // Modulo twice — an arrow can push the offset negative.
        offset.current = (((offset.current + drift + chunk) % span) + span) % span;
        track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [period]);

  /** One card plus its gap, so an arrow always lands the next cover in place. */
  function shove(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const [a, b] = [track.children[0], track.children[1]] as (HTMLElement | undefined)[];
    const card = a && b ? b.offsetLeft - a.offsetLeft : 300;
    nudge.current += card * direction;
  }

  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    paused.current = false;
  };

  // The second copy is scenery: hidden from screen readers and skipped by tab.
  const belt = [...PRODUCTS, ...PRODUCTS];

  return (
    <section id="products" className="products">
      {/* Organic colour marks, carried over from the palette the page runs on. */}
      <div className="products__blob products__blob--peach" aria-hidden="true" />
      <div className="products__blob products__blob--blush" aria-hidden="true" />

      <div className="products__inner">
        <Reveal className="products__head">
          <p className="products__eyebrow">What we serve</p>
          <h2 className="products__heading">Our Products</h2>
          <p className="products__body">
            Every cake leaves this kitchen the old-fashioned way: baked to order in small batches,
            iced by hand the morning it goes out, and finished with whatever the occasion asks for.
          </p>

          <div className="products__actions">
            <Link to="/catalog" className="products__more">
              View more
            </Link>
            <div className="products__arrows">
              <button
                type="button"
                className="products__arrow products__arrow--prev"
                onClick={() => shove(-1)}
                aria-label="Previous products"
              >
                <ArrowIcon size={18} />
              </button>
              <button
                type="button"
                className="products__arrow"
                onClick={() => shove(1)}
                aria-label="Next products"
              >
                <ArrowIcon size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        className="products__viewport"
        onPointerEnter={hold}
        onPointerLeave={release}
        onFocusCapture={hold}
        onBlurCapture={release}
      >
        <div className="products__track" ref={trackRef}>
          {belt.map((product, index) => {
            const clone = index >= PRODUCTS.length;
            return (
              <Link
                key={`${product.name}-${index}`}
                to="/catalog"
                className="product-card"
                aria-hidden={clone || undefined}
                tabIndex={clone ? -1 : undefined}
              >
                <div className="product-card__photo">
                  <img src={resolvePhotoUrl(product.photo)} alt={product.name} loading="lazy" />
                </div>
                <h3 className="product-card__name">{product.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
