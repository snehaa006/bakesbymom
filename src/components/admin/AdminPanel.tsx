import { useEffect, useState } from "react";
import {
  createCake,
  createCategory,
  deleteCake,
  deleteCategory,
  fetchCatalog,
  updateCake,
  updateCategory,
  type Cake,
  type CategoryWithCakes,
} from "../../lib/catalog";
import { formatPrice } from "../../lib/format";
import { isSupabaseConfigured } from "../../lib/supabase";
import { PageHeader } from "../PageHeader";
import { CakeEditor } from "./CakeEditor";

const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string) || "bakesbymom";
const SESSION_KEY = "bbm_admin_authed";

const emptyCake = { name: "", description: "", per_pound_price: "", weight_kg: "", fixed_price: "" };

export function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [catalog, setCatalog] = useState<CategoryWithCakes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCakeId, setSelectedCakeId] = useState<string | null>(null);

  // category form
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // cake form
  const [cakeForm, setCakeForm] = useState({ ...emptyCake });
  const [editingCakeId, setEditingCakeId] = useState<string | null>(null);

  async function reload() {
    try {
      setCatalog(await fetchCatalog());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    if (authed && isSupabaseConfigured) reload();
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password.");
    }
  }

  // -------- categories --------
  async function submitCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      if (editingCatId) {
        await updateCategory(editingCatId, { name: catName.trim(), description: catDesc.trim() || null });
      } else {
        await createCategory({
          name: catName.trim(),
          description: catDesc.trim() || null,
          sort_order: catalog.length,
        });
      }
      setCatName("");
      setCatDesc("");
      setEditingCatId(null);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function removeCategory(id: string) {
    if (!confirm("Delete this category and ALL its cakes?")) return;
    try {
      await deleteCategory(id);
      if (selectedCategoryId === id) setSelectedCategoryId(null);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // -------- cakes --------
  async function submitCake(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId || !cakeForm.name.trim()) return;
    const payload: Partial<Cake> = {
      name: cakeForm.name.trim(),
      description: cakeForm.description.trim() || null,
      per_pound_price: Number(cakeForm.per_pound_price) || 0,
      weight_kg: Number(cakeForm.weight_kg) || 0,
      fixed_price: Number(cakeForm.fixed_price) || 0,
    };
    try {
      if (editingCakeId) {
        await updateCake(editingCakeId, payload);
      } else {
        const cakes = catalog.find((c) => c.id === selectedCategoryId)?.cakes.length ?? 0;
        await createCake({ ...payload, category_id: selectedCategoryId, sort_order: cakes });
      }
      setCakeForm({ ...emptyCake });
      setEditingCakeId(null);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEditCake(cake: Cake) {
    setEditingCakeId(cake.id);
    setCakeForm({
      name: cake.name,
      description: cake.description ?? "",
      per_pound_price: String(cake.per_pound_price),
      weight_kg: String(cake.weight_kg),
      fixed_price: String(cake.fixed_price),
    });
  }

  async function removeCake(id: string) {
    if (!confirm("Delete this cake?")) return;
    try {
      await deleteCake(id);
      if (selectedCakeId === id) setSelectedCakeId(null);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // -------- render: login gate --------
  if (!authed) {
    return (
      <div className="catalog-page">
        <PageHeader />
        <main className="admin admin--login">
          <form className="admin__login-card" onSubmit={handleLogin}>
            <h1 className="admin__login-title">Admin access</h1>
            <p className="admin__login-sub">Enter the password to manage the catalog.</p>
            <input
              type="password"
              className="admin__login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="admin__login-error">{loginError}</p>}
            <button type="submit" className="admin__login-btn">
              Enter
            </button>
          </form>
        </main>
      </div>
    );
  }

  const selectedCategory = catalog.find((c) => c.id === selectedCategoryId) ?? null;

  return (
    <div className="catalog-page">
      <PageHeader>
        <button
          type="button"
          className="pagehead__link pagehead__link--btn"
          onClick={() => {
            sessionStorage.removeItem(SESSION_KEY);
            setAuthed(false);
          }}
        >
          Log out
        </button>
      </PageHeader>

      <main className="admin">
        <h1 className="admin__title">Catalog admin</h1>

        {!isSupabaseConfigured && (
          <div className="catalog__notice catalog__notice--error">
            Supabase isn&apos;t connected. Add your keys to <code>.env</code> and run
            <code> supabase/schema.sql</code> first.
          </div>
        )}
        {error && <div className="catalog__notice catalog__notice--error">{error}</div>}

        <div className="admin__columns">
          {/* ---- categories column ---- */}
          <section className="admin__col">
            <h2 className="admin__col-title">Categories</h2>
            <ul className="admin__list">
              {catalog.map((cat) => (
                <li
                  key={cat.id}
                  className={`admin__list-row ${selectedCategoryId === cat.id ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    className="admin__list-pick"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedCakeId(null);
                      setEditingCakeId(null);
                      setCakeForm({ ...emptyCake });
                    }}
                  >
                    {cat.name} <span className="admin__count">{cat.cakes.length}</span>
                  </button>
                  <span className="admin__row-actions">
                    <button
                      type="button"
                      className="admin__mini"
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setCatName(cat.name);
                        setCatDesc(cat.description ?? "");
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="admin__mini-del" onClick={() => removeCategory(cat.id)}>
                      Delete
                    </button>
                  </span>
                </li>
              ))}
              {catalog.length === 0 && <li className="admin__hint">No categories yet.</li>}
            </ul>

            <form className="admin__form" onSubmit={submitCategory}>
              <h3 className="admin__form-title">{editingCatId ? "Edit category" : "Add category"}</h3>
              <input placeholder="Category name" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <textarea
                placeholder="Description (optional)"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                rows={2}
              />
              <div className="admin__form-actions">
                <button type="submit">{editingCatId ? "Save" : "Add category"}</button>
                {editingCatId && (
                  <button
                    type="button"
                    className="admin__ghost"
                    onClick={() => {
                      setEditingCatId(null);
                      setCatName("");
                      setCatDesc("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ---- cakes column ---- */}
          <section className="admin__col">
            <h2 className="admin__col-title">
              Cakes {selectedCategory ? `· ${selectedCategory.name}` : ""}
            </h2>
            {!selectedCategory ? (
              <p className="admin__hint">Pick a category on the left to manage its cakes.</p>
            ) : (
              <>
                <ul className="admin__list">
                  {selectedCategory.cakes.map((cake) => (
                    <li
                      key={cake.id}
                      className={`admin__list-row ${selectedCakeId === cake.id ? "is-active" : ""}`}
                    >
                      <button
                        type="button"
                        className="admin__list-pick"
                        onClick={() => setSelectedCakeId(cake.id)}
                      >
                        {cake.name} <span className="admin__count">{formatPrice(cake.fixed_price)}</span>
                      </button>
                      <span className="admin__row-actions">
                        <button type="button" className="admin__mini" onClick={() => startEditCake(cake)}>
                          Edit
                        </button>
                        <button type="button" className="admin__mini-del" onClick={() => removeCake(cake.id)}>
                          Delete
                        </button>
                      </span>
                    </li>
                  ))}
                  {selectedCategory.cakes.length === 0 && <li className="admin__hint">No cakes yet.</li>}
                </ul>

                <form className="admin__form" onSubmit={submitCake}>
                  <h3 className="admin__form-title">{editingCakeId ? "Edit cake" : "Add cake"}</h3>
                  <input
                    placeholder="Cake name"
                    value={cakeForm.name}
                    onChange={(e) => setCakeForm({ ...cakeForm, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={cakeForm.description}
                    onChange={(e) => setCakeForm({ ...cakeForm, description: e.target.value })}
                    rows={2}
                  />
                  <div className="admin__form-grid">
                    <label>
                      Per pound (₹)
                      <input
                        type="number"
                        step="0.01"
                        value={cakeForm.per_pound_price}
                        onChange={(e) => setCakeForm({ ...cakeForm, per_pound_price: e.target.value })}
                      />
                    </label>
                    <label>
                      Weight (kg)
                      <input
                        type="number"
                        step="0.01"
                        value={cakeForm.weight_kg}
                        onChange={(e) => setCakeForm({ ...cakeForm, weight_kg: e.target.value })}
                      />
                    </label>
                    <label>
                      Fixed price (₹)
                      <input
                        type="number"
                        step="0.01"
                        value={cakeForm.fixed_price}
                        onChange={(e) => setCakeForm({ ...cakeForm, fixed_price: e.target.value })}
                      />
                    </label>
                  </div>
                  <div className="admin__form-actions">
                    <button type="submit">{editingCakeId ? "Save" : "Add cake"}</button>
                    {editingCakeId && (
                      <button
                        type="button"
                        className="admin__ghost"
                        onClick={() => {
                          setEditingCakeId(null);
                          setCakeForm({ ...emptyCake });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </section>

          {/* ---- cake details column ---- */}
          <section className="admin__col">
            <h2 className="admin__col-title">Photos, flavours &amp; add-ons</h2>
            {selectedCakeId ? (
              <CakeEditor cakeId={selectedCakeId} onError={setError} />
            ) : (
              <p className="admin__hint">Open a cake in the middle column to edit its details.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
