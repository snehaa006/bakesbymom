/**
 * The brain behind the little cake assistant.
 *
 * It runs entirely in the browser over the same `/api/catalog` payload the
 * catalog page renders — no model, no API key, no request per message. That
 * keeps it honest: every cake, price and size it quotes is a row in D1, so it
 * cannot invent a cake the bakery does not sell. Questions it does not
 * understand get an offer of the things it does know, not a guess.
 */

import type { CategoryWithCakes } from "./catalog";
import { formatPrice } from "./format";

export interface CakeHit {
  id: string;
  name: string;
  category: string;
  price: number;
  weightKg: number;
  photo: string | null;
}

export interface BotReply {
  /** Lines of prose, rendered as separate paragraphs. */
  text: string[];
  /** Cake cards to show under the prose, each linking to its detail page. */
  cakes?: CakeHit[];
  /** Tappable follow-up questions. */
  chips?: string[];
}

/**
 * Curated by the bakery, because the catalog has no orders table to count and
 * a made-up "most ordered" would be worse than an honest shortlist. Update the
 * ids here when the favourites change.
 */
const MOST_ORDERED = [
  "cake-choco-drip",
  "cake-heart-pearl",
  "cake-spiderman",
  "cake-anniversary-maroon",
];

/** The baker's own picks — the ones she likes making most. */
const CHEFS_PICKS = ["cake-maa-wings", "cake-bride-to-be", "cake-mom-flowerpot"];

/**
 * Flavour words worth searching for, each with the spellings people actually
 * type. A cake matches a flavour if any of its aliases is in its name or
 * description, which is how flavour search works without a flavours column on
 * every row.
 */
const FLAVOURS: { label: string; aliases: string[] }[] = [
  { label: "Chocolate", aliases: ["chocolate", "choco", "ganache", "truffle", "cocoa"] },
  { label: "Vanilla & cream", aliases: ["vanilla", "white cream", "ivory", "buttercream"] },
  { label: "Red velvet", aliases: ["red velvet", "velvet"] },
  { label: "Butterscotch & caramel", aliases: ["butterscotch", "caramel"] },
  { label: "Pistachio", aliases: ["pistachio", "pista"] },
  { label: "Strawberry & berry", aliases: ["strawberry", "berry", "raspberry"] },
  { label: "Pineapple", aliases: ["pineapple"] },
  { label: "Fresh fruit", aliases: ["fruit", "mango", "blueberry"] },
];

const SUGGESTIONS = [
  "Cakes under ₹1500",
  "What sizes do you do?",
  "Most ordered cake",
  "Chef's recommendation",
  "Chocolate cakes",
  "Birthday cakes for kids",
];

export const STARTER_CHIPS = SUGGESTIONS;

// ---------------------------------------------------------------------------
//  Shaping the catalog into something searchable
// ---------------------------------------------------------------------------

interface FlatCake extends CakeHit {
  /** name + description + category, lowercased once so matching stays cheap. */
  haystack: string;
}

export function flattenCatalog(categories: CategoryWithCakes[]): FlatCake[] {
  return categories.flatMap((category) =>
    category.cakes.map((cake) => ({
      id: cake.id,
      name: cake.name,
      category: category.name,
      price: Number(cake.fixed_price) || 0,
      weightKg: Number(cake.weight_kg) || 0,
      photo: cake.cover_url,
      haystack:
        `${cake.name} ${cake.description ?? ""} ${category.name} ${category.description ?? ""}`.toLowerCase(),
    })),
  );
}

/** Drop the search index before a cake goes on screen. */
function strip(cake: FlatCake): CakeHit {
  return {
    id: cake.id,
    name: cake.name,
    category: cake.category,
    price: cake.price,
    weightKg: cake.weightKg,
    photo: cake.photo,
  };
}

