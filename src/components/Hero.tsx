import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";
import { ArrowIcon } from "./icons";

/* The 3D baker scene still lives in ./BakerScene.tsx — it is intentionally
   not rendered here, but the code is kept so it can be dropped back in. */

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__band">
        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
            <path
              d="M0,150 C260,54 520,4 780,44 C1030,82 1240,166 1440,120 L1440,420 L0,420 Z"
              fill="#f7e9be"
            />
          </svg>
        </div>

        <div className="hero__grid">
          <Reveal className="hero__media">
            <PhotoSlot
              className="photo-slot--hero"
              label="Hero photo"
              hint="A box of cakes, brownies & cookies"
            />
          </Reveal>

          <Reveal className="hero__copy">
            <h1 className="hero__title">
              We're <em className="hero__title-script">Bakesbymom</em>
              <br />
              Home Bakery.
            </h1>
            <p className="hero__subtitle">
              A home bakery in Panipat baking cakes, brownies, cookies, cupcakes and breads — fresh to order.
            </p>
            <Link to="/catalog" className="hero__cta">
              <span>See this week's bakes</span>
              <span className="hero__cta-divider" aria-hidden="true" />
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue__label">Scroll</span>
        <div className="scroll-cue__track">
          <div className="scroll-cue__dot" />
        </div>
      </div>
    </section>
  );
}
