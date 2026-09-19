/**
 * The FSSAI vegetarian mark — a green dot inside a green square. Indian
 * packaged food carries it (brown/red for non-vegetarian), and since nothing
 * here is baked with egg, everything on the site wears the green one.
 */
export function VegMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="veg-mark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Vegetarian — contains no egg"
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#fff" stroke="#1f7a3d" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="6" fill="#1f7a3d" />
    </svg>
  );
}

/** The mark with the sentence that explains it, for the top of a shelf page. */
export function VegNote() {
  return (
    <p className="veg-note">
      <VegMark />
      <span>
        <strong>Pure vegetarian.</strong> The green dot is the FSSAI vegetarian mark — every single
        thing we bake is eggless, so everything on this page carries it.
      </span>
    </p>
  );
}
