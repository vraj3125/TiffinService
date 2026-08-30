# TiffinConnect — Features

A marketplace connecting home kitchens in **Vadodara, Gujarat** with customers who
want a daily tiffin. Three sides: customers who subscribe, kitchens that cook, and
an admin who verifies kitchens before they can trade.

Built with React 18, Vite 5, React Router 6, Tailwind CSS and Firebase Auth.

---

## Table of contents

- [Roles](#roles)
- [Customer features](#customer-features)
- [Kitchen partner features](#kitchen-partner-features)
- [Admin features](#admin-features)
- [Authentication](#authentication)
- [Location system](#location-system)
- [Public pages](#public-pages)
- [Data model](#data-model)
- [Routes](#routes)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Known limitations](#known-limitations)

---

## Roles

| Role | How it is assigned | Sees |
|---|---|---|
| **Customer** | Chosen at signup | Discovery, subscriptions, orders, profile |
| **Provider** | Chosen at signup, must pick a Vadodara area | Kitchen dashboard, menu, plans, orders, verification |
| **Admin** | Email listed in `VITE_ADMIN_EMAILS` | Verification queue, on top of their normal role |

Admin is a flag on the account, not a third signup option — an admin is also a
customer or a provider.

---

## Customer features

### Discovery
- Browse kitchens with photos, rating, cuisine tags, veg/non-veg and price range.
- **Location-aware search** — pick your area and you see kitchens in it *plus* any
  nearby kitchen whose own delivery radius reaches you. Results sort nearest first.
- Filters: area, cuisine, diet type, max price, meal (lunch/dinner), minimum rating.
- Quick chips for common filters; full-text search across name, area and pincode.

### Subscriptions and checkout
- Kitchen detail page with weekly menu, plans and public reviews.
- Plans by duration — one-time, weekly, monthly, monthly two-meal.
- Checkout shows an itemised total (plan price + 5% GST) before you confirm.
- **Add a delivery address inline** during checkout, with label, street, area and a
  validated 6-digit pincode. The first address saved becomes the default.
- Payment rails offered: UPI, card, cash on delivery.

### Managing a subscription
- Active plans with start date, end date, days remaining and skipped days.
- **Skip a meal** for a chosen date.
- **Pause and resume** a plan.
- Recent deliveries table with status — upcoming, out for delivery, delivered, skipped.
- Order tracking page per order.

### Profile
- Editable name, phone and city.
- Saved addresses: add, remove, automatic default handling.
- Wallet balance.

---

## Kitchen partner features

### Dashboard
- Today's orders and revenue, active subscribers, average rating.
- Seven-day revenue chart and month-to-date totals.
- Recent reviews.
- **Verification banner** stating exactly where the kitchen stands — not yet
  submitted, awaiting review, changes requested (with the reviewer's note), or
  approved. A kitchen is not visible to customers until approved.

### Business profile and verification
- Business name, owner name, FSSAI licence number, kitchen address, contact phone.
- **Go-live checklist** with four states per item:
  - ○ not done, ◐ saved but not submitted, ⏱ awaiting review, ✓ verified.
  - Items only tick from **saved** data — typing into a field does not count — and
    turn green only after an admin approves.
- **Document upload** — FSSAI licence, kitchen photos, owner ID proof. Real files
  from the device, PDF or image. Uploads sit at *Pending* until reviewed.
- **Inline document preview** — view a PDF or image without leaving the page, plus
  open-in-tab and download.
- **Kitchen photos** — up to 6, taken from the device and downscaled automatically.
- **Submit for verification**, enabled only once the checklist is complete.
  Resubmission after changes clears the previous decision.

### Kitchen locations (branches)
- A kitchen can cook from **more than one place**. Each branch has its own name,
  street address and **delivery radius (1–25 km)**.
- A customer is covered if **any** branch reaches them.
- The area chosen at signup becomes the first branch automatically.

### Menu management
- Seven-day menu, lunch and dinner per day.
- Per meal: item list, veg/non-veg flag, calories.
- Days start blank and are filled in; a meal can be cleared.

### Plans and delivery areas
- Create subscription plans — type, duration, price, meals per day, description.
- Extra delivery areas beyond the branch radii, each showing its distance from the
  nearest branch and flagged when no radius covers it.
- Read-only summary of branches with a link back to the profile.

### Orders, holidays and reviews
- Today's order list with status transitions — pending, preparing, out for
  delivery, delivered.
- Holiday calendar, opening on the current month, to mark closure days.
- Customer reviews with average rating.

---

## Admin features

Reached from the **Verification** link in the navbar, at `/admin`.

- **Three queues with counts** — awaiting review, approved, changes requested.
- Each row summarises the kitchen: name, owner, phone, number of locations,
  documents supplied, and submission time.
- **Review screen** showing everything at once:
  - Business details — owner, phone, FSSAI number, address.
  - Every branch with area, pincode and delivery radius.
  - Each document with an **inline preview**, open-in-tab and download.
    Missing documents are flagged in red.
  - Kitchen photos.
- **Approve** — the kitchen goes live, its documents become *Verified*, and its
  checklist turns green.
- **Request changes** — requires a note, which the provider sees on their profile
  along with a resubmit button.

---

## Authentication

Firebase Auth, with a demo fallback so the app stays usable before keys are added.

- **Email and password** signup and login, with role selection.
- **Google sign-in.**
- **Phone / OTP** login with an invisible reCAPTCHA, fixed to `+91` and validating
  Indian mobile format.
- **Already registered** — signing up with an existing email opens a dialog offering
  to log in or reset, rather than showing an error.
- **Password reset** as its own flow:
  - `/forgot-password` takes the email and sends the verification link, with a
    45-second resend cooldown.
  - `/reset-password` is where the link lands. It verifies the one-time code before
    revealing any field, then takes a new password, confirms it and returns to login.
    Expired or reused links get their own screen.
- **Sessions persist across refresh** — persistence is awaited before any sign-in so
  a session can never be stored in memory by accident. You stay logged in until you
  click Logout.
- **Obfuscated query strings** — login intent travels as one opaque token
  (`/login?d=...`) rather than readable `tab`/`role` parameters. A fresh nonce means
  the same intent never produces the same token twice. This is obfuscation, not
  confidentiality; the key ships in the bundle.

---

## Location system

Everything is scoped to Vadodara and the towns around it.

- **42 locations** with coordinates and pincodes — 34 city localities (Alkapuri,
  Gotri, Karelibaug, Akota, Manjalpur, Fatehgunj, Sayajigunj, …) and 8 nearby towns
  (Padra, Waghodia, Savli, Karjan, Dabhoi, Bajwa, Ranoli, Por).
- **Type-ahead search** restricted to a greater-Vadodara bounding box, so nothing
  outside the service area can be suggested.
- **Three interchangeable providers** via `VITE_PLACES_PROVIDER`:

  | Value | Key needed | Notes |
  |---|---|---|
  | `photon` *(default)* | none | komoot's public API over OpenStreetMap. No signup, no billing. Requires OSM attribution, which the UI shows. |
  | `google` | `VITE_GOOGLE_MAPS_API_KEY` | Richer results for shops and societies. Needs an active billing account. |
  | `local` | none | The curated list only, no network calls. |

- Any provider failure — missing key, billing off, offline — falls back to the
  curated list, so the field is never dead.
- **Distance and radius** are computed with a haversine straight-line distance. Good
  enough to decide coverage; not a road-network distance.

---

## Public pages

Eleven content pages, all reachable from the footer:

| Page | Path |
|---|---|
| How it works | `/how-it-works` |
| Gift cards | `/gift-cards` |
| Food safety | `/food-safety` |
| Why partner with us | `/partner` |
| Sustainability | `/sustainability` |
| About us | `/about` |
| Help centre | `/support` |
| Terms of service | `/terms` |
| Privacy policy | `/privacy` |
| Cancellation & refunds | `/refunds` |

- **Working forms without a backend** — the support, gift-card and newsletter forms
  compose an email with the fields filled in, so a submission actually reaches
  someone instead of vanishing.
- **Partner earnings calculator** — sliders for tiffins per day and price, showing
  monthly gross, the 12% commission and the payout.
- Terms, privacy and refunds share one renderer with a sticky section rail.
- Company details live in a single config file, and anything left blank is hidden
  rather than shown as a placeholder.

---

## Data model

There is no backend yet. Data lives in two places, and the split matters.

### Marketplace catalogue — shared
`src/mockData.js` holds the kitchens customers browse, their menus, plans and
public reviews. This is shop inventory: shared by everyone, seeded, read-only.

### Account data — per user
Everything belonging to a person is namespaced by uid under
`tc:data:<uid>:<name>` via `src/lib/accountStore.js`. A new account starts
genuinely empty and can never see another account's records.

| Key | Holds |
|---|---|
| `orders`, `subscriptions` | What this customer bought |
| `addresses`, `profile`, `wallet` | Customer profile |
| `kitchenProfile`, `branches`, `zones` | Kitchen identity and coverage |
| `menu`, `plans`, `holidays` | What the kitchen sells |
| `documents`, `kitchenPhotos` | Verification uploads |
| `kitchenOrders`, `kitchenReviews` | Incoming orders and feedback |

### Verification queue — shared
`tc:admin:applications` holds submitted applications so the admin screen can read
them, since a provider's own namespace is not readable by anyone else.

Every `src/api/*` function is already shaped like a network call — async, taking a
uid — so swapping localStorage for HTTP is mechanical.

---

## Routes

| Path | Access |
|---|---|
| `/` | Public |
| `/login`, `/forgot-password`, `/reset-password` | Public |
| `/discover`, `/providers/:id` | Public |
| 11 company pages | Public |
| `/checkout`, `/orders`, `/orders/:id/track`, `/profile` | Customer |
| `/provider/dashboard`, `/menu`, `/orders`, `/plans`, `/holidays`, `/verification`, `/reviews` | Provider |
| `/admin` | Admin |

---

## Environment variables

Copy `.env.example` to `.env.local`. Vite reads env files **at startup** — restart
`npm run dev` after editing.

```bash
# Firebase — without these the app runs in demo auth mode
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Location suggestions: photon (default, keyless) | google | local
VITE_PLACES_PROVIDER=photon
VITE_GOOGLE_MAPS_API_KEY=

# Comma-separated emails allowed into /admin. Blank means nobody.
VITE_ADMIN_EMAILS=

# Secret used to obfuscate login query params. Changing it invalidates old links.
VITE_URL_PARAM_SECRET=
```

For production, set the same variables in your hosting provider — `.env.local` is
gitignored and never deployed.

Additionally, in the Firebase console set **Authentication → Templates → Password
reset → action URL** to `https://<your-domain>/reset-password`, or reset emails
land on Firebase's own page instead of the app's screens.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # serve the build
```

---

## Known limitations

Worth reading before treating this as production-ready.

**No backend.** All data is in the browser's `localStorage`. It does not sync
between devices, does not survive clearing site data, and shares a ~5 MB budget —
which is why uploaded photos are downscaled before being stored.

**The verification queue is per-browser.** An admin only sees kitchens that
submitted in the same browser profile. A real provider on their own phone would be
invisible. This needs a server-side collection before it can be used for real.

**The admin gate is UI-only.** `VITE_ADMIN_EMAILS` is checked in the browser, so the
list is readable in the shipped bundle and a determined user could render the
screen. Before this handles genuine applications the check belongs in Firebase
custom claims plus Firestore rules, so the *data* is protected rather than the route.

**Roles are client-side.** A user's role is stored in `localStorage`, not in a
trusted claim. Fine for routing the UI, not a security boundary.

**Query-param obfuscation is not encryption.** The key ships in the bundle. It keeps
navigation intent out of plain sight; it is not a protection boundary.

**Catalogue kitchens are sample data.** The ten kitchens on `/discover` are
Vadodara-plausible but invented, and a real visitor could try to subscribe to one.
A newly registered kitchen gets a working private dashboard but does not yet appear
in the public catalogue.

**Company details are intentionally blank.** FSSAI licence, CIN, GSTIN, phone and
registered address are empty in `src/config/company.js` and hidden wherever empty,
so no invented statutory identifier is ever displayed. Fill each in as it is issued.

**Legal pages are drafts.** Terms, privacy and refunds are written for a tiffin
marketplace in India but have not been reviewed by a lawyer.
