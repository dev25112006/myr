# MYR account backend

## Local setup

1. Use Node.js 22.13 or newer. Copy `.env.example` to `.env` and set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` with at least 12 characters. The server creates this first admin on startup if that email is not already registered. For a local demo manager, optionally set `DEMO_MANAGER_EMAIL` and `DEMO_MANAGER_PASSWORD`; the server refuses these demo manager settings in production. Credentials are read from the ignored `.env` file; do not commit it.
2. In one terminal run `npm run dev:api`.
3. In another terminal run `npm run dev` and open the Vite URL (port 3000).

For a production-style run, build the frontend with `npm run build`, then run `npm start`. The API server serves `dist/` and the API on the same origin. Set `NODE_ENV=production`, configure `MONGODB_URI`, and terminate TLS at the hosting platform so secure session cookies are enabled. MongoDB is the production database. Local development can still use SQLite when no MongoDB URI is set; legacy SQLite or JSON data is imported into MongoDB on first startup if its state document is empty.

## Production operations (Render)

The project includes a Render Blueprint in `render.yaml`. It creates a paid Node web service, builds the frontend, runs the combined API/site service, checks `/api/health`, and prompts for `MONGODB_URI` without storing the URI in the repository. MongoDB Atlas stores application state, so the app does not need a Render disk. Keep the service at one instance because requests are serialized around the app's single state document. The app handles `SIGTERM` by stopping new traffic and closing database connections cleanly.

To prepare the service, connect this repository in Render and create a Blueprint from `render.yaml`. Enter `MONGODB_URI`, a working `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` (12+ characters); Render generates `TOKEN_PEPPER`. In Atlas, allow the Render service to connect and use a database user with access only to the `myr` database. Deploy and confirm `/api/health` returns `{ "ok": true }`. The app detects the Render service hostname for account emails and sitemap URLs. When adding a custom domain, configure it in Render, point the DNS records Render provides, wait for TLS provisioning, and set both `APP_ORIGIN` and `SITE_ORIGIN` to the final `https://your-domain` origin.

Public `SmartForm` submissions require Cloudflare Turnstile verification. Account login and registration use separate `AUTH_TURNSTILE_REQUIRED` and `VITE_AUTH_TURNSTILE_REQUIRED` settings. The Render Blueprint sets both to `false` so visitors can log in or register without Turnstile; registration is capped at 20 attempts per IP per hour, and login attempts are capped per IP/email. Set both flags to `true` to require Turnstile for account access, then configure `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` with a real production widget pair. Local `.env.example` contains public test-only Turnstile keys; never use those test keys in production or expose a real secret in a `VITE_` variable.

Run `npm run backup` from a machine with MongoDB Database Tools installed to create a compressed archive under `DATA_DIR/backups` (or set `BACKUP_DIR`). It uses a temporary, permission-restricted config file so the URI is not exposed in the `mongodump` command line, and keeps the newest 14 archive files. Restore into a separate/empty database with `mongorestore --config <private-config.yml> --archive=<backup.archive.gz> --gzip`; configure `uri` in that private file and restrict its permissions. For ongoing protection, enable Atlas backups for the cluster if the selected Atlas tier supports them, and periodically copy a `mongodump` archive to separate storage. Restore a backup in a separate environment before relying on it.

Atlas backup retention depends on the cluster tier and is configured in the Atlas project; it has not been changed by this code. The local `mongodump` command is available for portable exports, but no offsite archive destination or schedule has been configured yet.

To enable PayU India hosted checkout, set `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` from the PayU dashboard and use `PAYU_ENV=test` while staging. Set `PAYU_ENV=production` only with production credentials and after completing a real sandbox review. Set `APP_ORIGIN` to the canonical HTTPS origin so PayU can return customers to `/api/payments/payu/return`; the app verifies PayU's response hash and calls Verify Payment before marking an order paid. The refund callback URL is `/api/payments/payu/refund-callback`; refunds remain pending until PayU reports their final status. To enable email, set a Resend API key and verified sender in `RESEND_API_KEY` and `EMAIL_FROM`; only then set `EMAIL_VERIFICATION_REQUIRED=true`.

