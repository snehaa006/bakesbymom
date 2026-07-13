import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCatalog, type CategoryWithCakes } from "../lib/catalog";
import { formatPrice } from "../lib/format";
import { isSupabaseConfigured } from "../lib/supabase";
import { PageHeader } from "./PageHeader";

export function Catalog() {
  const [categories, setCategories] = useState<CategoryWithCakes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
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
      <PageHeader />

      <main className="catalog">
        <header className="catalog__intro">
          <p className="catalog__eyebrow">The Catalog</p>
          <h1 className="catalog__heading">Every cake, by category</h1>
          <p className="catalog__subtitle">
            Browse a category, open a cake, and build your order — final price adjusts to the flavour
            and customizations you choose.
          </p>
        </header>

        {!isSupabaseConfigured && (
          <div className="catalog__notice">
            The catalog database isn&apos;t connected yet. Add your Supabase keys to a
            <code> .env </code> file (see <code>.env.example</code>) and run the SQL in
            <code> supabase/schema.sql</code>.
          </div>
        )}

        {loading && <div className="catalog__status">Loading the catalog…</div>}
        {error && <div className="catalog__notice catalog__notice--error">{error}</div>}

        {!loading && !error && isSupabaseConfigured && categories.length === 0 && (
          <div className="catalog__status">
            No categories yet — add some from the Admin panel (button in the footer).
          </div>
        )}

        {categories.map((cat) => (
          <section key={cat.id} className="catalog__category">
            <div className="catalog__category-head">
              <h2 className="catalog__category-name">{cat.name}</h2>
              {cat.description && <p className="catalog__category-desc">{cat.description}</p>}
            </div>

            {cat.cakes.length === 0 ? (
              <p className="catalog__empty">No cakes in this category yet.</p>
            ) : (
              <div className="catalog__grid">
                {cat.cakes.map((cake) => (
                  <Link key={cake.id} to={`/catalog/${cake.id}`} className="cake-card">
                    <div className="cake-card__photo">
                      {cake.cover_url ? (
                        <img src={cake.cover_url} alt={cake.name} loading="lazy" />
                      ) : (
                        <div className="cake-card__placeholder">No photo yet</div>
                      )}
                    </div>
                    <div className="cake-card__body">
                      <h3 className="cake-card__title">{cake.name}</h3>
                      {cake.description && <p className="cake-card__desc">{cake.description}</p>}
                      <div className="cake-card__meta">
                        <span className="cake-card__price">{formatPrice(cake.fixed_price)}</span>
                        <span className="cake-card__perlb">
                          {formatPrice(cake.per_pound_price)}/lb · {cake.weight_kg} kg
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
