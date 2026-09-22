import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRODUCT_MENU } from "../lib/shop";

const LINKS = [
  { hash: "#about", label: "About" },
  { hash: "#showcase", label: "Our Cakes" },
  { hash: "#ritual", label: "Ritual" },
];

/**
 * The one navbar the whole site wears — landing, shop, catalog, cake detail
 * and admin. On the landing page the section links are plain in-page anchors;
 * anywhere else they route home first and App's ScrollToTop lands them on the
 * right section.
 *
 * Products comes first and opens a menu of the shelves, because that is what
 * most people arrive wanting.
 */
export const Nav = forwardRef<HTMLElement>((_props, ref) => {
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  // Close on a click anywhere else, and on Escape — the way a menu should.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenu(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // A new route means the menu has done its job.
  useEffect(() => setOpenMenu(false), [pathname]);

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
          <li
            className="nav__has-menu"
            ref={menuRef}
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
          >
            <button
              type="button"
              className={`nav__link nav__link--menu ${openMenu ? "is-open" : ""}`.trim()}
              onClick={() => setOpenMenu((v) => !v)}
              aria-expanded={openMenu}
              aria-haspopup="true"
            >
              Products
              <span className="nav__caret" aria-hidden="true" />
            </button>

            <div className={`nav__menu ${openMenu ? "is-open" : ""}`.trim()}>
              <div className="nav__menu-grid">
                {PRODUCT_MENU.map((entry) => (
                  <Link key={entry.to} to={entry.to} className="nav__menu-link">
                    {entry.label}
                  </Link>
                ))}
              </div>
              <p className="nav__menu-note">
                Everything eggless · baked to order · Panipat
              </p>
            </div>
          </li>

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
