import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

/* The story, told as three marks on a rail: where the baking started, where it
   got good, and everything it turned into. Copy is placeholder for now. */
const STEPS = [
  {
    title: "A hobby at home",
    text: "It started with birthday cakes for the people she loves — weekend bakes, one oven, and the joy of watching someone cut the first slice.",
  },
  {
    title: "Cakes, perfected",
    text: "Batch after batch the sponge got softer and the buttercream steadier, until the cakes people asked for became the cakes they came back for.",
  },
  {
    title: "A whole dessert table",
    text: "Cookies, brownies, cupcakes, bento and jar cakes, donuts, macarons, pastries and every kind of cake — one kitchen, and a table that keeps growing.",
  },
];

export function About() {
  return (
    <section id="about" className="about">
      <div className="about__inner">
        <Reveal className="about__copy">
          <p className="about__eyebrow">What began as a hobby in a home kitchen is now</p>

          <h2 className="about__heading">every cake, cookie and brownie on this table.</h2>

          <p className="about__body">
            Mom never set out to run a bakery. She baked for the people she loves — a birthday cake here, a tray of
            brownies there — and the kitchen quietly learned her hands.
          </p>
          <p className="about__body">
            One order became two, two became a weekend booked out, and the dessert table kept getting longer.
            Everything is still mixed, baked to order and finished by hand, in batches small enough to taste the care.
          </p>

          <Link to="/catalog" className="about__cta">
            <span>Explore the catalog</span>
            <svg className="about__cta-arrow" viewBox="0 0 56 12" fill="none" aria-hidden="true">
              <path d="M0 6h51" stroke="currentColor" strokeWidth="1.1" />
              <path
                d="M46.4 1.4 51 6l-4.6 4.6"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>

        {/* One Reveal for the whole rail, so the hairline between the marks
            never animates in pieces. */}
        <Reveal className="about__steps">
          {STEPS.map((step) => (
            <div key={step.title} className="about__step">
              <span className="about__step-dot" aria-hidden="true" />
              <h3 className="about__step-title">{step.title}</h3>
              <p className="about__step-text">{step.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
