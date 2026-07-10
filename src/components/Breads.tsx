import { Reveal } from "./Reveal";

const BREADS = [
  {
    modifier: "card--sourdough",
    title: "Country sourdough",
    desc: "Slow-fermented for a deep caramel crust and a custardy crumb that still steams when sliced.",
  },
  {
    modifier: "card--brioche",
    title: "Raspberry brioche",
    desc: "Butter-rich dough wrapped around bright berry jam, baked until the edges turn coral and glossy.",
  },
  {
    modifier: "card--croissant",
    title: "Honey croissant",
    desc: "Laminated by hand, brushed with local honey, and stacked in flakes that shatter like morning light.",
  },
];

export function Breads() {
  return (
    <section id="breads" className="breads">
      <Reveal className="breads__intro">
        <p className="breads__eyebrow">Chapter II — What the Oven Gives</p>
        <h2 className="breads__heading">
          Not products.
          <br />
          Morning characters.
        </h2>
        <p className="breads__body">
          Each tray leaves the hearth with its own mood: crackling crusts, soft interiors, fruit folded into butter,
          and pastries that carry the scent of the whole room.
        </p>
      </Reveal>

      <div className="breads__grid">
        {BREADS.map((bread) => (
          <Reveal key={bread.title} className={`card ${bread.modifier}`}>
            <div className="card__glow" />
            <div className="card__body">
              <h3 className="card__title">{bread.title}</h3>
              <p className="card__desc">{bread.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
