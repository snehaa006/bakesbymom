# Velvet Crumb — Immersive 3D Bakery Website

A fully immersive luxury bakery experience built with Next.js 15, React Three Fiber,
and GSAP. A persistent 3D scene sits behind the entire page; the camera travels
through it as you scroll, passing a rotating centerpiece cake, floating macarons,
donuts, cookies, and gift boxes, with bloom/depth-of-field post-processing for a
premium cinematic look.

## Stack

- Next.js 15 (App Router) + TypeScript
- React Three Fiber + drei + postprocessing (Three.js)
- GSAP + ScrollTrigger (scroll-driven camera waypoints)
- Lenis (buttery smooth scrolling)
- Tailwind CSS (UI layer, glassmorphic cards over the 3D scene)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For production:

```bash
npm run build
npm run start
```

## How the 3D works

- `components/three/Scene.tsx` — the persistent `<Canvas>`, lighting rig, fog,
  and post-processing stack (Bloom, DepthOfField, Vignette).
- `components/three/CameraRig.tsx` — reads scroll progress (via Lenis, exposed
  through `lib/scroll-context.tsx`) and smoothly interpolates the camera along
  waypoints defined in `lib/camera-path.ts`. Mouse position adds a subtle parallax
  offset on top of the scroll-driven path.
- `components/three/Cake.tsx` — the procedural hero centerpiece (layered tiers,
  frosting drips, sugar pearls, candle with flickering flame + point light, flowers).
- `components/three/FloatingDesserts.tsx` — macarons, donuts, cookies, cherries,
  and star sprinkles drifting with idle physics, reacting gently to the cursor.
- `components/three/SetPieces.tsx` — macaron tower, cookie stack, gift boxes
  placed at different points along the camera path so they reveal as you scroll.
- `components/three/AmbientParticles.tsx` — soft gold dust filling the air.

To add real product photography instead of/alongside the procedural geometry,
drop `.glb` models in `/public/models` and load them with `useGLTF` from drei
inside new components following the same pattern as `Cake.tsx`.

## Editing the camera journey

Open `lib/camera-path.ts` — each waypoint has a scroll `progress` (0–1), a camera
`position`, a `lookAt` target, and an optional `fov`. Add/move waypoints to match
your section order; the rig eases between them automatically.

## Notes

- The cursor is fully custom (`components/CustomCursor.tsx`) — hidden on touch
  devices automatically via a `(hover: none)` media query.
- All scroll-reveal text/cards use a shared `useReveal` hook
  (`hooks/useReveal.ts`) — IntersectionObserver-based, no extra dependency.
- Replace the Google Fonts `<link>` tags in `app/layout.tsx` with self-hosted
  fonts if you want zero external requests.
