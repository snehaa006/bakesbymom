import { Link } from "react-router-dom";

/** The page's sign-off: a line of credit and the way in to the admin panel. */
export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__copyright">© 2026 Bakesbymom · Panipat, Haryana</p>
      <Link to="/admin" className="site-footer__admin">
        Admin
      </Link>
    </footer>
  );
}
