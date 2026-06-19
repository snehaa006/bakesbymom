// Catalogue for Bakes by Mom.
// Each "module" is a portfolio category with its own showcase page at
// /collections/[slug]. Products are flattened into the /orders catalogue.

export interface Product {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  priceFrom: number; // INR
  unit: string; // e.g. "per kg", "per dozen", "each"
  serves?: string;
  tags: string[];
  from: string; // swatch gradient start (logo palette)
  to: string; // swatch gradient end
}

export interface Module {
  slug: string;
  name: string;
  short: string; // nav / chip label
  tagline: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  products: Product[];
}

export const MODULES: Module[] = [
  {
    slug: "wedding-cakes",
    name: "Wedding Cakes",
    short: "Wedding",
    tagline: "Tiered elegance for the day you'll never forget",
    description:
      "Hand-finished multi-tier cakes designed around your theme, palette and florals. Tasting sessions available before every booking.",
    accentFrom: "#EAD7B7",
    accentTo: "#7A5230",
    products: [
      {
        slug: "rose-champagne-tier",
        name: "Rose & Champagne Three-Tier",
        blurb: "Rose lychee sponge, champagne cream",
        description:
          "Three tiers of rose-lychee sponge layered with champagne buttercream, finished with hand-piped lace and fresh blooms.",
        priceFrom: 3800,
        unit: "per kg",
        serves: "40–60 guests",
        tags: ["Tiered", "Floral", "Signature"],
        from: "#F3E5CE",
        to: "#C9A074",
      },
      {
        slug: "ivory-pearl",
        name: "Ivory Pearl Classic",
        blurb: "Vanilla bean, white chocolate ganache",
        description:
          "Timeless ivory fondant dressed with edible pearls and sugar peonies — vanilla bean sponge and white chocolate ganache within.",
        priceFrom: 3500,
        unit: "per kg",
        serves: "30–50 guests",
        tags: ["Classic", "Fondant"],
        from: "#EFE0C9",
        to: "#B07D4E",
      },
      {
        slug: "naked-botanical",
        name: "Naked Botanical",
        blurb: "Semi-naked, seasonal fruit & herbs",
        description:
          "Rustic semi-naked finish with seasonal berries, figs and fresh herbs — for garden and intimate celebrations.",
        priceFrom: 3200,
        unit: "per kg",
        serves: "25–40 guests",
        tags: ["Rustic", "Seasonal"],
        from: "#E8D3AE",
        to: "#8A5A33",
      },
    ],
  },
  {
    slug: "birthday-cakes",
    name: "Birthday Cakes",
    short: "Birthday",
    tagline: "Themed, custom and unapologetically fun",
    description:
      "From first birthdays to milestone surprises — sculpted, themed and photo-ready cakes in any flavour you love.",
    accentFrom: "#F3E5CE",
    accentTo: "#B07D4E",
    products: [
      {
        slug: "chocolate-truffle-celebration",
        name: "Chocolate Truffle Celebration",
        blurb: "Belgian chocolate, ganache drip",
        description:
          "Rich Belgian chocolate sponge, silky truffle ganache and a glossy drip finish with custom toppers.",
        priceFrom: 1300,
        unit: "per kg",
        serves: "8–12 guests",
        tags: ["Chocolate", "Bestseller"],
        from: "#7A5230",
        to: "#3A2418",
      },
      {
        slug: "custom-theme-cake",
        name: "Custom Theme Cake",
        blurb: "Sculpted to your theme",
        description:
          "Tell us the theme — cartoon, hobby, brand or fantasy — and we sculpt it in fondant with hand-painted detail.",
        priceFrom: 1600,
        unit: "per kg",
        serves: "10–15 guests",
        tags: ["Custom", "Fondant"],
        from: "#C9A074",
        to: "#6E4B2A",
      },
      {
        slug: "funfetti-buttercream",
        name: "Funfetti Buttercream",
        blurb: "Vanilla sprinkle, swiss meringue",
        description:
          "Soft vanilla sponge packed with rainbow sprinkles and smooth swiss-meringue buttercream — a crowd favourite.",
        priceFrom: 1200,
        unit: "per kg",
        serves: "8–12 guests",
        tags: ["Vanilla", "Kids"],
        from: "#EFE0C9",
        to: "#C9A074",
      },
    ],
  },
  {
    slug: "anniversary-cakes",
    name: "Anniversary Cakes",
    short: "Anniversary",
    tagline: "Romantic cakes for milestone moments",
    description:
      "Elegant, heartfelt cakes for anniversaries and engagements — refined florals, gold leaf and the flavours you fell in love over.",
    accentFrom: "#EAD7B7",
    accentTo: "#8A5A33",
    products: [
      {
        slug: "red-velvet-romance",
        name: "Red Velvet Romance",
        blurb: "Red velvet, cream cheese, gold leaf",
        description:
          "Velvety red sponge with tangy cream-cheese frosting, finished with 24k gold leaf and sugar roses.",
        priceFrom: 1600,
        unit: "per kg",
        serves: "8–12 guests",
        tags: ["Red Velvet", "Gold Leaf"],
        from: "#9B5A4A",
        to: "#3A2418",
      },
      {
        slug: "floral-two-tier",
        name: "Floral Two-Tier",
        blurb: "Pistachio rose, buttercream blooms",
        description:
          "Two delicate tiers of pistachio-rose sponge with hand-piped buttercream blooms in your palette.",
        priceFrom: 2200,
        unit: "per kg",
        serves: "15–25 guests",
        tags: ["Floral", "Tiered"],
        from: "#E8D3AE",
        to: "#B07D4E",
      },
      {
        slug: "coffee-walnut-classic",
        name: "Coffee & Walnut Classic",
        blurb: "Espresso sponge, toasted walnut",
        description:
          "For the couple who fell for each other over coffee — espresso sponge, toasted walnut praline and mocha cream.",
        priceFrom: 1500,
        unit: "per kg",
        serves: "8–12 guests",
        tags: ["Coffee", "Classic"],
        from: "#6E4B2A",
        to: "#2A1A12",
      },
    ],
  },
  {
    slug: "treats",
    name: "Brownies, Cupcakes & Cookies",
    short: "Treats",
    tagline: "Everyday indulgence, boxed with love",
    description:
      "The little bakes that make any day better — fudgy brownies, seasonal cupcakes and hand-pressed cookies. Perfect for gifting.",
    accentFrom: "#C9A074",
    accentTo: "#3A2418",
    products: [
      {
        slug: "fudgy-brownie-box",
        name: "Dream Brownie Box",
        blurb: "9 squares, rich & fudgy",
        description:
          "Nine intensely fudgy brownie squares — choose classic Belgian, walnut, or salted caramel swirl.",
        priceFrom: 450,
        unit: "per box of 9",
        serves: "shares 4–6",
        tags: ["Brownies", "Gift"],
        from: "#5A3A22",
        to: "#2A1A12",
      },
      {
        slug: "seasonal-cupcakes",
        name: "Seasonal Cupcakes",
        blurb: "Half dozen, rotating flavours",
        description:
          "Six cupcakes in the season's flavours, swirled with buttercream and finished with delicate toppers.",
        priceFrom: 600,
        unit: "per half dozen",
        serves: "6 treats",
        tags: ["Cupcakes", "Seasonal"],
        from: "#EFE0C9",
        to: "#C9A074",
      },
      {
        slug: "artisan-cookies",
        name: "Artisan Cookie Box",
        blurb: "Hand-pressed & iced",
        description:
          "A box of thick hand-pressed cookies — brown butter choc-chip, double chocolate and seasonal iced designs.",
        priceFrom: 400,
        unit: "per box of 6",
        serves: "shares 3–4",
        tags: ["Cookies", "Gift"],
        from: "#C9A074",
        to: "#6E4B2A",
      },
    ],
  },
];

export function getModule(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export interface CatalogueItem extends Product {
  category: string;
  categorySlug: string;
}

export function allProducts(): CatalogueItem[] {
  return MODULES.flatMap((m) =>
    m.products.map((p) => ({
      ...p,
      category: m.name,
      categorySlug: m.slug,
    }))
  );
}

export const CONTACT = {
  brand: "Bakes by Mom",
  email: "info@khandelwalbusar.com",
  instagram: "https://instagram.com/bakesbymom",
  city: "Panipat, Haryana",
};
