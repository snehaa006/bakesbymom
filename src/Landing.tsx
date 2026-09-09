import { useRef } from "react";
import { FlourLayer } from "./components/FlourLayer";
import { Seal } from "./components/Seal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Acclaim } from "./components/Acclaim";
import { About } from "./components/About";
import { HowToOrder } from "./components/HowToOrder";
import { RotatingBadge } from "./components/RotatingBadge";
import { Ritual } from "./components/Ritual";
import { Breads } from "./components/Breads";
import { Timeline } from "./components/Timeline";
import { Visit } from "./components/Visit";
import { useNavAndSealScroll, useScrolledPast } from "./hooks/useScrollEffects";

export function Landing() {
  const navRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useNavAndSealScroll(navRef, sealRef);
  // The badge is not painted on the first screen — it pops in on the first scroll.
  const badgeIn = useScrolledPast(40);

  return (
    <div className="page">
      <FlourLayer />
      <div className="ambient-glow" />
      <Seal ref={sealRef} />
      <Nav ref={navRef} />

      {/* Pinned to the viewport, so it rides along the whole page — top to bottom
          and back up — and always paints over the sections it passes. It jumps
          in out of a butter-yellow flare the first time the page is scrolled. */}
      <RotatingBadge
        className={`spin-badge--float ${badgeIn ? "spin-badge--in" : ""}`.trim()}
        text="order your cakes and cookies now"
        src="/badge-tart.png"
      />

      <main id="top">
        <Hero />
        <Acclaim />
        <About />
        <HowToOrder />
        <Ritual />
        <Breads />
        <Timeline />
        <Visit />
      </main>
    </div>
  );
}
