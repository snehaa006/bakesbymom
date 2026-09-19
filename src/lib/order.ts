/**
 * The order slip the assistant assembles, and the WhatsApp hand-off.
 *
 * Nothing here sends anything. The builder ends at a `https://wa.me/<number>`
 * link, which opens WhatsApp with the message sitting in the typing box for the
 * customer to read, edit and send themselves — the bakery's number never
 * receives a thing until they hit send in WhatsApp.
 */

import type { CakeDetail } from "./catalog";
import { formatPrice } from "./format";

/**
 * The bakery's WhatsApp number in international form, digits only — the 91
 * country code in front of the ten-digit Panipat number. It is the shop's
 * public contact, so it lives here rather than in an env file the deploy can
 * forget; VITE_WHATSAPP_NUMBER still overrides it when the bakery moves number
 * or a preview build needs to point somewhere else.
 */
const DEFAULT_WHATSAPP_NUMBER = "917206552667";

export const WHATSAPP_NUMBER =
  ((import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "").replace(/\D/g, "") ||
  DEFAULT_WHATSAPP_NUMBER;

/** Sizes the kitchen bakes to, named the way Panipat asks for them. */
export const SIZES: { kg: number; label: string }[] = [
  { kg: 0.5, label: "½ kg · 1 pound" },
  { kg: 1, label: "1 kg · 2 pound" },
  { kg: 1.5, label: "1½ kg · 3 pound" },
  { kg: 2, label: "2 kg · 4 pound" },
  { kg: 3, label: "3 kg · 6 pound" },
];

/**
 * Flavours for cakes that have no flavour rows of their own yet. Once the
 * admin panel fills `cake_flavours`, the builder uses those instead — priced,
 * and specific to the cake.
 */
export const HOUSE_FLAVOURS = [
  "Chocolate truffle",
  "Vanilla",
  "Black forest",
  "Red velvet",
  "Butterscotch",
  "Pineapple",
  "Fresh fruit",
  "Rasmalai",
];

/** Finishing touches for anything iced and candle-worthy. */
const CAKE_ADDONS = [
  "Message piped on top",
  "Candles",
  "Name plaque",
  "Fresh flowers",
  "Photo print on top",
];

/** Finishing touches for the boxed things that travel as gifts. */
const GIFT_ADDONS = ["Gift wrapping", "Gift box", "Greeting card note"];

export const HOUSE_ADDONS = CAKE_ADDONS;

export const TIME_SLOTS = [
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 8pm)",
  "Night (8pm – 10pm)",
];

/**
 * One thing the kitchen sells, and the questions worth asking about it.
 *
 * Only cakes come out of the catalog — they are the rows the admin panel
 * maintains, with photos and prices. Everything else is baked to order off a
 * short list, so its options live here and its price is settled on WhatsApp.
 */
export interface ProductType {
  id: string;
  label: string;
  /** Pick the occasion and the cake out of the live catalog. */
  catalog?: boolean;
  /** Asked before the flavour, for things where the flour is the choice. */
  flours?: string[];
  flavours: string[];
  /** The "how much" question, when it isn't a cake weight. */
  quantity?: { label: string; options: string[] };
  addons: string[];
  /** Wording for the free-text line the customer wants written on it. */
  inscription: string;
}

/**
 * Everything is eggless, so it is said once on the first screen rather than
 * offered as a choice nobody has.
 */
export const EGGLESS_NOTE = "Everything we bake is 100% eggless.";

