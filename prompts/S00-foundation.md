# S00 — FOUNDATION: scaffold, design system, shell, shared components

**Phase 1** · Depends on: none · Governing: `prompts/MASTER.md`

## Mission
Create the Vite + React + TS + Tailwind project, the NEW visual identity (distinct from original), the routing skeleton covering all 56 routes, and every shared component listed in `prompts/00-PROMPT-MAP.md` contracts table. No page content yet except what S01 needs.

## Project setup
- `npm create vite@latest` → React + TypeScript; Tailwind CSS (pin a known-good version; verify build works before continuing).
- `react-router-dom` for routing; `framer-motion` (or equivalent) for the animation system — pick ONE motion library and stick to it.
- Path alias `@/` → `src/`. Strict TS. `npm run build` must pass.
- Folder shape:
  ```
  src/
    app/           # router, providers
    components/    # layout/, ui/, sections/, forms/, commerce/
    content/       # typed data modules per page (source: audit manifests)
    pages/         # one folder per route cluster
    lib/           # cart store, auth store, form config, utils
  public/assets/   # downloaded images
  ```
- **Routes:** every route in `prompts/00-PROMPT-MAP.md` must be registered (placeholder page component allowed until its segment runs; placeholder shows route name + "Segment pending" — never a fake UI).

## New visual identity (design freedom, but decide ONCE here)
- Direction: modern "deep-tech" — e.g. near-black/ink base, one vivid accent (cyan/teal or electric lime), generous whitespace, geometric display type + neutral body type, subtle grain/gradient orbs, 1px hairline borders.
- Tokens in `@theme`/CSS vars: colors, radius, spacing, shadows, container widths, type scale.
- Dark + light section rhythm (alternating), consistent card language, unified button variants (primary/ghost/outline).
- Motion system: scroll-reveal (fade+rise), stagger for card grids, count-up for stats, marquee for partners, hover micro-interactions, page-transition fade. MUST respect `prefers-reduced-motion`.
- Responsive: mobile-first; breakpoints tested 360/768/1024/1440.

## Shared components (exact behavioral contracts)
1. **SiteHeader** — two nav data sets (per analysis §3.1 primary and §3.2 inner variant; use `useHeaderVariant()` per route config). Contains: logo→`/`, desktop nav, **All Services** button → off-canvas panel (all 7 services + badges Featured/Book Now + socials), cart button showing `₹{total} ({count})` → `/cart/`, "Log in" → login popup, mobile hamburger. Sticky with scroll state. Also the basmala strip component (`<BasmalaStrip/>`) used by S01.
2. **SiteFooter** — analysis §3.4 exactly (blurb text, 3 columns with exact link sets, socials with exact URLs, Partner with Us → popup, copyright line verbatim, flags strip slot marked `UNVERIFIED: [lsft_horizontal_flags]`).
3. **LoginRegisterPopup** — tabs Login/Register; Login: username/email*, password*, remember me, submit, "Lost your password?" → `/my-account/`; Register: email*, helper text ("A link to set a new password…" + privacy sentence linking `/privacy-policy/`), submit. Demo auth via context+localStorage (never real credentials); success state shows demo user email.
4. **PartnerFormPopup** — heading/paragraph/4 bullets verbatim (analysis §3.5) + full field set with checkbox group; client validation; success state. On submit: store to localStorage + success message "Demo form — no backend connected (UNVERIFIED backend)."
5. **OffCanvasServices** — as specified in header.
6. **CartContext** — add/remove/update qty, totals in ₹ formatted `₹{n}` with paise where source uses it; persisted in localStorage; cart button + `/cart/` page consume it; `add-to-cart` query param on `/checkout/` handled (ID → product from catalog data module — if catalog not yet built, S16 completes it; S00 provides the hook API).
7. **AuthProvider** — demo login/register/logout state (feeds header "Log in"/"My account").
8. **Forms infrastructure** — `<SmartForm config={…}>` driven by a typed config (fields, labels, required, checkbox groups, validation messages) + success/error states. This backs: partner, contact, talk-to-sales, 1800-number, refund request, crm-dev, privyr, per-page contact forms. All submissions are client-side demo (flag in QA).
9. **SupportBlock ("Here to help 24/7")** — exact copy per page manifest (variants differ: "few minutes" vs "2 minutes" — pass as props), CTA label per page (e.g. "👋Got Questions? Chat Now!" / "Hi 👋 How can we help?"), link exact 3cx URL, image slot.
10. **FaqAccordion**, **SectionHeading**, **Reveal**, **CountUp**, **StatCounters** (labels per page), **PartnersMarquee** (15 logos), **TestimonialCard**, **PricingPlans** (S01/S03 data-driven), **Button/Link externals** (`ExternalLink` adds correct rel for 3cx/socials).
11. **Analytics of links:** internal links via React Router `Link`; preserve trailing-slash route forms (`/about-us/`) so parity with original sitemap — normalize in router config.

## Acceptance checklist (Phase 1)
- [ ] `npm run dev` + `npm run build` pass; zero TS errors.
- [ ] All 56 routes registered; visiting any shows header/footer + pending placeholder (not blank).
- [ ] Header variants, off-canvas, login popup, partner popup, cart button work on mobile + desktop.
- [ ] Cart persists across reload; add via API works (test in console).
- [ ] `prefers-reduced-motion` disables animations.
- [ ] Design tokens documented at top of `src/styles/` or token file.
