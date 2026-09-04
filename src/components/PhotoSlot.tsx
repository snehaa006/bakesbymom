interface PhotoSlotProps {
  /** Drop a real image in later — until then the frame renders as a labelled placeholder. */
  src?: string;
  alt?: string;
  /** Short label shown inside the empty frame, e.g. "Signature cake". */
  label: string;
  /** Optional second line with the intended crop, e.g. "Portrait · 3:4". */
  hint?: string;
  className?: string;
}

export function PhotoSlot({ src, alt = "", label, hint, className = "" }: PhotoSlotProps) {
  return (
    <figure className={`photo-slot ${src ? "photo-slot--filled" : ""} ${className}`.trim()}>
      {src ? (
        <img className="photo-slot__img" src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="photo-slot__empty">
          <span className="photo-slot__mark" aria-hidden="true" />
          <span className="photo-slot__label">{label}</span>
          {hint ? <span className="photo-slot__hint">{hint}</span> : null}
        </div>
      )}
    </figure>
  );
}
