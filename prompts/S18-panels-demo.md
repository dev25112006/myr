# S18 — PANEL DEMO UIs (10 routes)

**Phase 6** · Depends on: S00 · Sources: `audit/pages/crm-dashboard.md`, `my-leads.md`, `crm-reports.md`, `crm-tasks.md`, `my-profile.md`, `import-leads.md`, `crm-login.md`, `team-chat.md`, `team-panel.md`, `customer-panel.md` (+ `.links.md`)

## Context (owner decision, binding)
Original content is behind login-gated WordPress shortcodes (`[lfcrm_dashboard]`, `[lfcrm_leads]`, …) — **UNVERIFIED**. Rebuild = exact visible shell + functional **demo UI** with clearly-labeled sample data. Every such page shows a small badge: "Demo — original requires login (unverified)".

## Shared `<PanelLayout>`
- Panel heading (exact, per page): **"Team Task & Appointment Panel"** (crm-dashboard, my-leads, crm-reports, crm-tasks, my-profile, import-leads, crm-login, team-chat, team-panel) / **"Customer Appointment Panel"** (customer-panel — appears twice in source, render once unless layout repeats).
- Sidebar/nav (exact items + destinations): Dashboard → `/crm-dashboard/`, My Leads → `/my-leads/`, Reports → `/crm-reports/`, My Profile → `/my-profile/` ("My Profile" has no link in source → make it link to `/my-profile/` route which exists, QA-note the source omission).
- Panel logo/image slots from manifests (`…MYR-e1709294854593.png` etc.).
- Site header/footer: source pages include the login popup + partner popup + (some) footer — use S00 header/footer with footer omitted ONLY where the manifest shows none (check each; crm-* pages show no footer in outline → confirm per manifest and match).

## Per-route demo content (sample data must be obviously fictional)
| Route | Demo UI |
|---|---|
| `/crm-dashboard/` | Stat widgets (Leads, Tasks, Appointments, Calls), recent activity list, mini chart |
| `/my-leads/` | Leads table (name, phone, source, status dropdown, date) + filter/search + "Add lead" (client-side, persists to localStorage) |
| `/crm-reports/` | Charts (leads by month, conversion) using inline SVG/CSS — no chart lib required; data labeled sample |
| `/crm-tasks/` | Task list with checkboxes, due dates, priority tags (client-side state) |
| `/my-profile/` | Profile form (name, email, phone, avatar slot, password change disabled note) demo save |
| `/import-leads/` | CSV upload input (parses client-side headers only; shows preview; labeled demo) + instructions from manifest if any |
| `/crm-login/` | Login form (email/password) demo sign-in → dashboard note; links to `/my-account/` lost password as in source |
| `/team-chat/` | Chat UI (channel list + messages with canned sample messages + composer that appends locally; no network) |
| `/team-panel/` | Team member cards (roles, status) + task assignment demo |
| `/customer-panel/` | "Customer Appointment Panel": appointment list (sample), book-slot demo form |

## Rules
- Sample data: generic Indian-market names (e.g. "Amit Sharma", "Priya Patel") — must NOT reuse real testimonial people or real customers.
- No fake analytics presented as real business data — label "Sample data".
- Keep UI cohesive with S00 design system but visually distinct from marketing pages (denser app chrome).

## Acceptance
- [ ] 10 routes live; shell headings exact; sidebar links correct.
- [ ] Demo badge visible on every panel page.
- [ ] Interactive bits work (add lead, toggle task, send chat msg, CSV preview).
- [ ] No real-looking business metrics without "Sample data" label.
