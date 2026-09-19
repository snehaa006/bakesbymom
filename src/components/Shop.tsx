import { Link, useParams } from "react-router-dom";
import { Nav } from "./Nav";
import { VegMark, VegNote } from "./VegMark";
import { PhotoSlot } from "./PhotoSlot";
import { resolvePhotoUrl } from "../lib/api";
import { SHOP, findCategory } from "../lib/shop";

/**
 * One shelf: the filter rail down the left, the varieties across the right.
 * The rail is the whole shop, so a customer can cross from brownies to cookies
 * without going back up to the menu.
 */
export function Shop() {
  const { category: slug = "" } = useParams<{ category: string }>();
  const category = findCategory(slug);

  return (
    <div className="catalog-page">
      <Nav />

      {!category ? (
        <main className="shop">
          <p className="catalog__status">That shelf doesn&apos;t exist. Try the Products menu.</p>
        </main>
      ) : (
        <>
          <header className="shop__hero">
            <p className="shop__crumbs">
              <Link to="/">Home</Link> <span>›</span> <span>Products</span> <span>›</span>{" "}
              <strong>{category.name}</strong>
            </p>
            <h1 className="shop__heading">{category.name}</h1>
            <p className="shop__blurb">{category.blurb}</p>
          </header>

          <main className="shop">
            <aside className="shop__rail">
              <VegNote />

              {category.choices && (
                <div className="shop__filter">
                  <h2 className="shop__filter-title">{category.choiceLabel}</h2>
                  <ul className="shop__filter-list">
                    {category.choices.map((choice) => (
                      <li key={choice}>{choice}</li>
                    ))}
                  </ul>
                  <p className="shop__filter-note">
                    Pick yours when you open a cookie — any flavour can be baked in any of these.
                  </p>
                </div>
              )}

              <div className="shop__filter">
                <h2 className="shop__filter-title">Products</h2>
                <ul className="shop__nav">
                  <li>
                    <Link to="/catalog">Cakes</Link>
                  </li>
                  {SHOP.map((other) => (
                    <li key={other.slug}>
                      <Link
                        to={`/shop/${other.slug}`}
                        className={other.slug === category.slug ? "is-on" : ""}
                      >
                        {other.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shop__filter">
                <h2 className="shop__filter-title">Good to know</h2>
                <ul className="shop__filter-list">
                  <li>
                    Smallest order: {category.minQty} {category.unit}
                  </li>
                  {category.perBox && (
                    <li>
                      One box holds {category.perBox} {category.unit}
                    </li>
                  )}
                  <li>Baked to order, never off a shelf</li>
                  <li>Price confirmed on WhatsApp</li>
                </ul>
              </div>
            </aside>

            <div className="shop__grid">
              {category.items.map((item) => (
                <Link key={item.slug} to={`/shop/${category.slug}/${item.slug}`} className="shop-card">
                  <div className="shop-card__photo">
                    {item.photo ? (
                      <img src={resolvePhotoUrl(item.photo)} alt={item.name} loading="lazy" />
                    ) : (
                      <PhotoSlot label={item.name} hint="Photo coming soon" />
                    )}
                  </div>
                  <div className="shop-card__body">
                    <h3 className="shop-card__name">
                      <VegMark size={15} />
                      {item.name}
                    </h3>
                    <p className="shop-card__blurb">{item.blurb}</p>
                    <span className="shop-card__cta">Customise &amp; order</span>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
