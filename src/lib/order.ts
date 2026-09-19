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
 * Fallbacks for cakes that have no flavour or add-on rows of their own yet.
 * Once the admin panel fills `cake_flavours` / `cake_addons`, the builder uses
 * those instead — priced, and specific to the cake.
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

export const HOUSE_ADDONS = [
  "Eggless",
  "Message piped on top",
  "Candles",
  "Name plaque",
  "Fresh flowers",
  "Photo print on top",
];

export const TIME_SLOTS = [
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 8pm)",
  "Night (8pm – 10pm)",
];

export interface OrderDraft {
  occasion: string;
  cakeName: string;
  weightKg: number;
  flavour: string;
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
  occasion: "",
  cakeName: "",
  weightKg: 1,
  flavour: "",
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
 * nothing printed for a question the customer skipped.
 */
export function buildMessage(draft: OrderDraft): string {
  const lines: string[] = ["Hello Bakesbymom! I'd like to order a cake 🎂", ""];

  const add = (label: string, value: string) => {
    if (value.trim()) lines.push(`• ${label}: ${value.trim()}`);
  };

  add("Occasion", draft.occasion);
  add("Cake", draft.cakeName);
  add("Size", sizeLabel(draft.weightKg));
  add("Flavour", draft.flavour);
  add("Add-ons", draft.addons.join(", "));
  if (draft.cakeMessage.trim()) add("Message on the cake", `"${draft.cakeMessage.trim()}"`);

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
