import { useRef } from "react";
import type { CSSProperties } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";

interface ScrollWordsProps {
  text: string;
  className?: string;
  as?: "h2" | "p";
}

/**
 * A line of large type whose words light up one after another as it scrolls
 * through the middle of the screen. The sentence itself is untouched: screen
 * readers get it whole from the label, and each word only carries its place
 * in the line for the styles to use.
 */
export function ScrollWords({ text, className = "", as: Tag = "h2" }: ScrollWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useScrollProgress(ref, { from: 0.86, to: 0.32 });

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={`scroll-words ${className}`.trim()} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={index}
          className="scroll-words__word"
          aria-hidden="true"
          style={{ "--at": (index / words.length).toFixed(3) } as CSSProperties}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