export const PRODUCT_TYPES: ProductType[] = [
  {
    id: "cake",
    label: "Cake",
    catalog: true,
    flavours: HOUSE_FLAVOURS,
    addons: CAKE_ADDONS,
    inscription: "Message piped on the cake",
  },
  {
    id: "brownies",
    label: "Brownies",
    flavours: [
      "Oreo brownie",
      "Biscoff brownie",
      "Triple chocolate brownie",
      "Walnut brownie",
      "KitKat brownie",
      "Mixed flavours",
    ],
    quantity: { label: "How many?", options: ["Box of 4", "Box of 6", "Box of 9", "Box of 12"] },
    addons: GIFT_ADDONS,
    inscription: "Note on the gift card",
  },
  {
    id: "dry-cake",
    label: "Dry cake",
    flavours: ["Vanilla", "Chocolate", "Marble", "Banana walnut", "Orange", "Tutti frutti", "Coffee"],
    quantity: { label: "How much?", options: ["½ kg", "1 kg", "1½ kg", "2 kg"] },
    addons: GIFT_ADDONS,
    inscription: "Note on the gift card",
  },
  {
    id: "cookies",
    label: "Cookies",
    flours: ["Maida", "Wheat flour", "Ragi", "Oats", "Jowar"],
    flavours: [
      "Choco chip",
      "Rolled oats",
      "Coconut",
      "Butter / nankhatai",
      "Dry fruit",
      "Chocolate",
      "Jeera (salted)",
    ],
    quantity: { label: "How much?", options: ["250 g", "500 g", "750 g", "1 kg"] },
    addons: GIFT_ADDONS,
    inscription: "Note on the gift card",
  },
  {
    id: "jar-cake",
    label: "Jar cake",
    flavours: [
      "Chocolate truffle",
      "Red velvet",
      "Butterscotch",
      "Blueberry",
      "Biscoff",
      "Oreo",
      "Rasmalai",
      "Tiramisu",
      "Pineapple",
      "Mango",
      "Strawberry",
    ],
    quantity: { label: "How many jars?", options: ["1 jar", "2 jars", "4 jars", "6 jars", "12 jars"] },
    addons: GIFT_ADDONS,
    inscription: "Note on the gift card",
  },
  {
    id: "cupcakes",
    label: "Cupcakes",
    flavours: HOUSE_FLAVOURS,
    quantity: { label: "How many?", options: ["6 cupcakes", "12 cupcakes", "24 cupcakes"] },
    addons: CAKE_ADDONS,
    inscription: "Message piped on top",
  },
  {
    id: "cake-cupcakes",
    label: "Cake + cupcake combo",
    flavours: HOUSE_FLAVOURS,
    quantity: {
      label: "Which combo?",
      options: [
        "½ kg cake + 6 cupcakes",
        "1 kg cake + 6 cupcakes",
        "1 kg cake + 12 cupcakes",
        "1½ kg cake + 12 cupcakes",
      ],
    },
    addons: CAKE_ADDONS,
    inscription: "Message piped on the cake",
  },
  {
    id: "bento",
    label: "Bento cake",
    flavours: HOUSE_FLAVOURS,
    quantity: { label: "How many?", options: ["1 bento", "2 bentos", "3 bentos", "4 or more"] },
    addons: CAKE_ADDONS,
    inscription: "Message piped on the bento",
  },
];

export function findProduct(id: string): ProductType | null {
  return PRODUCT_TYPES.find((p) => p.id === id) ?? null;
}

export interface OrderDraft {
  /** Which of PRODUCT_TYPES this order is for. */
  product: string;
  occasion: string;
  cakeName: string;
  weightKg: number;
  /** Cookies are chosen by flour before they are chosen by flavour. */
  flour: string;
  flavour: string;
  /** Anything the list doesn't carry — berries, a flavour they had once. */
  customFlavour: string;
  /** "Box of 6", "500 g", "2 jars" — whatever the product counts in. */
  quantity: string;
  addons: string[];
  cakeMessage: string;
  date: string;
  slot: string;
  fulfilment: "Pickup" | "Delivery";
  area: string;
  name: string;
  phone: string;
  notes: string;
  /** Set once the customer picks a reference photo, so the slip can say so. */
  hasReference: boolean;
  /** What the site worked the price out to, or 0 when it can't say. */
  estimate: number;
  estimateExact: boolean;
}

export const EMPTY_DRAFT: OrderDraft = {
  product: "",
  occasion: "",
  cakeName: "",
  weightKg: 1,
  flour: "",
  flavour: "",
  customFlavour: "",
  quantity: "",
  addons: [],
  cakeMessage: "",
  date: "",
  slot: "",
  fulfilment: "Pickup",
  area: "",
  name: "",
  phone: "",
  notes: "",
  hasReference: false,
  estimate: 0,
  estimateExact: false,
};

/**
 * What the cake costs at the chosen weight. The catalog prices one reference
 * weight per cake, so any other size is that price scaled and rounded to the
 * nearest ten — flagged as approximate, because the kitchen has the last word.
 */
export function estimatePrice(
  cake: Pick<CakeDetail, "fixed_price" | "weight_kg">,
  weightKg: number,
  extras = 0,
): { amount: number; exact: boolean } {
  const base = Number(cake.fixed_price) || 0;
  const reference = Number(cake.weight_kg) || 0;
  if (!base || !reference || !weightKg) return { amount: 0, exact: false };

  const exact = Math.abs(reference - weightKg) < 0.01;
  const scaled = exact ? base : Math.round((base * weightKg) / reference / 10) * 10;
  return { amount: scaled + extras, exact };
}

