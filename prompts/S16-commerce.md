# S16 — COMMERCE: `/cart/`, `/checkout/`, `/my-account/`

**Phase 5** · Depends on: S00 (CartContext/AuthProvider) · Sources: `audit/pages/cart.md`, `checkout.md`, `my-account.md` (+ `.links.md`)

## A. `/cart/`
- H1 "Cart".
- **Cart table**: product (thumbnail/name link), price, quantity stepper (updates live), subtotal, remove. Data from CartContext (persisted).
- Coupon field ONLY if source shows it (check manifest — if present, implement honestly: accept nothing backend → disable with note `UNVERIFIED: coupons require server`).
- Totals block (subtotal/shipping/total as per source; shipping/tax logic: if source shows, present labels; values come from demo config — flag).
- **Proceed to checkout** → `/checkout/`.
- **Empty cart state**: source text (find "Your cart is currently empty." variant in `cart.md`) + **Return to shop** button → `/tech-store/`.
- Supports `?add-to-cart=ID&quantity=1` deep links (registered for `/checkout/` too): adds item then renders target page.

## B. `/checkout/`
- H1 per source (`<title>` quirk says "Cart"; page heading from manifest — preserve source heading, flag title quirk).
- Two-column: **Billing details** form — fields from manifest (first name, last name, company name (optional), country dropdown, street address, town/city, state, postcode, phone, email, account password (if present), order notes textarea). Exact labels/placeholder text from `checkout.md`.
- **Your order** summary table from CartContext (product, subtotal; shipping methods if in source; totals).
- Payment section: use PayU India hosted checkout when merchant credentials are configured. The server calculates the amount, signs the form, verifies the PayU response and confirms payment with PayU before marking the order paid. Without credentials, accept an order request only; never simulate a successful charge or collect card details.
- "Please enable JavaScript…" inline validation message equivalent (source WPForms note) where forms exist.
- Empty cart → redirect/handle like source (checkout with empty cart shows notice — reproduce notice text from manifest if present).

## C. `/my-account/`
- H1 "My account".
- **Login tab**: username or email*, password*, remember me, **Log in**, "Lost your password?" (source link → `/my-account/lost-password/` — route NOT in sitemap: register route rendering a password-reset demo form (WP: "Please enter your username or email address…" — text from WC standard only if found in manifest; otherwise honest minimal reset form + flag `UNVERIFIED: lost-password page`).
- **Register tab**: email*, explanation text verbatim ("A link to set a new password will be sent to your email address." + personal-data/privacy sentence linking `/privacy-policy/`), **Register** button.
- Auth demo via AuthProvider: on success show account dashboard-lite (Orders section placeholder: empty state text from source if present — orders are server-side `UNVERIFIED`). Never store real passwords (demo only, localStorage flag).
- Page-level contact form if present in manifest (fields 1,4,2,3,6,5,7[],8) — include as source does.

## Acceptance
- [ ] Deep-link `add-to-cart` works on both cart & checkout routes.
- [ ] Qty/remove/totals live-update; persistence across reload.
- [ ] Checkout validation complete (required billing fields) before demo order state.
- [ ] Payment honesty: no card fields, clear DEMO labels, QA flag.
- [ ] Login/register demo works and updates header state; logout works.
- [ ] Empty-cart text matches source.
