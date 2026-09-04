import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";

const VALUES = [
  {
    title: "Baked to order",
    text: "Nothing sits on a shelf. Your cake, brownie tray or cookie box goes into the oven once you order it.",
  },
  {
    title: "Real ingredients",
    text: "Good butter, real chocolate, fresh cream and fruit — no shortcuts, no packet mixes, no preservatives.",
  },
  {
    title: "Made for your moment",
    text: "Birthdays, anniversaries, tiny Tuesday treats — flavours, sizes and messages shaped around the occasion.",
  },
];

export function About() {
  return (
    <section id="about" className="about">
      <div className="about__top">
        <Reveal className="about__gallery">
          <PhotoSlot
            className="photo-slot--tall"
            label="Mom at work"
            hint="Portrait · 3:4"
          />
          <div className="about__gallery-stack">
            <PhotoSlot label="A finished cake" hint="Square · 1:1" />
            <PhotoSlot label="Brownies, sliced" hint="Square · 1:1" />
          </div>
        </Reveal>

        <Reveal className="about__copy">
          <p className="chapter-eyebrow">About us</p>
          <h2 className="about__heading">
            One kitchen,
            <br />
            <em className="about__heading-script">a whole dessert table.</em>
          </h2>
          <p className="chapter-body">
            Bakesbymom started the way most home bakeries do — one birthday cake for someone we love, then another for
            a neighbour, and then a kitchen that never quite stopped smelling of vanilla.
          </p>
          <p className="chapter-body">
            Today that same kitchen turns out celebration cakes, fudgy brownies, cupcakes, cookies, tea cakes and
            fresh breads. Every order is still mixed, shaped, baked and finished by hand, in batches small enough to
            taste the care.
          </p>

          <div className="about__signature">
            <p className="about__signature-name">Bakesbymom</p>
            <p className="about__signature-role">Home bakery · Panipat, Haryana</p>
          </div>
        </Reveal>
      </div>

      <div className="about__values">
        {VALUES.map((value) => (
          <Reveal key={value.title} className="about__value">
            <h3 className="about__value-title">{value.title}</h3>
            <p className="about__value-text">{value.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
