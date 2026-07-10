import { useEffect, useRef, useState } from "react";
import {
  addAddon,
  addFlavour,
  addPhoto,
  deleteAddon,
  deleteFlavour,
  deletePhoto,
  fetchCakeDetail,
  uploadPhoto,
  type CakeDetail,
} from "../../lib/catalog";
import { formatPrice } from "../../lib/format";

/** Photos + flavours + add-ons manager for one cake. */
export function CakeEditor({ cakeId, onError }: { cakeId: string; onError: (m: string) => void }) {
  const [cake, setCake] = useState<CakeDetail | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [flavourName, setFlavourName] = useState("");
  const [flavourDelta, setFlavourDelta] = useState("0");
  const [addonName, setAddonName] = useState("");
  const [addonDelta, setAddonDelta] = useState("0");

  async function reload() {
    try {
      setCake(await fetchCakeDetail(cakeId));
    } catch (e) {
      onError((e as Error).message);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakeId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadPhoto(cakeId, file);
      await addPhoto(cakeId, url, cake?.photos.length ?? 0);
      if (fileRef.current) fileRef.current.value = "";
      await reload();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddFlavour(e: React.FormEvent) {
    e.preventDefault();
    if (!flavourName.trim()) return;
    try {
      await addFlavour({
        cake_id: cakeId,
        name: flavourName.trim(),
        price_delta: Number(flavourDelta) || 0,
        sort_order: cake?.flavours.length ?? 0,
      });
      setFlavourName("");
      setFlavourDelta("0");
      await reload();
    } catch (err) {
      onError((err as Error).message);
    }
  }

  async function handleAddAddon(e: React.FormEvent) {
    e.preventDefault();
    if (!addonName.trim()) return;
    try {
      await addAddon({
        cake_id: cakeId,
        name: addonName.trim(),
        price_delta: Number(addonDelta) || 0,
        sort_order: cake?.addons.length ?? 0,
      });
      setAddonName("");
      setAddonDelta("0");
      await reload();
    } catch (err) {
      onError((err as Error).message);
    }
  }

  if (!cake) return <div className="admin__status">Loading cake…</div>;

  return (
    <div className="admin__editor">
      {/* -------- photos -------- */}
      <section className="admin__block">
        <h4 className="admin__block-title">Photos</h4>
        <div className="admin__photos">
          {cake.photos.map((p) => (
            <div key={p.id} className="admin__photo">
              <img src={p.url} alt="" />
              <button
                type="button"
                className="admin__photo-del"
                onClick={async () => {
                  try {
                    await deletePhoto(p.id);
                    await reload();
                  } catch (err) {
                    onError((err as Error).message);
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
          {cake.photos.length === 0 && <p className="admin__hint">No photos yet.</p>}
        </div>
        <label className="admin__upload">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {uploading ? "Uploading…" : "Upload a photo"}
        </label>
      </section>

      {/* -------- flavours -------- */}
      <section className="admin__block">
        <h4 className="admin__block-title">Flavours (dropdown options)</h4>
        <ul className="admin__list">
          {cake.flavours.map((f) => (
            <li key={f.id} className="admin__list-row">
              <span>
                {f.name}
                {Number(f.price_delta) > 0 && ` · +${formatPrice(f.price_delta)}`}
              </span>
              <button
                type="button"
                className="admin__mini-del"
                onClick={async () => {
                  try {
                    await deleteFlavour(f.id);
                    await reload();
                  } catch (err) {
                    onError((err as Error).message);
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
          {cake.flavours.length === 0 && <li className="admin__hint">No flavours yet.</li>}
        </ul>
        <form className="admin__inline-form" onSubmit={handleAddFlavour}>
          <input
            placeholder="Flavour name"
            value={flavourName}
            onChange={(e) => setFlavourName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Extra ₹"
            value={flavourDelta}
            onChange={(e) => setFlavourDelta(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      {/* -------- add-ons -------- */}
      <section className="admin__block">
        <h4 className="admin__block-title">Customization add-ons</h4>
        <ul className="admin__list">
          {cake.addons.map((a) => (
            <li key={a.id} className="admin__list-row">
              <span>
                {a.name}
                {Number(a.price_delta) > 0 && ` · +${formatPrice(a.price_delta)}`}
              </span>
              <button
                type="button"
                className="admin__mini-del"
                onClick={async () => {
                  try {
                    await deleteAddon(a.id);
                    await reload();
                  } catch (err) {
                    onError((err as Error).message);
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
          {cake.addons.length === 0 && <li className="admin__hint">No add-ons yet.</li>}
        </ul>
        <form className="admin__inline-form" onSubmit={handleAddAddon}>
          <input
            placeholder="Add-on name"
            value={addonName}
            onChange={(e) => setAddonName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Extra ₹"
            value={addonDelta}
            onChange={(e) => setAddonDelta(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}