Local test checkout can be enabled with `COMMERCE_TEST_MODE=true` only when `NODE_ENV` is not `production`, `PAYU_ENV=test`, and PayU test merchant credentials are configured. The checkout and account screens identify sandbox transactions. This override does not approve tax or shipping for production; verify those business values before enabling live checkout. The Render Blueprint does not enable this override.

Set `SITE_ORIGIN` to the clone's public origin before running `npm run seo`; generated canonical metadata and sitemap URLs use that value. The client also uses the current host for canonical URLs at runtime. Do not set it to the reference website.

## Included

- Customer registration with server-side scrypt password hashes and customer-only self-registration.
- Local admin and manager demo accounts can be seeded at startup from environment credentials; manager demo seeding is blocked in production.
- Login/logout through opaque, random, HttpOnly, SameSite=Lax cookies. Session records are stored server-side and expire after seven days.
- Admin-only role assignment for existing accounts (`customer`, `manager`, `admin`); role changes revoke that account's sessions.
- Admin account listing and manager/admin shared inbox with server-side status updates.
- Public website inquiry, sales, booking, partnership, newsletter preference, CRM lead, and refund forms save labelled field values to the shared inbox. `SmartForm` submissions and login/register popups require Cloudflare Turnstile server verification. Sales/booking/partnership inquiries are leads; refund requests are tickets; preference updates are forms.
- Staff tasks with assignment to active admin/manager accounts, due dates, status changes, deletion, persistence, and audit events.
- Signed-in user profile details (name, phone, timezone), plus staff-only shared team chat with bounded message history.
- CSV lead import is staff-only, validated on the server, batched into inbox records, and audited.
- Product reviews are limited to verified buyers, stored pending moderation, publicly returned only when approved, and moderated by admins.
- Server-side catalog price editing for admins, order requests priced against the current server catalog, manager/admin order status updates, and customer order history.
- Customer support tickets linked to the signed-in account and shown in the shared manager inbox.
- PayU hosted checkout, reverse-hash and server-side payment verification, and refund initiation with status reconciliation.
- Password reset and email verification token flows with one-time, expiring tokens. Delivery uses the configured Resend email API.
- Staff replies on inbox requests and customer support tickets, with email delivery when configured.
- Refund requests currently accept text fields only. Attachments are not accepted or stored; if evidence is needed, staff request it in a reply and arrange a supported transfer channel.
- MongoDB Atlas persistence in production, with local SQLite fallback for development. State includes the team roster and bounded admin audit trail; existing SQLite or legacy JSON data is imported on first startup when the MongoDB state document is empty.
- Signed-in customer carts persist across devices. Order quantities are not limited by inventory; orders include configurable tax, physical-product shipping, and shipping address. Checkout stays paused until an admin verifies the business tax and shipping settings.
- Request size limits, same-origin checks on mutations, generic login errors, login throttling, and basic browser security headers.

MongoDB currently stores application state in one document and serializes API requests within one server process. Keep one server instance and migrate entities into separate collections before higher traffic; MongoDB limits a document to 16 MB. If PayU credentials are absent, checkout creates a pending-payment order request; if Resend credentials are absent, password reset and verification emails cannot be delivered. Configure actual tax and shipping rates in the admin panel before accepting orders. Use Atlas backups and periodic `mongodump` exports for recovery.

## Remaining implementation and launch work
Deploy the Render Blueprint with the rotated MongoDB URI, production admin credentials, and chosen public domain; configure DNS/origins and enable Atlas backups plus a separate offsite archive schedule.
Configure real services: set and verify live PayU and email credentials, then configure actual tax and shipping values.
Plan for backend growth: MongoDB currently stores the whole application state as one document. Before higher traffic, migrate the entities to separate collections and use per-entity updates.
Add secured attachment storage before enabling file uploads. Define allowed types and sizes, retention, malware scanning, and staff-only download access.
Run end-to-end checks: payment and email providers still need production environment-backed verification.
