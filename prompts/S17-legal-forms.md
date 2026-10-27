# S17 — LEGAL: 4 policies + refund request form

**Phase 6** · Depends on: S00 · Sources: `audit/pages/privacy-policy.md`, `shipping-policy.md`, `terms-and-conditions.md`, `refund-and-return-policy.md`, `refund-request-form.md` (+ `.links.md`)

## Rules
- **Verbatim reproduction** of every section heading and paragraph from the manifests (these are legal texts — zero paraphrasing, zero "corrections"; known typos stay, flags already registered).
- Shared `LegalPageLayout`: H1 (source casing: "privacy policy", "shipping policy", "Terms and Conditions", "Refund and Return Policy"), optional updated/effective-date line ONLY if in source, numbered section headings as H2, TOC sidebar/jump-links (allowed design freedom), in-page anchors per section, consistent typography.
- Internal links inside policies (e.g. contact, refund form) must be wired to real routes.

## Pages
1. `/privacy-policy/` — 10 sections: Information We Collect → Contact Us (exact headings from manifest).
2. `/shipping-policy/` — 9 sections: Shipping Destinations → Contact Us.
3. `/terms-and-conditions/` — 17+ sections: Introduction → Governing Law (…read full list in manifest; include ALL).
4. `/refund-and-return-policy/` — 9 sections: Eligibility for Returns → Contact Information.
5. `/refund-request-form/` — H1 "Refund Request Form" + 12-field WPForm (fields 1–12 from `refund-request-form.links.md`): map labels from manifest (contact info, order number, order date, product, reason dropdown/radio, message, file attachment if present — file input: client-side only, note). Client validation + demo success state ("UNVERIFIED backend"), plus any guidance text from manifest (links to policy page).

## Acceptance
- [ ] Section counts match manifests exactly (10/9/17+/9).
- [ ] Spot-check paragraph diff = 0 changes vs manifest.
- [ ] Refund form: all 12 fields present with correct types/required flags.
- [ ] TOC navigation works on mobile (collapsible).
