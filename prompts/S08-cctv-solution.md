# S08 — CCTV SOLUTION (`/cctv-solution/`)

**Phase 3** · Depends on: S00–S02 · Source: `audit/pages/cctv-solution.md` + `.links.md`

## Sections
1. Header + Hero — H1 "cctv solution" (source casing; render with display styling that doesn't look broken — e.g. CSS text-transform none, keep exact string) + hero copy/images from manifest.
2. Service/feature sections as ordered in manifest (surveillance offerings, benefits, packages if present — use ONLY manifest content).
3. **Booking / "Book Now" CTAs** — source links to appointment popup (Elementor 3195/`/booking/`): implement in-page appointment popup (demo form labeled UNVERIFIED) consistent with S02 choice, plus any "Book Now" badges on cards.
4. Any pricing/deal text present (e.g. badges) — exact.
5. Support block if present in manifest + footer.

## Acceptance
- [ ] H1 text exactly "cctv solution".
- [ ] All CTAs functional (popup/booking), nothing decorative-only.
- [ ] No invented camera specs/prices — if manifest lacks detail, section stays minimal (flag in QA).
