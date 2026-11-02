# MYR SaaS Platform API (Phases 1–2)

All routes use same-origin session cookies and JSON unless noted. SaaS records are stored through the app persistence layer: MongoDB when `MONGODB_URI` is configured, with the existing local SQLite/JSON development fallback. Organization IDs in paths are always checked against the authenticated user's membership; clients cannot establish ownership by supplying an owner/user ID.

## Public catalog

### `GET /api/saas/products`

Returns active products and enabled plans only. Plan amount is represented in minor currency units. The endpoint does not return drafts.

## SaaS email verification

### `POST /api/saas/email-verification/request` — signed-in user

Creates/replaces a 24-hour, single-use token and emails a link. The raw token is only in the emailed link and is never returned in JSON. This SaaS-specific state does not inherit the legacy website's optional email-verification flag.

### `GET /api/saas/verify-email?token=...` — public redemption

Consumes a valid token and sets `saas_users.email_verified_at` in a transaction. Reuse, expiration, malformed tokens, and unknown tokens are rejected.

## Organization and entitlements

### `POST /api/saas/organizations` — signed-in, SaaS-verified user

Body: `{ "name": "Example Institute", "countryCode": "IN" }`. The owner comes from the session. A new organization is `pending` and has no product access until a later approved trial/payment flow.

### `GET /api/saas/organizations` — signed-in user

Returns organizations where the session user has active membership.

### `PATCH /api/saas/organizations/{organizationId}/billing-profile` — owner/admin/billing member

Updates invoice name/email/address/city/state/postal code/billing country and optional GSTIN. Billing details are organization-scoped; edits are audited by changed field names only. GSTIN input receives format validation, not tax registration verification. Future invoice snapshots preserve the billing details used at payment time.

### `GET /api/saas/organizations/{organizationId}/members` — active member

Lists member emails/roles only after a membership check for that same organization.

### `GET /api/saas/entitlements` — signed-in user

Returns active entitlement rows only for organizations where the user has an active membership. Entitlements require active organization state and current validity dates.

### `GET /api/saas/notifications` — signed-in user

Returns the caller's notifications only when the notification organization is also an active membership for that user.

### `GET /api/saas/usage` — signed-in user

Returns organization-scoped record usage for the supported CRM lead, HRM employee and Coaching ERP student records, including the matching configured plan cap when present.

### `POST /api/saas/organizations/{organizationId}/products/{productSlug}/launch` — active member with current product entitlement

Rechecks the organization membership, active subscription, product status and current entitlement. Returns a configured external `launchUrl` or an internal module URL for Coaching ERP, CRM or HRM. Product launch is denied when any access check fails.

## Initial product module records

The first module slice is enabled only for active, entitled product subscriptions. Every record query includes `organizationId` scope; creation checks matching plan limits where a known limit key is present.

- `GET|POST /api/saas/modules/crm/organizations/{organizationId}/leads` and `GET|PATCH|DELETE .../{leadId}` — CRM lead/contact basics, stage and follow-up date.
- `GET|POST /api/saas/modules/hrm/organizations/{organizationId}/employees` and `GET|PATCH|DELETE .../{employeeId}` — employee basics and onboarding/status.
- `GET|POST /api/saas/modules/coaching-erp/organizations/{organizationId}/students` and `GET|PATCH|DELETE .../{studentId}` — minimal admission/program/batch status records. This first slice does not collect DOB, health or other sensitive student information.

These are foundational records/workflow slices, not a claim that all product capabilities in the specification are complete. Fees/receipts, attendance, exams/results, branches, appointments, shifts/leave, reports, uploads and fine-grained product roles remain to be implemented and reviewed before advertising or production use.

## Support and knowledge (Phase 4)

- `GET /api/saas/support/knowledge?q=&product=` — returns only reviewed `published` articles, optionally filtered by product slug. Article bodies are plain text rendered as text.
- `POST /api/saas/support/assistant` — returns ranked exact excerpts from approved articles with source IDs. It is explicitly disclosed as automated and extractive; no model call, account-data retrieval, or financial action occurs. Raw questions are not persisted; only query length, source IDs and review metadata are retained for admin monitoring.
- `GET|POST /api/saas/support/tickets` — lists only tickets in active member organizations or creates a ticket with organization, optional active product/plan context and assistant handover summary.
- `GET /api/saas/support/tickets/{ticketId}` — organization-member-scoped thread. Private internal notes are excluded, including for an admin visiting the customer route.
- `POST /api/saas/support/tickets/{ticketId}/messages` — customer reply, up to three PDF/PNG/JPEG/plain-text attachments, 3 MB each. File type is checked by signature; bytes are stored with private filesystem permissions under `DATA_DIR/saas-support-attachments`, outside static serving. Downloads require active organization membership.
- `GET /api/saas/admin/support/tickets`, `PATCH /api/saas/admin/support/tickets/{ticketId}`, and `POST .../{ticketId}/messages` — MFA-verified SaaS admin queue, assignment/status/priority changes with required audit reason, public agent reply, and private internal note.
- `GET|POST /api/saas/admin/support/knowledge` and `PATCH /api/saas/admin/support/knowledge/{articleId}` — MFA-gated knowledge draft/review/publish/archive controls.
- `GET /api/saas/admin/support/assistant-usage` and `POST /api/saas/admin/support/assistant-review` — review/flag controls over minimized usage metadata.

