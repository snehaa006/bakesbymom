interface RotatingBadgeProps {
  /** Text that runs around the ring; it is repeated to close the circle. */
  text: string;
  /** Optional image for the middle of the badge. */
  src?: string;
  className?: string;
}

export function RotatingBadge({ text, src, className = "" }: RotatingBadgeProps) {
  const id = `badgeRing-${text.replace(/\W+/g, "").slice(0, 12)}`;
  const ring = `${text} • `;

  return (
    <div className={`spin-badge ${className}`.trim()} aria-label={text}>
      <svg className="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="spin-badge__text">
          <textPath href={`#${id}`}>{ring}</textPath>
        </text>
      </svg>

      <div className="spin-badge__center">
        {src ? (
          <img className="spin-badge__img" src={src} alt="" loading="lazy" />
        ) : (
          <span className="spin-badge__slot">Photo</span>
        )}
      </div>
    </div>
  );
}
