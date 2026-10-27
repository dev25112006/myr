# S10 — PRIVYR MOBILE CRM (`/privyr/`)

**Phase 3** · Depends on: S00–S01 · Source: `audit/pages/privyr.md` + `privyr.links.md`

Landing page for "All-in-One Lead CRM" (nav item). Third-party product page (Privyr) with MYR branding.

## Sections (exact order from manifest)
1. Header + Hero — "Transform Your Leads into Loyal Clients, Right from Your Phone" + subline "Designed for Small Businesses, Marketers, and Solopreneurs" + CTA "Ready to get started?" (destinations per manifest).
2. **Audience cards** — Real Estate Agents / Financial Advisors / Trainers & Coaches / Marketing Agencies / Direct Sales Agents / Wedding Planners (+ their descriptions verbatim).
3. **Trust stats** — "Trusted by over 250,000 businesses across 100+ countries" + figures 250,000 / 100+ / 100 Million / +300% with exact captions from manifest (count-up allowed; values fixed).
4. **Feature blocks** ("Effortle…" truncated in outline — read full `privyr.md`) — preserve every feature heading/copy.
5. **Payment CTAs** — source contains Razorpay links `https://rzp.io/rzp/BRYPjee`, `https://rzp.io/rzp/c4ZG37v`, `https://rzp.io/rzp/o8XYLr6j` with visible plan labels (from manifest). Preserve as external links (exact URL + label); DO NOT embed keys or fake checkout. QA-flag: payment destination = external Razorpay page (unverified content).
6. **Signup form** (3-field WPForm: fields 3,1,2 — name/email/phone as per manifest) — demo submit.
7. Footer.

## Acceptance
- [ ] 250,000/100+/100 Million/+300% exact — preserved despite differing from homepage 9,000+ (flag §7.2).
- [ ] All 3 rzp.io links exact and open externally.
- [ ] Audience cards: 6 exact.
