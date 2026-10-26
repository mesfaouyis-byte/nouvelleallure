# Project architecture

NOUVELLE ALLURE is a Moroccan fashion storefront. React 19 + TypeScript, TanStack Start file routing/SSR, Vite and Tailwind/custom CSS run on Netlify. Preserve the luxury editorial ivory/black/beige identity, Cormorant/DM Sans typography, mobile layouts and Arabic RTL.

## Key directories

- `src/routes/__root.tsx`: metadata, SSR document, StoreProvider and Layout.
- `src/routes/index.tsx`: branded homepage.
- `src/routes/$.tsx`: validated storefront/content route dispatcher and route SEO; unknown paths return notFound.
- `src/components/Store.tsx`: cart/language context, local persistence, shell, product cards, consent and translated literal T component.
- `src/components/Pages.tsx`: search/filter/sort catalog, product detail/gallery, cart, COD checkout, confirmation, policies.
- `src/data/products.ts`: source-managed sample catalog/categories, shared by frontend and authoritative backend.
- `src/lib/config.ts`: centralized WhatsApp, shipping, origin and demo settings. Do not scatter contact numbers or fees.
- `src/lib/translations.ts`, `src/lib/info-ar.ts`: Arabic copy. Use React-owned text nodes, not DOM translation mutation.
- `src/lib/analytics.ts`: blank public IDs; consent-gated provider integration. Never add fake IDs or purchase events.
- `netlify/functions/orders.mts`: POST-only validated order persistence; recomputes prices/shipping server-side, verifies options, caps quantities and uses a unique request UUID for retries. No public order read API.
- `db/schema.ts`, `drizzle.config.ts`, `netlify/database/migrations`: Drizzle beta + @netlify/database schema/migrations. Generate a migration with every schema change. Do not alter deployed migrations.
- `public/img`: generated original sample photos; serve with the Image CDN helper. `public/logo*.svg`: original logo assets.

## Conventions and decisions

Keep browser APIs inside effects/handlers for SSR. The generated route tree belongs to TanStack tooling, not manual edits. Keep order confirmation dependent on a successful API response. Only contact the customer through explicitly requested user actions; no notifications or messaging are automatically sent. No card payment provider is used. Guest assistance is deliberately not a fabricated login flow.

The entire catalog is demonstrative, stock is unknown and orders are flagged as demo. Never invent reviews, availability, fulfillment, Instagram handles or legal identity. Product-level configured stock is checked but not reserved/decremented; do not claim real-time inventory management. Full multiple-angle imagery and variant-level stock await real catalog data. Administration uses authorized source edits and Netlify's authenticated database console, documented in README; there is no public admin dashboard. If adding one later, use Netlify Identity with verified authorization on every privileged backend action.

Protect personal data: do not log request bodies or expose order lists publicly. Never print secrets or place credentials in frontend code. Analytics remains disabled until real IDs and consent are configured. Maintain French and Arabic content when editing policies. Update sitemap/robots after catalog/domain edits.

Build/test restrictions for a given run override generic workflow: this implementation was source-reviewed without running local validation; deployment verification remains necessary. See README for manual verification cases and launch preparation.
