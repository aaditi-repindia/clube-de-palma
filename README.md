# Dynamix Club de Palma — Membership Experience Prototype

Immersive homepage redesign for **Dynamix Club de Palma** (Clube de Palma, Bambolim, Goa). This is a frontend visual prototype that preserves the existing brand system extracted from [dynamixclubedepalma.co.in](https://dynamixclubedepalma.co.in/).

It is **not** a replacement for the live WordPress site and does not include backend membership processing.

## What you can explore

1. Welcome splash (session-aware, skippable, reduced-motion safe)
2. Cinematic hero with Explore / Apply CTAs
3. About storytelling
4. Interactive amenities discovery (verified facilities only)
5. Draggable / swipe photo gallery with lightbox
6. Membership narrative, benefits, enquiry form + link to the live application portal
7. Events & Club News (clearly labelled CMS placeholders where live content is unavailable)
8. Contact strip and structured footer

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default port **3847**).

```bash
npm run build
npm run preview
```

## Brand system notes

See `docs/BRAND-AUDIT.md` for the full live-site audit.

### Colours (extracted)

- Accent teal `#56C1A9`
- Ink / buttons `#050505` → hover `#56C1A9`
- Cream surface `#F8F7F3`
- Soft white `#FAFAFA`

### Typography dependency

Brief requires **TFarrow Light** (headings) and **Optima** (body/UI).

Those licensed files are **not** in this repository and are **not** served by the live site today (live headings use **Seasons**). Place files here when available:

- `public/assets/fonts/TFarrow-Light.woff2`
- `public/assets/fonts/Optima.woff2`

Until then the CSS declares the required families and falls back to Seasons + the Optima system stack.

## Membership flow

- Enquiry form is interactive with client-side validation and a designed confirmation state.
- It does **not** post to a server.
- Official applications continue on the existing portal:  
  https://dynamixclubedepalma.co.in/clubdepalma/membership/form

## Content policy

- Photography and logos mirrored from the live media library
- Facility copy taken from verified amenity pages
- Events / news use labelled placeholders when no calendar is published
- No invented pricing, testimonials, or facilities
