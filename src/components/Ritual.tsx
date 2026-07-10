import { Reveal } from "./Reveal";
import { FlameIcon, SunDomeIcon, WheatIcon } from "./icons";

const STEPS = [
  { modifier: "chip--a", icon: <SunDomeIcon />, text: "Starter wakes beside the warm brick." },
  { modifier: "chip--b", icon: <WheatIcon />, text: "Flour is folded until it becomes silk." },
  { modifier: "chip--c", icon: <FlameIcon />, text: "The hearth is fed until the room glows." },
];

export function Ritual() {
  return (
    <section id="ritual" className="ritual">
      <Reveal className="story-panel">
        <p className="chapter-eyebrow">Chapter I — Before the Bell</p>
        <h2 className="chapter-heading ritual__heading">
          Bread begins as a promise: flour, water, warmth, and time.
        </h2>
        <p className="chapter-body">
          Every morning starts in the quiet. The starter is stirred, linen is lifted from resting dough, and the
          first loaves are scored while the hearth remembers yesterday's fire.
        </p>
      </Reveal>

      <div className="ritual__list">
        {STEPS.map((step) => (
          <Reveal key={step.text} className={`chip ${step.modifier}`}>
            <span className="chip__icon">{step.icon}</span>
            <span className="chip__text">{step.text}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
