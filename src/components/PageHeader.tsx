import { Link } from "react-router-dom";

interface PageHeaderProps {
  /** Optional extra links rendered on the right of the header. */
  children?: React.ReactNode;
}

/** Slim top bar reused by the Catalog, Cake detail and Admin pages. */
export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="pagehead">
      <div className="pagehead__inner">
        <Link to="/" className="pagehead__logo">
          Bakesbymom
        </Link>
        <nav className="pagehead__links">
          <Link to="/catalog" className="pagehead__link">
            Catalog
          </Link>
          <Link to="/" className="pagehead__link">
            Home
          </Link>
          {children}
        </nav>
      </div>
    </header>
  );
}
