import { Reveal } from "./Reveal";

const EVENTS = [
  { year: "1986", text: "The starter is carried across town in a blue ceramic bowl." },
  { year: "2004", text: "A brick oven replaces the steel deck, and the crust changes overnight." },
  { year: "Today", text: "The same starter wakes before sunrise, feeding every loaf on the table.", isNow: true },
];

export function Timeline() {
  return (
    <section className="timeline">
      <Reveal className="story-panel">
        <p className="chapter-eyebrow">Chapter III — The Recipe Survives</p>
        <h2 className="chapter-heading timeline__heading">
          A bakery written
          <br />
          in flour marks.
        </h2>
        <p className="chapter-body">
          The first notes were not business plans. They were margins on paper sacks: hotter fire in January, longer
          rest when rain comes, save the last loaf for whoever knocks before dawn.
        </p>
      </Reveal>

      <div className="timeline__list">
        {EVENTS.map((event) => (
          <Reveal
            key={event.year}
            className={`timeline__item ${event.isNow ? "timeline__item--now" : ""}`.trim()}
          >
            <p className="timeline__year">{event.year}</p>
            <p className="timeline__text">{event.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
