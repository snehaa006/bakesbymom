import { useRef } from "react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { FlowModel } from "./FlowModel";
import { useHoverTilt } from "../hooks/useTilt";

interface StageProps {
  index: number;
  title: string;
  caption: string;
  children: ReactNode;
}

function FlowStage({ index, title, caption, children }: StageProps) {
  const objectRef = useRef<HTMLDivElement>(null);
  useHoverTilt(objectRef, 16);

  return (
    <div className="flow__stage">
      <div className="flow__scene">
        <div className="flow__pedestal" />
        <div ref={objectRef} className="flow__object">
          {children}
        </div>
      </div>
      <div className="flow__meta">
        <span className="flow__step">Step {index}</span>
        <p className="flow__title">{title}</p>
        <p className="flow__caption">{caption}</p>
      </div>
    </div>
  );
}

/** A soft doodled arrow between two stages: one curved stroke, a rounded head. */
function FlowArrow() {
  return (
    <div className="flow__arrow" aria-hidden="true">
      <svg viewBox="0 0 52 30" fill="none">
        <path className="flow__arrow-shaft" d="M5 24C11 11 22 6 44 13" />
        <path className="flow__arrow-head" d="M33.5 16.1 44 13 37.2 4.4" />
      </svg>
    </div>
  );
}

export function Ritual() {
  return (
    <section id="ritual" className="ritual">
      <Reveal className="ritual__intro">
        <p className="chapter-eyebrow">Chapter I — Before the Bell</p>
        <h2 className="chapter-heading ritual__heading">From flour to the first warm bite.</h2>
        <p className="chapter-body">
          Every cookie is a small journey. Butter and sugar are creamed to silk, the dough is shaped by hand, the
          hearth turns it gold, and it lands on the plate still warm.
        </p>
      </Reveal>

      <Reveal className="flow">
        <FlowStage index={1} title="Mix" caption="Butter, sugar & flour folded into silky dough.">
          <FlowModel src="/mixer.glb" label="Stand mixer" front={30} />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={2} title="Shape" caption="Rolled and pressed into soft, raw rounds.">
          <FlowModel src="/oven.glb" label="Oven with a cake baking inside" front={270} />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={3} title="Pipe" caption="Buttercream roses piped on by hand.">
          <FlowModel
            src="/piping.glb"
            label="Baker piping roses onto a tiered cake"
            front={325}
            scale={1.5}
            tilt={8}
          />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={4} title="Done" caption="Crispy edges, gooey centre, melting chips.">
          <FlowModel src="/cake2.2.glb" label="Finished cake" front={300} />
        </FlowStage>
      </Reveal>
    </section>
  );
}
