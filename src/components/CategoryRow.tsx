import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CategoryWithCakes } from "../lib/catalog";
import { formatPrice } from "../lib/format";
import { resolvePhotoUrl } from "../lib/api";
import { ArrowIcon } from "./icons";

/** The strip under each photo, in the slot the reference uses for a pickup rule. */
function sizeLabel(weightKg: number): string {
  if (!weightKg) return "MADE TO ORDER";
  if (weightKg >= 2) return `${weightKg} KG · TIERED`;
  if (weightKg < 1) return `${weightKg} KG · SMALL`;
  return `${weightKg} KG · SERVES 8–10`;
}

interface CategoryRowProps {
  category: CategoryWithCakes;
  /** Rotates the band tint so no two neighbouring categories share a colour. */
  tone: string;
}

/**
 * One category as a band: its name centred above the row, a View more toggle,
 * arrows on the right, and the cakes running off the edge of the screen.
 */
export function CategoryRow({ category, tone }: CategoryRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // Grey out an arrow once the row is against that end, and note whether the
  // row runs off the edge at all — which is what decides whether the grid
  // toggle has anything to reveal, at whatever width the reader is on.
  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setOverflows(max > 4);
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows, expanded, category.cakes.length]);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    // One card plus its gap, so a click always lands the next card in place.
    const card = track.querySelector<HTMLElement>(".cake-card");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  const cakes = category.cakes;
  // The arrows belong to every real shelf, greyed out at whichever end the row
  // is already against — on a narrow window even two cakes need them.
  const showArrows = cakes.length > 1 && !expanded;
  // The grid toggle only earns its place when there is something off-screen to
  // reveal, or something expanded to fold back up.
  const showMore = overflows || expanded;

  return (
    <section className={`band band--${tone}`} id={`cat-${category.id}`}>
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">{category.name}</h2>
          {category.description && <p className="band__desc">{category.description}</p>}

          {showMore && (
            <button
              type="button"
              className="band__more"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "View more"}
            </button>
          )}

          {showArrows && (
            <div className="band__arrows">
              <button
                type="button"
                className="band__arrow band__arrow--prev"
                onClick={() => scrollBy(-1)}
                disabled={atStart}
                aria-label={`Previous ${category.name} cakes`}
              >
                <ArrowIcon size={17} />
              </button>
              <button
                type="button"
                className="band__arrow"
                onClick={() => scrollBy(1)}
                disabled={atEnd}
                aria-label={`More ${category.name} cakes`}
              >
                <ArrowIcon size={17} />
              </button>
            </div>
          )}
        </header>

        {cakes.length === 0 ? (
          <p className="band__empty">No cakes in this category yet.</p>
        ) : (
          <div
            ref={trackRef}
            onScroll={syncArrows}
            className={`band__track ${
              expanded ? "band__track--grid" : overflows ? "" : "band__track--fits"
            }`.trim()}
          >
            {cakes.map((cake) => (
              <Link key={cake.id} to={`/catalog/${cake.id}`} className="cake-card">
                <div className="cake-card__photo">
                  {cake.cover_url ? (
                    <img src={resolvePhotoUrl(cake.cover_url)} alt={cake.name} loading="lazy" />
                  ) : (
                    <div className="cake-card__placeholder">Photo coming soon</div>
                  )}
                </div>
                <div className="cake-card__tag">{sizeLabel(cake.weight_kg)}</div>
                <div className="cake-card__body">
                  <h3 className="cake-card__title">{cake.name}</h3>
                  {cake.description && <p className="cake-card__desc">{cake.description}</p>}
                  <p className="cake-card__price">Starting at {formatPrice(cake.fixed_price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
