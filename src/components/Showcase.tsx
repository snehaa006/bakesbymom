import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { resolvePhotoUrl } from "../lib/api";

/**
 * Sixteen covers pulled from the catalog, arranged four across. They are listed
 * here rather than fetched so the section paints with the rest of the page
 * instead of popping in after an API round trip; every one of them is a real
 * cake photo out of the same R2 bucket the catalog reads.
 */
const TILES = [
  { photo: "/api/photos/uploads/IMG-20260913-WA0002.png", alt: "Spiderman web cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0012.png", alt: "Dragon Ball Z cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0008.png", alt: "Football legend cake" },
  { photo: "/api/photos/uploads/IMG-20260310-WA0017.png", alt: "First birthday teddy cake" },

  { photo: "/api/photos/uploads/IMG-20251130-WA0022.png", alt: "Photo clothesline cake" },
  { photo: "/api/photos/uploads/IMG-20260213-WA0054.png", alt: "Butterfly and macaron cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0007.png", alt: "Angel wings cake" },
  { photo: "/api/photos/uploads/IMG-20260808-WA0045.png", alt: "Super Dad cake" },

  { photo: "/api/photos/uploads/IMG-20260913-WA0009.png", alt: "HBD wifey rose cake" },
  { photo: "/api/photos/uploads/IMG-20260206-WA0062.png", alt: "Pearl heart cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0011.png", alt: "Loaded chocolate drip cake" },
  { photo: "/api/photos/uploads/IMG-20251128-WA0019.png", alt: "Bride to be cake" },

  { photo: "/api/photos/uploads/IMG-20251130-WA0019.png", alt: "Engagement ring hands cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0003.png", alt: "Maroon and gold anniversary cake" },
  { photo: "/api/photos/uploads/IMG-20260808-WA0046.png", alt: "Rose flowerpot cake" },
  { photo: "/api/photos/uploads/IMG-20260913-WA0013.png", alt: "Janmashtami lotus cake" },
];

export function Showcase() {
  return (
    <section id="showcase" className="showcase">
      <div className="showcase__inner">
        <Reveal className="showcase__copy">
          <h2 className="showcase__heading">
            Passion,
            <br />
            Patience,
            <br />
            Perfection
          </h2>
          <p className="showcase__body">
            Three things go into every box that leaves this kitchen. We pour the passion in at the
            mixing bowl, give the batter the patience it asks for, and keep fussing over the piping
            until the last rose sits right. Taste what that does to a slice.
          </p>
          <Link to="/catalog" className="showcase__cta">
            Explore
          </Link>
        </Reveal>

        <Reveal className="showcase__grid">
          {TILES.map((tile) => (
            <Link key={tile.photo} to="/catalog" className="showcase__tile" aria-label={tile.alt}>
              <img src={resolvePhotoUrl(tile.photo)} alt={tile.alt} loading="lazy" />
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
