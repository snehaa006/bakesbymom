import { FlourLayer } from "./components/FlourLayer";
import { Intro } from "./components/Intro";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Products } from "./components/Products";
import { Ritual } from "./components/Ritual";
import { Showcase } from "./components/Showcase";
import { HowToOrder } from "./components/HowToOrder";
import { RotatingBadge } from "./components/RotatingBadge";
import { Reviews } from "./components/Reviews";
import { Footer } from "./components/Footer";
import { useScrolledPast } from "./hooks/useScrollEffects";

/**
 * The home page, ordered the way a shop window is: who we are, then what you
 * can order, then the work itself — the gallery, the story, the process — and
 * finally what people say and how to order.
 */
export function Landing() {
  // The badge is not painted on the first screen — it pops in on the first scroll.
  const badgeIn = useScrolledPast(40);

  return (
    <div className="page">
      <Intro />
      <FlourLayer />
      <div className="ambient-glow" aria-hidden="true" />
      <Nav />

      {/* Pinned to the viewport, so it rides along the whole page and always
          paints over the sections it passes. It eases in on the first scroll. */}
      <RotatingBadge
        className={`spin-badge--float ${badgeIn ? "spin-badge--in" : ""}`.trim()}
        text="order your cakes and cookies now"
        src="/badge-tart.png"
      />

      <main id="top">
        <Hero />
        <Products />
        <Showcase />
        <About />
        <Ritual />
        <Reviews />
        <HowToOrder />
      </main>

      <Footer />
    </div>
  );
}
