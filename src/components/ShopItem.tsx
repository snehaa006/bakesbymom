import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Nav } from "./Nav";
import { VegMark } from "./VegMark";
import { PhotoSlot } from "./PhotoSlot";
import { resolvePhotoUrl } from "../lib/api";
import { TIME_SLOTS, whatsappUrl } from "../lib/order";
import { findItem } from "../lib/shop";

const TABS = ["Description", "Details", "Reviews"] as const;
type Tab = (typeof TABS)[number];

/** "2 boxes of 9", or "1 box of 9 plus 2 loose" when it doesn't divide. */
function boxing(qty: number, perBox: number): string {
  const boxes = Math.floor(qty / perBox);
  const loose = qty % perBox;
  const boxPart = `${boxes} box${boxes === 1 ? "" : "es"} of ${perBox}`;
  if (!loose) return boxPart;
  if (!boxes) return `${loose} loose`;
  return `${boxPart} plus ${loose} loose`;
}

/**
 * One variety, with everything a customer can change about it.
 *
 * The order button ends where the assistant's slip ends: a wa.me link that
 * drops the order into WhatsApp's typing box for them to read and send. The
 * site never sends anything itself, and quotes no price — the kitchen does
 * that in the chat, because these are baked to order.
 */
export function ShopItem() {
  const { category: categorySlug = "", item: itemSlug = "" } = useParams();
  const { category, item } = findItem(categorySlug, itemSlug);

  const [tab, setTab] = useState<Tab>("Description");
  const [qty, setQty] = useState(category?.minQty ?? 1);
  const [choice, setChoice] = useState(category?.choices?.[0] ?? "");
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const allExtras = useMemo(
    () => [...(category?.extras ?? []), ...(item?.extras ?? [])],
    [category, item],
  );

  const message = useMemo(() => {
    if (!category || !item) return "";
    const lines = [`Hello Bakesbymom! I'd like to order ${item.name} 🍫`, ""];
    lines.push(`• Item: ${item.name} (${category.name})`);
    if (choice) lines.push(`• ${category.choiceLabel}: ${choice}`);
    lines.push(`• Quantity: ${qty} ${category.unit}`);
    if (category.perBox) lines.push(`• That's ${boxing(qty, category.perBox)}`);
    if (extras.length) lines.push(`• Customisations: ${extras.join(", ")}`);
    const when = [date, slot].filter(Boolean).join(" · ");
    if (when) lines.push(`• Needed on: ${when}`);
    if (note.trim()) {
      lines.push("");
      lines.push(`Notes: ${note.trim()}`);
    }
    return lines.join("\n").trim();
  }, [category, item, choice, qty, extras, date, slot, note]);

  if (!category || !item) {
    return (
      <div className="catalog-page">
        <Nav />
        <main className="shop">
          <p className="catalog__status">
            We couldn&apos;t find that one. <Link to="/">Back home</Link>
          </p>
        </main>
      </div>
    );
  }

  const step = category.unit === "grams" ? 250 : 1;

  function toggle(extra: string) {
    setExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra],
    );
  }

  /** Never below the kitchen's smallest order, and always a whole step. */
  function setQuantity(next: number) {
    if (!Number.isFinite(next)) return;
    setQty(Math.max(category!.minQty, Math.round(next / step) * step));
  }

  return (
    <div className="catalog-page">
      <Nav />

      <main className="item">
        <p className="shop__crumbs item__crumbs">
          <Link to="/">Home</Link> <span>›</span> <Link to={`/shop/${category.slug}`}>{category.name}</Link>{" "}
          <span>›</span> <strong>{item.name}</strong>
        </p>

        <div className="item__grid">
          {/* ---- picture ---- */}
          <div className="item__photo">
            {item.photo ? (
              <img src={resolvePhotoUrl(item.photo)} alt={item.name} />
            ) : (
              <PhotoSlot label={item.name} hint="Our own photo, coming soon" />
            )}
          </div>

          {/* ---- name, mark, customiser ---- */}
          <div className="item__info">
            <p className="item__category">{category.name}</p>
            <h1 className="item__name">{item.name}</h1>

            <p className="item__veg">
              <VegMark />
              <span>
                Pure vegetarian — the green dot is the FSSAI mark for food with no egg or meat in
                it. Everything this kitchen bakes carries it.
              </span>
            </p>

            <p className="item__price">Price confirmed on WhatsApp — every box is baked to order.</p>

            {/* flour, for the shelves that ask it first */}
            {category.choices && (
              <div className="item__field">
                <span className="item__field-label">{category.choiceLabel}</span>
                <div className="item__opts">
                  {category.choices.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`item__opt ${choice === option ? "is-on" : ""}`.trim()}
                      onClick={() => setChoice(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* how many */}
            <div className="item__field">
              <span className="item__field-label">
                How many? ({category.unit}, smallest order {category.minQty})
              </span>
              <div className="item__qty">
                <button
                  type="button"
                  onClick={() => setQuantity(qty - step)}
                  disabled={qty <= category.minQty}
                  aria-label="Fewer"
                >
                  −
                </button>
                <input
                  type="number"
                  min={category.minQty}
                  step={step}
                  value={qty}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  aria-label={`Quantity in ${category.unit}`}
                />
                <button type="button" onClick={() => setQuantity(qty + step)} aria-label="More">
                  +
                </button>
              </div>
              {category.perBox ? (
                <p className="item__hint">
                  One box holds {category.perBox} {category.unit} — that&apos;s{" "}
                  <strong>{boxing(qty, category.perBox)}</strong>. Order any number from{" "}
                  {category.minQty} upwards; we&apos;ll box it sensibly.
                </p>
              ) : (
                <p className="item__hint">
                  Order any amount from {category.minQty} {category.unit} upwards.
                </p>
              )}
            </div>

            {/* what to change about it */}
            <div className="item__field">
              <span className="item__field-label">Make it yours</span>
              <div className="item__opts">
                {allExtras.map((extra) => (
                  <button
                    key={extra}
                    type="button"
                    className={`item__opt ${extras.includes(extra) ? "is-on" : ""}`.trim()}
                    onClick={() => toggle(extra)}
                  >
                    {extra}
                  </button>
                ))}
              </div>
            </div>

            {/* when */}
            <div className="item__field item__field--row">
              <label className="item__sub">
                <span className="item__field-label">Needed on</span>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="item__sub">
                <span className="item__field-label">Time</span>
                <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                  <option value="">Any time</option>
                  {TIME_SLOTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="item__field">
              <span className="item__field-label">Anything else</span>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Less sweet, a flavour split, a message on the box…"
              />
            </label>

            <a className="item__order" href={whatsappUrl(message)} target="_blank" rel="noreferrer">
              Order on WhatsApp
            </a>
            <p className="item__hint">
              This opens WhatsApp with your order already typed out. Read it, change anything, and
              send it yourself — nothing leaves this page on its own.
            </p>
          </div>
        </div>

        {/* ---- description · details · reviews ---- */}
        <div className="item__tabs">
          <div className="item__tab-bar" role="tablist">
            {TABS.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={tab === name}
                className={`item__tab ${tab === name ? "is-on" : ""}`.trim()}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="item__tab-body">
            {tab === "Description" && <p>{item.description}</p>}

            {tab === "Details" && (
              <ul className="item__details">
                {item.details.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li>
                  Smallest order {category.minQty} {category.unit}
                  {category.perBox ? `, boxed ${category.perBox} to a box` : ""}.
                </li>
              </ul>
            )}

            {tab === "Reviews" && (
              <p>
                No reviews on this one yet. If you&apos;ve ordered it, tell us on WhatsApp — we put
                the good ones up on the home page.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
