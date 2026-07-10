import { useEffect } from "react";
import type { RefObject } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Subtle 3D parallax driven by the cursor's position anywhere in the viewport.
 * Writes rotateX / rotateY onto the element so a `preserve-3d` child reads as a
 * solid object being turned. Used for the always-on hero scenes.
 */
export function useSceneTilt(
  ref: RefObject<HTMLElement | null>,
  maxX = 8,
  maxY = 12,
) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `rotateX(${-my * maxX}deg) rotateY(${mx * maxY}deg)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref, maxX, maxY]);
}

/**
 * Pronounced tilt toward the cursor while hovering the element, easing back to
 * flat on leave. Used for the cookie-journey stages so each scene feels like a
 * 3D object you can lean into.
 */
export function useHoverTilt(ref: RefObject<HTMLElement | null>, max = 14) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${-py * max}deg`);
      el.style.setProperty("--ry", `${px * max}deg`);
      el.style.setProperty("--lift", "1");
    };
    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--lift", "0");
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, max]);
}
