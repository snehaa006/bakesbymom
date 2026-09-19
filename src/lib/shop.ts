/**
 * The shop, as it reads on the shelf pages: a handful of categories, each with
 * the varieties the kitchen bakes and the knobs a customer can turn on one.
 *
 * Cakes are not here — they live in D1 and are served by /api/catalog, because
 * the admin panel maintains them with photos and prices. Everything on these
 * pages is baked to order off a fixed list, so it is written down here and the
 * price is settled on WhatsApp.
 *
 * Photos: `photo` stays empty until the bakery's own picture of that item is in
 * the R2 bucket. An empty slot renders as a labelled frame rather than
 * borrowing somebody else's photograph of somebody else's brownie.
 */

export interface ShopItem {
  slug: string;
  name: string;
  /** One line under the name on the shelf. */
  blurb: string;
  /** The Description tab. */
  description: string;
  /** The Details tab — one line each. */
  details: string[];
  /** Path in the photo bucket, or "" while the bakery hasn't shot it yet. */
  photo: string;
  /** Extras specific to this variety, on top of the category's own. */
  extras?: string[];
}

export interface ShopCategory {
  slug: string;
  name: string;
  blurb: string;
  /** What the quantity is counted in, e.g. "pieces". */
  unit: string;
  /** Smallest order the kitchen takes, in `unit`. */
  minQty: number;
  /** How many come in a box, for the "one box holds N" line. */
  perBox?: number;
  /** A first choice made before the variety, the way cookies pick a flour. */
  choiceLabel?: string;
  choices?: string[];
  /** Offered on every variety in the category. */
  extras: string[];
  items: ShopItem[];
}

/** Keeping time and storage lines consistent across the shelf. */
const KEEPS = (days: number) => `Best within ${days} days. Airtight at room temperature.`;
const BAKED_TO_ORDER = "Baked to order — please give us a day's notice where you can.";
const EGGLESS = "100% eggless, like everything else that leaves this kitchen.";

const BROWNIE_EXTRAS = [
  "Extra walnuts",
  "Extra choco chips",
  "Extra fudgy (under-baked centre)",
  "Cake-style (lighter crumb)",
  "Chocolate drizzle on top",
  "Cut into smaller squares",
];

const COOKIE_EXTRAS = [
  "Extra choco chips",
  "Extra nuts",
  "Less sweet",
  "Crisper bake",
  "Softer bake",
  "Mixed box (half and half)",
];

const GIFT_EXTRAS = ["Gift wrapping", "Gift box", "Greeting card note"];

