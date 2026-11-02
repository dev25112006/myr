# PayU Hosted Checkout (Phase 2)

## Current implementation

- Provider credentials are read only from `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT`; `PAYU_ENV=test|production` selects PayU India hosted checkout and Verify Payment endpoints.
- `POST /api/saas/checkout` accepts a plan and organization ID, recalculates subtotal/tax/total from server catalog data, stores a pending order and subscription before returning a hidden-form payload, and never accepts a browser-supplied amount.
- Checkout currently supports INR monthly/annual terms without trials. It rejects currencies not explicitly allow-listed, unsupported regions, custom periods, and unconfigured tax treatment.
- `/api/saas/payments/payu/return` and `/api/saas/payments/payu/webhook` accept URL-encoded PayU callbacks, validate the documented SHA-512 reverse hash (including additional charges), then call PayU Verify Payment and match the merchant transaction ID and amount before activation.
- Verified payment activation is idempotent in the current single-document MongoDB request queue. It activates the organization/subscription, writes term-bound entitlements, creates an invoice record and audit event, and queues a payment notice. Customer order status is read-only; admin reconciliation is MFA-gated.
- Cancellation is scheduled at the end of the paid term. Renewal is currently manual; no recurring charge is attempted.
- Checkout creation, callback verification, and reconciliation use the provider-neutral contract in `server/payment-provider.mjs`; the PayU adapter owns the provider-specific handoff and verification mapping.
- A lifecycle job runs hourly and on SaaS API requests to expire elapsed terms, finish scheduled cancellations, remove their entitlements, and close expired pending checkouts. This timer is suitable only for a single active app instance; multi-instance deployment requires a distributed/leased job runner before relying on exactly-once lifecycle processing.
- The same hourly single-instance job reconciles up to five unexpired pending PayU checkouts with Verify Payment; the MFA-gated admin action uses the same idempotent reconciliation path. Multi-instance deployment still needs a distributed/leased runner.

## Configuration

Set merchant keys only in the deployment secret store or ignored local `.env`. Use PayU test credentials and `PAYU_ENV=test` first. Production also requires HTTPS `APP_ORIGIN`. `SAAS_ALLOWED_CURRENCIES` must include `INR` only after the account's eligibility is confirmed. Configure one approved `SAAS_TAX_RATE_BPS`, or set `SAAS_TAX_EXEMPT=true` only after MYR's tax owner confirms the treatment.

Do not enable a product/plan for sale until its product, price, region, feature limits, tax treatment, legal terms and launch target have been approved. The webhook URL to configure in the merchant dashboard is `/api/saas/payments/payu/webhook`.

## Recurring mandate gate

This code does not create PayU standing-instruction mandates or automatic renewals. PayU requires the merchant account to have subscriptions enabled, mandate-mode selection, pre-debit notifications for supported methods, mandate-status checks and cancellation management. The current checkout rejects trials and custom intervals. Leave `renewalMode=manual` visible to customers until MYR confirms eligibility and the selected PayU API/method; then implement and stage-test that mandate workflow before describing plans as auto-renewing.

## Remaining Phase 2 acceptance gates

- Configure PayU test credentials and the approved `INR` allow-list in staging, register the webhook URL, and complete a real provider sandbox payment and failure/retry review.
- Obtain the MYR-approved product, plan, feature limits, tax treatment, customer terms and actual product launch URL. Until then, products remain drafts and checkout stays gated.
- Implement and stage-test plan change/reactivation and provider-specific recurring mandates only after PayU enables the merchant capability and MYR selects the payment method and renewal policy.
- M2 is not accepted until a staging record demonstrates the full verified-registration → organization → payment → subscription/entitlement/invoice → real product launch journey.

## Provider references

- [PayU Hosted Checkout payment API](https://docs.payu.in/reference/_payment_payu_hosted_checkout)
- [PayU request and response hash formulas](https://docs.payu.in/docs/hashing-request-and-response)
- [PayU Verify Payment API](https://docs.payu.in/reference/verify_payment_api)
- [PayU webhook events and payloads](https://docs.payu.in/docs/webhook-events-and-sample-payloads)
- [PayU Subscriptions API integration and mandate prerequisites](https://docs.payu.in/docs/subscriptions-integration)
