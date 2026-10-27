# S14 — STOREFRONT: `/tech-store/` + `/shop/`

**Phase 5** · Depends on: S00, S16-cart API (CartContext from S00; checkout flow validated with S16 — build S16 first within the phase) · Sources: `audit/pages/tech-store.md`, `shop.md` (+ `.links.md`)

## Sections for `/tech-store/` (primary store)
1. Header (store variant with search + cart) + **category nav**: Website Development → `/product-category/website-development/`; PBX → `/product-category/pbx/`; IT Products → `/product-category/it-products/`; IP PBX Solution → `/product-category/ip-pbx/`; Digital Marketing → `/product-category/digital-marketing/` (exact labels).
2. **Search control** — client-side demo search over catalog (same pattern as S13), labeled demo (original is WP search `?s=`).
3. **Hero slider banners** (auto-rotating + manual controls) — exact slide texts + destinations:
   - "Transforming Your Vision into a Digital Reality with Speed and Precision" + **Choose Plan** → `/product/website-development/`
   - "Your Business, Your CRM – Tailored for Success." + **Sign Up** → per manifest (jetcrm or product — follow link)
   - "Digital Marketing Solutions to Drive Growth and Results" + **Choose Plan** → `/product/digital-marketing/`
   - "Your Business, Connected: Advanced IP PBX for Smarter Communication" + **Buy Now** → `/product/myrlink-ip-pbx-ip100-v3/`
4. **Promo/deal banners** (exact prices + CTA targets):
   - "UP TO 70% OFF DEAL" → `/product-category/it-products/`; "Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs" ₹30,000.00 → ₹11,988.00 + **BUY NOW** → `add-to-cart=2765` (via cart → `/checkout/`) [price-diff flag §7.3 preserved]
   - "Streamline Your Calls: One Number for All Your Customers!" / "Buy MYRLINK IPBX Now and Transform Communication" ₹150,000.00 → ₹65,499.00 + **BUY NOW** → `add-to-cart=3056`
   - duplicated banner variants in source (appears twice) — preserve if layout shows carousel duplicates; QA note.
5. **Category tiles** — Digital Marketing Plans → `/product/digital-marketing/`; CCTV Solution → `/tech-store/` (source self-link — preserve + flag); Network Product → `/product-category/networking-devices/` (404-flagged route: register route → 404 behavior, flag); PBX & IP Telephone → `/product-category/it-products/`. Copy: "Your Vision, Our Code –**Website Development**", "Effortless Connectivity, Delivered Fast – Buy **MYRLINK IPBX Now**" etc. exact.
6. **Product grid** — cards from S15 catalog data: Website Development (From ₹14,499.00, "Sale!", Select options), NewBiz Essentials, RevampCommerce Lite, EliteCustom Suite, Digital Marketing, MYRLINK IP PBX IP100 V3 (+ any others listed in manifest). Card: image, category eyebrow, name link, price (sale pair), CTA (Select options/Add to cart per source text).
7. Support/CTA strips present in manifest (e.g. "Connect Smarter, Communicate Better – Upgrade to IP Telephony Today!", "Smart Networking Devices") + footer.

## `/shop/`
- Same store experience (source is a variant: titles identical; footer form posts to `/tech-store/`). Implement `/shop/` as the same component (with search widget per manifest) — record any differences found in `shop.md` (e.g. extra blocks) — do not drop them.

## Rules
- All prices EXACT (`₹11,988.00`, `₹14,499.00`, `₹65,499.00` formats per source).
- BUY NOW/add-to-cart must update CartContext and lead to `/checkout/` with item — matching source semantics `checkout/?add-to-cart=ID&quantity=1`.

## Acceptance
- [ ] 5 category links + slider + deals + tiles + grid all present with exact text/prices.
- [ ] Cart flow works from every BUY NOW (id mapping: 2765, 3056, others per catalog).
- [ ] `/shop/` renders full store (no redirect) and matches `/tech-store/` content.
- [ ] Dead/404 destinations flagged but reproduced per source.
