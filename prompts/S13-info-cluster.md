# S13 — INFO CLUSTER: how-we-help, our-products-benefit, knowledge-base, lets-keep-in-touch, evercompare

**Phase 4** · Depends on: S00–S02 · Sources: `audit/pages/<route>.md` + `.links.md` for each

## 1. `/how-we-help-your-business/`
- H1 "How We Help Your Business !" + page content verbatim (benefit/support sections from manifest).
- Working site search widget (GET `/?s=`) if present → route to a demo search results behavior (client-side index of routes; labeled demo) — same approach as roadmap search.
- **"Here to help 24/7"** block (page variant) + FAQ section "Advice and answers from the Customer Success Team" (page variant — this is the same knowledge teaser used on roadmap).

## 2. `/our-products-benefit/`
- H1 "How Our Products Benefit Your Business !" + sections per manifest, including the benefit groups found there: **IT Infrastructure Solutions** etc. and bullets like Improved Customer Relationships: / Scalability: / Cost-Effectiveness: / Innovation and Growth: — exact pairing of heading→body from `our-products-benefit.md`.
- Search widget + support/knowledge teaser blocks present in source — same treatment as above.

## 3. `/knowledge-base/`
- H1 "Knowledge Base" — source body contains only the H1 (articles are plugin-rendered; `UNVERIFIED: KB articles`).
- Rebuild: Knowledge Base page with the H1 + a **search-first UI** offering honest client-side results over site routes/FAQs (built from inventory + FAQ sets), plus category tiles ONLY if sourced. Do not invent articles. Add small "Demo — original loads articles after login/plugin (UNVERIFIED)" note; flag in QA.

## 4. `/lets-keep-in-touch/`
- H1 "Let's Keep In Touch" + content from manifest (keep-in-touch/newsletter section). If a subscribe form exists in manifest → fields exactly, demo submit. Nothing invented beyond sourced text.

## 5. `/evercompare/`
- H1 "EverCompare" + `[evercompare_table]` shortcode (client-rendered; `UNVERIFIED: table rows`).
- Rebuild: page + comparison table structure — **only** if row data exists in manifest; otherwise render a clearly-labeled placeholder panel: "Comparison table loads from plugin (UNVERIFIED)" + QA flag. No fabricated spec rows.

## Acceptance
- [ ] Each route renders its exact H1/title.
- [ ] Search widgets behave consistently with S11 roadmap approach (same component).
- [ ] KB/EverCompare placeholders honest, visible, flagged — never fake data.
