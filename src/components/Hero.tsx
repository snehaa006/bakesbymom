import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { AuntyScene } from "./AuntyScene";
import { ArrowIcon } from "./icons";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
          <path
            d="M0,150 C260,54 520,4 780,44 C1030,82 1240,166 1440,120 L1440,420 L0,420 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="hero__grid container">
        <Reveal className="hero__copy stagger">
          <h1 className="hero__title display">
            <span className="hero__line">
              We're <em className="hero__title-script">Bakesbymom</em>
            </span>{" "}
            <span className="hero__line">Home Bakery.</span>
          </h1>
          <p className="hero__subtitle lede">
            A home bakery in Panipat baking cakes, brownies, cookies, cupcakes and breads — fresh to order.
          </p>
          <div className="hero__actions">
            <Link to="/catalog" className="btn hero__cta">
              <span>See this week's bakes</span>
              <ArrowIcon size={17} />
            </Link>
          </div>
        </Reveal>

        <div className="hero__scene">
          <div className="hero__halo" aria-hidden="true" />
          <AuntyScene />
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue__label">Scroll</span>
        <div className="scroll-cue__track">
          <div className="scroll-cue__dot" />
        </div>
      </div>
    </section>
  );
}
