import { forwardRef } from "react";
import type { ReactNode } from "react";

interface HearthProps {
  /** Compact drops the chimney + smoke so the same oven fits the flow row. */
  compact?: boolean;
  /** What is baking inside the mouth. Defaults to a loaf. */
  children?: ReactNode;
}

/**
 * The wood-fired hearth — one shared 3D furnace used both in the hero and as
 * the "Bake" step of the cookie journey. Everything is sized in the ambient
 * `--u` unit, so it scales to whatever context it is dropped into.
 */
export const Hearth = forwardRef<HTMLDivElement, HearthProps>(function Hearth({ compact = false, children }, ref) {
  return (
    <div ref={ref} className={`hearth${compact ? " hearth--compact" : ""}`}>
      {!compact && (
        <>
          <div className="hearth__smoke hearth__smoke--1" />
          <div className="hearth__smoke hearth__smoke--2" />
          <div className="hearth__smoke hearth__smoke--3" />
          <div className="hearth__chimney" />
        </>
      )}
      <div className="hearth__dome">
        <div className="hearth__dome-light" />
        <div className="hearth__rim">
          <div className="hearth__mouth">
            <div className="hearth__fire" />
            <div className="hearth__logs" />
            {children ?? <div className="hearth__loaf" />}
          </div>
        </div>
        {!compact && <div className="hearth__hatch" />}
      </div>
      <div className="hearth__stand" />
      <div className="hearth__heat" />
    </div>
  );
});
