# Education ERP Experience — Audit & Architecture Analysis

Source: master brief (cinematic Education ERP redesign, four routes + MYR Virtual Campus tour).
Date: October 2026. This document is the required pre-implementation analysis: codebase audit, existing component/API inventory, page & component architecture, functional-ERP inventory, tour infrastructure plan, performance/SEO/test strategy, and open decisions.

---

## 1. Codebase audit (what exists today)

### 1.1 Stack
| Layer | Finding |
|---|---|
| Build | Vite 8 + `tsc -b` (TypeScript **strict**, `noUnusedLocals/Parameters`, `verbatimModuleSyntax`) |
| Framework | React 19.3, react-router-dom 7 (BrowserRouter, no data-router), StrictMode |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; design tokens in `src/index.css` `@theme` block |
| Motion | **framer-motion 14** installed and central (`Reveal`, `Stagger`, `StaggerItem`, `TiltCard`, `CountUp` in `src/components/ui/motion.tsx`; `useReducedMotion` respected everywhere) |
| 3D | **No three.js, no GSAP installed.** 3D today = CSS `perspective`/`rotateX/Y` + framer-motion |
| Lint | oxlint (`npm run lint`) |
| Tests | Playwright smoke suite (`scripts/smoke.mjs`) that visits every path in `src/content/routeMeta.ts`, failing on HTTP ≥400, blank render, console/page errors |
| Server | Single-file Node API (`server/index.mjs`), Vite dev proxy `/api → 127.0.0.1:3001`; Mongo-backed state with SQLite fallback |
| A11y baseline | Skip link, `aria-*` patterns, keyboard-accessible `FaqAccordion`, `prefers-reduced-motion` honored in Layout, motion helpers, EducationErpPage |

### 1.2 Routing & SEO infrastructure (critical constraint)
- `src/app/router.tsx` — flat `<Routes>` list under `<Layout/>` (header/footer, AnimatePresence page transition, ScrollProgress bar).
- `src/content/routeMeta.ts` is **AUTO-GENERATED** from `audit/inventory.json` by `scripts/gen-route-meta.mjs` (header variant, title, meta, keywords, canonical, robots). `SeoHead` reads it for title/meta/canonical/OG/JSON-LD. **New routes must be added via the generator** (extend `EXTRA_ROUTES` mechanism or inventory), not by hand-editing, then `npm run seo` regenerates routeMeta + `public/sitemap.xml`.
- The Playwright smoke suite picks up new routes automatically once they appear in routeMeta — good, free regression coverage.

### 1.3 Existing Education ERP page (the thing being redesigned)
`src/pages/EducationErpPage.tsx` at `/education-erp/`:
- Single page with a **tab switcher** (School / College / Coaching) driven by `?type=` query param; nav mega-menu already deep-links `/education-erp/?type=school#institution-types` etc. (SiteHeader lines ~200, ~248; also `OFFCANVAS_SERVICES`, HomePage).
- Content: per-institution hero copy, **invented stats** ("2,486 enrolled students", "94.2% present"…) shown inside a mock dashboard, three module-group cards each, role grid (Administrator/Teacher/Student/Parent), CTA to `/contact-us/?interest=education-erp#contact-form`.
- Visual identity: local **teal palette** (`#102b31`, `#123c43`, teal-200/300 accents) layered on the navy/rose design system — an established per-page identity exception worth reusing.
- CSS-3D dashboard mock (perspective + rotateY hover) already demonstrates the "simulated dashboard" building block.
- ⚠️ Honesty gap vs. the brief: the mock stats read as product claims. The redesign must (a) label every simulated surface "Demo environment · sample data", (b) not present numbers as customer/institution facts.

