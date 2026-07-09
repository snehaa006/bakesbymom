import type { ComponentPropsWithoutRef } from "react";
import { useReveal } from "../hooks/useReveal";

type RevealProps = ComponentPropsWithoutRef<"div">;

export function Reveal({ className = "", ...rest }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      {...rest}
    />
  );
}
