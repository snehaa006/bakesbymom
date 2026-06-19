import Link from "next/link";

/**
 * Brand mark for Bakesbymom — a 4-quadrant cream/chocolate disc inside the
 * logo's gradient ring, next to the wordmark.
 */
export default function Logo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const disc = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const text = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <Link
      href="/"
      data-cursor-hover
      className={`flex items-center gap-3 ${className}`}
      aria-label="Bakesbymom — home"
    >
      <span className="brand-ring inline-flex shrink-0">
        <span className={`${disc} block overflow-hidden`}>
          <span
            className="block h-full w-full"
            style={{
              background:
                "conic-gradient(#F3E5CE 0deg 90deg, #6E4B2A 90deg 180deg, #C9A074 180deg 270deg, #3A2418 270deg 360deg)",
            }}
          />
        </span>
      </span>
      <span className={`font-serif ${text} tracking-wide text-cream leading-none`}>
        Bakes<span className="text-champagne italic">bymom</span>
      </span>
    </Link>
  );
}