/** "1½ kg · 3 pound", from the weight alone. */
export function sizeLabel(kg: number): string {
  return SIZES.find((size) => Math.abs(size.kg - kg) < 0.01)?.label ?? `${kg} kg`;
}

/** 2026-09-24 → "24 Sep 2026", left alone if it isn't a date. */
function prettyDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * The order as the bakery reads it on WhatsApp: one line per answer, and
 * nothing printed for a question the customer skipped or was never asked. A
 * cake lists its occasion, catalog name and weight; a box of cookies lists its
 * flour and how much of it — the same slip, shaped by what was ordered.
 */
export function buildMessage(draft: OrderDraft): string {
  const product = findProduct(draft.product);
  const lines: string[] = ["Hello Bakesbymom! I'd like to place an order 🎂", ""];

  const add = (label: string, value: string) => {
    if (value.trim()) lines.push(`• ${label}: ${value.trim()}`);
  };

  add("Item", product?.label ?? "");
  add("Occasion", draft.occasion);
  add("Cake", draft.cakeName);
  if (product?.catalog) add("Size", sizeLabel(draft.weightKg));
  add("Flour", draft.flour);

  const flavour = [draft.flavour, draft.customFlavour.trim()].filter(Boolean).join(" · ");
  add("Flavour", flavour);
  add("Quantity", draft.quantity);
  add("Add-ons", draft.addons.join(", "));
  if (draft.cakeMessage.trim()) {
    add(product?.inscription ?? "Message", `"${draft.cakeMessage.trim()}"`);
  }

  const when = [draft.date ? prettyDate(draft.date) : "", draft.slot].filter(Boolean).join(" · ");
  add("Needed on", when);
  add(
    draft.fulfilment === "Delivery" ? "Delivery to" : "Pickup",
    draft.fulfilment === "Delivery" ? draft.area || "address to share" : "from the kitchen",
  );

  if (draft.estimate > 0) {
    const prefix = draft.estimateExact ? "" : "about ";
    lines.push(`• Price on the site: ${prefix}${formatPrice(draft.estimate)} — please confirm`);
  }

  lines.push("");
  const who = [draft.name.trim(), draft.phone.trim()].filter(Boolean).join(" · ");
  if (who) lines.push(`From: ${who}`);
  if (draft.notes.trim()) lines.push(`Notes: ${draft.notes.trim()}`);
  if (draft.hasReference) lines.push("I'm attaching a reference photo 📎");

  return lines.join("\n").trim();
}

/**
 * The click-to-chat link. WhatsApp drops the text into the compose box and
 * waits — it does not send, and there is no way to make it send from a link.
 * Without a configured number it opens the chat picker with the text ready.
 */
export function whatsappUrl(message: string, number: string = WHATSAPP_NUMBER): string {
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/**
 * Whether this device can hand WhatsApp the photo and the text together
 * through the OS share sheet. Phones can; most desktop browsers cannot, and
 * there the photo gets attached by hand in the chat instead.
 */
export function canShareFile(file: File | null): boolean {
  if (!file || typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Whether a typed message is someone asking to order rather than asking a
 * question. Deliberately narrow: "most ordered cake" is a question about the
 * catalog, not an order, so a bare "order" never counts — only the phrases
 * people actually open with, in English and in Hinglish.
 */
const ORDER_INTENT =
  /\b(?:(?:i |we |lets |let's |can i |how (?:do|to) (?:i |we )?)?(?:want(?:ed)? to |wanna |like to |need to )?(?:place|start|make|give|put)?\s*(?:an? )?order(?:ing)?\b(?! ?ed)|order (?:a |the )?(?:cake|now|online|please|kar|kr)|(?:cake|kek) (?:ka |ki )?order|book (?:a |the )?(?:cake|order)|buy (?:a |the )?cake|customi[sz]e (?:a |my |the )?cake|place my order)/;

export function isOrderIntent(text: string): boolean {
  const q = text.toLowerCase().trim();
  // Questions about what sells well are not orders.
  if (/\b(most|least|best|top) ordered\b/.test(q)) return false;
  return ORDER_INTENT.test(q);
}
