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
import { useNavAndSealScroll } from "./hooks/useScrollEffects";

export function Landing() {
  const navRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useNavAndSealScroll(navRef, sealRef);

  return (
    <div className="page">
      <FlourLayer />
      <div className="ambient-glow" />
      <Seal ref={sealRef} />
      <Nav ref={navRef} />

      <main id="top">
        <Hero />
        {/* the badge sticks and travels alongside these sections */}
        <div className="sticky-zone">
          <RotatingBadge className="spin-badge--float" text="order your cakes and cookies now" />
          <Acclaim />
          <About />
        </div>
        <HowToOrder />
        <Ritual />
        <Breads />
        <Timeline />
        <Visit />
      </main>
    </div>
  );
}
