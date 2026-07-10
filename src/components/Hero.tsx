import { useRef } from "react";
import { Reveal } from "./Reveal";
import { useArchPointerParallax, useNoteParallax } from "../hooks/useScrollEffects";

export function Hero() {
  const archRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useArchPointerParallax(archRef);
  useNoteParallax(noteRef, 0.14, "rotate(2deg)");

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

      <div className="hero__oven-wrap">
        <div className="oven">
          <div className="oven__vent oven__vent--left" />
          <div className="oven__vent oven__vent--right" />
          <div className="oven__heat-wash" />
          <div ref={archRef} className="oven__arch">
            <div className="oven__arch-inner" />
            <div className="oven__ember" />
            <div className="oven__ember oven__ember--small" />
          </div>
          <div className="oven__base" />
          <div className="oven__steam oven__steam--left" />
          <div className="oven__steam oven__steam--right" />
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
