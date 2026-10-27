# MYR account backend

## Local setup

1. Use Node.js 22.13 or newer. Copy `.env.example` to `.env` and set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` with at least 12 characters. The server creates this first admin on startup if that email is not already registered. For a local demo manager, optionally set `DEMO_MANAGER_EMAIL` and `DEMO_MANAGER_PASSWORD`; the server refuses these demo manager settings in production. Credentials are read from the ignored `.env` file; do not commit it.
2. In one terminal run `npm run dev:api`.
3. In another terminal run `npm run dev` and open the Vite URL (port 3000).

For a production-style run, build the frontend with `npm run build`, then run `npm start`. The API server serves `dist/` and the API on the same origin. Set `NODE_ENV=production`, configure persistent storage, and terminate TLS at the hosting platform so secure session cookies are enabled. Without `DATABASE_URL`, existing `myr.json` data is imported on first startup into `myr.sqlite`. With `DATABASE_URL`, the service creates a PostgreSQL state table and uses a transaction lock to serialize API state changes across instances.

To enable Razorpay, set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` from the Razorpay dashboard and configure the webhook URL as `/api/payments/webhook` for `order.paid` and `payment.captured`. Use test keys first. Set `APP_ORIGIN` to the canonical site origin. To enable email, set a Resend API key and verified sender in `RESEND_API_KEY` and `EMAIL_FROM`; only then set `EMAIL_VERIFICATION_REQUIRED=true`.

## Included

- Customer registration with server-side scrypt password hashes and customer-only self-registration.
- Local admin and manager demo accounts can be seeded at startup from environment credentials; manager demo seeding is blocked in production.
- Login/logout through opaque, random, HttpOnly, SameSite=Lax cookies. Session records are stored server-side and expire after seven days.
- Admin-only role assignment for existing accounts (`customer`, `manager`, `admin`); role changes revoke that account's sessions.
- Admin account listing and manager/admin shared inbox with server-side status updates.
- Server-side catalog price editing for admins, order requests priced against the current server catalog, manager/admin order status updates, and customer order history.
- Customer support tickets linked to the signed-in account and shown in the shared manager inbox.
- Razorpay order creation, checkout signature verification, signed and idempotent webhook processing, and full refund requests for captured payments.
- Password reset and email verification token flows with one-time, expiring tokens. Delivery uses the configured Resend email API.
- Staff replies on inbox requests and customer support tickets, with email delivery when configured.
- Persistent SQLite state by default, or shared PostgreSQL state when `DATABASE_URL` is set. Both include the team roster and a bounded admin audit trail; legacy JSON data is imported on first startup.
- Signed-in customer carts persist across devices. Orders include configurable tax and physical-product shipping, shipping address, and optional inventory checks/reservations. Admin can configure tax, flat shipping, and stock in the panel.
- Request size limits, same-origin checks on mutations, generic login errors, login throttling, and basic browser security headers.

PostgreSQL mode currently stores the application state as a JSONB document and serializes API operations with a database lock. This supports multiple instances but limits throughput; migrate the entities to normalized tables before high-volume use. SQLite is intended for one process on persistent storage. If Razorpay credentials are absent, checkout creates a pending-payment order request; if Resend credentials are absent, password reset and verification emails cannot be delivered. Configure actual tax and shipping rates in the admin panel before accepting orders. Back up PostgreSQL with `pg_dump`; back up SQLite using its online backup mechanism rather than copying a live database file.
