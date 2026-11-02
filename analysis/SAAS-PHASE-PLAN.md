# MYR SaaS Platform — Phase Execution Tracker

Source: `MYR_SaaS_Platform_Developer_Specification.pdf`, v1.0 (October 2026). This tracker separates the specification's requirements from work implemented in this repository. A checked build does not by itself pass a milestone.

## Phase 0 — Audit and plan approval

**Status: repository audit prepared; owner approval/dependencies pending.**

- [x] Compare current repository stack, routes, persistence and payment implementation to the specification.
- [x] Record current state, gaps, target workflow and delivery sequence in `SAAS-SPEC-GAP-ANALYSIS.md`.
- [ ] MYR approves target architecture, MongoDB data evolution plan, estimates/cost and risks (M1).
- [ ] Confirm PayU merchant eligibility, currencies, recurring mandates, notices, webhook behavior, refund ability, fees and settlement in writing.
- [ ] Confirm first product, plan, price, currency, tax, trial and product launch destination.
- [ ] Use MongoDB for staging and production SaaS data; select queue, email and object storage.

## Phase 1 — Foundation

**Status: code implementation substantially complete; staging/database and product-slice acceptance remain open.**

- [x] Preserve existing site and storefront; add separate `/software/`, `/pricing/` and `/workspace/` paths.
- [x] Add MongoDB-persisted SaaS state for users, organizations/members, products/plans, subscriptions/items, entitlements, audit and notifications.
- [x] Persist SaaS state through the existing MongoDB-backed application state store.
- [x] Seed Coaching ERP, CRM and HRM as draft identities only; no invented commercial price or feature catalog.
- [x] Add public active product catalog API.
- [x] Add signed-in organization list/create; creation starts pending and derives owner from session.
- [x] Add separate SaaS email verification state with emailed, expiring, single-use verification links; do not inherit legacy verification settings.
- [x] Require redeemed SaaS email verification before workspace creation, inviting, or accepting invitations.
- [x] Add membership-scoped entitlement read API and workspace UI.
- [x] Add owner/admin invitations, exact verified-email acceptance, owner role control/removal, and audit events.
- [x] Add TOTP admin MFA enrollment, encrypted pending/active seeds, single-use recovery codes, login challenge and failed-attempt limit; guard SaaS admin routes.
- [x] Add MFA-gated catalog/product/plan API; enabled plans require active products and explicitly allow-listed currencies.
- [x] Add `/saas-admin/` product and plan console with draft creation and status controls.
- [x] Document foundation API contracts and authorization in `server/SAAS-API.md`.
- [x] Publish machine-readable OpenAPI 3.1 contract for implemented Phase 1 routes in `server/openapi.saas.yaml`.
- [ ] Connect staging MongoDB and verify SaaS persistence/runtime behavior.
- [ ] Run tenant boundary checks across organizations and capture staging DB evidence.
- [ ] Complete staging acceptance evidence for schema, auth, MFA and API behavior.
- [ ] Select and configure one owner-approved product/plan vertical slice with verified features, limits, price, tax, trial and product runtime.

**Exit evidence:** MongoDB SaaS persistence verified on staging; redeemed-email auth; org owner/member roles; one approved configured product/plan; every relevant API tenant-scoped; isolation checks pass. Code is present for the foundation, but Phase 1 is not accepted until staging and product-slice evidence exists. Keep M1 separate: architecture and cost approval is a management gate.

## Phase 2 — Commercial journey

**Status: first INR hosted-checkout path implemented; production acceptance and recurring mandates remain open.**

- [x] Add server-calculated pending SaaS order/subscription and provider-hosted INR PayU checkout payload.
- [x] Keep merchant key/salt server-side; use environment-specific official PayU endpoints and documented request hash.
- [x] Validate callback reverse hash and verify payment server-to-server, matching transaction and amount before activation.
- [x] Record provider events idempotently; activation writes subscription, term entitlements, invoice record and audit atomically in persisted Mongo app state.
- [x] Add scoped read-only order status, billing invoices, cancellation-at-term-end and MFA-gated payment reconciliation.
- [x] Add customer checkout review UI with server-generated tax and total before posting to PayU.
- [x] Document PayU config, integration gate and provider sources in `server/PAYU-INTEGRATION.md`.
- [x] Extract a provider-neutral hosted-payment adapter contract and route PayU checkout/callback verification through it.
- [x] Add hourly and request-triggered subscription term expiry, end-of-term cancellation completion, entitlement removal and abandoned-checkout cleanup.
- [x] Add customer cancellation reversal before term end and expired plan renewal path back to pricing.
- [x] Add hourly scheduled reconciliation for unexpired pending PayU checkouts and reuse it for the MFA-gated admin reconciliation action.
- [ ] Confirm merchant account eligibility, webhook delivery, enabled INR payment methods and test credentials.
- [ ] Complete qualified tax, invoice, renewal, cancellation, privacy and terms review; configure approved tax treatment.
- [ ] Implement PayU recurring mandate enrollment, mandate-status checks, required pre-debit notices, recurring charge, retries/grace and cancellation at provider.
- [ ] Add paid plan changes and validate distributed scheduled-job behavior in staging.
- [ ] Pass M2 end-to-end PayU staging acceptance for one approved product/plan/currency and its real product launch.