The extractive assistant is a safe operational fallback, not a generative AI integration. Ticket e-mail notices are optional: configure `RESEND_API_KEY`, `EMAIL_FROM` and a verified sender; set `SAAS_SUPPORT_EMAIL` to also receive staff queue notices. Delivery failures do not roll back saved tickets or replies. Private notes are never emailed. For multi-instance deployment, move attachments to private object storage and add retention/deletion lifecycle controls before production.

## Membership

### `POST /api/saas/organizations/{organizationId}/invitations` — verified owner/admin

Body: `{ "email": "person@example.com", "role": "member" }`; role is `admin`, `member`, or `billing`. Invitation token is stored hashed, is single-use and expires after seven days. Acceptance requires a signed-in SaaS-verified account whose email matches the invitation.

### `POST /api/saas/invitations/{invitationId}/accept` — matching verified account

Body: `{ "token": "..." }`. Accepts once and creates active membership. Invalid, expired, redeemed, or mismatched invitations fail without revealing invitation details.

### `PATCH /api/saas/organizations/{organizationId}/members/{userId}/role` — owner

Body: `{ "role": "member" }`. Owner role cannot be assigned through this route; owners cannot change their own role.

### `DELETE /api/saas/organizations/{organizationId}/members/{userId}` — owner

Removes a non-owner membership. Owner membership cannot be removed.

## SaaS administrator controls

Every `/api/saas/admin/*` route requires an admin role and an MFA-verified session. Enrollment uses TOTP, encrypted seeds (`TOTP_ENCRYPTION_KEY`), and one-time recovery codes.

- `POST /api/saas/admin/mfa/setup` — returns the enrollment secret and `otpauth` URI for the current admin.
- `POST /api/saas/admin/mfa/enable` — body `{ "code": "123456" }`; returns recovery codes once.
- `POST /api/saas/admin/mfa/disable` — requires current TOTP and revokes admin sessions.
- `GET|POST /api/saas/admin/products` — catalog management.
- `PATCH /api/saas/admin/products/{productId}` — product fields/status/features.
- `GET /api/saas/admin/plans` — lists all configured plans, including disabled plans.
- `POST /api/saas/admin/plans` — creates a plan.
- `PATCH /api/saas/admin/plans/{planId}` — changes plan values, limits, trial, region and enabled state.

The admin console is available at `/saas-admin/` after enabling MFA from `/workspace/`. The machine-readable contract is `server/openapi.saas.yaml`.

Enabling any plan requires an active product and a currency in `SAAS_ALLOWED_CURRENCIES`; leave that setting empty until payment eligibility is confirmed.

Sensitive admin mutations are audit logged. Plan deletion and invitation cancellation are not included in the Phase 1 API.

## Checkout, payments and billing (Phase 2)

- `POST /api/saas/checkout` — verified organization billing member submits `{ "organizationId": "...", "planId": "..." }`. The server validates active catalog, region, INR allow-list and explicit tax configuration, creates a pending order/subscription, computes the total, then returns a PayU hosted form payload. The browser never supplies the charge amount.
- `POST /api/saas/payments/payu/return` — PayU URL-encoded return callback; verifies reverse hash and PayU Verify Payment before changing billing state. Redirects to `/workspace/` with a result code.
- `POST /api/saas/payments/payu/webhook` — URL-encoded PayU event callback; verifies signature and reconciles transaction with PayU before applying idempotent activation.
- `GET /api/saas/orders/{orderId}` — read-only, organization-billing-member-scoped status query.
- `GET /api/saas/subscriptions` — lists subscriptions for the current user's memberships.
- `POST /api/saas/subscriptions/{subscriptionId}/cancel` — schedules cancellation at the end of the paid term.
- `POST /api/saas/subscriptions/{subscriptionId}/reactivate` — reverses a scheduled cancellation before the paid term ends; does not enable automatic renewal.
- `GET /api/saas/invoices` and `GET /api/saas/invoices/{invoiceId}` — scoped invoice records as JSON.
- Successful verified payment queues a receipt email/notification; delivery occurs only when email service is configured.
- `POST /api/saas/admin/payments/reconcile` — MFA-gated reconciliation for up to five pending/failed PayU transactions per request.

Current checkout is INR monthly/annual, one-time per term, with manual renewal. Trials, custom intervals and automatic recurring debits are rejected until PayU standing-instruction enrollment, mandate status, pre-debit notices and provider cancellation are implemented and merchant-enabled. A lifecycle job expires subscriptions and entitlements at term end and closes stale pending checkouts. Configure `PAYU_ENV`, `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT`, `SAAS_ALLOWED_CURRENCIES`, and an approved `SAAS_TAX_RATE_BPS` or explicit `SAAS_TAX_EXEMPT=true`. See `server/PAYU-INTEGRATION.md`.

## Error responses

Errors are JSON `{ "error": "..." }` with standard HTTP status codes: `400` invalid input/token, `401` missing session, `403` missing role/verification, `404` unavailable or unauthorized invitation, `409` state conflict, `429` rate limit, `503` email/MFA configuration missing, and `500` unexpected server failure.
