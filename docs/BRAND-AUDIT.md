# Dynamix Club de Palma — Existing Website Audit

Source: https://dynamixclubedepalma.co.in/ (WordPress + Woodmart + Elementor)

Audited for redesign prototype. Live site is not overwritten.

## Stack (live)

- WordPress / WooCommerce
- Woodmart theme 7.6.0
- Elementor
- Membership application: `/clubdepalma/membership/form`

## Brand colour palette (extracted)

| Token | Hex | Usage on live site |
| --- | --- | --- |
| Accent teal | `#56C1A9` | Primary hover / interactive accent (matches logo fronds ~rgb 87,193,168) |
| Terracotta | `#A25D50` | Logo wordmark / palm trunks (sampled from CDP logo) |
| Ink | `#050505` / `#000000` / `#202020` | Buttons, dark surfaces |
| Title | `#242424` / `#3A3A3A` / `#474747` | Headings |
| Body | `#3D3D3D` / `#767676` | Supporting copy |
| Cream | `#F8F7F3` | Soft brand surface |
| Soft white | `#FAFAFA` / `#FDFDFD` | Section backgrounds |
| Gold (theme alt) | `#E0B252` / `#fbbc34` | Theme alternative (used sparingly) |
| Green (theme) | `#459647` | Theme secondary |

Buttons: black fill, `border-radius: 20px`, hover fills `#56C1A9`.

## Typography (live vs brief)

| Role | Brief requirement | Live website today |
| --- | --- | --- |
| Headings | **TFarrow Light** | Custom **Seasons** (`1426Seasons.woff2`) + Raleway |
| Body / UI | **Optima** | Quicksand / Raleway |

### Font dependency (blocking for exact brand match)

- Licensed **TFarrow Light** files are **not** present in this repository and are **not** served by the live site.
- Licensed **Optima** files are **not** present in this repository.
- Prototype declares the required families and falls back to Seasons (live display) + Optima system stack until licensed files are supplied in `public/assets/fonts/`.

## Verified facilities

- Swimming Pool (half Olympic) + Kids’ Pool
- Gymnasium
- Yoga Garden
- Badminton, Squash, Tennis, Tennis-Ground, Pickleball
- Cards Room, Billiards, Table Tennis
- O Bar Azul, Sabores restaurant, Café Verde
- Banquet hall (~500 guests)
- Children’s / Toddlers’ play areas + kids activities & sport lessons

## Verified contact

- Phone: +91-96997 51872 / +91-83018 26935
- Email: vishal.roy@dynamixgroup.co.in
- Address: Clube de Palma, H. No. ADG/15/PH/II, Near Phase II Gate, Aldeia de Goa, Bambolim, Goa
- Social: Facebook (Dynamix Group), Instagram (@dynamixgroup), LinkedIn (Dynamix Group)

## Content notes

- Hero line: “A haven of experiences, where you belong”
- Club size claim: 40,000 sq.ft recreational space; Konkan Coast / Goa positioning
- Events/news on live homepage: “Stay Tuned For The Updates!” — no verified upcoming event feed
- Legal pages: Rules & Regulations, Code of Conduct, Privacy Policy, Cancellation & Refund

## Assets mirrored locally

Photography, logos, social icons, and Seasons woff2 copied from the live WordPress media library into `public/assets/` for prototype use.
