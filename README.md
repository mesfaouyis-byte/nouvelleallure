# NOUVELLE ALLURE

A Moroccan fashion boutique built with React 19, TypeScript, TanStack Start routing and SSR, Vite, Tailwind CSS/custom CSS, Lucide icons, Netlify Functions, and Netlify Database with Drizzle ORM. French and Arabic interfaces include RTL layout. Original generated editorial photography is stored in `public/img` and served through Netlify Image CDN. The original typographic logo and monogram are available as SVG assets.

## Current status

This is an explicitly labelled demonstration collection, with illustrative prices and unknown inventory (`stock: null`). Checkout saves **test requests** to a real database; it does not trigger shipping, payment, or fulfillment. There are no fabricated customer reviews, sales rankings, social accounts, or stock claims. The account icon opens guest-order assistance, not an authentication screen. There is no public admin dashboard.

## Local development

Use Node 22.13+ or Node 24 and pnpm. Run `pnpm install`, then `netlify link` to select your project and `netlify dev --port 8889`. Netlify development provides the function and image-CDN environment; plain Vite does not emulate these. Do not copy credentials into frontend configuration. Production builds use `pnpm run build`, managed by Netlify.

## Deploy and custom domain

Connect this repository to Netlify and deploy the main branch. The included `netlify.toml` configures the build and publishes `dist/client`; the TanStack adapter handles SSR routes, including direct links. Functions live in `netlify/functions`. No SPA catch-all redirect is required. The database provisions automatically on first connection and the included migration creates the orders table during deployment.

In Netlify Domain management, add your custom domain, follow the displayed DNS records or switch to Netlify DNS, then enable HTTPS and choose the primary domain. Update the store origin, sitemap URLs, and robots sitemap URL to your primary domain. Submit the sitemap to search engines after replacing the sample catalog.

## Managing the catalog securely

This project uses the documented source-editing alternative to a full admin dashboard. Only authorized repository collaborators can edit products and deploy changes. Keep repository access restricted and protect the main branch.

Edit `src/data/products.ts` to manage category slugs, French/Arabic names, product names/descriptions, SEO copy, MAD prices, optional `regularPrice`, `images`, colors and hexadecimal swatches, sizes, `stock`, `isNew`, `best`, and `sample`. Sizes 36–41 are configurable for shoes. New categories automatically appear in navigation and filters. Images are file stems under `public/img` (without `.png`); use actual distinct photos for multiple views. The existing duplicate gallery images are clearly disclosed sample illustrations. Product IDs are stable URL slugs. The first entries in the source array are the newest; reorder entries when publishing arrivals. Best selections are editorial selections, not asserted sales data.

`stock: null` means unknown, 0 disables adding the item, and a positive integer displays the configured availability and validates each order line. **There is no automatic inventory reservation or decrement**: manage inventory manually when confirming COD requests, or add transactional variant inventory before selling limited stock at volume. Inventory is product-level, not separately counted per color/size. Source edits affect frontend and authoritative server pricing together after deployment. Orders retain their item/price snapshot.

## Managing orders

There is no endpoint that publicly lists orders. Open your site's Database section in the authenticated Netlify dashboard, then use its database explorer or the secure SQL connection details provided there with an authorized PostgreSQL client. Restrict access to staff and never put those credentials in the app. The `orders` table holds UUID reference, contact and address, JSON item/variant snapshots, totals, status, demo flag, and creation date.

For example, in an authenticated SQL editor:

```sql
SELECT id, name, phone, city, items, total, status, demo, created_at
FROM orders ORDER BY created_at DESC LIMIT 100;
```

After contacting the customer, update only the matching order UUID using a parameterized query:

```sql
UPDATE orders SET status = 'confirmed' WHERE id = $1;
```

Suggested statuses are pending, confirmed, dispatched, delivered, cancelled. Restrict database writes to trusted staff. Do not expose an unauthenticated order lookup or export. Define a retention period and remove test requests before launch. Never ship records marked `demo = 1`.

## Branding, delivery, and contacts

- `src/lib/config.ts`: the single source for WhatsApp number/link, delivery fee (demo: 35 DH), free-delivery threshold (demo: 699 DH), demo flag, domain, formatting, and inquiry text.
- `src/components/Store.tsx`: live typographic logo, shared navigation, footer, consent and cart state.
- `public/logo.svg`, `public/logo-mark.svg`: original downloadable logo/monogram assets and favicon.
- `src/styles.css`: visual identity, typography, breakpoints and RTL styling.
- `src/routes/index.tsx`: homepage sections and hero copy.
- `src/routes/__root.tsx`: sharing title/description, global head and shell; no custom og:image is set.
- `src/components/Pages.tsx`, `src/lib/info-ar.ts`, `src/lib/translations.ts`: page copy and Arabic translations. Some product names and identifiers remain French by design.
- `public/sitemap.xml`, `public/robots.txt`: keep in sync with categories, products and domain after edits.

The homepage has a social inspiration section without inventing an Instagram account. Add your verified profile link when available. WhatsApp product inquiries are prefilled in French and include the selected variant.

## Analytics and consent

Add **public tracking IDs only** to `src/lib/analytics.ts`: `google`, `meta`, `tiktok`. Leave IDs blank to disable tracking. Nothing loads before opt-in. The consent banner offers accept/refuse; Cookies in the footer reopens it. Consent is stored on the device, and the integrations initialize only after approval. Revocation sends available provider consent signals, disables Google tracking and clears known first-party analytics cookies; review each vendor's current consent requirements and policy before enabling. No purchase events are invented or emitted for test orders. No secrets belong in VITE variables.

## Commercial launch preparation

Replace all illustrative products, photos, prices, descriptions and unknown stock with your real catalog. Publish your actual delivery fees and times, return/refund policy, legal business identity and privacy retention/contact information in both languages. The existing policies explicitly explain the demonstration state rather than inventing legal or operational terms. Set `store.demo` to false only after adjusting demonstration notices in the UI and policies; do not merely hide notices while retaining sample items. For production inventory operations, implement transactional inventory as described above. Add genuine reviews and your real social profile only when supplied.

## Verification

Source files, request validation, pricing calculations, links, migration and responsive rules were reviewed. No build, development server, browser testing or live database test was run in this session; the platform validates builds after edits. Do not treat the implementation as an executed end-to-end test.

After deployment, verify `/`, `/boutique`, all seven `/categorie/:slug` routes, all `/produit/:id` routes, `/panier`, `/commander`, `/confirmation`, `/a-propos`, `/contact`, `/faq`, `/livraison-retours`, `/confidentialite`, `/conditions`, `/compte`, and an unknown URL. Check phone and tablet layouts, French/Arabic switching, gallery zoom and thumbnails, variant requirements, every filter, search, price sorting, quantity/removal, persistence, empty states, and the WhatsApp destination. Inspect 349 × 2 = 698 DH plus 35 DH shipping = 733 DH; 349 + 599 = 948 DH has free shipping. Submit a test order with valid contact data, verify its row in Database and `demo = 1`, then test invalid variants/phone, server failures and retry idempotency. A failed save must not display confirmation or clear the cart. Test consent both before and after adding real tracking IDs.
