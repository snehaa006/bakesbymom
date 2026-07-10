import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { BagIcon, CupIcon, FlowerIcon, LoafIcon, PinIcon } from "./icons";

export function Visit() {
  return (
    <section id="visit" className="visit">
      <Reveal className="visit__intro">
        <p className="visit__eyebrow">Final Chapter — Pull Up a Chair</p>
        <h2 className="visit__heading">The table is already warm.</h2>
        <p className="visit__subtitle">
          Come for bread, stay for the room: coffee in small cups, flowers in chipped glass, and loaves cooling close
          enough to hear them crackle.
        </p>
      </Reveal>

      <Reveal className="visit__orbs">
        <div className="orb orb--wheat">
          <LoafIcon size={42} color="#F7E9C4" strokeWidth={1.4} />
        </div>
        <div className="orb orb--coffee">
          <div className="orb__steam" />
          <CupIcon size={40} color="#F7E9C4" />
        </div>
        <div className="orb orb--berry">
          <FlowerIcon size={42} color="#F7E9C4" />
        </div>
      </Reveal>

      <Reveal className="visit__actions">
        <Link to="/catalog" className="btn btn--filled">
          <BagIcon />
          Explore the catalog
        </Link>
        <a href="#top" className="btn btn--outline">
          <PinIcon />
          Visit at sunrise
        </a>
      </Reveal>

      <p className="visit__tagline">Baked Fresh Every Morning • Crafted With Love</p>

      <div className="visit__footer">
        <p className="visit__copyright">© 2026 Bakesbymom · Panipat, Haryana</p>
        <Link to="/admin" className="visit__admin-link">
          Admin
        </Link>
      </div>
    </section>
  );
}
