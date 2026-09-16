import { useEffect, useState } from "react";
import { fetchCatalog, type CategoryWithCakes } from "../lib/catalog";
import { isApiConfigured } from "../lib/api";
import { Nav } from "./Nav";
import { CategoryRow } from "./CategoryRow";

/** Band tints, cycled so neighbouring categories never share a background. */
const TONES = ["blush", "cream", "rose", "ivory"] as const;

export function Catalog() {
  const [categories, setCategories] = useState<CategoryWithCakes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false);
      return;
    }
    fetchCatalog()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="catalog-page">
      <Nav />

      <header className="catalog__hero">
        <p className="catalog__eyebrow">The Catalog</p>
        <h1 className="catalog__heading">Every cake, by occasion</h1>
        <p className="catalog__subtitle">
          Browse a shelf, open a cake, and build your order — the final price follows the flavour,
          the size and the finishing touches you pick.
        </p>
      </header>

      <main className="catalog">
        {!isApiConfigured && (
          <div className="catalog__notice">
            The catalog API isn&apos;t reachable. Point <code>VITE_API_BASE_URL</code> at your
            Worker in a <code>.env</code> file (see <code>.env.example</code>), and make sure
            <code> db/schema.sql</code> has been applied to the D1 database.
          </div>
        )}

        {loading && <div className="catalog__status">Loading the catalog…</div>}
        {error && <div className="catalog__notice catalog__notice--error">{error}</div>}

        {!loading && !error && isApiConfigured && categories.length === 0 && (
          <div className="catalog__status">
            No categories yet — add some from the Admin panel (button in the footer).
          </div>
        )}

        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            tone={TONES[index % TONES.length]}
          />
        ))}
      </main>
    </div>
  );
}
