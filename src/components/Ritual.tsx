import { useRef } from "react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Hearth } from "./Hearth";
import { useHoverTilt } from "../hooks/useTilt";

/* Chip layout shared by every cookie (percent coordinates inside the disc). */
const CHIPS = [
  { x: 30, y: 26 },
  { x: 62, y: 22 },
  { x: 46, y: 44 },
  { x: 22, y: 56 },
  { x: 70, y: 52 },
  { x: 38, y: 70 },
  { x: 60, y: 74 },
  { x: 78, y: 36 },
];

type CookieVariant = "raw" | "baking" | "done";

function Cookie({ variant }: { variant: CookieVariant }) {
  return (
    <div className={`cookie cookie--${variant}`}>
      <div className="cookie__body">
        <div className="cookie__gloss" />
        {CHIPS.map((c, i) => (
          <span key={i} className="cookie__chip" style={{ left: `${c.x}%`, top: `${c.y}%` }} />
        ))}
      </div>
    </div>
  );
}

/* Stage 1 — creaming butter, sugar & flour into dough. */
function MixScene() {
  return (
    <div className="mix">
      <div className="mix__drop mix__drop--1" />
      <div className="mix__drop mix__drop--2" />
      <div className="mix__drop mix__drop--3" />
      <div className="mix__spoon" />
      <div className="mix__bowl">
        <div className="mix__dough" />
        <div className="mix__shine" />
      </div>
    </div>
  );
}

/* Stage 2 — shaping the raw dough under a rolling pin. */
function ShapeScene() {
  return (
    <div className="shape">
      <div className="shape__board" />
      <Cookie variant="raw" />
      <div className="shape__pin">
        <span className="shape__pin-handle shape__pin-handle--l" />
        <span className="shape__pin-barrel" />
        <span className="shape__pin-handle shape__pin-handle--r" />
      </div>
      <div className="shape__flour shape__flour--1" />
      <div className="shape__flour shape__flour--2" />
    </div>
  );
}

/* Stage 3 — baking in the same hearth from the hero, shrunk to fit the row. */
function BakeScene() {
  return (
    <Hearth compact>
      <Cookie variant="baking" />
    </Hearth>
  );
}

/* Stage 4 — the finished cookie, golden and glossy. */
function DoneScene() {
  return (
    <div className="done">
      <div className="done__steam done__steam--1" />
      <div className="done__steam done__steam--2" />
      <div className="done__steam done__steam--3" />
      <Cookie variant="done" />
      <div className="done__plate" />
    </div>
  );
}

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

function FlowArrow() {
  return (
    <div className="flow__arrow" aria-hidden="true">
      <span className="flow__track" />
      <span className="flow__travel" />
      <span className="flow__head" />
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
          <MixScene />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={2} title="Shape" caption="Rolled and pressed into soft, raw rounds.">
          <ShapeScene />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={3} title="Bake" caption="Into the wood-fired hearth until golden.">
          <BakeScene />
        </FlowStage>
        <FlowArrow />
        <FlowStage index={4} title="Done" caption="Crispy edges, gooey centre, melting chips.">
          <DoneScene />
        </FlowStage>
      </Reveal>
    </section>
  );
}
