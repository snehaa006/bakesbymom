# Bakesbymom — Immersive 3D Bakery Website

A luxury bakery portfolio + storefront built with Next.js 15, React Three Fiber,
and GSAP. The home page runs a persistent 3D scene behind the content; the camera
travels through it as you scroll. Customers can browse portfolio modules, order
online, and leave reviews — orders and reviews are stored in **Supabase**.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- React Three Fiber + drei + postprocessing (Three.js)
- GSAP + ScrollTrigger (scroll-driven camera waypoints) + Lenis (smooth scroll)
- Tailwind CSS (UI layer, glassmorphic cards)
- Supabase (orders + reviews)

## Pages

- `/` — immersive 3D home (hero, portfolio modules, story, reviews teaser, enquiry).
- `/orders` — e-commerce-style menu with category filter and an **Order Now** modal
  that writes to the Supabase `orders` table.
- `/reviews` — reads reviews from Supabase and lets customers post their own.
- `/collections/[slug]` — a dedicated portfolio module page per category
  (wedding-cakes, birthday-cakes, anniversary-cakes, treats). Defined in
  `lib/products.ts`.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Open http://localhost:3000.

### Supabase setup

1. In your Supabase project, open **SQL Editor** and run `supabase/schema.sql`
   (creates the `orders` and `reviews` tables with Row Level Security).
2. Set these env vars locally (`.env.local`) **and** in Vercel
   (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   These are public client keys — safe to expose, protected by RLS.

## Editing the catalogue

All products and portfolio modules live in `lib/products.ts`. Add a module or a
product there and it automatically appears on `/orders`, the relevant
`/collections/[slug]` page, and the home "Collections" grid.

## Performance

The 3D scene pauses rendering when the tab is hidden, auto-scales resolution on
weaker machines, and respects `prefers-reduced-motion` (falling back to a static
gradient). Content pages (orders/reviews/modules) skip WebGL entirely and use a
lightweight CSS ambient background.
