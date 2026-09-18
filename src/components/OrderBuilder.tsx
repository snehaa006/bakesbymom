import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCakeDetail, type CakeDetail, type CategoryWithCakes } from "../lib/catalog";
import { resolvePhotoUrl } from "../lib/api";
import { formatPrice } from "../lib/format";
import {
  EMPTY_DRAFT,
  HOUSE_ADDONS,
  HOUSE_FLAVOURS,
  SIZES,
  TIME_SLOTS,
  WHATSAPP_NUMBER,
  buildMessage,
  canShareFile,
  estimatePrice,
  whatsappUrl,
  type OrderDraft,
} from "../lib/order";

const STEPS = ["Occasion", "Cake", "Size", "Flavour", "Extras", "When", "You", "Review"];

interface OrderBuilderProps {
  catalog: CategoryWithCakes[];
  /** Cake to start on, when the customer came from a card in the thread. */
  startCakeId?: string;
  onClose: () => void;
}

/**
 * The order slip, assembled one question at a time.
 *
 * Every answer is optional except the cake itself — the point is a message the
 * bakery can read at a glance, not a form to survive. The last step shows that
 * message in a box the customer can edit, and hands it to WhatsApp's compose
 * box from there. Nothing is sent from the site.
 */
export function OrderBuilder({ catalog, startCakeId, onClose }: OrderBuilderProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OrderDraft>(EMPTY_DRAFT);
  const [categoryId, setCategoryId] = useState("");
  const [cakeId, setCakeId] = useState("");
  const [detail, setDetail] = useState<CakeDetail | null>(null);
  const [reference, setReference] = useState<File | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  /** The message once the customer has edited it by hand; "" means auto. */
  const [edited, setEdited] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const patch = (fields: Partial<OrderDraft>) => setDraft((prev) => ({ ...prev, ...fields }));

  const category = catalog.find((c) => c.id === categoryId) ?? null;
  const cakes = category?.cakes ?? [];

  // Jump straight to the size question when a cake card started this.
  useEffect(() => {
    if (!startCakeId || !catalog.length) return;
    const owner = catalog.find((c) => c.cakes.some((cake) => cake.id === startCakeId));
    const cake = owner?.cakes.find((c) => c.id === startCakeId);
    if (!owner || !cake) return;
    setCategoryId(owner.id);
    setCakeId(cake.id);
    setDraft((prev) => ({
      ...prev,
      occasion: owner.name,
      cakeName: cake.name,
      weightKg: Number(cake.weight_kg) || 1,
    }));
    setStep(2);
  }, [startCakeId, catalog]);

  // Flavours, add-ons and the real base price live on the cake's own row.
  useEffect(() => {
    if (!cakeId) {
      setDetail(null);
      return;
    }
    let live = true;
    fetchCakeDetail(cakeId)
      .then((data) => live && setDetail(data))
      .catch(() => live && setDetail(null));
    return () => {
      live = false;
    };
  }, [cakeId]);

  // Keep a preview of the reference photo, and let go of it on the way out.
  useEffect(() => {
    if (!reference) {
      setReferenceUrl("");
      return;
    }
    const url = URL.createObjectURL(reference);
    setReferenceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [reference]);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, [step]);

  const flavours = detail?.flavours.length
    ? detail.flavours.map((f) => ({
        name: f.name,
        delta: Number(f.price_delta) || 0,
      }))
    : HOUSE_FLAVOURS.map((name) => ({ name, delta: 0 }));

  const addons = detail?.addons.length
    ? detail.addons.map((a) => ({ name: a.name, delta: Number(a.price_delta) || 0 }))
    : HOUSE_ADDONS.map((name) => ({ name, delta: 0 }));

  // Price follows the size, the flavour surcharge and whatever add-ons are on.
  // Only priced options move it — the house fallbacks carry no surcharge.
  const priced = useMemo(() => {
    if (!detail) return { amount: 0, exact: false };
    const flavour = detail.flavours.find((f) => f.name === draft.flavour);
    const flavourDelta = Number(flavour?.price_delta) || 0;
    const addonDelta = detail.addons
      .filter((a) => draft.addons.includes(a.name))
      .reduce((sum, a) => sum + (Number(a.price_delta) || 0), 0);
    return estimatePrice(detail, draft.weightKg, flavourDelta + addonDelta);
  }, [detail, draft.weightKg, draft.flavour, draft.addons]);

  const slip: OrderDraft = {
    ...draft,
    hasReference: Boolean(reference),
    estimate: priced.amount,
    estimateExact: priced.exact,
  };
  const message = edited ?? buildMessage(slip);
  const shareable = canShareFile(reference);

  function toggleAddon(name: string) {
    patch({
      addons: draft.addons.includes(name)
        ? draft.addons.filter((a) => a !== name)
        : [...draft.addons, name],
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  /** Hand WhatsApp the photo and the text together, where the OS allows it. */
  async function shareWithPhoto() {
    if (!reference) return;
    try {
      await navigator.share({ files: [reference], text: message });
    } catch {
      // Cancelled or unsupported — the link and the copy button still stand.
    }
  }

  // Nothing here is compulsory, so the forward button never locks; it only
  // renames itself when the step has been left blank.
  const answered = [
    Boolean(draft.occasion),
    Boolean(draft.cakeName),
    true,
    Boolean(draft.flavour),
    draft.addons.length > 0 || Boolean(draft.cakeMessage),
    Boolean(draft.date || draft.slot),
    Boolean(draft.name || draft.phone),
    true,
  ][step];

  return (
    <div className="builder">
      <div className="builder__bar">
        <button type="button" className="builder__back" onClick={onClose}>
          ← Chat
        </button>
        <span className="builder__count">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </span>
      </div>
      <div className="builder__progress" aria-hidden="true">
        <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="builder__scroll" ref={scrollerRef}>
        {/* ---- 1 · occasion ---- */}
        {step === 0 && (
          <>
            <h3 className="builder__q">What's the occasion?</h3>
            {catalog.length > 0 ? (
              <div className="builder__opts">
                {catalog.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`builder__opt ${categoryId === c.id ? "is-on" : ""}`.trim()}
                    onClick={() => {
                      setCategoryId(c.id);
                      setCakeId("");
                      patch({ occasion: c.name, cakeName: "" });
                      setStep(1);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <label className="builder__field">
                <span>Tell us the occasion</span>
                <input
                  value={draft.occasion}
                  onChange={(e) => patch({ occasion: e.target.value })}
                  placeholder="Anniversary, birthday, farewell…"
                />
              </label>
            )}
          </>
        )}

        {/* ---- 2 · cake ---- */}
        {step === 1 && (
          <>
            <h3 className="builder__q">Which cake?</h3>
            {cakes.length > 0 ? (
              <div className="builder__cakes">
                {cakes.map((cake) => (
                  <button
                    key={cake.id}
                    type="button"
                    className={`builder__cake ${cakeId === cake.id ? "is-on" : ""}`.trim()}
                    onClick={() => {
                      setCakeId(cake.id);
                      patch({ cakeName: cake.name, weightKg: Number(cake.weight_kg) || 1 });
                      setStep(2);
                    }}
                  >
                    <span className="builder__cake-photo">
                      {cake.cover_url ? (
                        <img src={resolvePhotoUrl(cake.cover_url)} alt="" loading="lazy" />
                      ) : null}
                    </span>
                    <span className="builder__cake-text">
                      <span className="builder__cake-name">{cake.name}</span>
                      <span className="builder__cake-meta">
                        from {formatPrice(cake.fixed_price)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <label className="builder__field">
                <span>Cake you have in mind</span>
                <input
                  value={draft.cakeName}
                  onChange={(e) => patch({ cakeName: e.target.value })}
                  placeholder="Describe it in a few words"
                />
              </label>
            )}
            <p className="builder__hint">
              Not sure yet? Type it above — Mom will work it out with you on WhatsApp.
            </p>
          </>
        )}

        {/* ---- 3 · size ---- */}
        {step === 2 && (
          <>
            <h3 className="builder__q">How big?</h3>
            <div className="builder__opts">
              {SIZES.map((size) => (
                <button
                  key={size.kg}
                  type="button"
                  className={`builder__opt ${
                    Math.abs(draft.weightKg - size.kg) < 0.01 ? "is-on" : ""
                  }`.trim()}
                  onClick={() => patch({ weightKg: size.kg })}
                >
                  {size.label}
                </button>
              ))}
            </div>
            {priced.amount > 0 && (
              <p className="builder__price">
                {priced.exact ? "" : "About "}
                <strong>{formatPrice(priced.amount)}</strong>
                {priced.exact ? " at this size" : " at this size — confirmed on WhatsApp"}
              </p>
            )}
          </>
        )}

        {/* ---- 4 · flavour ---- */}
        {step === 3 && (
          <>
            <h3 className="builder__q">Flavour?</h3>
            <div className="builder__opts">
              {flavours.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  className={`builder__opt ${draft.flavour === f.name ? "is-on" : ""}`.trim()}
                  onClick={() => patch({ flavour: draft.flavour === f.name ? "" : f.name })}
                >
                  {f.name}
                  {f.delta > 0 ? ` +${formatPrice(f.delta)}` : ""}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ---- 5 · extras ---- */}
        {step === 4 && (
          <>
            <h3 className="builder__q">Anything on top?</h3>
            <div className="builder__opts">
              {addons.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  className={`builder__opt ${draft.addons.includes(a.name) ? "is-on" : ""}`.trim()}
                  onClick={() => toggleAddon(a.name)}
                >
                  {a.name}
                  {a.delta > 0 ? ` +${formatPrice(a.delta)}` : ""}
                </button>
              ))}
            </div>
            <label className="builder__field">
              <span>Message piped on the cake</span>
              <input
                value={draft.cakeMessage}
                onChange={(e) => patch({ cakeMessage: e.target.value })}
                placeholder="Happy 25th, Mumma &amp; Papa"
                maxLength={80}
              />
            </label>
          </>
        )}

        {/* ---- 6 · when & where ---- */}
        {step === 5 && (
          <>
            <h3 className="builder__q">When do you need it?</h3>
            <label className="builder__field">
              <span>Date</span>
              <input
                type="date"
                value={draft.date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => patch({ date: e.target.value })}
              />
            </label>
            <div className="builder__opts">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`builder__opt ${draft.slot === slot ? "is-on" : ""}`.trim()}
                  onClick={() => patch({ slot: draft.slot === slot ? "" : slot })}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="builder__opts">
              {(["Pickup", "Delivery"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`builder__opt ${draft.fulfilment === mode ? "is-on" : ""}`.trim()}
                  onClick={() => patch({ fulfilment: mode })}
                >
                  {mode}
                </button>
              ))}
            </div>
            {draft.fulfilment === "Delivery" && (
              <label className="builder__field">
                <span>Area in Panipat</span>
                <input
                  value={draft.area}
                  onChange={(e) => patch({ area: e.target.value })}
                  placeholder="Model Town, Sector 11…"
                />
              </label>
            )}
          </>
        )}

        {/* ---- 7 · you + reference ---- */}
        {step === 6 && (
          <>
            <h3 className="builder__q">Who's it from?</h3>
            <label className="builder__field">
              <span>Name</span>
              <input
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="Your name"
              />
            </label>
            <label className="builder__field">
              <span>Phone</span>
              <input
                type="tel"
                inputMode="tel"
                value={draft.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="10-digit number"
              />
            </label>
            <label className="builder__field">
              <span>Anything else</span>
              <textarea
                rows={2}
                value={draft.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Less sugar, a colour you'd like, a theme…"
              />
            </label>

            <div className="builder__field">
              <span>Reference photo (optional)</span>
              <label className="builder__file">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReference(e.target.files?.[0] ?? null)}
                />
                <span>{reference ? "Choose another" : "Pick a photo"}</span>
              </label>
              {referenceUrl && (
                <div className="builder__ref">
                  <img src={referenceUrl} alt="Your reference" />
                  <button type="button" onClick={() => setReference(null)}>
                    Remove
                  </button>
                </div>
              )}
              {reference && (
                <p className="builder__hint">
                  {shareable
                    ? "It'll go along with the message when you tap Send with photo."
                    : "Attach it in WhatsApp once the chat opens — the message says you have one."}
                </p>
              )}
            </div>
          </>
        )}

        {/* ---- 8 · review ---- */}
        {step === 7 && (
          <>
            <h3 className="builder__q">Read it over</h3>
            <p className="builder__hint">
              This is what lands in your WhatsApp typing box. Change anything you like — here or
              there — nothing is sent until you tap send in WhatsApp.
            </p>
            <textarea
              className="builder__message"
              rows={12}
              value={message}
              onChange={(e) => setEdited(e.target.value)}
            />
            <div className="builder__actions">
              <a
                className="builder__send"
                href={whatsappUrl(message)}
                target="_blank"
                rel="noreferrer"
              >
                Open WhatsApp
              </a>
              {shareable && (
                <button type="button" className="builder__ghost" onClick={shareWithPhoto}>
                  Send with photo
                </button>
              )}
              <button type="button" className="builder__ghost" onClick={copy}>
                {copied ? "Copied ✓" : "Copy message"}
              </button>
              {edited !== null && (
                <button type="button" className="builder__ghost" onClick={() => setEdited(null)}>
                  Reset text
                </button>
              )}
            </div>
            {!WHATSAPP_NUMBER && (
              <p className="builder__hint">
                No WhatsApp number is configured yet, so WhatsApp will ask which chat to open. Set
                VITE_WHATSAPP_NUMBER to point it straight at the bakery.
              </p>
            )}
          </>
        )}
      </div>

      <div className="builder__nav">
        <button
          type="button"
          className="builder__ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="builder__next" onClick={() => setStep((s) => s + 1)}>
            {answered ? "Next" : "Skip"}
          </button>
        ) : (
          <button type="button" className="builder__ghost" onClick={onClose}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}