## Phase 3 — Customer experience

**Status: platform customer journey expanded; product runtime and M3 acceptance remain open.**

- [x] Product discovery now renders the live active catalog and enabled plans only; no planned-product marketing cards are presented as configured offers.
- [x] Show published plan limits, region codes, plan term, one-time/manual renewal disclosure, workspace billing country and server-priced tax/total.
- [x] Filter checkout workspaces to active owner/admin/billing members; server remains authoritative for membership and region checks.
- [x] Add dashboard notification history and invoice detail/print view.
- [x] Add plan status, end date, limits, term cancellation/reversal, expired-plan return to pricing, and entitlement-gated server launch authorization.
- [x] Add dedicated product pages from live catalog data.
- [x] Add first tenant-scoped record workflows for CRM leads/pipeline/follow-ups, HRM employee onboarding/status, and Coaching ERP minimal admissions/program/batch records.
- [x] Require active subscription plus product entitlement for module access and enforce configured record-count caps.
- [x] Show live lead/employee/student record counts in the customer workspace for the first module slices.
- [x] Add organization billing name/contact/address/country and optional format-checked GSTIN; snapshot it on future invoices and audit only changed field names.
- [ ] Obtain MYR accounting/privacy approval for invoice fields, retention and tax wording; GSTIN format check does not verify registration.
- [ ] Complete specification workflows: ERP fees/receipts, attendance, exams/results, parent/student access, branches/learning; CRM appointments, team assignment and reports; HRM shifts, leave, documents and reports.
- [ ] Add full usage/limit counters for seats, branches, storage, appointments and other product resources; current usage covers only lead/employee/student records.
- [ ] Publish additional products/currencies only after feature verification, payment eligibility and tax review (M3).

## Phase 4 — Support

**Status: core support workflow implemented; generative AI integration and M4 staging acceptance remain open.**

- [x] Add customer tickets with product/plan context, statuses, priority, assignment, customer/agent replies and app notifications.
- [x] Keep private notes out of customer ticket responses and downloads; require MFA for support administration and reasoned/audited ticket changes.
- [x] Add private attachments with PDF/PNG/JPEG/plain-text allow-list, signature/type checks, 3 MB/file limit, private filesystem permissions and membership-scoped downloads.
- [x] Add admin-authored draft/review/published/archived knowledge articles with product scope and public help search.
- [x] Add a disclosed extractive assistant that returns only exact excerpts from published articles with citations; do not store raw questions or allow financial actions.
- [x] Add one-step ticket handover context from automated help; add MFA-gated support queue, ticket metrics, knowledge review and minimized assistant-usage review/flagging.
- [ ] Configure a generative AI provider only after MYR selects/approves the provider, model, data handling and retention; current automated help is extractive, not generative AI.
- [x] Add optional customer/staff ticket e-mail notices via Resend (`RESEND_API_KEY`, `EMAIL_FROM`, optional `SAAS_SUPPORT_EMAIL`); email failures do not undo saved ticket actions and private notes are never emailed.
- [ ] Move attachments to private object storage and configure retention/deletion lifecycle for multi-instance production.
- [ ] Pass M4 staging acceptance, including tenant isolation, private-note, attachment authorization and operational retention evidence.

## Phase 5 — Production readiness

**Status: not started.**

- [ ] Security, privacy, DPDP/student data, legal, tax and payment mandate reviews completed by responsible qualified owners.
- [ ] Rate limiting, security headers, dependency review, monitoring, alerts and health/ready checks.
- [ ] Staging matches production; encrypted off-server backup restore is demonstrated.
- [ ] Production secrets are outside Git; restricted SSH/firewall/TLS/database network configured.
- [ ] Rollback procedure demonstrated; production migration waits for staging acceptance.
- [ ] Record evidence for all 32 acceptance tests and deliver required runbooks/API/schema/payment docs (M5).

## Milestone ledger

| Gate | Status | Required proof |
|---|---|---|
| M1 Audit and plan approved | In progress | MYR approval of audit, MongoDB data approach, PayU dependencies, estimate/cost and risks. |
| M2 First paid staging journey | Not started | Code for the INR PayU journey, activation, invoice and launch authorization exists; staging credentials, approved product/plan/tax configuration, merchant eligibility and end-to-end evidence remain. |
| M3 All products and currencies | Not started | Three products configured; INR eligibility verified; USD/GBP only if confirmed. |
| M4 Support and AI staging | In progress | Core ticket/knowledge and extractive handover code exists; staging isolation/retention evidence and approved generative AI provider are still needed. |
| M5 Production ready | Not started | Acceptance suite, restore, rollback, legal policies and operations proof. |

## Decisions that block only the dependent work

PayU merchant eligibility and mandate approval block recurring charges and M2. Approved prices/limits/tax/trial block publishable plan configuration. Product runtime/launch URL blocks the real launcher. These do not block provider-neutral subscription state, the gated INR hosted-checkout implementation, workspace UI or API documentation.
