# S15 — CATALOG: 6 product pages + 7 category pages

**Phase 5** · Depends on: S14 · Sources: `audit/pages/product_*.md`, `product-category_*.md` (+ `.links.md` each)

## A. Shared product page template (all 6 `/product/*`)
Layout (source order): breadcrumb-ish context (category links) → gallery (main + thumbnails; images from manifest; lightbox on click) → title → **price block**: sale shows struck original + "Original price was: …" + current + "Current price is: …" (source strings) or regular price → **quantity stepper** (− / value / +) → **Add to cart** + **Buy Now** (Buy Now = add + go to `/checkout/`) → short description (verbatim, bold runs) → SKU (e.g. `MYR-IT-254301TS`) → Categories (links to categories) → **Product Information tabs**: Description / Additional information / Reviews (n) with content EXACT from manifest (spec tables preserved as tables) → **Related products** grid → **You may also like…** (RevampCommerce has it) → Reviews tab includes comment form (rating stars, comment, author, email, consent checkbox) — demo submit, flagged; existing review(s) displayed verbatim (e.g. MYRLINK has 1 review).

### Per-product specifics
| Route | Key facts (from manifest — re-read before coding) |
|---|---|
| `/product/website-development/` | Variable product: `attribute_plan` dropdown (plan options from manifest) → price varies; description + category Website Development |
| `/product/newbiz-essentials/` | ₹30,000.00 → ₹14,499.00; SKU MYR-IT-254341TS; short desc "Classic, timeless designs to establish a strong online presence."; 4 gallery images |
| `/product/revampcommerce-lite/` | sale pair from manifest (₹60,999 → ₹24,499 context); Related + You may also like (EliteCustom) |
| `/product/elitecustom-suite/` | sale pair from manifest (₹75,000 → ₹59,499); description "Tailored designs, advanced features…" |
| `/product/digital-marketing/` | Variable: `attribute_pick-version`, `attribute_choose-plan` + quantity + add-to-cart; plans/versions from manifest |
| `/product/myrlink-ip-pbx-ip100-v3/` | ₹150,000.00 → ₹65,499.00; SKU MYR-IT-254301TS; spec table (Model MYRLINK IP100 V3, 100 users upgradable to 600, unlimited concurrent, call center features, license list…); Categories: IP PBX Solution, IT Products, PBX; 1 review section |

Variation products: selecting a variation must resolve price + enable add-to-cart (client-side from manifest options; if variation prices aren't in manifest, mark `UNVERIFIED: variation pricing` and disable add until known — never invent).

## B. Category pages (7)
Template: H1 (exact: Website Development / Website Design / Website / Digital Marketing / IP PBX Solution / IT Products / PBX) → description text if present → sort dropdown (`orderby`, `paged` GET params — implement client-side sort over catalog: menu order/price/date as source offers) → product grid of that category's products (from manifests) → empty-state text if a category has no products (source: Digital Marketing category shows its product; verify per manifest) → footer.
- `/product-category/website-development/` shows: EliteCustom Suite, NewBiz Essentials, RevampCommerce Lite, Website Development (per heading outline order).
- Sub-categories `/website/` and `/website-design/` same product set as parent (per outline) unless manifest differs.
- Pagination controls only if source shows them.

## Acceptance
- [ ] Every product page: gallery, exact prices/SKUs, tabs content, related grids.
- [ ] Quantity + add-to-cart + buy now functional; cart badge updates.
- [ ] All 7 category H1s exact; sort works (or honestly disabled if unsupported).
- [ ] Reviews form demo-flagged; existing reviews verbatim.
- [ ] No invented variations/prices/specs.
