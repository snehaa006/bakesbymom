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
        <div className="hero__grid">
          <Reveal className="hero__media">
            <PhotoSlot
              className="photo-slot--hero"
              label="Hero photo — a box of the good stuff"
              hint="Cakes, brownies & cookies · landscape 4:3"
            />
          </Reveal>

          <Reveal className="hero__copy">
            <p className="hero__eyebrow">Baked fresh every morning</p>
            <h1 className="hero__title">
              We're <em className="hero__title-script">Bakesbymom</em>
              <br />
              Home Bakery.
            </h1>
            <p className="hero__subtitle">
              A home bakery in Panipat making celebration cakes, fudgy brownies, soft cookies, cupcakes and warm
              breads — every order baked to order, by hand, in small batches.
            </p>

            <div className="hero__actions">
              <Link to="/catalog" className="hero__cta">
                <span>See this week's bakes</span>
                <span className="hero__cta-divider" aria-hidden="true" />
                <ArrowIcon />
              </Link>
              <a href="#about" className="hero__link">
                Our story
              </a>
            </div>

            <ul className="hero__facts">
              <li>
                <strong>Cakes</strong>
                <span>Celebration & custom</span>
              </li>
              <li>
                <strong>Brownies</strong>
                <span>Fudgy, never dry</span>
              </li>
              <li>
                <strong>Cookies</strong>
                <span>Baked to order</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
            <path d="M0,96 C240,140 420,20 720,44 C1020,68 1220,140 1440,86 L1440,140 L0,140 Z" fill="#f7e9be" />
          </svg>
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
