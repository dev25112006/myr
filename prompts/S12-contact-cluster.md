# S12 — CONTACT CLUSTER: `/contact-us/`, `/talk-to-sales/`, `/booking/`

**Phase 4** · Depends on: S00–S01 · Sources: `audit/pages/contact-us.md`, `talk-to-sales.md`, `booking.md` (+ `.links.md`)

## A. `/contact-us/`
1. Header + **"Less Waiting. More Solutions."** hero (kicker + paragraph verbatim) + hero image (`…/uploads/2024/08/…` from links manifest).
2. **"How can we assist you?"** — subline "We're available around the clock…" + 5 options:
   - Chat with our Customer Support Team → "Log in" control opens **LoginRegisterPopup** (source is popup 2975).
   - Sales inquiry → **Talk with Sales Expert** → `/talk-to-sales/`
   - Media (PR) → `press@myradvancesolution.com` (mailto)
   - Report abuse → `abuse@myradvancesolution.com` + "click here" → `https://1367.3cx.cloud/eli`
   - Lost access to your 2FA or MYR ADVANCE SOLUTION website account email or Username? → `account-recovery@myradvancesolution.com`
3. **"Find Out More"** — 4 link cards: How We Help Your Business → `/how-we-help-your-business/`; Our Products Benefits → `/our-products-benefit` (normalize to `/our-products-benefit/`); Knowledge Base → `/knowledge-base`; Talk To Sales → `/talk-to-sales/`.
4. **"Our office locations"** — 4 offices (heading + full address verbatim incl. "Contarcting" typo) with map pin visual; if source embeds Google Maps iframe → include same embed only if URL found in manifest, else pin card only (flag).
5. **Contact form** — page WPForm exists (fields 1,2,3,6,5,4,7[],8: name/email/phone/…/services checkboxes/message per manifest labels). Include it (order per manifest: after hero or before offices — check `contact-us.md` flow) with demo submit.
6. Footer.

## B. `/talk-to-sales/`
- Hero: "Discover Your Ideal IT and Security Solution with a Personalized Consultation!" (exact).
- Form (fields 6,7,1,2,4,8,10,9): labels from manifest (name, email, phone, company, service interest, message/requirement fields as present). Demo submit + success state. Include any supporting copy from manifest; nothing invented.

## C. `/booking/`
- Source body is empty (Amelia booking plugin renders client-side; `UNVERIFIED: booking calendar UI`).
- Rebuild: page shell with header/footer, title "Booking" (per `<title>`), and an honest **booking panel**: heading from context + a demo booking form (name/email/phone/date/time/service select) OR embedded placeholder noting the original uses a booking plugin. MUST be labeled demo/UNVERIFIED in UI note (small badge) and QA. No fake confirmed appointments.

## Acceptance
- [ ] 5 contact options + 4 offices + 4 find-out links all exact and functional.
- [ ] mailto: links correct.
- [ ] Forms validated; demo-submit labeled.
- [ ] Booking page never claims real booking confirmation.
