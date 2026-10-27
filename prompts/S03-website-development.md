# S03 — WEBSITE DEVELOPMENT (`/website-development/`)

**Phase 2** · Depends on: S00–S01 · Source: `audit/pages/website-development.md` + `.links.md`

This is the highest-value service/sales page (target of nav item "Launch Your Website").

## Sections (exact order per manifest)
1. Header + **Hero** — "Grow Your Brand with Expert Website Development + Marketing Solutions" (+ supporting text/images exactly as in manifest).
2. **Pricing — "Pick your perfect plan"** — 3 plans (same data as S01 PricingPlans: NewBiz ₹ 14,499 / RevampCommerce ₹ 24,499 MOST POPULAR / EliteCustom ₹ 59,499; Save 51%/60%/20%; renewal notes; "What you get:"/"All the benefits…" feature lists verbatim from THIS page's manifest — may differ slightly from homepage; page text wins here) + **Choose plan** → add-to-cart 2765/2766/2767 → `/checkout/`.
3. **"Compare our plans" / `#viewallfeatures`** — the comparison feature table (anchor MUST be id `viewallfeatures`; header CTA and homepage "View all features" land here). Row content from manifest (`---|---|---|---` table lines).
4. **"Included with every plan"** — 5 items: Website Development / Total security / 99.9% uptime. Guaranteed / A single, simple dashboard / 24/7 customer support (exact labels; icons = your icon set).
5. **Testimonials A** — Rohan Malhotra, Ananya Desai, Vikram Singh (quotes from manifest).
6. **"Trusted by 3K+ website owners"** + story cards: Amit & Neha Khanna (Co-Founders of UrbanCraft Designs), Rajesh Verma (Marketing Head at Digital Nexus), Priya Sharma (Founder of Ethnic Elegance (E-commerce Business)) — exact quotes.
7. **"24/7 support for your website's success."** support block variant (copy from manifest; CTA link as in source).
8. **Website Development (FAQs)** — 6 questions from THIS page: How long does it take to build my website? / Do you offer custom website designs? / Will my website be mobile-friendly? / Can I update my website after it's live? / Do you offer SEO optimization? / What if I need support after my website is launched? — answers verbatim from manifest.
9. Footer.

## Acceptance
- [ ] `#viewallfeatures` anchor works from homepage and in-page.
- [ ] Prices/savings/renewal notes exact; cart wiring identical to S01.
- [ ] FAQ set = this page's 6 (not the 5 global FAQs).
- [ ] 3K+ claim preserved (do not reconcile with 9,000+ elsewhere — flag already exists).
