# Redesign audit — every element on the site, and where it lives now

Before the redesign, every route was rendered and its visible text, links,
images, buttons, ARIA labels, form placeholders and select options were
captured. The redesign was checked against that capture: nothing on the list
below was dropped, reworded or replaced. Only layout, order, type, colour and
motion changed.

Legend — **Kept** means the same content and behaviour, restyled. **Moved**
means the same content in a new position.

## Site-wide

| Element | Content / behaviour | Status |
|---|---|---|
| Intro curtain | "Bakesbymom", rule, "Home Bakery · Panipat"; plays once per page load, skips on reduced motion, any wheel/touch/key dismisses, 4.2 s fallback | Kept |
| Nav wordmark | "Bakesbymom" → `#top` on the landing page, `/` elsewhere | Kept |
| Products menu | Cakes, Brownies, Cookies, Jar Cakes, Dry Cakes, Cupcakes, Bento Cakes, Cake + Cupcake Combos; note "Everything eggless · baked to order · Panipat"; hover (pointer) / click (touch), Esc and outside-click close | Kept |
| Nav links | About `#about`, Our Cakes `#showcase`, Ritual `#ritual` (route home first off the landing page) | Kept |
| Nav CTA | "Catalog" → `/catalog` | Kept |
| Mobile drawer | Burger "Open menu"/"Close menu", drawer of the same links, scroll lock, closes on route change and on widening past 860px | Kept |
| Cake assistant | Robot launcher, "Cake assistant", "Sizes · flavours · prices · what to gift", Order button, greeting, 8 chips, input "Ask about a cake…", Send, Esc closes, hidden on `/admin`; order builder (all steps) | Kept |
| Footer | "© 2026 Bakesbymom · Panipat, Haryana", "Admin" → `/admin` | Kept (the footer also repeats the nav's existing links) |
| Scroll-to-top / hash landing | `ScrollToTop` | Kept |

## Landing page `/` (section order changed)

| Old order | Section | Content | New position |
|---|---|---|---|
| — | Floating badge | Ring text "order your cakes and cookies now", tart photo `badge-tart.png`, appears after first scroll | Kept |
| — | Flour specks + ambient glow | Decorative drifting flour | Kept, quieter |
| 1 | Hero | "We're *Bakesbymom* Home Bakery.", "A home bakery in Panipat baking cakes, brownies, cookies, cupcakes and breads — fresh to order.", CTA "See this week's bakes" → `/catalog`, 3D baker (`aunty.glb`, scroll turn + cursor look, loading "Warming the kitchen… n%", error "The 3D scene could not load."), wave, "Scroll" cue | 1 |
| 3 | Our Products | "What we serve", "Our Products", body copy, "View more" → `/catalog`, prev/next arrows, auto-drifting looped belt of 11 categories with photos (pauses on hover/focus, reduced-motion still) | 2 |
| 5 | Showcase | "Passion, Patience, Perfection", body copy, "Explore" → `/catalog`, 16 cake photo tiles → `/catalog` with their alt text | 3 |
| 2 | About | "What began as a hobby in a home kitchen is now", "every cake, cookie and brownie on this table.", two paragraphs, "Explore the catalog" → `/catalog`, three steps (A hobby at home / Cakes, perfected / A whole dessert table) with their text | 4 |
| 4 | Ritual | "Chapter I — Before the Bell", "From flour to the first warm bite.", body, Steps 1–4 (Mix, Shape, Pipe, Done) with captions, four lazy-loaded 3D props with hover tilt, arrows between steps | 5 |
| 7 | Reviews | "Kind Words", "What the neighbourhood says.", intro line, featured review (Ritika S.), four more reviews with names, meta and star ratings | 6 |
| 6 | How To Order | "How To Order", "Learn more about our ordering process →" → `/catalog`, logo card (EST. BY MONICA, bakesbymom, EGGLESS CUSTOM CAKES, @BAKESBYMOM, 7206552667) | 7 |

## Catalog `/catalog`

"The Catalog", "Every cake, by occasion", subtitle, API notice / loading /
error / empty states, one band per category (name, description, View more /
Show less grid toggle, arrows, tiles linking to the cake). **Kept** — same
row structure, moved onto the new type and colour system.

## Cake detail `/catalog/:id`

"← Back to catalog", loading / error / not-found states, gallery with
thumbnails, category, name, description, Per pound / Weight / Base price,
Flavour select, Customizations checkboxes, Final price and its note. **Kept**.

## Shelf `/shop/:category` (7 shelves)

Breadcrumbs, heading, blurb, veg note, flour choices (cookies), Products rail,
"Good to know" (smallest order, box size, baked to order, price on WhatsApp),
item cards (photo slot "Photo coming soon", veg mark, name, blurb, "Customise &
order"), unknown-shelf message. **Kept**.

## Item `/shop/:category/:item`

Breadcrumbs, photo slot "Our own photo, coming soon", category, name, veg
line, price line, flour picker, quantity stepper (min/step rules, box
maths), "Make it yours" extras, date + time slot, notes, "Order on WhatsApp"
(pre-filled wa.me link), hint, Description / Details / Reviews tabs,
not-found message. **Kept**.

## Admin `/admin`

Password gate ("Admin access", "Enter the password to manage the catalog.",
Enter), category / cake / photo / flavour / add-on management. **Kept** — a
back-office tool, restyled only through shared colour and type tokens.

## Verification

The capture was re-run against the redesigned build: 16 routes and 1,367
strings, links, images, ARIA labels, alt texts, placeholders and options. Every
one of them is still on its page (0 gaps). The six restaged photos now load as
thumbnails named after their original photo key; the check counts each one
under its original image.
