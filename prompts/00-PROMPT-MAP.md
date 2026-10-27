# PROMPT MAP — which prompt builds what

Read order: `MASTER.md` → this map → the segment file (S00–S19) → the referenced `audit/pages/*.md` manifests.

## How to use
1. Each segment prompt is **self-contained**: it lists its routes, source manifests, section spec, interactions, and acceptance checklist.
2. A segment's **content source is always** `audit/pages/<route>.md` + `<route>.links.md`. Never re-scrape, never invent.
3. Execute segments in the **phase order** below. A segment may only start when its `Depends on` entries are complete.
4. After each phase: run the app, verify routes (see `S19` checklist), and append results to `analysis/PHASE-REPORT.md`.

## Segment → routes → source files → phase

| ID | Segment prompt file | Routes built | Source manifests | Phase | Depends on |
|----|--------------------|--------------|------------------|-------|------------|
| S00 | `prompts/S00-foundation.md` | (shell only; all routes mount here) | `analysis/WEBSITE-ANALYSIS.md` §3 | 1 | — |
| S01 | `prompts/S01-homepage.md` | `/`, `/myr/` | `audit/pages/home.md`, `myr.md` + `.links.md` | 1 | S00 |
| S02 | `prompts/S02-services-hub.md` | `/services/` | `audit/pages/services.md` | 2 | S00–S01 |
| S03 | `prompts/S03-website-development.md` | `/website-development/` | `audit/pages/website-development.md` | 2 | S00–S01 |
| S04 | `prompts/S04-crm-development.md` | `/crm-development/` | `audit/pages/crm-development.md` | 2 | S00–S01 |
| S05 | `prompts/S05-digital-marketing.md` | `/digital-marketing/` | `audit/pages/digital-marketing.md` | 2 | S00–S01 |
| S06 | `prompts/S06-network-solution.md` | `/network-solution/` | `audit/pages/network-solution.md` | 3 | S00–S02 |
| S07 | `prompts/S07-ipbx-solution.md` | `/ipbx-solution/` | `audit/pages/ipbx-solution.md` | 3 | S00–S02 |
| S08 | `prompts/S08-cctv-solution.md` | `/cctv-solution/` | `audit/pages/cctv-solution.md` | 3 | S00–S02 |
| S09 | `prompts/S09-1800-number.md` | `/1800-number/` | `audit/pages/1800-number.md` | 3 | S00–S02 |
| S10 | `prompts/S10-privyr.md` | `/privyr/` | `audit/pages/privyr.md` | 3 | S00–S01 |
| S11 | `prompts/S11-about-roadmap.md` | `/about-us/`, `/roadmap/` | `audit/pages/about-us.md`, `roadmap.md` | 4 | S00–S01 |
| S12 | `prompts/S12-contact-cluster.md` | `/contact-us/`, `/talk-to-sales/`, `/booking/` | `audit/pages/contact-us.md`, `talk-to-sales.md`, `booking.md` | 4 | S00–S01 |
| S13 | `prompts/S13-info-cluster.md` | `/how-we-help-your-business/`, `/our-products-benefit/`, `/knowledge-base/`, `/lets-keep-in-touch/`, `/evercompare/` | matching `audit/pages/*.md` | 4 | S00–S02 |
| S14 | `prompts/S14-storefront.md` | `/tech-store/`, `/shop/` | `audit/pages/tech-store.md`, `shop.md` | 5 | S00, S16-cart |
| S15 | `prompts/S15-catalog.md` | 6 × `/product/*`, 7 × `/product-category/*` | matching `audit/pages/product_*.md`, `product-category_*.md` | 5 | S14 |
| S16 | `prompts/S16-commerce.md` | `/cart/`, `/checkout/`, `/my-account/` | `audit/pages/cart.md`, `checkout.md`, `my-account.md` | 5 | S00 (cart context) |
| S17 | `prompts/S17-legal-forms.md` | `/privacy-policy/`, `/shipping-policy/`, `/terms-and-conditions/`, `/refund-and-return-policy/`, `/refund-request-form/` | matching `audit/pages/*.md` | 6 | S00 |
| S18 | `prompts/S18-panels-demo.md` | `/crm-dashboard/`, `/my-leads/`, `/crm-reports/`, `/crm-tasks/`, `/my-profile/`, `/import-leads/`, `/crm-login/`, `/team-chat/`, `/team-panel/`, `/customer-panel/` | matching `audit/pages/*.md` | 6 | S00 |
| S19 | `prompts/S19-qa-deploy.md` | `/not-found/`, site-wide QA, verification checklist, deployment | `analysis/WEBSITE-ANALYSIS.md` (all), `audit/inventory.json` | 7 | everything |

## Phase plan (numbered working method required by MASTER)

| Phase | Segments | Outcome |
|-------|----------|---------|
| **Phase 1 — Foundation** | S00, S01 | Runnable app; design system; header/footer/popups/cart/auth shared components; homepage live with all 14 sections |
| **Phase 2 — Service core** | S02, S03, S04, S05 | Services hub, website dev (pricing), CRM dev, digital marketing |
| **Phase 3 — Service extended** | S06, S07, S08, S09, S10 | Network, IPBX, CCTV, 1800 number, Privyr |
| **Phase 4 — Company & info** | S11, S12, S13 | About/roadmap, contact cluster, info pages |
| **Phase 5 — Commerce** | S16 → S14 → S15 | Cart context, storefront, product/category pages (order matters: cart before store CTAs) |
| **Phase 6 — Legal & panels** | S17, S18 | Policies + refund form, panel demo UIs |
| **Phase 7 — Verification** | S19 | 404, full link/route check, responsive pass, flags report, deployment instructions |

## Shared components contract (defined in S00, reused by every segment)

| Component | Used by | Contract |
|-----------|---------|----------|
| `<SiteHeader>` | all | primary/inner nav variants, off-canvas All Services, cart button, login popup trigger |
| `<SiteFooter>` | all | brand blurb, 3 link columns, Partner popup trigger, socials, copyright |
| `<PartnerFormPopup>` | all | exact fields from §3.5 of analysis |
| `<LoginRegisterPopup>` | all | WooCommerce-style login/register demo auth |
| `<SupportBlock>` | S02–S10 | "Here to help 24/7" + 3cx CTA |
| `<FaqAccordion>` | S01, S02, S03 | per-page FAQ sets (wording differs per page — use page manifest) |
| `<PricingPlans>` | S01, S03 | plan cards + `?add-to-cart` behavior |
| `<SectionHeading>` `<Reveal>` `<CountUp>` | all | animation system (design freedom) |
| `<StatCounters>` | S01, S02 | Team Member/Efficiency/Happy Clients/Countries |
| `<PartnersMarquee>` | S01 | 15 partner logos |
| `<TestimonialCard>` | S01, S03, S11 | story cards |
| `<ContactForm>` (config-driven) | S04, S09, S11–S13, S17 | per-page field config from `.links.md` |
| `<ProductCard>`, `<CartContext>` | S14–S16 | catalog data from product manifests, prices exact |
| `<PanelLayout>` | S18 | demo sidebar shell |

## Content rules reminder (from MASTER)
- Exact source text; flags preserved; unverified marked `UNVERIFIED:` in code + QA report.
- Dead links in original (`#`) → preserve destination meaning: render as non-navigating control with same label, note in QA.
- External destinations (3cx, wa.me, socials, jetcrm, rzp.io) keep exact URLs.
- Images: download to `public/assets/` (preferred) or hot-link the original CDN URLs during dev — record choice in QA.