### 1.4 Reusable building blocks (reuse, don't rebuild)
| Component | Use for |
|---|---|
| `Reveal/Stagger/StaggerItem/TiltCard/CountUp` (`ui/motion.tsx`) | All cinematic scroll reveals, 3D card hovers, stat counters — already reduced-motion-safe |
| `FaqAccordion` (`ui/`) | FAQ section on all four pages (single-open, keyboard accessible) |
| `SectionHeading`, `SupportBlock`, `StatCounters`, `PartnersMarquee` | Standard section chrome |
| `SmartForm` + `src/content/leadForms.ts` | Conversion forms posting to real inbox API; `LEAD_FORM_4500` already has an "Education ERP" interest option |
| `usePopup()` (`lib/stores.tsx`) + `AppointmentPopup` | "Book a live demo" CTA (existing popup system) |
| `container-page`, `section-light/section-dark` CSS utilities | Layout rhythm |
| Design tokens `ink-950/accent-400/flame-500/paper/line` | Keep pages inside the design system; per-segment accent layered like the current teal |
| Conversion patterns | `/contact-us/?interest=education-erp#contact-form`, `/talk-to-sales/`, `/pricing/`, `/booking/` all exist |

### 1.5 Real product/API surface (the honesty boundary)
Implemented today in `server/index.mjs` (tenant-scoped, subscription-gated, **auth required**):
- **Coaching ERP module (real, working)**: students (admissions), branches, fees + receipts (INR paise, balance checks, void-with-audit), attendance (one mark/student/date), exams, results, portal grants (guardian/student, activates on email verify), per-module reports (fee collected/outstanding, attendance last 30 days…).
- **CRM**: leads + pipeline statuses, appointments, lead assignment, reports.
- **HRM**: employees, shifts, leave requests, private document uploads (typed/size-checked, retention-purge → HTTP 410), reports.
- Public catalog: `/api/saas/products` (active products/plans only).
- **Not implemented as product runtime**: School ERP and College ERP (transport, hostel, library, LMS, payroll, accreditation… are marketing-scope content only). The pages must present these as **configurable scope / implementation targets**, never as shipped features.
- No real ERP screenshots exist in `public/assets/` — simulated HTML/CSS dashboards (as today) are the correct approach.

---

## 2. Constraints derived from the audit

1. **Preserve everything**: `/education-erp/` URL, its `?type=` deep links (redirect to new routes), nav mega-menu, all other pages untouched.
2. **No invented claims**: every simulated number/table labeled as demo; School/College module lists labeled "configurable scope"; no customer counts, testimonials, or integrations.
3. **Tour never touches production data**: fully client-side simulation over static demo datasets; the only real network calls are optional public catalog reads.
4. **RouteMeta is generated**: new routes flow through `gen-route-meta.mjs` + sitemap regen; smoke suite then covers them.
5. **TS strict + oxlint clean**; no `any`, no unused locals.
6. **Dependency tension in the brief**: "use Three.js/R3F + GSAP" vs "avoid unnecessary dependencies". See Decision D1 — recommendation below.

---

## 3. Page & component architecture

### 3.1 Routes
| Route | Page | Segment identity (accent over navy/rose system) |
|---|---|---|
| `/education-erp/` | `EducationHubPage` (redesigned existing) — portal to the four experiences, keeps `?type=` redirects | Teal (current) |
| `/education-erp/school` | `SchoolErpPage` | Deep **indigo** campus dusk |
| `/education-erp/college` | `CollegeErpPage` | **Violet** lecture-hall night |
| `/education-erp/coaching` | `CoachingErpPage` | **Amber/saffron** study-centre glow |
| `/education-erp/modules` | `EducationModulesPage` — full module matrix with per-module status chips | Neutral system |

Each page (except hub/modules) is composed from **one shared section kit driven by segment config** so pages feel distinct (accent, opening choreography, demo datasets, copy, dashboard skin, mission set) without duplicating templates.

