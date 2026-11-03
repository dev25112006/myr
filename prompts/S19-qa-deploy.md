# S19 — 404, FULL QA, VERIFICATION CHECKLIST, DEPLOYMENT

**Phase 7** · Depends on: S00–S18 · Sources: `audit/pages/not-found.md`, `audit/inventory.json`, `analysis/WEBSITE-ANALYSIS.md`

## A. `/not-found/` + router 404
- Source 404 page content from `not-found.md` (H1/heading per manifest; includes search widget `?s=` + partner/footer chrome). Implement as the catch-all route (also serves `/services/web-development/` which is 404 in original — verify via inventory).
- Working demo search (client-side index) + "Back home" style CTA only if present in source (otherwise no invented CTAs — use source wording).

## B. Automated verification checklist (make it runnable)
Add `npm run verify` (script `scripts/verify.mjs`):
1. **Route coverage:** every route in `audit/inventory.json` appears in the router manifest (imported `src/app/routes.ts` or sitemap array) — fail on missing.
2. **Link audit:** crawl built `dist/` (or source files) → collect all `href`s:
   - internal `/…` targets must exist in route manifest (allow query/anchor) — report dead internal links (expected known: `/product-category/networking-devices/`, `/#E-Commerce` mapping, `#` dead links → must be on the QA allowlist with flag IDs).
   - external links must match the audit allowlist (3cx, wa.me, socials, jetcrm, mailto, twitter intents).
3. **Content spot-checks:** assert presence of exact strings (prices `₹14,499`, `₹24,499`, `₹59,499`, `₹65,499.00`, `₹11,988.00`, claims `9,000+`, `250,000`, office typo `Contarcting`, `needS`, `Intregation`) on their routes — ensures flags preserved.
4. **Form inventory:** each source form (from `inventory.json`) maps to a rendered `<form>`/`SmartForm` on its route — report missing.
5. **Build gate:** `npm run build` must succeed (TS + bundling).

## C. Manual QA pass (record results in `analysis/PHASE-REPORT.md`)
- Responsive: 360 / 768 / 1024 / 1440 on: home, services, website-development, tech-store, product, checkout, contact, privacy, crm-dashboard, 404.
- Interactions: off-canvas, login popup, partner popup, cart add/remove/deep-link, checkout demo order, FAQ accordions, sliders/marquee, all external CTAs (open in new tab), mailto links.
- A11y: keyboard nav, focus states, alt text on content images, form labels, `prefers-reduced-motion`.
- SEO: `<title>` + meta description per route (from `inventory.json` title/meta fields — preserve originals incl. quirks; QA-note odd ones like checkout title "Cart").
- Flags report: restate all 12 items from `analysis/WEBSITE-ANALYSIS.md` §7 with status PRESERVED + the UNVERIFIED list from §8 with status (demo/placeholder implemented where).

## D. Deployment instructions (deliver in `DEPLOY.md`)
- `npm run build` → static `dist/` deployable to Netlify/Vercel/any static host.
- SPA rewrite rule required: all paths → `/index.html` (provide `public/_redirects` for Netlify and `vercel.json` for Vercel; plus generic nginx snippet).
- Environment: no secrets required (no API keys in build — verify none present; grep dist for `key|secret|token`).
- Post-deploy smoke: `/`, `/tech-store/`, `/checkout/`, a product, a policy, a panel, unknown route → 404 page.

## Acceptance to declare DONE (per MASTER: no "complete" claim while anything verified is missing)
- [ ] `npm run verify` passes (0 unexpected failures; allowlist documented).
- [ ] All 56 routes visited manually-or-scripted with screenshots/notes in PHASE-REPORT.
- [ ] Flags §7 + unverified §8 reported with statuses.
- [ ] DEPLOY.md written and build reproducible.
