/**
 * The little cake robot that sits in the launcher button: a two-tier cake with
 * a screen for a face, stubby arms and a cherry antenna. Purely decorative, so
 * it is hidden from assistive tech — the button carries the label.
 */
export function CakeRobot() {
  return (
    <svg
      className="cake-bot"
      viewBox="0 0 48 48"
      width="34"
      height="34"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* antenna: a cherry on a stalk, the way Mom finishes every cake */}
      <g className="cake-bot__antenna">
        <path d="M24 10V6" stroke="var(--pill-cream)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="4.4" r="2.8" fill="var(--crimson)" />
        <circle cx="23.1" cy="3.5" r="0.8" fill="var(--pill-cream)" opacity="0.7" />
      </g>

      {/* head tier: frosting lid, screen face, two icing-swirl ears */}
      <g className="cake-bot__head">
        <circle cx="10.5" cy="19" r="2.6" fill="var(--honey-700)" />
        <circle cx="37.5" cy="19" r="2.6" fill="var(--honey-700)" />
        <rect x="12" y="10.5" width="24" height="16" rx="6" fill="var(--cream-200)" />
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
      <path d="M11.5 33.5 7 31" stroke="var(--cream-200)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36.5 33.5 41 31" stroke="var(--cream-200)" strokeWidth="2.4" strokeLinecap="round" />

      {/* base tier, with a sprinkle band */}
      <rect x="9" y="28" width="30" height="16" rx="5.5" fill="var(--cream-200)" />
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
