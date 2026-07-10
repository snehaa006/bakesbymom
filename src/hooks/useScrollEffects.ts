import { useEffect } from "react";
import type { RefObject } from "react";

export function useNavAndSealScroll(
  navRef: RefObject<HTMLElement | null>,
  sealRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nav = navRef.current;
      if (nav) {
        if (y > 60) {
          nav.style.background = "rgba(250,240,206,0.9)";
          nav.style.boxShadow = "0 12px 40px rgba(120,20,40,0.16)";
        } else {
          nav.style.background = "rgba(250,240,206,0.62)";
          nav.style.boxShadow = "0 10px 34px rgba(120,20,40,0.10)";
        }
      }

      const doc = document.documentElement;
      const frac = y / Math.max(1, doc.scrollHeight - window.innerHeight);
      const seal = sealRef.current;
      if (seal) seal.style.opacity = frac > 0.35 ? "1" : "0";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [navRef, sealRef]);
}

export function useNoteParallax(
  ref: RefObject<HTMLElement | null>,
  speed: number,
  baseTransform: string,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `${baseTransform} translateY(${-center * speed}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, speed, baseTransform]);
}

export function useArchPointerParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translateX(-50%) translate(${mx * 14}px, ${my * 8}px)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref]);
}