export const SHOP: ShopCategory[] = [
  {
    slug: "brownies",
    name: "Brownies",
    blurb:
      "Dense, fudgy and cut thick. Baked in trays through the week and boxed the morning they go out.",
    unit: "pieces",
    minQty: 9,
    perBox: 9,
    extras: BROWNIE_EXTRAS,
    items: [
      {
        slug: "oreo-brownie",
        name: "Oreo Brownie",
        blurb: "Cookies through the batter and crushed over the top.",
        description:
          "Our fudgy chocolate base with Oreo pieces folded through it and more crushed over the top before it goes in, so the biscuit softens into the crumb instead of sitting on it.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "biscoff-brownie",
        name: "Biscoff Brownie",
        blurb: "Warm spiced biscuit spread, swirled and baked in.",
        description:
          "Biscoff spread swirled through the batter and a second spoonful melted over the top once it's out, so you get the caramel-spice note in every square.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "triple-chocolate-brownie",
        name: "Triple Chocolate Brownie",
        blurb: "Dark, milk and white, all three in one square.",
        description:
          "Dark chocolate in the batter, milk chocolate chunks folded through, white chocolate over the top. The one to order when chocolate is the whole point.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "walnut-brownie",
        name: "Walnut Brownie",
        blurb: "The classic, with walnuts on top and through.",
        description:
          "The brownie most people mean when they say brownie: deep and fudgy, with toasted walnuts folded in and a few more pressed on top so they crisp in the oven.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Contains wheat, dairy, soy, walnuts."],
        photo: "",
      },
      {
        slug: "kitkat-brownie",
        name: "KitKat Brownie",
        blurb: "Wafer fingers laid in and baked through.",
        description:
          "KitKat laid across the batter before baking, so the wafer goes soft and the chocolate melts into the top. A favourite with the kids' boxes.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "mixed-brownie-box",
        name: "Mixed Flavours Box",
        blurb: "A box that can't make up its mind. Tell us the split.",
        description:
          "Pick the flavours you want and how many of each — we'll cut and box them together. The usual ask is three each of walnut, triple chocolate and Oreo.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(4), "Tell us the split in the order message."],
        photo: "",
      },
    ],
  },
  {
    slug: "cookies",
    name: "Cookies",
    blurb:
      "Choose your flour first — maida, wheat, ragi, oats or jowar — then the flavour on top of it.",
    unit: "grams",
    minQty: 250,
    choiceLabel: "Flour",
    choices: ["Maida", "Wheat flour", "Ragi", "Oats", "Jowar"],
    extras: COOKIE_EXTRAS,
    items: [
      {
        slug: "choco-chip-cookie",
        name: "Choco Chip Cookie",
        blurb: "Chunks, not chips. Soft middle, crisp edge.",
        description:
          "Proper chocolate chunks rather than chips, so they pool rather than stud. Bakes soft in the middle with a crisp rim — say the word and we'll take it crisper all the way through.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(10), "Contains wheat or your chosen flour, dairy."],
        photo: "",
      },
      {
        slug: "rolled-oats-cookie",
        name: "Rolled Oats Cookie",
        blurb: "Chewy, wholesome, good with chai.",
        description:
          "Rolled oats through and through, lightly sweetened, with a chew that holds. The one that disappears fastest out of the tin at teatime.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(10), "Contains oats, dairy."],
        photo: "",
      },
      {
        slug: "coconut-cookie",
        name: "Coconut Cookie",
        blurb: "Desiccated coconut, toasted golden.",
        description:
          "Coconut folded through a short, buttery dough and baked until the edges toast. Light, and not too sweet.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(10), "Contains dairy, coconut."],
        photo: "",
      },
      {
        slug: "nankhatai",
        name: "Butter Nankhatai",
        blurb: "The one that crumbles before you bite it.",
        description:
          "Short, melt-in-the-mouth nankhatai with a touch of cardamom and a pistachio pressed on top. Baked the way it has always been baked.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(14), "Contains dairy, nuts."],
        photo: "",
      },
      {
        slug: "dry-fruit-cookie",
        name: "Dry Fruit Cookie",
        blurb: "Almonds, cashews and raisins in every one.",
        description:
          "Loaded with chopped almonds, cashews and raisins. The tin people ask for at Diwali and then again in January.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(12), "Contains nuts, dairy."],
        photo: "",
      },
      {
        slug: "jeera-cookie",
        name: "Jeera Cookie",
        blurb: "Salted, not sweet. For the chai people.",
        description:
          "Roasted cumin through a savoury short dough, with a pinch of salt on top. The answer when somebody in the house doesn't like sweet things.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(14), "Contains dairy."],
        photo: "",
      },
      {
        slug: "custom-flavour-cookie",
        name: "Tell Us the Flavour",
        blurb: "Berries, coffee, anything you've had before.",
        description:
          "If it isn't on the shelf, ask. Berries, coffee, orange zest, a flavour you had somewhere and want again — tell us in the order message and we'll say whether we can bake it.",
        details: [EGGLESS, BAKED_TO_ORDER, "Write the flavour in the order message."],
        photo: "",
      },
    ],
  },
  {
    slug: "jar-cakes",
    name: "Jar Cakes",
    blurb: "Layered in a jar, spoon included. Every flavour we do, in the size that travels.",
    unit: "jars",
    minQty: 1,
    extras: [...GIFT_EXTRAS, "Extra layer of cream", "Less sweet", "Add a spoon to each jar"],
    items: [
      {
        slug: "chocolate-truffle-jar",
        name: "Chocolate Truffle Jar",
        blurb: "Sponge, ganache, sponge, ganache.",
        description:
          "Chocolate sponge soaked and layered with dark truffle ganache, finished with a curl of chocolate on top.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
      {
        slug: "red-velvet-jar",
        name: "Red Velvet Jar",
        blurb: "Cream cheese frosting, crumb on top.",
        description:
          "Red velvet sponge layered with cream cheese frosting and finished with the crumb off the same cake.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
      {
        slug: "biscoff-jar",
        name: "Biscoff Jar",
        blurb: "Spread, crumb, cream, repeat.",
        description:
          "Vanilla sponge layered with Biscoff spread and whipped cream, crushed biscuit between every layer.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
      {
        slug: "blueberry-jar",
        name: "Blueberry Jar",
        blurb: "Compote through fresh cream.",
        description:
          "Vanilla sponge with blueberry compote and fresh cream, layered so you get fruit in every spoonful.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
      {
        slug: "rasmalai-jar",
        name: "Rasmalai Jar",
        blurb: "Saffron, cardamom, soaked sponge.",
        description:
          "Sponge soaked in saffron-cardamom rabri, layered with cream and topped with slivered pistachio.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
      {
        slug: "any-flavour-jar",
        name: "Any Flavour You Like",
        blurb: "Butterscotch, oreo, tiramisu, mango, pineapple, strawberry.",
        description:
          "Every flavour the kitchen does can be layered into a jar. Name it in the order message — butterscotch, oreo, tiramisu, mango, pineapple, strawberry, or ask for something else.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated. Best within 3 days."],
        photo: "",
      },
    ],
  },
  {
    slug: "dry-cakes",
    name: "Dry Cakes",
    blurb: "Tea cakes with no icing to melt — the loaf that sits on the counter all week.",
    unit: "grams",
    minQty: 500,
    extras: [...GIFT_EXTRAS, "Extra nuts", "Less sweet", "Sliced before packing"],
    items: [
      {
        slug: "vanilla-tea-cake",
        name: "Vanilla Tea Cake",
        blurb: "Plain, buttery, and better on day two.",
        description: "A plain vanilla loaf with a tight, buttery crumb. The one to keep in the tin.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(5), "Contains wheat, dairy."],
        photo: "",
      },
      {
        slug: "chocolate-tea-cake",
        name: "Chocolate Tea Cake",
        blurb: "Cocoa-dark, no icing needed.",
        description: "Deep cocoa loaf, moist without any frosting to hide behind.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(5), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "marble-cake",
        name: "Marble Cake",
        blurb: "Vanilla and chocolate, swirled.",
        description: "Vanilla and chocolate batter swirled through each other — no two slices alike.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(5), "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "banana-walnut-cake",
        name: "Banana Walnut Cake",
        blurb: "Ripe bananas, toasted walnuts.",
        description:
          "Properly ripe bananas and toasted walnuts, baked into a loaf that stays moist for days.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(5), "Contains wheat, dairy, walnuts."],
        photo: "",
      },
      {
        slug: "tutti-frutti-cake",
        name: "Tutti Frutti Cake",
        blurb: "The bakery loaf you grew up on.",
        description: "Candied fruit through a light vanilla crumb. The one from the corner bakery, done properly.",
        details: [EGGLESS, BAKED_TO_ORDER, KEEPS(5), "Contains wheat, dairy."],
        photo: "",
      },
    ],
  },
  {
    slug: "cupcakes",
    name: "Cupcakes",
    blurb: "Six, twelve or twenty-four, piped the morning they go out.",
    unit: "cupcakes",
    minQty: 6,
    perBox: 6,
    extras: [
      "Piped message on the box",
      "Candles",
      "Sprinkles",
      "Extra frosting",
      "Less sweet frosting",
      ...GIFT_EXTRAS,
    ],
    items: [
      {
        slug: "chocolate-cupcake",
        name: "Chocolate Cupcake",
        blurb: "Chocolate sponge, truffle swirl.",
        description: "Chocolate sponge under a swirl of truffle frosting and a chocolate curl.",
        details: [EGGLESS, BAKED_TO_ORDER, "Best the day they're made.", "Contains wheat, dairy, soy."],
        photo: "",
      },
      {
        slug: "vanilla-cupcake",
        name: "Vanilla Cupcake",
        blurb: "Buttercream rose on a vanilla crumb.",
        description: "Vanilla sponge with a piped buttercream rose — the colour is yours to pick.",
        details: [EGGLESS, BAKED_TO_ORDER, "Best the day they're made.", "Contains wheat, dairy."],
        photo: "",
      },
      {
        slug: "red-velvet-cupcake",
        name: "Red Velvet Cupcake",
        blurb: "Cream cheese, piped high.",
        description: "Red velvet sponge under cream cheese frosting, with the crumb dusted over.",
        details: [EGGLESS, BAKED_TO_ORDER, "Keep refrigerated.", "Contains wheat, dairy."],
        photo: "",
      },
      {
        slug: "butterscotch-cupcake",
        name: "Butterscotch Cupcake",
        blurb: "Praline crunch on the top.",
        description: "Butterscotch sponge and frosting, finished with praline crunch.",
        details: [EGGLESS, BAKED_TO_ORDER, "Best the day they're made.", "Contains wheat, dairy, nuts."],
        photo: "",
      },
    ],
  },
  {
    slug: "bento-cakes",
    name: "Bento Cakes",
    blurb: "The little one in a box — six inches of cake for two people and a message on top.",
    unit: "bentos",
    minQty: 1,
    extras: [
      "Message piped on top",
      "Candles",
      "Your colour scheme",
      "Matching cupcakes",
      ...GIFT_EXTRAS,
    ],
    items: [
      {
        slug: "message-bento",
        name: "Message Bento",
        blurb: "Whatever you want written, in your colour.",
        description:
          "A small round cake in a bento box with your words piped across it. Tell us the message and the colour and it's done.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 2. Keep refrigerated.", "Contains wheat, dairy."],
        photo: "",
      },
      {
        slug: "minimal-bento",
        name: "Minimal Bento",
        blurb: "One colour, clean edges, nothing else.",
        description: "Plain and smooth, a single colour, no writing. For the people who like it quiet.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 2. Keep refrigerated.", "Contains wheat, dairy."],
        photo: "",
      },
      {
        slug: "photo-bento",
        name: "Photo Bento",
        blurb: "An edible print of your picture.",
        description:
          "Send the photo on WhatsApp and we'll print it onto the cake. Works best with a clear, bright picture.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 2. Send the photo with your order.", "Contains wheat, dairy."],
        photo: "",
      },
    ],
  },
  {
    slug: "combos",
    name: "Cake + Cupcake Combos",
    blurb: "A cake and a set of cupcakes, iced to match, in one box.",
    unit: "combos",
    minQty: 1,
    extras: ["Message piped on the cake", "Candles", "Matching colours", "Fresh flowers", ...GIFT_EXTRAS],
    items: [
      {
        slug: "half-kg-six",
        name: "½ kg Cake + 6 Cupcakes",
        blurb: "Enough for a small table.",
        description: "A half-kilo cake with six matching cupcakes around it, same flavour or two different ones.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 6–8. Keep refrigerated."],
        photo: "",
      },
      {
        slug: "one-kg-six",
        name: "1 kg Cake + 6 Cupcakes",
        blurb: "The usual birthday order.",
        description: "A one-kilo cake with six cupcakes, iced to match. Pick the flavour for each.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 10–12. Keep refrigerated."],
        photo: "",
      },
      {
        slug: "one-kg-twelve",
        name: "1 kg Cake + 12 Cupcakes",
        blurb: "For the party that spilled onto the lawn.",
        description: "A one-kilo cake and a full dozen cupcakes, all in one box.",
        details: [EGGLESS, BAKED_TO_ORDER, "Serves 14–16. Keep refrigerated."],
        photo: "",
      },
    ],
  },
];

export function findCategory(slug: string): ShopCategory | null {
  return SHOP.find((c) => c.slug === slug) ?? null;
}

export function findItem(categorySlug: string, itemSlug: string) {
  const category = findCategory(categorySlug);
  const item = category?.items.find((i) => i.slug === itemSlug) ?? null;
  return { category, item };
}

/** What the nav's Products menu lists: the shelves, plus the live cake catalog. */
export const PRODUCT_MENU: { label: string; to: string }[] = [
  { label: "Cakes", to: "/catalog" },
  ...SHOP.map((c) => ({ label: c.name, to: `/shop/${c.slug}` })),
];
