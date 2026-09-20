/**
 * The little cake robot that sits in the launcher button: a two-tier cake with
 * a screen for a face, stubby arms and a lit birthday candle on top. Purely
 * decorative, so it is hidden from assistive tech — the button carries the label.
 */
export function CakeRobot() {
  return (
    <svg
      className="cake-bot"
      viewBox="0 0 48 48"
      width="108"
      height="108"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* candle: a lit birthday candle where an antenna would be */}
      <g className="cake-bot__candle">
        <rect x="22.8" y="6.6" width="2.4" height="4.2" rx="1.2" fill="var(--pill-cream)" />
        <rect x="22.8" y="8" width="2.4" height="1" fill="var(--blush)" />
        <path d="M24 6.4V5.2" stroke="var(--maroon)" strokeWidth="0.7" strokeLinecap="round" />
        <g className="cake-bot__flame">
          <ellipse cx="24" cy="3.9" rx="2.4" ry="3.3" fill="var(--amber)" opacity="0.45" />
          <path
            d="M24 0.6c1.9 1.7 2.8 3.1 2.8 4.4a2.8 2.8 0 0 1-5.6 0c0-1.3.9-2.7 2.8-4.4Z"
            fill="var(--amber)"
          />
          <path
            d="M24 2.6c.9.9 1.4 1.7 1.4 2.5a1.4 1.4 0 0 1-2.8 0c0-.8.5-1.6 1.4-2.5Z"
            fill="var(--cream-100)"
          />
        </g>
      </g>

      {/* head tier: frosting lid, screen face, two icing-swirl ears */}
      <g className="cake-bot__head">
        <circle cx="10.5" cy="19" r="2.6" fill="var(--honey-700)" stroke="var(--maroon)" strokeWidth="0.9" />
        <circle cx="37.5" cy="19" r="2.6" fill="var(--honey-700)" stroke="var(--maroon)" strokeWidth="0.9" />
        <rect
          x="12"
          y="10.5"
          width="24"
          height="16"
          rx="6"
          fill="var(--cream-200)"
          stroke="var(--maroon)"
          strokeWidth="0.9"
        />
        <path
          d="M12 16.5v-.1a6 6 0 0 1 6-5.9h12a6 6 0 0 1 6 5.9v.1c-1.6 0-1.6 2-3.2 2s-1.6-2-3.2-2-1.6 2-3.2 2-1.6-2-3.2-2-1.6 2-3.2 2-1.6-2-3.2-2-1.6 2-3.2 2S13.6 16.5 12 16.5Z"
          fill="var(--blush)"
        />
        <rect x="15" y="17.5" width="18" height="7.5" rx="3.2" fill="var(--maroon)" />
        <g className="cake-bot__eyes">
          <circle cx="20.2" cy="21.2" r="1.5" fill="var(--pill-cream)" />
          <circle cx="27.8" cy="21.2" r="1.5" fill="var(--pill-cream)" />
        </g>
        <path
          d="M21.4 23.4c.8.7 1.7 1 2.6 1s1.8-.3 2.6-1"
          stroke="var(--blush)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>

      {/* arms */}
      <path d="M11.5 33.5 7 31" stroke="var(--maroon)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36.5 33.5 41 31" stroke="var(--maroon)" strokeWidth="2.4" strokeLinecap="round" />

      {/* base tier, with a sprinkle band */}
      <rect
        x="9"
        y="28"
        width="30"
        height="16"
        rx="5.5"
        fill="var(--cream-200)"
        stroke="var(--maroon)"
        strokeWidth="0.9"
      />
      <path
        d="M9 33.5v-.1A5.5 5.5 0 0 1 14.5 28h19a5.5 5.5 0 0 1 5.5 5.4v.1c-1.7 0-1.7 2.1-3.4 2.1s-1.7-2.1-3.4-2.1-1.7 2.1-3.4 2.1-1.7-2.1-3.4-2.1-1.7 2.1-3.4 2.1-1.7-2.1-3.4-2.1-1.7 2.1-3.3 2.1S10.7 33.5 9 33.5Z"
        fill="var(--amber)"
      />
      <circle cx="16.5" cy="39.5" r="1.3" fill="var(--blush)" />
      <circle cx="24" cy="40.2" r="1.3" fill="var(--crimson)" />
      <circle cx="31.5" cy="39.5" r="1.3" fill="var(--blush)" />
    </svg>
  );
}
