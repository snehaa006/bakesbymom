import { forwardRef } from "react";
import { Link } from "react-router-dom";

const LINKS = [
  { href: "#ritual", label: "Ritual" },
  { href: "#breads", label: "Breads" },
  { href: "#visit", label: "Visit" },
];

export const Nav = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <nav ref={ref} className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__logo">
          Bakesbymom
        </a>
        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav__link">
                {link.label}
              </a>
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
