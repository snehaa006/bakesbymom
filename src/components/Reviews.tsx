import { Reveal } from "./Reveal";
import { StarIcon } from "./icons";

interface Review {
  quote: string;
  name: string;
  meta: string;
  rating: number;
}

/** The one that gets the big chocolate card, the way the reference leads with a single voice. */
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
        <StarIcon key={star} size={15} color={star <= rating ? "currentColor" : "rgba(43, 30, 23, 0.16)"} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <Reveal className="reviews__intro stagger">
          <p className="eyebrow">Kind Words</p>
          <h2 className="reviews__heading display">What the neighbourhood says.</h2>
          <p className="reviews__lede lede">
            Every box leaves the kitchen warm and comes back as a message on the phone. A few of the ones we kept.
          </p>
        </Reveal>

        <Reveal className="review review--feature stagger">
          <span className="review__quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <Stars rating={FEATURED.rating} />
          <p className="review__text">{FEATURED.quote}</p>
          <div className="review__by">
            <p className="review__name">{FEATURED.name}</p>
            <p className="review__meta">{FEATURED.meta}</p>
          </div>
        </Reveal>

        <Reveal className="reviews__grid stagger">
          {REVIEWS.map((review) => (
            <article key={review.name} className="review">
              <Stars rating={review.rating} />
              <p className="review__text">{review.quote}</p>
              <div className="review__by">
                <p className="review__name">{review.name}</p>
                <p className="review__meta">{review.meta}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
