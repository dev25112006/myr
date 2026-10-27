# S01 — HOMEPAGE (`/` and `/myr/`)

**Phase 1** · Depends on: S00 · Source of truth: main page scrape from `https://www.myradvancesolution.com/`

## Mission
Build the complete homepage with all 14 sections in source order, exact source text, all CTAs wired to verified destinations, animated stats, marquee, testimonials, FAQ accordion, and the pricing block feeding the cart flow.

## Sections (build in this exact order)

1. **Basmala strip** — `(بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ) (ماشاء الله لا ولا قوة إلا بالله)` — styled as an elegant serif/Arabic line (RTL-correct render, preserve parentheses).

2. **Hero** — H1-equivalent "IT Products. Solutions. Services."; paragraph starting "At **MyR Advance Solution,** we specialize in delivering cutting-edge IT solutions to enhance business operations and support individuals. Our services include PBX & IP-PBX systems, CCTV security, CRM development, website design, networking, cloud computing, mobile apps, data analytics, digital marketing, VoIP solutions, and a comprehensive range of IT hardware products. With our expertise, we ensure seamless connectivity, security, and efficiency. Partner with us for reliable and innovative technology solutions tailored to your needs."; CTA **Shop Now** → `/tech-store/`; hero image (`website-front-hero-image.png`).

3. **Animated stats** — Team Member / Efficiency / Happy Clients / Countries; count-up from 0 (source displays "0 +", "0 %" placeholders because of JS counters — rebuild as meaningful count-up; **labels exact**; numeric targets: use values from source page if hardcoded in HTML, otherwise count to the same suffix pattern — if target values are not in the manifest, mark `UNVERIFIED: counter targets` and use 0→label only with suffix `+`/`%` per label; do NOT invent big numbers).

4. **Basmala strip #2 + "Our Core Services"** — subline "we aim to meet all your technological needs and drive your business towards success in the digital age." + 7 service cards (title + exact blurb + badges: Web Development "UPTO 60% OFF", Digital Marketing "UPTO 70% OFF", IPBX "UPTO 60% OFF"; card links per `home.links.md`). Section decorations: `ipbx-768x644-1.png`, `it-expert-2.png` if present in layout.

5. **"Who We Are"** — two blocks, exact paragraphs (preserve odd casing "needS", "we"), bullet "Let MyR Advance Solution be your trusted IT partner, helping you stay ahead with reliable, high-performance, and future-ready technology." CTA **Contact Us Now** → `/contact-us/`.

6. **"About our mission, values, and commitment"** — intro paragraph + Mission/Values/Commitment bullets (homepage wording) + closing paragraph + CTA **Know More** → `/about-us/`; image `buy-toll-free-number-768x644-1.png` present in source layout.

7. **"Exclusive Website Pricing" / "Pick Your Perfect Plan"** — 3 plan cards driven by `PricingPlans`:
    - NewBiz Essentials — badge "Save 51%", ₹ 14,499 (was ₹ 30,000), note "₹599.00/mo when you renew hosting\*", 3 bullets, "What you get:" list (1 Year Free Hosting, Unlimited SSL, Weekly backups), CTA **Choose plan** → `/checkout/?add-to-cart=2765&quantity=1`
    - RevampCommerce Lite — "MOST POPULAR", "Save 60%", ₹ 24,499 (was ₹ 60,999), "₹1649.00/mo…", "All the benefits of NewBiz, plus:" (Domain included (₹749.00 value), Payment Gateway Integration, E-Commerce Functionality) → `add-to-cart=2766`
    - EliteCustom Suite — "SAVE 20%", ₹ 59,499 (was ₹ 75,000), "₹2499.00/mo…", "All the goodness of Revamp, plus:" (Daily and on-demand backups, Social accounts Intregation [sic], Agent live chat & telephony, AI ChatBot Integration, CDN included) → `add-to-cart=2767`
    - **View all features** → `/website-development/#viewallfeatures`
    - Choose plan must go through CartContext (add product 2765/2766/2767) then navigate to `/checkout/`.

8. **GET IN TOUCH strip** — "GET IN TOUCH" eyebrow + "Connect with us for custom plan pricing that fits your needs." + **Contact Us** → `/contact-us/`.

9. **Partners** — eyebrow "Our Brand", H2 "Partners", the long quote paragraph, marquee of 15 logos (alt texts from `home.links.md`), pause on hover, seamless loop.

10. **Featured Client Stories** — heading + "Trusted by over 9,000+ customers worldwide…" subline (exact), 4 cards (image, name, role, quote with bold runs): Dr. Prabhat Tripathi / Chairman Tirupati College of Engineering; Abhishek Khare / Owner Khare's Kitchen Restaurant; Mohammad Ali Khan / Loyaltech Management Services Pvt. Ltd.; Riya Tiwari / Owner Fashion Store. Each has **Read the full story** → original destination is `#` (dead) → render as disabled-looking control with tooltip/`aria-disabled` note + QA flag. **Read more stories** same treatment. Optional modal `[Close]` exists in source — implement card expand modal containing the same quote only (no invented content), or omit modal and keep dead-link treatment consistently — record choice in QA.

11. **FAQS** — eyebrow "FAQS" + "Frequently Asked Questions" + subline; 5 accordions with **homepage wording** (differs from services page — use `home.md` text verbatim): How to buy a product? / How to send a custom query? / How Does the Support Policy Work? / How can send a refund request? / My account blocked what can I do? Internal links inside answers (Shop Page, Contact Us, My Account popup, support@ email, WhatsApp number) must work exactly as in source (popup links open the LoginRegisterPopup; `mailto:` works).

12. **Second FAQS/CTA block** — "Unlock the Ideal Solution for Your Needs - Reach Out for Assistance Today !" + quote paragraph + **"Here to help 24/7"** with 3 ✅ bullets ("few minutes" variant) + CTA **[👋Got Questions? Chat Now!]** → `https://1367.3cx.cloud/myradvancesolutionpr` + image `Live-Support-Chat.png`.

13. **Bottom CTA band** — "Save up to 60% on Website Development plan + get a free domain" + "Try risk-free. 30-day money-back guarantee." + **Get Started** → source target is `#E-Commerce` anchor → wire to the pricing section (give it matching id) and QA-flag the original anchor name.

14. **Footer** (S00).

## Design freedom
Section layouts, cards, backgrounds, animation timing are yours — but section ORDER, text, badges, prices, and destinations are fixed.

## Acceptance checklist
- [ ] Text diff vs source main page shows no wording changes (flags §7 quirks preserved: "needS", "Intregation", 9,000+ claim).
- [ ] All 7 service cards + 3 plan cards + 4 testimonials + 15 partner logos present.
- [ ] Choose plan adds correct product to cart and lands on `/checkout/`.
- [ ] FAQ accordion works with keyboard, one-or-many open — your choice, consistent.
- [ ] Stats/marquee/reveal animations respect reduced motion.
- [ ] `/myr/` renders identical output.
- [ ] Mobile: header collapses, grids stack, no horizontal scroll at 360px.