### 3.2 File layout (new)
```
src/pages/education/
  EducationHubPage.tsx  SchoolErpPage.tsx  CollegeErpPage.tsx
  CoachingErpPage.tsx   EducationModulesPage.tsx
src/components/education/
  segment.ts            — per-segment identity + copy + demo datasets (typed)
  ErpHero.tsx           — cinematic opening (variant per segment)
  SegmentStory.tsx      — product explanation + module storytelling
  DashboardPreview.tsx  — role-based animated dashboard mock (demo-labelled)
  WorkflowShowcase.tsx  — guided workflow demonstration (animated steps)
  BenefitsSection.tsx   — benefits + use cases
  ErpFaq.tsx            — FAQ (wraps FaqAccordion, per-segment items)
  CtaBand.tsx           — conversion band (tour / demo / pricing / contact)
  DemoBadge.tsx         — the required "Demo environment · sample data" chip
src/components/education/tour/
  TourProvider.tsx      — reducer: step machine, XP, badges, role, progress
  TourShell.tsx         — fullscreen overlay: HUD (XP, badges, progress),
                          skip / pause / restart / exit, focus trap, Esc handling
  CampusScene.tsx       — 3D/2.5D campus environment (lazy; fallback poster)
  missions/             — mission definitions + interactive widgets
  sim/                  — simulated dashboards: SimTable, SimFilters, SimSearch,
                          SimChart (SVG), SimForm, SimAttendance, SimFees,
                          SimExams, SimReports  — all pure state over demo data
src/content/education/
  school.ts college.ts coaching.ts modules.ts   — copy + FAQ + demo data
```
All tour/sim code loads via `React.lazy` + dynamic `import()` — the four pages' base content must render with **zero tour/3D bytes** in the initial route chunk.

### 3.3 Section order per product page (brief compliance)
Cinematic opening → hero → product explanation → module storytelling → role-based dashboard preview → **[Start interactive tour CTA]** → workflow demonstration → benefits/use cases → FAQ → conversion section. Persistent but non-intrusive sticky CTA pill (tour + talk-to-sales) after hero, hidden on scroll-up reappear, mobile-bottom-safe.

---

## 4. MYR Virtual Campus — tour engine design

State machine (reducer in `TourProvider`), persisted to `localStorage` under `myr.tour.v1.<segment>`:

```
entry (cinematic) → institutionSelect (hub only) → campus (environment)
→ roleSelect (Administrator | Teacher | Student | Guardian)
→ dashboardExplore (hotspot missions: 3–5 per role)
→ missions (guided workflows, see 4.2) → summary (XP, badges, recap)
→ cta (book demo / pricing / contact)
```

Controls: `?tour=1` query or any "Start tour" CTA launches; **Skip** (jump to summary), **Pause** (overlay dim + resume), **Restart**, **Exit** (returns to exact scroll position; page remains fully readable without the tour). Tour is `role="dialog" aria-modal`, focus-trapped, Esc = pause, arrow/Tab navigation between steps, screen-reader announcements via `aria-live` for XP/badge events.

### 4.1 Gamification
- **XP**: small awards per meaningful action (marked attendance run, matched fee receipts, scheduled an exam block, resolved a lead→admission flow). XP shown in HUD with `CountUp`.
- **Badges** (unlockable departments double as progression): `front-office`, `attendance-keeper`, `fee-collector`, `exam-planner`, `result-publisher`, `guardian-link`, `lead-closer`, `staff-roster`.
- **Progress**: step meter + mission checklist; completion summary recaps what the visitor actually did, then converts.

### 4.2 Missions (each demonstrates a REAL workflow that exists in the product today)
| Mission | Mirrors real feature | Segment |
|---|---|---|
| Mark attendance for a batch (resolve duplicates) | Coaching attendance API rules | coaching |
| Record a fee + issue receipt within balance | Fees/receipts balance logic | coaching (+school/college variants) |
| Schedule an exam and publish a result | Exams/results workflow | all |
| Grant & revoke guardian portal access | Portal grants (verify-activated) | all |
| Work a lead → qualified → admission | CRM pipeline + assignment | coaching, college |
| Build a weekly staff roster + approve leave | HRM shifts/leave | school, college |
| Run the daily/weekly report card | Module reports (collected/outstanding, conversion) | all |

