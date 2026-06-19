"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollProgressContext } from "@/lib/scroll-context";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      // Slightly tighter than before — feels responsive without losing the glide.
      duration: prefersReduced ? 0 : 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", (e: { progress: number }) => {
      progressRef.current.value = e.progress;
      ScrollTrigger.update();
    });

    // One cancellable RAF loop that we can pause when the tab is hidden, so the
    // scroll engine isn't churning in the background and janking on return.
    let rafId = 0;
    let running = true;
    function raf(time: number) {
      lenis.raf(time);
      if (running) rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(raf);
        ScrollTrigger.refresh();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    ScrollTrigger.defaults({ scroller: document.body });

    // Bridge ScrollTrigger's expectations with Lenis-driven scroll
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      lenis.destroy();
    };
  }, []);

  return (
    <ScrollProgressContext.Provider value={progressRef}>
      {children}
    </ScrollProgressContext.Provider>
  );
}
