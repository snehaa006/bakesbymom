import { useCallback, useEffect, useState } from "react";
import type { AnimationEvent } from "react";

/**
 * The curtain that opens the site: the wordmark fades up small and centred,
 * then walks forward towards the reader until it overflows the screen, and the
 * whole panel dissolves to leave the landing page behind it.
 *
 * It belongs to the page load, not to the route — coming back to "/" from the
 * catalog should not replay it — so a module-level flag remembers that it has
 * already run. A reload resets the module, and the curtain opens again.
 */
let alreadyPlayed = false;

/** Comfortably past the tail of the `introPanel` keyframes in index.css. */
const FALLBACK_MS = 4200;

export function Intro() {
  const [playing, setPlaying] = useState(() => {
    if (alreadyPlayed) return false;
    // Someone who asked for less motion gets the page, not the performance.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      alreadyPlayed = true;
      return false;
    }
    return true;
  });

  const finish = useCallback(() => setPlaying(false), []);

  useEffect(() => {
    if (!playing) return;
    alreadyPlayed = true;

    // Nothing should scroll underneath the curtain while it is closed. The
    // unlock lives in the cleanup, so it runs however the curtain comes down.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // The panel's own animationend is what normally ends this. The timer is a
    // backstop for the case where that event never lands — the landing page
    // decodes a 3D scene while this plays, and a choked main thread must never
    // leave the reader stuck behind a curtain that has already faded out.
    const timer = window.setTimeout(finish, FALLBACK_MS);

    // And if the reader tries to move before either of those, let them.
    const events = ["wheel", "touchmove", "keydown"] as const;
    for (const event of events) window.addEventListener(event, finish, { passive: true });

    return () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, finish);
      document.body.style.overflow = previousOverflow;
    };
  }, [playing, finish]);

  if (!playing) return null;

  // The mark and the glow animate too and their events bubble; only the panel's
  // own fade means the curtain is actually down.
  function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) finish();
  }

  return (
    <div className="intro" role="presentation" onAnimationEnd={onAnimationEnd}>
      <div className="intro__mark">
        <span className="intro__word">Bakesbymom</span>
        <span className="intro__rule" aria-hidden="true" />
        <span className="intro__tagline">Home Bakery · Panipat</span>
      </div>
    </div>
  );
}
