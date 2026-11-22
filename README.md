# Ecco Nails & Spa - Lake Mary, Florida

Ecco Nails & Spa — 4300 W Lake Mary Blvd #1030, Lake Mary, FL 32746 · (407) 333-0904.

Luxury, mobile-first React + Vite site with React Router and handcrafted CSS (no Tailwind required). Pages: Home, Services, Booking, Gallery, Blog, Contact.

Built on the same codebase/design system as Casabella Nail & Spa's site (gold
theme, layout, and components), with all content rebranded for Ecco. The real
menu in `src/data/services.json` comes from Ecco's printed luxury menu.

### What's wired up vs. what still needs setup
- **Menu, pages, SEO, gold branding** — done, using Ecco's real info and services.
- **Firebase** (admin price editor, live hours, Firestore promos) — code is in
  place but intentionally unconfigured; see `.env.example`. Create Ecco's own
  Firebase project — do not reuse another salon's project/keys.
- **Online booking link** — `ROUTES.bookingExternal` currently falls back to
  `tel:+14073330904`. Swap in Ecco's real booking platform URL once chosen.
- **Gallery / Instagram photos** — `src/assets/nails` and `src/assets/interior`
  are empty on purpose (the originals were Casabella's own photos). Add Ecco's
  real photos, or wire up Firestore `galleryImages`.
- **Testimonials / blog posts** — left empty rather than filled with
  placeholder/fake content.
- **Logo** — `public/ecco.png` is a simple placeholder gold "E" mark; replace
  with a real logo when available.
- **Meta Pixel / analytics** — removed (was Casabella's ad account ID); add
  Ecco's own when ready.

## Run locally
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure Firebase.
3. Start the app: `npm run dev`
4. Build for production: `npm run build`

## Firebase admin setup
- This app now uses Firebase Authentication + Firestore for admin login and content editing.
- Configure Firebase values in `.env` from your Firebase project settings.
- In Firebase Auth, create email/password users for admins.
- Set the Firebase Auth custom claim `admin: true` on each manager account using a trusted Firebase Admin SDK environment. Sign out and back in after changing claims.
- Deploy `firestore.rules` and `storage.rules`; both reject content mutations unless the ID token contains the admin claim.
- In Firestore, create:
  - Collection `offers`, document `welcome` (popup content fields)
  - Collection `services` with fields:
    `name`, `shortDescription`, `duration`, `category`, `priceFrom`, `key`
    where `key` is `name::category`

## Admin pages
- Admin login route: `/admin/login`
- Admin panel route: `/admin/advertise`
- Admin services pricing route: `/admin/services`

## Customize content
- Business info: edit text in `src/components/NavBar.jsx` and `src/components/Footer.jsx`.
- Services: defaults live in `src/data/services.json`; runtime editable prices are persisted by backend API in `server/data/services.json`.
- Testimonials: `src/data/testimonials.json`.
- Blog posts: `src/data/posts.json` (supports `tags` and simple markdown-ish lists with `- `).
- Gallery: tweak image list in `src/pages/Gallery.jsx` (`src`, `alt`, `category`).
- Hero/Home copy: adjust sections in `src/pages/Home.jsx`.
- Offer popup content is fetched from Firestore and cached in `localStorage` as fallback.

## Notes
- Styling lives in `src/index.css` (CSS variables, layout, buttons, cards, forms).
- SEO titles/descriptions are set per route with `src/utils/seo.js`.
- Booking and Contact include client-side validation and success states without retaining customer form data in browser storage.

## Optional local admin API

`server/index.js` binds to `127.0.0.1` by default. Its mutation routes remain disabled until `ADMIN_API_TOKEN` is configured, and callers must send that value as a Bearer token. Do not put this token in any `VITE_*` variable.
