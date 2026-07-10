import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  computeFinalPrice,
  fetchCakeDetail,
  type CakeAddon,
  type CakeDetail as CakeDetailType,
} from "../lib/catalog";
import { formatPrice } from "../lib/format";
import { isSupabaseConfigured } from "../lib/supabase";
import { PageHeader } from "./PageHeader";

export function CakeDetail() {
  const { cakeId } = useParams<{ cakeId: string }>();
  const [cake, setCake] = useState<CakeDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePhoto, setActivePhoto] = useState(0);
  const [flavourId, setFlavourId] = useState<string>("");
  const [addonIds, setAddonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!cakeId || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCakeDetail(cakeId)
      .then((data) => {
        setCake(data);
        // default to the first flavour if one exists
        if (data?.flavours.length) setFlavourId(data.flavours[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cakeId]);

  const selectedFlavour = useMemo(
    () => cake?.flavours.find((f) => f.id === flavourId) ?? null,
    [cake, flavourId],
  );
  const selectedAddons: CakeAddon[] = useMemo(
    () => cake?.addons.filter((a) => addonIds.has(a.id)) ?? [],
    [cake, addonIds],
  );
  const finalPrice = useMemo(
    () => (cake ? computeFinalPrice(cake, selectedFlavour, selectedAddons) : 0),
    [cake, selectedFlavour, selectedAddons],
  );

  function toggleAddon(id: string) {
    setAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="catalog-page">
      <PageHeader />

      <main className="detail">
        <Link to="/catalog" className="detail__back">
          ← Back to catalog
        </Link>

        {loading && <div className="catalog__status">Loading…</div>}
        {error && <div className="catalog__notice catalog__notice--error">{error}</div>}
        {!loading && !error && !cake && (
          <div className="catalog__status">This cake could not be found.</div>
        )}

        {cake && (
          <div className="detail__grid">
            {/* ---- gallery ---- */}
            <div className="detail__gallery">
              <div className="detail__photo">
                {cake.photos.length > 0 ? (
                  <img src={cake.photos[activePhoto]?.url} alt={cake.name} />
                ) : (
                  <div className="detail__photo-placeholder">No photos yet</div>
                )}
              </div>
              {cake.photos.length > 1 && (
                <div className="detail__thumbs">
                  {cake.photos.map((p, i) => (
                    <button
                      key={p.id}
                      className={`detail__thumb ${i === activePhoto ? "is-active" : ""}`}
                      onClick={() => setActivePhoto(i)}
                      type="button"
                    >
                      <img src={p.url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---- info + builder ---- */}
            <div className="detail__info">
              {cake.category && <p className="detail__category">{cake.category.name}</p>}
              <h1 className="detail__name">{cake.name}</h1>
              {cake.description && <p className="detail__desc">{cake.description}</p>}

              <dl className="detail__specs">
                <div>
                  <dt>Per pound</dt>
                  <dd>{formatPrice(cake.per_pound_price)}</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{cake.weight_kg} kg</dd>
                </div>
                <div>
                  <dt>Base price</dt>
                  <dd>{formatPrice(cake.fixed_price)}</dd>
                </div>
              </dl>

              {cake.flavours.length > 0 && (
                <label className="detail__field">
                  <span className="detail__field-label">Flavour</span>
                  <select
                    className="detail__select"
                    value={flavourId}
                    onChange={(e) => setFlavourId(e.target.value)}
                  >
                    {cake.flavours.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                        {Number(f.price_delta) > 0 ? ` (+${formatPrice(f.price_delta)})` : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {cake.addons.length > 0 && (
                <div className="detail__field">
                  <span className="detail__field-label">Customizations</span>
                  <div className="detail__addons">
                    {cake.addons.map((a) => (
                      <label key={a.id} className="detail__addon">
                        <input
                          type="checkbox"
                          checked={addonIds.has(a.id)}
                          onChange={() => toggleAddon(a.id)}
                        />
                        <span>{a.name}</span>
                        {Number(a.price_delta) > 0 && (
                          <span className="detail__addon-price">+{formatPrice(a.price_delta)}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail__final">
                <div className="detail__final-row">
                  <span>Final price</span>
                  <strong>{formatPrice(finalPrice)}</strong>
                </div>
                <p className="detail__final-note">
                  Final price is the fixed base price plus your selected flavour and customization
                  add-ons.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
