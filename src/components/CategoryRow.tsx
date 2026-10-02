import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CategoryWithCakes } from "../lib/catalog";
import { resolveThumbUrl } from "../lib/api";

/** The plain chevron the reference puts in its round carousel buttons. */
function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface CategoryRowProps {
  category: CategoryWithCakes;
  /** Alternates the band between the tinted and the plain ground. */
  tone: string;
  /** The first band is on screen at load, so its photos skip lazy-loading. */
  eager?: boolean;
}

/**
 * One category as a band, laid out the way Magnolia Bakery sets its "Treats
 * for any Occasion" and "Our Products" rows: a big centred heading, a line of
 * copy, an underlined VIEW MORE, round arrows parked on the right in line with
 * it, and a row of tall photo tiles with just the name underneath.
 */
export function CategoryRow({ category, tone, eager = false }: CategoryRowProps) {
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
    // One tile plus its gap, so a click always lands the next tile in place.
    const tile = track.querySelector<HTMLElement>(".cake-tile");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = tile ? tile.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  const cakes = category.cakes;
  const showArrows = overflows && !expanded;
  // VIEW MORE only earns its place when there is something off-screen to
  // reveal, or something expanded to fold back up.
  const showMore = overflows || expanded;

  return (
    <section className={`band band--${tone}`} id={`cat-${category.id}`}>
      <div className="band__inner">
        <header className="band__head">
          <h2 className="band__title">{category.name}</h2>
          {category.description && <p className="band__desc">{category.description}</p>}

          <div className="band__controls">
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
                  className="band__arrow"
                  onClick={() => scrollBy(-1)}
                  disabled={atStart}
                  aria-label={`Previous ${category.name} cakes`}
                >
                  <Chevron flip />
                </button>
                <button
                  type="button"
                  className="band__arrow"
                  onClick={() => scrollBy(1)}
                  disabled={atEnd}
                  aria-label={`More ${category.name} cakes`}
                >
                  <Chevron />
                </button>
              </div>
            )}
          </div>
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
            {cakes.map((cake, index) => (
              <Link key={cake.id} to={`/catalog/${cake.id}`} className="cake-tile">
                <div className="cake-tile__photo">
                  {cake.cover_url ? (
                    <img
                      src={resolveThumbUrl(cake.cover_url)}
                      alt={cake.name}
                      width={500}
                      height={600}
                      decoding="async"
                      loading={eager && index < 5 ? "eager" : "lazy"}
                      {...(eager && index < 5 ? { fetchpriority: "high" } : {})}
                    />
                  ) : (
                    <div className="cake-tile__placeholder">Photo coming soon</div>
                  )}
                </div>
                <h3 className="cake-tile__title">{cake.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
