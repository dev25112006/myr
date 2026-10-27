# S02 — SERVICES HUB (`/services/`)

**Phase 2** · Depends on: S00–S01 · Source: `audit/pages/services.md` + `services.links.md`

## Sections (exact order)
1. Header (inner variant) + H1-level "Our Core Services" + subline "we aim to meet all your technological needs…"
2. **7 service cards** — same titles/links as homepage but **services-page blurbs** (e.g. "Premium Web Development We craft sleek, user-friendly designs tailored for your success." with the "Premium"/"Exclusive" accent words and badges as in manifest — use `services.md` text, NOT homepage text). Badges: Web Development (Premium), Digital Marketing (Exclusive), CCTV ("Book Now" badge link → appointment popup `3195`).
3. **CTA card** — "Schedule an Appointment with Our IT Pro" → opens appointment popup (Elementor 3195, content unverified → build popup: heading + short honest demo scheduling form (name/email/phone/preferred date) labeled demo, OR link to `/booking/` if popup content can't be sourced — record choice; prefer in-page popup with demo form + note `UNVERIFIED: original popup content`).
4. **Stats** — Team Member / Total Project / Happy Clients / Countries (labels exact; same counter rule as S01).
5. **"About our mission, values, and commitment"** — **services-page wording** (differs from homepage: "Our mission is to empower businesses with cutting-edge technology…") + 3 bullets (Mission/Values/Commitment services variants) + closing line + **Know More** → `/about-us/` + image slot.
6. **FAQS** — services-page variants: "How to buy a product?", "How to send a custom query?", **"How work the support policy?"** (sic), "How can send a refund request?", "My account blocked what can I do?" — verbatim from `services.md` including "Within 72 Hours" response time and WhatsApp link `+91 7408443341` and policy links (`/privacy-policy/`, `/refund-and-return-policy/`).
7. **Unlock CTA block** ("Unlock the Ideal Solution…" + quote) + **Here to help 24/7** ("2 minutes" variant here) + CTA **[Hi 👋 How can we help?]** → `https://1367.3cx.cloud/myradvancesolutionpr` + `sales-support-girl.png`.
8. Footer.

## Acceptance
- [ ] Distinct from homepage: services blurbs/FAQ wording match `services.md` (the two pages intentionally differ — do not unify).
- [ ] All card links correct; appointment CTA functional (popup or documented redirect).
- [ ] Responsive + reduced-motion + no invented text.
