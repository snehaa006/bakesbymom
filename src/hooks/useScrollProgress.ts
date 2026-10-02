import { useEffect } from "react";
import type { RefObject } from "react";

interface Options {
  /**
   * Where the element's top edge sits, as a fraction of the viewport height,
   * when progress reads 0 and when it reads 1. Leave `to` out to run the whole
   * pass: from the top edge entering at the bottom until the bottom edge
   * leaves at the top.
   */
  from?: number;
  to?: number;
  /** The CSS custom property the progress is written to. */
  property?: string;
}

/**
 * Writes how far an element has travelled through the viewport (0 → 1) to a
 * CSS custom property on it, once per frame while scrolling. The styles do the
 * rest — so a parallax column or a line of words lighting up is a calc(), not
 * a React render.
 *
 * Reduced motion pins the value at 1: everything is shown, nothing moves.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, options: Options = {}) {
  const { from = 1, to, property = "--progress" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty(property, "1");
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * from;
      const end = to === undefined ? -rect.height : vh * to;
      const raw = (start - rect.top) / (start - end || 1);
      el.style.setProperty(property, Math.min(1, Math.max(0, raw)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, from, to, property]);
}
