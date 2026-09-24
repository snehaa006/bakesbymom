import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRODUCT_MENU } from "../lib/shop";

const LINKS = [
  { hash: "#about", label: "About" },
  { hash: "#showcase", label: "Our Cakes" },
  { hash: "#ritual", label: "Ritual" },
];

/** Below this the pill carries a burger and the links live in a drawer. */
const DRAWER_QUERY = "(max-width: 860px)";

/**
 * The one navbar the whole site wears — landing, shop, catalog, cake detail
 * and admin. On the landing page the section links are plain in-page anchors;
 * anywhere else they route home first and App's ScrollToTop lands them on the
 * right section.
 *
 * Products comes first and opens a menu of the shelves, because that is what
 * most people arrive wanting.
 *
 * On a phone the links do not fit beside the wordmark, so the pill keeps only
 * the wordmark and a burger, and the same list drops underneath as a drawer —
 * one row per link at a size a thumb can actually hit. The Products menu opens
 * in place inside that drawer rather than floating over the page.
 */
export const Nav = forwardRef<HTMLElement>((_props, ref) => {
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const [openMenu, setOpenMenu] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Close on a click anywhere else, and on Escape — the way a menu should.
  useEffect(() => {
    if (!openMenu && !openNav) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenu(false);
      if (!navRef.current?.contains(e.target as Node)) setOpenNav(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(false);
      setOpenNav(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu, openNav]);

  // A new route means both menus have done their job.
  useEffect(() => {
    setOpenMenu(false);
    setOpenNav(false);
  }, [pathname]);

  // A drawer lying over the page should not let the page scroll underneath it.
  useEffect(() => {
    if (!openNav) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [openNav]);

  // The drawer only exists on narrow screens; widening past the breakpoint with
  // it open would otherwise leave the burger stuck in its pressed state.
  useEffect(() => {
    const mq = window.matchMedia(DRAWER_QUERY);
    const sync = () => {
      if (!mq.matches) {
        setOpenNav(false);
        setOpenMenu(false);
      }
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Hovering the Products label is a pointer gesture. On a touch screen the
  // same handlers fire off the tap and fight the click toggle, so they are only
  // wired up where a real hover exists.
  const hoverMenu = (open: boolean) => () => {
    if (window.matchMedia("(hover: hover)").matches) setOpenMenu(open);
  };

  return (
    <nav
      ref={(node) => {
        navRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={`nav ${onLanding ? "" : "nav--page"} ${openNav ? "nav--open" : ""}`.trim()}
    >
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

        <button
          type="button"
          className={`nav__burger ${openNav ? "is-open" : ""}`.trim()}
          onClick={() => setOpenNav((v) => !v)}
          aria-expanded={openNav}
          aria-controls="nav-links"
          aria-label={openNav ? "Close menu" : "Open menu"}
        >
          <span className="nav__burger-bar" aria-hidden="true" />
          <span className="nav__burger-bar" aria-hidden="true" />
          <span className="nav__burger-bar" aria-hidden="true" />
        </button>

        <ul id="nav-links" className={`nav__links ${openNav ? "is-open" : ""}`.trim()}>
          <li
            className="nav__has-menu"
            ref={menuRef}
            onMouseEnter={hoverMenu(true)}
            onMouseLeave={hoverMenu(false)}
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
                <a href={link.hash} className="nav__link" onClick={() => setOpenNav(false)}>
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
