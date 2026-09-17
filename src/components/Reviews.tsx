import { Reveal } from "./Reveal";
import { StarIcon } from "./icons";

interface Review {
  quote: string;
  name: string;
  meta: string;
  rating: number;
}

/** The one that gets the big blush card, the way the reference leads with a single voice. */
const FEATURED: Review = {
  quote:
    "Absolutely love this bakery! Everything is always fresh, delicious, and made with care. The perfect spot for a sweet treat!",
  name: "Ritika S.",
  meta: "Model Town · Ordered a birthday cake",
  rating: 5,
};

const REVIEWS: Review[] = [
  {
    quote: "The fudgy brownies are the real thing — gooey middle, crackled top. They never last the evening here.",
    name: "Aman K.",
    meta: "Sector 11 · Regular since 2022",
    rating: 5,
  },
  {
    quote: "Ordered a tres leches on a day's notice and it still turned up soft, cold and perfect. Packed beautifully too.",
    name: "Neha & Varun",
    meta: "Anniversary order",
    rating: 5,
  },
  {
    quote: "You can taste that it's a home kitchen — nothing over-sweet, nothing from a packet. My kids ask for it by name.",
    name: "Pooja M.",
    meta: "Tea-time cookie boxes",
    rating: 5,
  },
  {
    quote: "Cake was lovely and reached us on time. Would have loved a couple more eggless choices on the menu.",
    name: "Sahil G.",
    meta: "Office celebration",
    rating: 4,
  },
];

/** Five stars, the unearned ones left as faint outlines rather than dropped. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="review__stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} color={star <= rating ? "currentColor" : "rgba(122, 15, 42, 0.18)"} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="reviews">
      <Reveal className="reviews__intro">
        <p className="chapter-eyebrow">Kind Words</p>
        <h2 className="chapter-heading reviews__heading">What the neighbourhood says.</h2>
        <p className="chapter-body">
          Every box leaves the kitchen warm and comes back as a message on the phone. A few of the ones we kept.
        </p>
      </Reveal>

      <div className="reviews__grid">
        <Reveal className="review review--feature">
          <span className="review__quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <Stars rating={FEATURED.rating} />
          <p className="review__text">{FEATURED.quote}</p>
          <p className="review__name">{FEATURED.name}</p>
          <p className="review__meta">{FEATURED.meta}</p>
        </Reveal>

        {REVIEWS.map((review) => (
          <Reveal key={review.name} className="review">
            <Stars rating={review.rating} />
            <p className="review__text">{review.quote}</p>
            <p className="review__name">{review.name}</p>
            <p className="review__meta">{review.meta}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
