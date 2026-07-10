import { Reveal } from "./Reveal";
import { BakerScene } from "./BakerScene";

export function Hero() {
  return (
    <section className="hero">
      <Reveal className="hero__panel">
        <p className="hero__title">
          Every cake becomes
          <br />
          a little celebration.
        </p>
        <p className="hero__subtitle">
          From the first swirl of buttercream to the final sprinkle, everything is made slowly, warmly, and just for
          your moment.
        </p>
      </Reveal>

      <Reveal className="hero__scene-wrap">
        <BakerScene />
      </Reveal>

      <div className="scroll-cue">
        <span className="scroll-cue__label">Scroll</span>
        <div className="scroll-cue__track">
          <div className="scroll-cue__dot" />
        </div>
      </div>
    </section>
  );
}
