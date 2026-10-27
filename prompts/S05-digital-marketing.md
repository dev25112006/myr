# S05 — DIGITAL MARKETING (`/digital-marketing/`)

**Phase 2** · Depends on: S00–S01 · Source: `audit/pages/digital-marketing.md` + `.links.md`

## Sections (exact order)
1. Header + Hero — "Digital Marketing Solutions to Drive Growth and Results" + intro paragraph "At MYR ADVANCE SOLUTION PVT. LTD.…" (exact).
2. **"Our Digital Marketing Services"** — service cards: Search Engine Optimization (SEO) / Digital Community (Account Handling) / Digital Community Page Post Design and Posting / Lead Generation / Ads Campaign Design — each with exact description from manifest.
3. **"Why Choose us ?"** (sic spacing) — bullets/cards verbatim; include the Twitter-intent share links present in source (`https://twitter.com/intent/tweet?text=…` — exact encoded URLs from `digital-marketing.links.md`) as share controls if they appear as such in source; otherwise preserve as inline links.
4. **Pricing "Pick Your Perfect Plan"** — CRITICAL: source contains TWO price groups with same plan names. Reproduce EXACTLY as in manifest (order, labels, prices):
   - Group 1: Standard ₹25000/mo crossed + **₹ 7999 .00**; Pro+ ₹35000/mo crossed + **₹ 16999 .00**; Custom Plan
   - Group 2: Standard ₹25000/mo crossed + **₹ 6999 .00**; Pro+ ₹35000/mo crossed + **₹ 14999 .00**; Custom Plan
   - Preserve any tabs/toggle the source uses to switch groups (check manifest for tab labels). If grouping context is ambiguous, keep both visible in source order and QA-flag (already §7.4).
   - Any plan CTAs → destinations in `digital-marketing.links.md` (add-to-cart IDs 2773–2776 or product link) — wire to cart if `add-to-cart`, else link as-is.
5. **Here to help 24/7** variant from this page + footer.

## Acceptance
- [ ] Both price groups present with exact figures ("₹ 7999 .00" spacing preserved in display copy).
- [ ] Discount badges ("up to 40%" / "SAVE …" as found) exact.
- [ ] Share links byte-identical to source URLs.
- [ ] QA note lists this page's price duplication (flag §7.4) as PRESERVED.
