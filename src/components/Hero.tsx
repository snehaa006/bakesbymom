import { useRef } from "react";
import { Reveal } from "./Reveal";
import { Hearth } from "./Hearth";
import { useNoteParallax } from "../hooks/useScrollEffects";
import { useSceneTilt } from "../hooks/useTilt";

export function Hero() {
  const mixerRef = useRef<HTMLDivElement>(null);
  const ovenRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useSceneTilt(mixerRef, 6, 10);
  useSceneTilt(ovenRef, 7, 12);
  useNoteParallax(noteRef, 0.1, "rotate(2.5deg)");

  return (
    <section className="hero">
      <Reveal className="hero__panel">
        <p className="hero__title">
          The hearth wakes
          <br />
          before the city.
        </p>
        <p className="hero__subtitle">
          Step inside the bakery while the flour is still in the air, the first loaves cool on wooden racks, and every
          recipe sounds like a memory.
        </p>
      </Reveal>

      <div className="kitchen">
        {/* LEFT — stand mixer folding the dough */}
        <div className="scene scene--mixer">
          <div className="scene__pedestal" />
          <div className="scene__float">
            <div ref={mixerRef} className="mixer">
              <div className="mixer__drop mixer__drop--1" />
              <div className="mixer__drop mixer__drop--2" />
              <div className="mixer__drop mixer__drop--3" />
              <div className="mixer__column" />
              <div className="mixer__head">
                <div className="mixer__dial" />
                <div className="mixer__badge" />
              </div>
              <div className="mixer__beater">
                <span />
                <span />
                <span />
              </div>
              <div className="mixer__bowl">
                <div className="mixer__batter" />
                <div className="mixer__bowl-shine" />
              </div>
              <div className="mixer__foot" />
            </div>
          </div>
          <p className="scene__label">Butter, sugar &amp; flour, folded to silk</p>
        </div>

        {/* RIGHT — wood-fired hearth */}
        <div className="scene scene--hearth">
          <div className="scene__pedestal" />
          <div className="scene__float scene__float--slow">
            <Hearth ref={ovenRef} />
          </div>
          <p className="scene__label">Into the wood-fired hearth</p>
        </div>

        <div ref={noteRef} className="note-card">
          <p className="note-card__title">Feed the starter before the sun finds the windows.</p>
          <p className="note-card__body">
            A quiet rule from the first family notebook: let the dough wake slowly, then shape it by hand while the
            oven gathers its glow.
          </p>
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
