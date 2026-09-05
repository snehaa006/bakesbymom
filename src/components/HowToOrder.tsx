import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { LogoCard } from "./LogoCard";

export function HowToOrder() {
  return (
    <section id="order" className="order">
      <div className="order__blob-mark" aria-hidden="true" />

      <div className="order__inner">
        <Reveal className="order__panel">
          <div className="order__panel-inner">
            <h2 className="order__title rise">
              <span className="rise__line">How To</span>
              <span className="rise__line">Order</span>
            </h2>
            <Link to="/catalog" className="order__link rise__line">
              Learn more about our ordering process →
            </Link>
          </div>
        </Reveal>

        <Reveal className="order__logo">
          <LogoCard />
        </Reveal>
      </div>
    </section>
  );
}
