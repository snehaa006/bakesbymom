import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { LogoCard } from "./LogoCard";

/**
 * The page's last word: a dark card with the call to order on one side and
 * the bakery's own card on the other, the way it would sit on the counter.
 */
export function HowToOrder() {
  return (
    <section id="order" className="order">
      <div className="container">
        <div className="order__panel">
          <div className="order__blob-mark" aria-hidden="true" />

          <Reveal className="order__copy">
            <h2 className="order__title display rise">
              <span className="rise__line">How To</span>{" "}
              <span className="rise__line">Order</span>
            </h2>
            <Link to="/catalog" className="order__link rise__line">
              Learn more about our ordering process →
            </Link>
          </Reveal>

          <Reveal className="order__logo">
            <LogoCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
