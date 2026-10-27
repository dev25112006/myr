# S11 — ABOUT (`/about-us/`) + ROADMAP (`/roadmap/`)

**Phase 4** · Depends on: S00–S01 · Sources: `audit/pages/about-us.md`, `roadmap.md` (+ `.links.md`)

## A. `/about-us/` sections (exact order)
1. Header + Hero — "Advancing Technology, Enhancing Businesses" (2-line display) + hero image.
2. **About Us / Our Journey** — founded 2016 paragraph (bold runs preserved) + second paragraph ("With a strong foundation…") + image(s).
3. **Who We Are** — two paragraphs + **read more** → popup (Elementor 2107): popup content is unverified → implement modal containing ONLY additional sourced text if any exists in manifest; else the control reveals the full text already on page and is flagged `UNVERIFIED: popup 2107 content`. Record choice in QA.
4. **Our Journey timeline** — 9 milestones 2016→2024: The Beginning / Expanding Horizons / Rebranding and Growth / Entering New Markets / Adapting to Change / Enhancing Client Solutions / Building Strategic Partnerships / Leading with Innovation / Commitment to Excellence — body paragraphs verbatim (include founders sentence for 2016).
5. **Our Strengths** — 6 items (Innovative Solutions / Expert Team / Comprehensive Services / Client-Centric Approach / Adaptability / Commitment to Excellence) with their 6 description paragraphs matched in source order (tabs in source; rebuild as tabs or accordion — content identical).
6. **Thousands of satisfied customers** — subline + 3 testimonials (Rakesh Kumar – Shopping Mart Owner; Sneha Kapoor – Boutique Owner; Dr. Kavita Rao – Dental Clinic Owner) verbatim + **Read more reviews** (source `#` → dead-link treatment + QA flag).
7. **Here to help 24/7** — this page's copy + dual CTAs: **Talk to sales** → `https://1367.3cx.cloud/myrsolution`, **Live Chat** → `https://1367.3cx.cloud/myradvancesolutionpr`.
8. **Our Values / Our Team / Our Products and Services / Our Commitment / Looking Ahead** — full text sections per manifest (Team members: Rakesh Kumar, Sneha Kapoor, Dr. Kavita Rao with roles; ensure images/roles exact).
9. Footer.

## B. `/roadmap/`
- Structure per manifest: page titled "Roadmap", contains search widget (`/?s=&post_type=` GET) + "Advice and answers from the Customer Success Team" knowledge/roadmap content.
- Rebuild: page header "Roadmap", working search field (client-side filter over an index of site routes/services built from inventory — honest "searches this site" behavior; label as demo if original WP search backend unverified), then the roadmap/content items EXACTLY as they appear in `roadmap.md` (if the manifest is thin, render sourced items only and flag `UNVERIFIED: roadmap items are server-rendered search/knowledge content` — do not invent roadmap entries).

## Acceptance
- [ ] Timeline 9/9 with exact year+title+body.
- [ ] Strengths: 6 items with correct paragraph pairing.
- [ ] Testimonials exact; dead links handled per S01 convention.
- [ ] Roadmap contains zero invented items.