function list(cakes: FlatCake[], limit = 4): CakeHit[] {
  return cakes.slice(0, limit).map(strip);
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

// ---------------------------------------------------------------------------
//  Reading the question
// ---------------------------------------------------------------------------

/**
 * The rupee figure in the message, however it was written: "under 1500",
 * "₹1,500", "1500 rs", "1.5k". Numbers carrying a weight unit ("500 g", "2 kg")
 * are skipped, so "500g cake" reads as a size and not a budget.
 */
function findBudget(q: string): number | null {
  const cleaned = q.replace(/,/g, "");
  const k = cleaned.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (k) return Math.round(parseFloat(k[1]) * 1000);
  const plain = cleaned.match(/(?:₹|rs\.?|inr)?\s*(\d{3,6})(?!\s*(?:g|gm|gms|gram|grams|kg|kgs)\b)/);
  return plain ? parseInt(plain[1], 10) : null;
}

/** A weight in kg, from "1 kg", "half kg", "500g", "2kg". */
function findWeight(q: string): number | null {
  if (/\bhalf\s*(?:a\s*)?kg\b|\b1\/2\s*kg\b|\b500\s*g(?:m|ms|rams)?\b/.test(q)) return 0.5;
  const kg = q.match(/(\d+(?:\.\d+)?)\s*kgs?\b/);
  if (kg) return parseFloat(kg[1]);
  const g = q.match(/(\d{3,4})\s*g(?:m|ms|rams)?\b/);
  if (g) return parseInt(g[1], 10) / 1000;
  return null;
}

function matchFlavour(q: string) {
  return FLAVOURS.find((flavour) => flavour.aliases.some((alias) => q.includes(alias))) ?? null;
}

function matchCategory(cakes: FlatCake[], q: string): string | null {
  // Occasion words that don't appear verbatim in a category name.
  const occasions: [RegExp, string][] = [
    [/\bkid|child|children|cartoon|superhero|character\b/, "Kids & Character Birthdays"],
    [/\bmom|mum|mother|maa|dad|father|papa|parent/, "Birthdays for Mom & Dad"],
    [/\bwife|husband|partner|girlfriend|boyfriend|wifey|hubby\b/, "Birthdays for Your Partner"],
    [/\bengage|proposal|bride|roka\b/, "Engagement & Bride-to-Be"],
    [/\banniversar/, "Anniversary"],
    [/\bfarewell|send.?off|goodbye\b/, "Farewell & Send-off"],
    [/\bfestival|diwali|janmashtami|rakhi|raksha\b/, "Festival Specials"],
    [/\bteacher/, "Teacher's Day"],
    [/\bromantic|love|valentine\b/, "Romantic & Just Because"],
  ];

  const names = [...new Set(cakes.map((c) => c.category))];
  for (const [pattern, name] of occasions) {
    if (pattern.test(q) && names.includes(name)) return name;
  }
  // Otherwise look for a category the question names more or less directly.
  return (
    names.find((name) =>
      name
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter((word) => word.length > 4)
        .some((word) => q.includes(word)),
    ) ?? null
  );
}

// ---------------------------------------------------------------------------
//  Answering
// ---------------------------------------------------------------------------

export function answer(question: string, categories: CategoryWithCakes[]): BotReply {
  const q = question.toLowerCase().trim();
  const cakes = flattenCatalog(categories);

  if (cakes.length === 0) {
    return {
      text: [
        "I can't reach the catalog right now, so I'd rather not guess at prices.",
        "Try the Catalog page in a moment — it reads from the same place I do.",
      ],
    };
  }

  const byPrice = [...cakes].sort((a, b) => a.price - b.price);

  // --- greetings & help ----------------------------------------------------
  if (/^(hi|hey|hello|yo|namaste|hola)\b/.test(q) || /what can you do|help\b/.test(q)) {
    return {
      text: [
        "Hi! I'm the Bakesbymom helper. I know every cake on the shelf — prices, sizes, flavours and who each one is for.",
        "Ask me something, or tap one of these:",
      ],
      chips: SUGGESTIONS,
    };
  }

  // --- most ordered --------------------------------------------------------
  if (/most (ordered|popular|bought|sold)|best ?seller|popular|favourite|favorite|trending/.test(q)) {
    const picks = MOST_ORDERED.map((id) => cakes.find((c) => c.id === id)).filter(
      (c): c is FlatCake => Boolean(c),
    );
    const shown = picks.length ? picks : byPrice.slice(0, 4);
    return {
      text: ["These are the ones that leave the kitchen most often:"],
      cakes: list(shown),
      chips: ["Chef's recommendation", "What sizes do you do?"],
    };
  }

  // --- chef's recommendation ----------------------------------------------
  if (/recommend|chef|suggest|what should i|pick for me/.test(q)) {
    const picks = CHEFS_PICKS.map((id) => cakes.find((c) => c.id === id)).filter(
      (c): c is FlatCake => Boolean(c),
    );
    const shown = picks.length ? picks : cakes.slice(0, 3);
    return {
      text: [
        "The baker's own picks — the ones she takes her time over:",
      ],
      cakes: list(shown, 3),
      chips: ["Most ordered cake", "Cakes under ₹1500"],
    };
  }

  // --- sizes ---------------------------------------------------------------
  if (/\bsize|weight|how (big|heavy)|how many (people|serves)|serves|kg\b/.test(q) && !findWeight(q)) {
    const weights = [...new Set(cakes.map((c) => c.weightKg))].sort((a, b) => a - b);
    return {
      text: [
        `Cakes are baked to order in ${weights.map((w) => `${w} kg`).join(", ")} — and anything in between, just ask.`,
        "Half a kilo cuts into about 4–6 slices, a kilo does 8–10, and two kilos comes as a two-tier for a proper crowd.",
        "The price on each cake is for its listed weight; a bigger one is priced off the per-kilo rate on its page.",
      ],
      chips: ["Cakes under ₹1500", "Most ordered cake"],
    };
  }

  // --- flavours (the list, not a search) -----------------------------------
  if (/what flavour|what flavor|which flavour|which flavor|flavours|flavors\b/.test(q) && !matchFlavour(q)) {
    return {
      text: [
        "The ones that come up most: " + FLAVOURS.map((f) => f.label.toLowerCase()).join(", ") + ".",
        "Nearly every cake can be made eggless too. Name a flavour and I'll show you what we've got.",
      ],
      chips: ["Chocolate cakes", "Red velvet", "Pistachio"],
    };
  }

  // --- price range / cheapest ----------------------------------------------
  if (/cheapest|lowest price|least expensive|budget|price range|how much/.test(q) && !findBudget(q)) {
    const low = byPrice[0];
    const high = byPrice[byPrice.length - 1];
    return {
      text: [
        `Cakes run from ${formatPrice(low.price)} up to ${formatPrice(high.price)}, depending on size and how much handwork goes on top.`,
        "Here are the gentlest on the wallet:",
      ],
      cakes: list(byPrice, 3),
      chips: ["Cakes under ₹1500", "What sizes do you do?"],
    };
  }

  // --- delivery ------------------------------------------------------------
  // The catalog holds cakes, not logistics, so say so rather than inventing a
  // delivery radius or a courier the bakery may not actually use.
  if (/delivery|deliver|pickup|pick ?up|shipping|courier|send it/.test(q)) {
    return {
      text: [
        "I only know the cakes, not the delivery details — those get sorted with Mom when you place the order.",
        "What I can tell you is nothing is pre-made, so a day's notice helps, and more for the tiered cakes.",
      ],
      chips: ["How do I order?", "Most ordered cake"],
    };
  }

  // --- how to order --------------------------------------------------------
  if (/how (do i|to) order|order process|notice|lead time|book|custom/.test(q)) {
    return {
      text: [
        "Open any cake from the catalog, pick the flavour and the add-ons you want, and the page works out the final price as you go.",
        "Everything is baked to order rather than pulled off a shelf, so give the kitchen a day's notice where you can — more for the tiered ones.",
      ],
      chips: ["Most ordered cake", "Chef's recommendation"],
    };
  }

  // --- eggless -------------------------------------------------------------
  if (/eggless|vegetarian|no egg|jain/.test(q)) {
    return {
      text: [
        "Almost everything here can be baked eggless — it's the more common request, not the exception.",
        "Choose the cake you like and pick the eggless option on its page; where it carries a surcharge the price updates in front of you.",
      ],
      chips: ["Most ordered cake", "Cakes under ₹1500"],
    };
  }

  // --- filters: budget, weight, flavour, occasion --------------------------
  const budget = /under|below|less than|within|upto|up to|budget|cheap|₹|rs\b|inr|\d/.test(q)
    ? findBudget(q)
    : null;
  const weight = findWeight(q);
  const flavour = matchFlavour(q);
  const category = matchCategory(cakes, q);

  if (budget || weight || flavour || category) {
    let hits = cakes;
    const criteria: string[] = [];

    if (category) {
      hits = hits.filter((c) => c.category === category);
      criteria.push(category.toLowerCase());
    }
    if (flavour) {
      hits = hits.filter((c) => flavour.aliases.some((alias) => c.haystack.includes(alias)));
      criteria.push(flavour.label.toLowerCase());
    }
    if (weight) {
      hits = hits.filter((c) => Math.abs(c.weightKg - weight) < 0.001);
      criteria.push(`${weight} kg`);
    }
    if (budget) {
      hits = hits.filter((c) => c.price <= budget);
      criteria.push(`under ${formatPrice(budget)}`);
    }

    const what = criteria.join(", ");

    if (hits.length === 0) {
      // Say what was actually asked for before offering the nearest thing.
      const nearest = budget
        ? byPrice.filter((c) => (category ? c.category === category : true)).slice(0, 3)
        : byPrice.slice(0, 3);
      return {
        text: [
          `Nothing on the shelf matches ${what} right now.`,
          nearest.length ? "The closest I can offer:" : "Try a wider budget or a different occasion.",
        ],
        cakes: nearest.length ? nearest.map(strip) : undefined,
        chips: ["What sizes do you do?", "Most ordered cake"],
      };
    }

    const sorted = [...hits].sort((a, b) => a.price - b.price);
    return {
      text: [
        `${sorted.length} ${plural(sorted.length, "cake", "cakes")} ${plural(sorted.length, "matches", "match")} ${what}${sorted.length > 4 ? " — here are the first few" : ""}:`,
      ],
      cakes: list(sorted, 4),
      chips: ["Chef's recommendation", "How do I order?"],
    };
  }

  // --- last resort: plain keyword search over names and descriptions -------
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  if (words.length) {
    const scored = cakes
      .map((cake) => ({
        cake,
        score: words.filter((word) => cake.haystack.includes(word)).length,
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length) {
      return {
        text: ["Closest I can find:"],
        cakes: list(
          scored.map((row) => row.cake),
          4,
        ),
        chips: SUGGESTIONS.slice(0, 3),
      };
    }
  }

  return {
    text: [
      "I didn't catch that one — I'm only good for cake questions.",
      "Try me on a budget, a size, a flavour or an occasion:",
    ],
    chips: SUGGESTIONS,
  };
}
