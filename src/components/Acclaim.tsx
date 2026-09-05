import { Reveal } from "./Reveal";
import { PhotoSlot } from "./PhotoSlot";

export function Acclaim() {
  return (
    <section className="acclaim">
      {/* Organic colour marks, echoing the reference's peach & pink shapes. */}
      <div className="acclaim__blob acclaim__blob--peach" aria-hidden="true" />
      <div className="acclaim__blob acclaim__blob--blush" aria-hidden="true" />

      <div className="acclaim__inner">
        <Reveal className="acclaim__quote">
          <p className="acclaim__quote-text">
            <span className="acclaim__quote-line">&ldquo;Known for</span>
            <span className="acclaim__quote-script">Fudgy Brownies</span>
            <span className="acclaim__quote-line">in Panipat&rdquo;</span>
          </p>
          <p className="acclaim__quote-meta">Baked in small batches, most mornings of the week.</p>
        </Reveal>

        <Reveal className="acclaim__badges">
          <PhotoSlot className="photo-slot--badge" label="Badge" hint="Circle · 1:1" />
          <PhotoSlot className="photo-slot--badge" label="Badge" hint="Circle · 1:1" />
        </Reveal>

        <Reveal className="acclaim__cutout">
          <PhotoSlot
            className="photo-slot--cutout"
            label="Brownie cutout"
            hint="PNG with a transparent background"
          />
        </Reveal>
      </div>
    </section>
  );
}
