import { Link, useLocation } from "react-router-dom";
import { PRODUCT_MENU } from "../lib/shop";

const SECTIONS = [
  { hash: "#about", label: "About" },
  { hash: "#showcase", label: "Our Cakes" },
  { hash: "#ritual", label: "Ritual" },
];

/**
 * The sign-off every public page shares: the wordmark, the same shelves and
 * sections the nav offers, the line of credit and the way in to the admin.
 */
export function Footer() {
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            {onLanding ? (
              <a href="#top" className="site-footer__logo">
                Bakesbymom
              </a>
            ) : (
              <Link to="/" className="site-footer__logo">
                Bakesbymom
              </Link>
            )}
            <p className="site-footer__note">Everything eggless · baked to order · Panipat</p>
          </div>

          <nav className="site-footer__cols" aria-label="Footer">
            <div className="site-footer__col">
              <p className="site-footer__heading">Products</p>
              <ul>
                {PRODUCT_MENU.map((entry) => (
                  <li key={entry.to}>
                    <Link to={entry.to}>{entry.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__col">
              <p className="site-footer__heading">Bakesbymom</p>
              <ul>
                {SECTIONS.map((section) => (
                  <li key={section.hash}>
                    {onLanding ? (
                      <a href={section.hash}>{section.label}</a>
                    ) : (
                      <Link to={`/${section.hash}`}>{section.label}</Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link to="/catalog">Catalog</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">© 2026 Bakesbymom · Panipat, Haryana</p>
          <Link to="/admin" className="site-footer__admin">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
