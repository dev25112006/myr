# MASTER PROMPT — MYR ADVANCE SOLUTION WEBSITE REBUILD

> This is the governing prompt (verbatim, as provided by the project owner). Every segment prompt in this folder operates UNDER this master prompt. In case of conflict, this master prompt wins.

## Objective
Rebuild https://www.myradvancesolution.com/ as a new, production-quality website. The original website is the source of truth for business identity, content, page hierarchy, services, product information, pricing, policies, and user-facing functionality.

The replacement may use a different visual design, color palette, typography, animation system, section styling, card layouts, and responsive composition. However, it must preserve all verified original content and functionality.

## Non-negotiable rules
1. Audit the source website before implementing each page.
2. Do not invent page names, services, prices, discounts, ratings, testimonials, addresses, guarantees, customer counts, company claims, or policy wording.
3. Preserve the exact source text whenever practical. Keep a source-content manifest for every page.
4. Do not silently correct apparent errors or inconsistent claims in the original. Flag them for owner review and preserve them until approval.
5. Record all page routes, internal links, external destinations, CTAs, forms, navigation items, FAQs, and purchase flows.
6. Preserve the actual meaning and destination of every functional control.
7. If a page or feature cannot be verified, record it as unverified instead of fabricating it.
8. Do not replace a working feature with a decorative button or nonfunctional mockup.
9. Do not copy the original visual design pixel for pixel. Create a distinctive, polished visual identity while retaining the same information architecture.
10. Never expose API keys, credentials, payment secrets, or private customer data.

## Source of truth
Original website: https://www.myradvancesolution.com/

Inspect the homepage, navigation menus, footer links, internal service pages, store, product pages, forms, FAQs, and policy links. Use browser access when available. If access is unavailable, request screenshots, exported page text, or source assets rather than guessing.

## Required deliverables
- Verified route inventory
- Page-by-page content and section manifest
- Asset inventory
- Interaction and link inventory
- Shared component architecture
- Responsive website implementation
- Functional navigation, forms, and commerce paths as verified
- Automated or repeatable verification checklist
- Deployment instructions

## Working method
Work in numbered phases. Before coding a phase, inspect the relevant source pages. After coding, run the application, test the changed routes, check responsive layouts, and report completed work, missing content, assumptions, and remaining issues.

Do not claim the website is complete while any verified page, section, link, or interaction remains unimplemented.

---

## Owner decisions recorded during audit (binding)
1. **Stack:** Vite + React + TypeScript + Tailwind CSS, React Router for all routes, static-build deployable.
2. **Login-gated panel pages** (`/crm-dashboard/`, `/my-leads/`, `/crm-reports/`, `/crm-tasks/`, `/my-profile/`, `/import-leads/`, `/crm-login/`, `/team-chat/`, `/team-panel/`, `/customer-panel/`): rebuild visible shell + functional **demo UI** with sample data, clearly labeled "Demo — original requires login (unverified)".
3. **Commerce depth:** full front-end cart + checkout UI (add-to-cart, cart page, checkout form with validation). Payment step is **demo only** — no real gateway; clearly labeled; never fake a successful real payment.
4. **Audit artifacts are the content source:** `analysis/WEBSITE-ANALYSIS.md`, `audit/pages/*.md` (content), `audit/pages/*.links.md` (links/CTAs/forms/images), `audit/inventory.json`.
5. **Flags** listed in `analysis/WEBSITE-ANALYSIS.md` §7 are preserved verbatim until owner approves changes; they must appear in the QA report.
