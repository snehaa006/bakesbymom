import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { hash: "#about", label: "About" },
  { hash: "#showcase", label: "Our Cakes" },
  { hash: "#ritual", label: "Ritual" },
  { hash: "#breads", label: "Breads" },
  { hash: "#visit", label: "Visit" },
];

/**
 * The one navbar the whole site wears — landing, catalog, cake detail and admin.
 * On the landing page the section links are plain in-page anchors; anywhere else
 * they route home first and App's ScrollToTop lands them on the right section.
 */
export const Nav = forwardRef<HTMLElement>((_props, ref) => {
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  return (
    <nav ref={ref} className={`nav ${onLanding ? "" : "nav--page"}`.trim()}>
      <div className="nav__inner">
        {onLanding ? (
          <a href="#top" className="nav__logo">
            Bakesbymom
          </a>
        ) : (
          <Link to="/" className="nav__logo">
            Bakesbymom
          </Link>
        )}

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.hash}>
              {onLanding ? (
                <a href={link.hash} className="nav__link">
                  {link.label}
                </a>
              ) : (
                <Link to={`/${link.hash}`} className="nav__link">
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link to="/catalog" className="nav__link nav__link--cta">
              Catalog
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Nav.displayName = "Nav";
