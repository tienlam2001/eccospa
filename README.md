# Ecco Nails & Spa — Lake Mary

Responsive salon website for https://ecconailslakemary.com, built with semantic HTML, CSS, small native JavaScript, and Vite. Booking opens the salon's existing ABC Salon System; this site does not collect customer data.

## Development

```sh
npm ci
npm run dev
npm run build
npm run check
```

## Deployment

Production Cloudflare Worker: `eccospa`, account `a7684b64536ac77c302658cc04cdbaad`. Apex and www use this Worker, with www redirected to the apex.

The build produces `dist/` and packages its static files into `.cloudflare/worker.mjs`. The small site is served by a Worker with correct content types, ETags, HEAD support and cache headers. Requests count toward the account's Workers allowance. Initial deployment uses the connected Cloudflare API. Later, use `npm run deploy` with `CLOUDFLARE_API_TOKEN` in the environment (Workers Scripts Edit on this account). Never commit credentials. Custom domains persist through code deployments. GitHub pushes alone do not trigger deployment.

## Sources

Verified November 22, 2026:

- Contact details, service categories, booking: https://ecconailsspa.com/
- Updated prices: https://www.instagram.com/ecconailsspa_fl/reel/DfsFWmfyja7/ — classic manicure $25, classic pedicure $32; adult combos $52/$64, $60/$72, $67/$79, $77/$89, $87/$99, $97/$109; kids combos $42/$55; gel toes +$20. Prices not confirmed in the newer source are omitted.
- Google business hours: https://maps.app.goo.gl/Er9fynYHgxDcnTDJ9 — Monday closed; Tuesday–Saturday 9:30–19:00; Sunday 11:00–17:00. November 26, 2026 Thanksgiving closed. The holiday notice expires automatically; structured holiday data is date-scoped.
- `public/images/aurora-manicure.jpg`: existing photo downloaded through the browser from https://www.instagram.com/p/DfvIZuXgsOJ/ (slide 2).
- `public/images/jade-manicure.jpg`: existing photo downloaded through the browser from https://www.instagram.com/p/DfsJqPoEdOh/.
- Existing photo framing and branding are retained. No generated photographs are used.

Ivory/olive tokens and an editorial serif system connect the hero, service accordions, price dialog, portfolio and contact section. Google Fonts supplies Italiana and DM Sans with serif/sans fallbacks. Includes keyboard navigation, a native dialog, reduced-motion support, local image files, metadata, structured business data and a sitemap.
