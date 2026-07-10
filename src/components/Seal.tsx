import { forwardRef } from "react";
import { LoafIcon } from "./icons";

export const Seal = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <div ref={ref} className="seal">
      <div className="seal__disc" />
      <svg viewBox="0 0 120 120" className="seal__ring">
        <defs>
          <path id="sealPath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fill="#F7E9C4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "3.2px", fontWeight: 500 }}>
          <textPath href="#sealPath">BAKED FRESH EVERY MORNING • CRAFTED WITH LOVE • </textPath>
        </text>
      </svg>
      <div className="seal__icon">
        <LoafIcon size={34} color="#F7E9C4" />
      </div>
    </div>
  );
});

Seal.displayName = "Seal";