Every mission runs on `sim/` widgets over static demo fixtures — **no API writes**, visibly demo-labelled.

---

## 5. 3D, motion & performance strategy

1. **GSAP: skip.** framer-motion 14 already provides `useScroll`/`useTransform`/`useSpring` (ScrollTrigger-equivalent scrubbing, already used in `Layout`'s ScrollProgress) plus layout choreography. Adding GSAP duplicates capability and bundle for zero new behavior. Cinematic scroll = framer-motion scrub timelines.
2. **three.js/R3F: conditional, isolated** (Decision D1). If approved: `three` + `@react-three/fiber` (+ minimal drei) in a **lazy chunk loaded only on demand** (desktop, `pointer: fine`, `prefers-reduced-motion: no-preference`, `navigator.hardwareConcurrency ≥ 4`), clamped `dpr`, no post-processing on mobile; a static poster/CSS-3D scene is the guaranteed fallback. The campus scene is the *only* consumer.
3. **Default recommendation**: CSS-3D + canvas-free cinematic (the current page's perspective-dashboard technique, parallax layers, `content-visibility: auto`, reserved `aspect-ratio` boxes to prevent CLS). This satisfies "cinematic, 3D-transform, glassmorphism" with **no new runtime dependency** and is the safest Core Web Vitals outcome on mobile networks.
4. Mobile: reduced parallax, no continuous loops >2 elements, `dvh` hero with reserved height, images `loading="lazy"` + explicit dimensions.
5. Route splitting: every new page + tour + sim are separate chunks; verify with `vite build` chunk report.

---

## 6. SEO, analytics-free telemetry, QA plan

- Extend `gen-route-meta.mjs` with the five routes (titles/meta/keywords per segment; hub keeps its current ranking intent) → run `npm run seo` → routeMeta + sitemap updated → smoke suite auto-covers.
- JSON-LD: `pageLd` already special-cases FAQ per route; add FAQ blocks for the four new routes in `seoLd.ts`.
- Preserve `/education-erp/?type=x` deep links: hub reads the param and forwards to the new route (301-equivalent via client redirect + canonical consolidation on the new route).
- QA per route: `npm run build`, `npm run lint`, `node scripts/smoke.mjs /education-erp/ /education-erp/school /education-erp/college /education-erp/coaching /education-erp/modules`, then manual matrix: keyboard tour walkthrough, reduced-motion pass (both OS setting and in-page pause), 360/768/1440 widths, tour launch/skip/restart/exit, badge/XP persistence across reload, contact/demo/pricing CTA destinations.

---

## 7. Implementation sequence

1. **Infrastructure** — segment config + demo datasets (typed, demo-labelled), routeMeta/sitemap extension, hub redesign with redirects.
2. **Section kit** — ErpHero, SegmentStory, DashboardPreview, WorkflowShowcase, Benefits, Faq, CtaBand, DemoBadge, sticky CTA.
3. **Four product pages** — assembled from kit + segment identities; Modules page matrix with honest status chips ("Live in workspace today" for Coaching/CRM/HRM items vs "Configurable scope").
4. **Tour engine** — TourProvider/TourShell + sim widgets + missions, lazy chunks.
5. **Campus environment** — 2.5D default (3D per D1), cinematic entry.
6. **QA + docs** — smoke, a11y, perf pass, update nav mega-menu links to new routes.

---

## 8. Decisions (resolved with owner)

| # | Decision | Resolution |
|---|---|---|
| **D1** | 3D approach | **CSS-3D cinematic only** — no three.js/GSAP. framer-motion scroll-scrubbing + perspective transforms + parallax layers. Best mobile performance; tour interactivity unaffected. |
| **D2** | `/education-erp/` URL | **Redesigned hub** — preserves nav contract/SEO equity, portals to the four experiences, forwards `?type=` deep links. |
| **D3** | Live data | **Read-only `/api/saas/products` fetch on modules page only**, graceful empty fallback. Tour and product pages fully simulated/static. |
