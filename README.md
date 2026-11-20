# Dynamix Club de Palma — Membership Experience Prototype

Immersive homepage redesign for **Dynamix Club de Palma** (Clube de Palma, Bambolim, Goa).

This is a **static HTML / CSS / JS** site. No npm, Vite, or build step is required for production.

## Run / deploy (no build tools)

Upload or copy this whole folder to any static host (Apache, Nginx, IIS, cPanel, S3, Netlify, etc.) and open `index.html`.

### Local preview (pick one)

Any static file server works. Examples:

```bash
# Python
python -m http.server 3847

# PHP
php -S localhost:3847
```

Then open `http://localhost:3847`.

> ES modules need HTTP. Opening files via `file://` will not load the scripts.

### Folder layout

```
index.html, about.html, amenities.html, events.html, contact.html, membership.html
assets/     images, fonts, logos, video
src/        site CSS + JS modules
vendor/     GSAP + Lenis (already included — no install needed)
```

## What you can explore

1. Welcome splash / progress preloader (session-aware, skippable, reduced-motion safe)
2. Cinematic hero with Courtyard / Nightfall atmosphere crossfade
3. About storytelling with scrubbed layered photography
4. Interactive amenities discovery (verified facilities only)
5. Horizontally scrubbed gallery (touch swipe on mobile) with lightbox
6. Membership narrative, benefits, enquiry form + link to the live application portal
7. Events & Club News (clearly labelled CMS placeholders where live content is unavailable)
8. Contact strip and structured footer

### Motion language

Interaction patterns are inspired by [Era Residence](https://www.era-residence.com/) (Lenis smooth scroll, GSAP ScrollTrigger, magnetic CTAs, reveal masks, pinned/horizontal scrub). Visual identity stays Dynamix only.

## Brand system notes

See `docs/BRAND-AUDIT.md` for the full live-site audit.

### Colours (extracted)

- Accent teal `#56C1A9`
- Ink / buttons `#050505` → hover `#56C1A9`
- Cream surface `#F8F7F3`
- Soft white `#FAFAFA`

### Typography

Brief requires **TFarrow Light** (headings) and **Optima** (body/UI). Files live under `assets/fonts/`.

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
