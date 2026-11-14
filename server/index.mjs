import { createServer } from 'node:http'
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { mkdir, readFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { MongoClient } from 'mongodb'
import pg from 'pg'
import { normalizeNotificationSettings, resolveRecipients, sendEmail as sendTransactionalEmail } from './email-notify.mjs'
import { checkPayURefundStatus, createPayUCheckout, initiatePayURefund, payuConfigFromEnv, payuConfigured, verifyPayUCallbackDetail, verifyPayUPayment } from './payu-commerce.mjs'

const scrypt = promisify(scryptCallback)
const port = Number(process.env.PORT || 3001)
const dataDir = path.resolve(process.env.DATA_DIR || './data')
const dbPath = path.join(dataDir, 'myr.sqlite')
const legacyDbPath = path.join(dataDir, 'myr.json')
const prod = process.env.NODE_ENV === 'production'
const testCheckoutRequested = process.env.COMMERCE_TEST_MODE === 'true'
const payuConfig = payuConfigFromEnv()
const testCheckoutEnabled = testCheckoutRequested && !prod && payuConfig.environment === 'test' && payuConfigured(payuConfig)
const authTurnstileRequired = process.env.AUTH_TURNSTILE_REQUIRED !== 'false'
const sessionTtl = 7 * 24 * 60 * 60 * 1000
const initialCatalog = [
  [2765, 'NewBiz Essentials', '/product/newbiz-essentials/', 14499, 'Website Development'], [2766, 'RevampCommerce Lite', '/product/revampcommerce-lite/', 24499, 'Website Development'], [2767, 'EliteCustom Suite', '/product/elitecustom-suite/', 59499, 'Website Development'],
  [5085, 'NewBiz Essentials', '/product/newbiz-essentials/', 14499, 'Website Development'], [5088, 'RevampCommerce Lite', '/product/revampcommerce-lite/', 24499, 'Website Development'], [5090, 'EliteCustom Suite', '/product/elitecustom-suite/', 59499, 'Website Development'],
  [3056, 'MYRLINK IP PBX IP100 V3', '/product/myrlink-ip-pbx-ip100-v3/', 65499, 'IP PBX Solution'], [2424, 'Website Development', '/product/website-development/', 14499, 'Website Development'], [2768, 'AI Digital Marketing', '/product/digital-marketing/', 6999, 'Digital Marketing'],
  [2773, 'AI Digital Marketing — Standard (Monthly)', '/product/digital-marketing/', 7999, 'Digital Marketing'], [2774, 'AI Digital Marketing — Pro+ (Monthly)', '/product/digital-marketing/', 16999, 'Digital Marketing'], [2775, 'AI Digital Marketing — Standard (Annual)', '/product/digital-marketing/', 6999, 'Digital Marketing'], [2776, 'AI Digital Marketing — Pro+ (Annual)', '/product/digital-marketing/', 14999, 'Digital Marketing'],
  [6001, 'School ERP', '/education-erp/school/', 5000, 'ERP'], [6002, 'College ERP', '/education-erp/college/', 7000, 'ERP'], [6003, 'Coaching ERP', '/education-erp/coaching/', 4000, 'ERP'],
  [6004, 'CRM Software', '/crm-development/', 8000, 'CRM'], [6005, 'HRM Software', '/hrm-solutions/', 3000, 'HRM'],
  [6006, 'E-commerce Website', '/ecommerce-solutions/', 24999, 'E-commerce'], [6007, 'Billing Software', '/contact-us/', 4999, 'Billing'],
].map(([id, name, slug, price, category]) => ({ id, name, slug, price, category, type: 'simple' }))
/** Starter blog articles — shared with the frontend bundle (src/content/blogs.json). */
const seedBlogs = (() => {
  try {
    const parsed = JSON.parse(readFileSync(new URL('../src/content/blogs.json', import.meta.url), 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('[blogs] seed content unavailable', error?.message || error)
    return []
  }
})()
let db = {
  users: [], sessions: [], inbox: [], orders: [], reviews: [], catalog: initialCatalog, carts: {}, team: [], tasks: [], chatMessages: [], audit: [], webhookEvents: [], blogs: seedBlogs,
  jobs: [], jobApplications: [], posts: [],
  settings: { taxRateBps: 0, shippingFlat: 0, commerceVerified: false, emailNotifications: normalizeNotificationSettings({}) },
}
let database
let pgPool
let mongoClient
let mongoCollection
let mongoQueue = Promise.resolve()
let requestClient

function configuredOrigin(value) {
  if (value) return new URL(value.includes('://') ? value : `https://${value}`).origin
  if (process.env.RENDER_EXTERNAL_URL) return new URL(process.env.RENDER_EXTERNAL_URL).origin
  if (process.env.RENDER_EXTERNAL_HOSTNAME) return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
  return `http://localhost:${port}`
}

/**
 * Auth records accumulate forever: every login appends a session and every
 * verification/reset appends a token, and only individual flows ever removed
 * their own. Trim the expired ones as part of each write so the store stays
 * bounded without a separate sweeper.
 */
function pruneExpiredAuthRecords() {
  const now = Date.now()
  if (Array.isArray(db.sessions)) db.sessions = db.sessions.filter((item) => item && item.expiresAt > now)
  if (Array.isArray(db.emailTokens)) db.emailTokens = db.emailTokens.filter((item) => item && item.expiresAt > now)
}

async function persist() {
  pruneExpiredAuthRecords()
  if (mongoCollection) {
    await mongoCollection.updateOne(
      { _id: 'primary' },
      { $set: { state: JSON.parse(JSON.stringify(db)), updatedAt: new Date() } },
      { upsert: true },
    )
    return
  }
  if (pgPool) {
    const queryable = requestClient || pgPool
    await queryable.query('INSERT INTO myr_app_state (id, state, updated_at) VALUES (1, $1::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state, updated_at = EXCLUDED.updated_at', [JSON.stringify(db)])
    return
  }
  database.prepare('INSERT INTO app_state (id, state, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at').run(JSON.stringify(db), new Date().toISOString())
}
async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derived = await scrypt(password, salt, 64)
  return { salt, hash: derived.toString('hex') }
}
function tokenHash(value) { return createHmac('sha256', process.env.TOKEN_PEPPER || 'myr-local-token-pepper-change-me').update(value).digest('hex') }
async function issueEmailToken(user, purpose) {
  const token = randomBytes(32).toString('hex')
  db.emailTokens ||= []
  db.emailTokens = db.emailTokens.filter((item) => !(item.userId === user.id && item.purpose === purpose))
  db.emailTokens.push({ userId: user.id, purpose, hash: tokenHash(token), expiresAt: Date.now() + (purpose === 'reset' ? 60 : 24 * 60) * 60 * 1000 })
  await persist()
  const origin = configuredOrigin(process.env.APP_ORIGIN)
  const route = purpose === 'reset' ? '/my-account/reset-password/?token=' : '/my-account/verify-email/?token='
  await sendTransactionalEmail(user.email, purpose === 'reset' ? 'Reset your MYR account password' : 'Verify your MYR account email', `<p>Use the link below to ${purpose === 'reset' ? 'reset your password' : 'verify your email'}:</p><p><a href="${origin}${route}${token}">Continue</a></p><p>This link expires in ${purpose === 'reset' ? '60 minutes' : '24 hours'}.</p>`)
}

async function issueSaasEmailToken(user) {
  const token = randomBytes(32).toString('hex')
  db.emailTokens ||= []
  db.emailTokens = db.emailTokens.filter((item) => !(item.userId === user.id && item.purpose === 'saas_verify'))
  db.emailTokens.push({ userId: user.id, purpose: 'saas_verify', hash: tokenHash(token), expiresAt: Date.now() + 24 * 60 * 60 * 1000 })
  await persist()
  const origin = configuredOrigin(process.env.APP_ORIGIN)
  await sendTransactionalEmail(user.email, 'Verify your MYR SaaS email', `<p>Use the link below to verify your SaaS email:</p><p><a href="${origin}/api/saas/verify-email?token=${token}">Continue</a></p><p>This link expires in 24 hours.</p>`)
}

/**
 * Resolves the recipients for an event and starts delivery without blocking the
 * caller. A slow or broken mail server must not stall — or, if it threw, fail —
 * a request whose database write already succeeded, so the delivery promise is
 * detached and only logged.
 */
function triggerNotification({ user, event = 'default', subject, html, text, includeUser = true, roles = [], explicitEmails = [] }) {
  try {
    const recipients = resolveRecipients({
      users: db.users,
      settings: db.settings?.emailNotifications || normalizeNotificationSettings({}),
      event,
      user,
      includeUser,
      roles,
      explicitEmails,
    })
    if (!recipients.length) return Promise.resolve(false)
    void Promise.resolve(sendTransactionalEmail(recipients, subject, html, { text })).catch((error) => {
      console.error('[notify] delivery failed', { event, subject, message: error?.message || error })
      return false
    })
    return Promise.resolve(true)
  } catch (error) {
    console.error('[notify] failed', { event, subject, message: error?.message || error })
    return Promise.resolve(false)
  }
}
function publicUser(user) { return { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified !== false, createdAt: user.createdAt } }
function json(res, status, data, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers })
  res.end(JSON.stringify(data))
}
async function body(req, maxBytes = 128_000) {
  // Concatenate as Buffers: appending string chunks directly splits multi-byte
  // UTF-8 characters that straddle a chunk boundary and corrupt the JSON.
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))
    size += buffer.length
    if (size > maxBytes) throw Object.assign(new Error('Request too large'), { status: 413 })
    chunks.push(buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  try { return raw ? JSON.parse(raw) : {} } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }) }
}
async function rawBody(req) {
  const chunks = []; let size = 0
  for await (const chunk of req) { size += chunk.length; if (size > 128_000) throw Object.assign(new Error('Request too large'), { status: 413 }); chunks.push(chunk) }
  return Buffer.concat(chunks).toString('utf8')
}
async function formBody(req) {
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/x-www-form-urlencoded')) throw Object.assign(new Error('Expected a URL-encoded form.'), { status: 415 })
  return Object.fromEntries(new URLSearchParams(await rawBody(req)))
}
function recordAudit(actor, action, target, detail = {}) {
  db.audit ||= []
  db.audit.unshift({ id: randomBytes(8).toString('hex'), actorId: actor.id, actorEmail: actor.email, action, target, detail, date: new Date().toISOString() })
  db.audit = db.audit.slice(0, 2000)
}
function slugifyBlog(value) {
  return String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96)
}
/** Coerce + default an incoming blog payload against an existing post (or {}). */
function sanitizeBlog(input, base) {
  const title = String(input.title ?? base.title ?? '').trim()
  const content = String(input.content ?? base.content ?? '')
  const words = content.split(/\s+/).filter(Boolean).length
  const fallbackMinutes = Math.max(1, Math.ceil(words / 220))
  let tags = base.tags ?? []
  if (Array.isArray(input.tags)) tags = input.tags.map((tag) => String(tag).trim()).filter(Boolean)
  else if (typeof input.tags === 'string') tags = input.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
  return {
    title,
    slug: slugifyBlog(String(input.slug ?? base.slug ?? title)) || 'post',
    excerpt: String(input.excerpt ?? base.excerpt ?? '').trim(),
    content,
    category: String(input.category ?? base.category ?? '').trim() || 'General',
    tags: [...new Set(tags.map((tag) => tag.toLowerCase()))].slice(0, 12).map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)),
    author: String(input.author ?? base.author ?? '').trim() || 'MYR Editorial Team',
    coverImage: String(input.coverImage ?? base.coverImage ?? '').trim(),
    status: ['draft', 'published'].includes(input.status) ? input.status : (base.status === 'draft' ? 'draft' : 'published'),
    featured: typeof input.featured === 'boolean' ? input.featured : base.featured === true,
    readingMinutes: Math.max(1, Math.min(180, Math.round(Number(input.readingMinutes ?? base.readingMinutes) || fallbackMinutes))),
  }
}
function validBlogFields(fields) {
  if (fields.title.length < 3 || fields.title.length > 150) return 'Title must be between 3 and 150 characters.'
  if (fields.content.length < 10 || fields.content.length > 100_000) return 'Content must be between 10 and 100,000 characters.'
  if (fields.excerpt.length > 400) return 'Excerpt must be 400 characters or fewer.'
  if (!fields.slug) return 'A valid slug is required.'
  return null
}
function cookie(req, name) {
  return (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}
function cookieHeader(value, maxAge) {
  return `myr_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${prod ? '; Secure' : ''}`
}
function csrfCheck(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return true
  if (req.url?.startsWith('/api/payments/payu/return') || req.url?.startsWith('/api/payments/payu/refund-callback')) return true
  const origin = req.headers.origin
  if (!origin) return !prod
  try {
    const originUrl = new URL(origin)
    const requestHost = String(req.headers.host || '').toLowerCase()
    if (originUrl.host.toLowerCase() === requestHost) return true
    if (prod) return false
    const localHosts = new Set(['localhost', '127.0.0.1', '[::1]'])
    const requestHostname = new URL(`http://${requestHost}`).hostname.toLowerCase()
    return localHosts.has(originUrl.hostname.toLowerCase()) && localHosts.has(requestHostname)
  } catch { return false }
}
function emailOk(email) { return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }
/** True when either configured provider (SMTP or Resend) can actually send mail. */
function emailProviderConfigured() {
  const smtpOk = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const resendOk = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
  return smtpOk || resendOk
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}
async function verifyHumanToken(token) {
  if (!process.env.TURNSTILE_SECRET_KEY) return { configured: false, verified: false }
  if (typeof token !== 'string' || !token.trim()) return { configured: true, verified: false }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token.trim() }),
      signal: AbortSignal.timeout(6000),
    })
    const result = response.ok ? await response.json() : null
    return { configured: true, verified: result?.success === true }
  } catch { return { configured: true, verified: false, unavailable: true } }
}
function dateOnlyOk(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
function passwordOk(password) { return typeof password === 'string' && password.length >= 12 && password.length <= 200 }
function payuStatusIsSuccess(value) {
  if (value === null || value === undefined) return false
  const text = String(value).trim().toLowerCase()
  return text === 'success' || text === '1' || text === 'true'
}

/**
 * Every PayU transaction id issued for an order. A customer who presses "pay
 * now" twice gets two valid transaction ids; if the first one is the one that
 * actually captured money, verification and reconciliation must still recognise
 * it instead of reporting a mismatch and leaving the payment unsettled.
 */
function orderTxnIds(order) {
  const ids = new Set()
  if (order?.payuTxnId) ids.add(String(order.payuTxnId))
  for (const id of Array.isArray(order?.payuTxnIds) ? order.payuTxnIds : []) if (id) ids.add(String(id))
  return [...ids]
}

function rememberPayUTxnId(order, txnid) {
  const id = String(txnid || '')
  if (!id) return
  const ids = new Set(orderTxnIds(order))
  ids.add(id)
  order.payuTxnIds = [...ids]
  order.payuTxnId = id
}

/**
 * Server-side confirmation from PayU's Verify Payment API. The transaction id and
 * amount are what bind the provider record to our order; the udf echo is only
 * enforced when PayU actually returned it, because some transaction modes omit it.
 */
function providerConfirmsOrder(providerPayment, order) {
  if (!providerPayment || !payuStatusIsSuccess(providerPayment.status)) return false
  if (!orderTxnIds(order).includes(String(providerPayment.txnid || ''))) return false
  const providerAmount = Math.round(Number(providerPayment.amt ?? providerPayment.amount) * 100)
  if (!Number.isSafeInteger(providerAmount) || providerAmount !== order.total * 100) return false
  if (!String(providerPayment.mihpayid || '')) return false
  if (providerPayment.udf1 && providerPayment.udf1 !== order.id) return false
  if (providerPayment.udf2 && providerPayment.udf2 !== order.userId) return false
  return true
}

async function sendPaymentReceiptEmail(order) {
  const customer = db.users.find((item) => item.id === order.userId)
  if (!customer) return false
  const accountUrl = new URL('/my-account/', configuredOrigin(process.env.APP_ORIGIN)).toString()
  const itemsHtml = order.items.map((item) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb">${item.name}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:center">${item.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price * item.qty}</td></tr>`).join('')
  const html = `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Payment confirmed — thank you for your purchase</h2><p>Hi ${customer.profile?.name || customer.email},</p><p>Your payment for order <strong>${order.id}</strong> has been verified by PayU.</p><table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr style="text-align:left;border-bottom:2px solid #e5e7eb;"><th style="padding:6px 10px">Item</th><th style="padding:6px 10px;text-align:center">Qty</th><th style="padding:6px 10px;text-align:right">Price</th><th style="padding:6px 10px;text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table><table style="width:100%;border-collapse:collapse;margin:16px 0;"><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Subtotal</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.subtotal}</td></tr><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Tax</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.tax}</td></tr><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Shipping</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.shipping}</td></tr><tr><td style="padding:8px 10px;border-top:2px solid #166534;text-align:right"><strong>Total paid</strong></td><td style="padding:8px 10px;border-top:2px solid #166534;text-align:right"><strong>₹${order.total}</strong></td></tr></table><p>Transaction ID: <code>${order.payuTxnId}</code> · PayU payment ID: <code>${order.payuPaymentId}</code></p><p>You can view this order anytime in your <a href="${accountUrl}">account panel</a>.</p><p style="color:#6b7280;font-size:12px">This is an automated receipt from MYR. Please keep it for your records.</p></div>`
  const text = `Your payment for order ${order.id} (₹${order.total}) has been confirmed by PayU. Items: ${order.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}. Transaction ID: ${order.payuTxnId}.`
  // The receipt goes to the customer alone; admins get their own notification so
  // neither party sees the other's address in the To: header. Delivery is
  // detached so a slow mail server cannot hold the payment redirect open.
  void Promise.resolve(sendTransactionalEmail(customer.email, `Receipt — Payment confirmed for order ${order.id}`, html, { text })).then((sent) => {
    if (!sent) console.error('[payu] receipt email was not delivered', { orderId: order.id, to: customer.email })
    return sent
  }).catch((error) => { console.error('[payu] receipt delivery failed', { orderId: order.id, message: error?.message }); return false })
  void triggerNotification({ user: null, includeUser: false, roles: ['admin'], event: 'payment', subject: `Payment received — order ${order.id} (₹${order.total})`, html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Payment received</h2><p>Order <strong>${order.id}</strong> from ${customer.email} has been confirmed by PayU.</p><ul>${order.items.map((item) => `<li>${item.name} × ${item.qty} — ₹${item.price * item.qty}</li>`).join('')}</ul><p><strong>Total: ₹${order.total}</strong> · PayU payment ID: ${order.payuPaymentId}</p><p>Update it from the admin panel.</p></div>`, text: `Payment received for order ${order.id} from ${customer.email}. Total ₹${order.total}. PayU payment ID ${order.payuPaymentId}.` })
  return true
}

/** Marks an order paid exactly once and fans out the receipt + admin notification. */
async function settlePaidOrder(order, providerPayment, source) {
  if (order.paymentStatus === 'paid') return false
  order.paymentStatus = 'paid'
  order.status = 'Paid'
  order.payuPaymentId = String(providerPayment.mihpayid)
  order.updatedAt = new Date().toISOString()
  order.lastPaymentCheck = { at: order.updatedAt, result: 'paid', source }
  // A paid SaaS checkout unlocks the workspace it was bought for.
  if (order.organizationId) {
    const organization = (db.organizations || []).find((item) => item.id === order.organizationId)
    if (organization && organization.status !== 'active') {
      organization.status = 'active'
      organization.activatedAt = order.updatedAt
    }
  }
  await persist()
  try { await sendPaymentReceiptEmail(order) } catch (error) { console.error('[payu] receipt delivery failed', { orderId: order.id, message: error?.message }) }
  console.log('[payu] order settled', { orderId: order.id, txnid: order.payuTxnId, payuPaymentId: order.payuPaymentId, source })
  return true
}

/**
 * A browser return callback can be lost (closed tab, dropped network, provider
 * hiccup) even though PayU already captured the money. Re-check a few awaiting
 * orders against Verify Payment so the payment still settles, the receipt goes
 * out and both panels update without the customer having to do anything.
 */
const paymentReconcileIntervalMs = 2 * 60_000
async function reconcileAwaitingPayments(limit = 5) {
  if (!payuConfigured(payuConfig)) return 0
  const now = Date.now()
  // Phase 1 — pick the candidates from a locked snapshot. Mutating `db` outside
  // the mongo/PG snapshot queue (as this job used to) races concurrent requests
  // and gets clobbered by the next read, so every access goes through
  // `exclusive()`. No network call happens while the lock is held.
  const candidates = await exclusive(() => db.orders.filter((order) => {
    if (order.paymentStatus === 'paid') return false
    if (!orderTxnIds(order).length) return false
    if (!['Awaiting payment', 'Pending payment'].includes(order.status)) return false
    if (!order.lastPaymentCheck) return true
    const checkedAt = Date.parse(order.lastPaymentCheck.at)
    return Number.isFinite(checkedAt) && now - checkedAt > paymentReconcileIntervalMs
  }).slice(0, limit).map((order) => ({ id: order.id, txnids: orderTxnIds(order) })))
  if (!candidates.length) return 0

  let settled = 0
  for (const candidate of candidates) {
    // A retried checkout can have several ids; check them until one is confirmed.
    let providerPayment = null
    let failure = null
    for (const txnid of candidate.txnids) {
      try {
        const result = await verifyPayUPayment(payuConfig, txnid)
        if (result) { providerPayment = result; break }
      } catch (error) {
        failure = error
        console.error('[payu] reconciliation unavailable', { orderId: candidate.id, txnid, message: error?.message })
        break
      }
    }
    // Phase 2 — re-read the order under a fresh lock and only then write, so the
    // result is applied to current state rather than a detached copy.
    const result = await exclusive(async () => {
      const order = db.orders.find((item) => item.id === candidate.id)
      if (!order || order.paymentStatus === 'paid') return false
      if (!failure && providerConfirmsOrder(providerPayment, order)) {
        return settlePaidOrder(order, providerPayment, 'background reconciliation')
      }
      order.lastPaymentCheck = {
        at: new Date().toISOString(),
        result: failure ? 'unavailable' : `provider:${String(providerPayment?.status || 'unknown').toLowerCase()}`,
      }
      await persist()
      return false
    })
    if (result) settled += 1
  }
  return settled
}

/* --------------------------------- OTP verification --------------------------------- */

const otpStore = new Map() // email -> { code, expiresAt, attempts, resendAt }
const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes
const OTP_MAX_ATTEMPTS = 5
const OTP_RESEND_COOLDOWN_MS = 60 * 1000 // 1 minute between resends

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6-digit code
}

function normalizeOtpEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function otpEntry(email) {
  return otpStore.get(normalizeOtpEmail(email))
}

function setOtp(email, code, purpose) {
  const key = normalizeOtpEmail(email)
  otpStore.set(key, {
    code,
    purpose: purpose || 'register',
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    // A fresh send is not subject to the resend cooldown; only subsequent
    // resend attempts are, so `resendAt` must start in the future.
    resendAt: Date.now() + OTP_RESEND_COOLDOWN_MS,
  })
  // Cleanup expired entries periodically
  if (otpStore.size > 10000) {
    const now = Date.now()
    for (const [k, v] of otpStore.entries()) {
      if (v.expiresAt < now) otpStore.delete(k)
    }
  }
}

function incrementOtpAttempts(email) {
  const key = normalizeOtpEmail(email)
  const entry = otpStore.get(key)
  if (entry) { entry.attempts += 1; otpStore.set(key, entry) }
  return entry
}

function clearOtp(email) {
  otpStore.delete(normalizeOtpEmail(email))
}

/**
 * Server-side record that an address actually passed OTP verification.
 * The register endpoint used to trust a client-supplied `otpVerified: true`
 * (the UI hard-codes it), which made the whole check meaningless.
 */
const otpVerifiedRegistrations = new Map() // email -> expiry epoch ms
const OTP_VERIFIED_TTL_MS = 15 * 60 * 1000

function markOtpVerified(email) {
  const now = Date.now()
  for (const [key, expiresAt] of otpVerifiedRegistrations) if (expiresAt <= now) otpVerifiedRegistrations.delete(key)
  if (otpVerifiedRegistrations.size > 10_000) otpVerifiedRegistrations.clear()
  otpVerifiedRegistrations.set(normalizeOtpEmail(email), now + OTP_VERIFIED_TTL_MS)
}

function otpVerifiedRecently(email) {
  const key = normalizeOtpEmail(email)
  const expiresAt = otpVerifiedRegistrations.get(key)
  if (!expiresAt) return false
  if (expiresAt <= Date.now()) { otpVerifiedRegistrations.delete(key); return false }
  return true
}

async function sendOtpEmail(email, code, purpose = 'register') {
  const purposeLabel = purpose === 'register' ? 'Account Verification' : purpose === 'login' ? 'Login Verification' : 'Password Reset'
  // The address is user-supplied and lands inside HTML, so it is escaped before
  // interpolation (an attacker requesting an OTP for `<img src=x onerror=...>`
  // would otherwise inject markup into the message body).
  return await sendTransactionalEmail(email, `MYR — ${purposeLabel} OTP`, `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Your MYR verification code</h2><p>Hi ${escapeHtml(email)},</p><p>Your one-time password (OTP) for <strong>${purposeLabel}</strong> is:</p><div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#166534;background:#f0fdf4;border:2px dashed #166534;padding:16px;text-align:center;margin:20px 0;">${code}</div><p>This code expires in 10 minutes. Do not share it with anyone.</p><p>If you didn't request this, please ignore this email.</p><p style="color:#6b7280;font-size:12px">This is an automated email from MYR Advance Solution.</p></div>`, { text: `Your MYR ${purposeLabel} OTP is ${code}. It expires in 10 minutes.` })
}

/* --------------------------------- end OTP --------------------------------- */
/* --------------------------------- production middleware --------------------------------- */

// Request logging + x-request-id. This hooks `res.on('finish')` rather than a
// `res.send` method, which Node's http.ServerResponse never has (so the old
// version silently logged nothing).
const requestLog = (req, res, next) => {
  const requestId = String(req.headers['x-request-id'] || '').slice(0, 64) || randomBytes(8).toString('hex')
  res.setHeader('x-request-id', requestId)
  const start = Date.now()
  res.on('finish', () => {
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'
    console.log(JSON.stringify({
      level,
      requestId,
      method: req.method,
      path: req.url,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'] || '',
    }))
  })
  next()
}

// Behind Render (or any reverse proxy) every request arrives from the proxy, so
// keying rate limits on the socket address collapses every user into one bucket
// and lets a single visitor lock the site down. Prefer the forwarded client.
function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  if (forwarded && /^\d{1,3}(\.\d{1,3}){3}$/.test(forwarded)) return forwarded
  if (forwarded && forwarded.includes(':')) return forwarded
  return req.socket.remoteAddress || 'unknown'
}

function endpointRateLimit(config) {
  const buckets = new Map()
  let lastPrune = 0
  return (req, res) => {
    const key = clientIp(req) + ':' + (req.url || '')
    const now = Date.now()
    // Buckets are per (IP, path); without pruning this Map grows forever and
    // becomes a slow memory leak under scanner traffic.
    if (buckets.size > 20_000 && now - lastPrune > 60_000) {
      lastPrune = now
      for (const [bucketKey, bucket] of buckets) if (now > bucket.reset) buckets.delete(bucketKey)
    }
    const current = buckets.get(key) || { count: 0, reset: now + config.windowMs }
    if (now > current.reset) { current.count = 0; current.reset = now + config.windowMs }
    current.count += 1
    buckets.set(key, current)
    if (current.count > config.max) {
      json(res, 429, { error: 'Too many requests. Please try again later.', retryAfter: Math.ceil((current.reset - now) / 1000) })
      return false
    }
    return true
  }
}

const globalLimit = endpointRateLimit({ windowMs: 60_000, max: 300 }) // 300 req/min per IP
const authLimit = endpointRateLimit({ windowMs: 60_000, max: 20 }) // 20 auth req/min per IP
const otpLimit = endpointRateLimit({ windowMs: 60_000, max: 10 }) // 10 OTP req/min per IP
const checkoutLimit = endpointRateLimit({ windowMs: 60_000, max: 30 }) // 30 checkout req/min per IP
const jobApplyLimit = endpointRateLimit({ windowMs: 60_000, max: 8 }) // 8 job applications/min per IP

/* --------------------------------- end production middleware --------------------------------- */

const loginAttempts = new Map()
const registrationAttempts = new Map()

function allowRegistration(req) {
  const key = clientIp(req)
  const now = Date.now()
  const current = registrationAttempts.get(key) || { count: 0, reset: now + 60 * 60_000 }
  if (now >= current.reset) { current.count = 0; current.reset = now + 60 * 60_000 }
  if (current.count >= 20) return false
  current.count += 1
  registrationAttempts.set(key, current)
  if (registrationAttempts.size > 5000) {
    for (const [address, attempts] of registrationAttempts) if (now >= attempts.reset) registrationAttempts.delete(address)
  }
  return true
}

async function init() {
  let saved
  if (testCheckoutRequested && !testCheckoutEnabled) throw new Error('COMMERCE_TEST_MODE requires non-production mode, PAYU_ENV=test, and PayU merchant credentials.')
  if (prod && !process.env.MONGODB_URI) throw new Error('Set MONGODB_URI to the production MongoDB connection string.')
  if (process.env.MONGODB_URI) {
    mongoClient = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 5, serverSelectionTimeoutMS: 10_000 })
    await mongoClient.connect()
    mongoCollection = mongoClient.db().collection('myr_app_state')
    saved = (await mongoCollection.findOne({ _id: 'primary' }))?.state
    if (!saved) {
      try {
        await stat(dbPath)
        const legacyDatabase = new DatabaseSync(dbPath, { readOnly: true })
        try {
          const hasStateTable = legacyDatabase.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'app_state'").get()
          if (hasStateTable) saved = legacyDatabase.prepare('SELECT state FROM app_state WHERE id = 1').get()?.state
        } finally { legacyDatabase.close() }
      } catch (error) { if (error.code !== 'ENOENT') throw error }
      if (!saved) {
        try { saved = JSON.parse(await readFile(legacyDbPath, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
      }
    }
  } else if (process.env.DATABASE_URL) {
    pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 10_000 })
    await pgPool.query('CREATE TABLE IF NOT EXISTS myr_app_state (id SMALLINT PRIMARY KEY CHECK (id = 1), state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())')
    const result = await pgPool.query('SELECT state FROM myr_app_state WHERE id = 1')
    saved = result.rows[0]?.state
  } else {
    await mkdir(dataDir, { recursive: true, mode: 0o700 })
    database = new DatabaseSync(dbPath)
    database.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL; CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK (id = 1), state TEXT NOT NULL, updated_at TEXT NOT NULL)')
    saved = database.prepare('SELECT state FROM app_state WHERE id = 1').get()?.state
  }
  if (saved) db = { ...db, ...(typeof saved === 'string' ? JSON.parse(saved) : saved) }
  else { try { db = { ...db, ...JSON.parse(await readFile(legacyDbPath, 'utf8')) } } catch (error) { if (error.code !== 'ENOENT') throw error } }
  db.catalog = initialCatalog.map((base) => {
    const { stock, ...existing } = (db.catalog || []).find((item) => item.id === base.id) || {}
    const renamedStoreProducts = [2768, 2773, 2774, 2775, 2776]
    return { ...base, ...existing, ...(renamedStoreProducts.includes(base.id) ? { name: base.name } : {}) }
  })
  db.orders ||= []
  for (const order of db.orders) delete order.stockReserved
  db.tasks ||= []
  db.chatMessages ||= []
  db.reviews ||= []
  db.settings = { taxRateBps: 0, shippingFlat: 0, commerceVerified: false, emailNotifications: normalizeNotificationSettings({}), ...(db.settings || {}) }
  db.settings.emailNotifications = normalizeNotificationSettings(db.settings.emailNotifications)
  if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && !process.env.EMAIL_FROM) throw new Error('Set EMAIL_FROM before requiring email verification.')
  if (process.env.ADMIN_EMAIL || process.env.ADMIN_PASSWORD) {
    const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD || ''
    if (!emailOk(email) || !passwordOk(password) || password === 'replace-with-a-unique-password') throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD to real values; the admin password must be at least 12 characters.')
    const existing = db.users.find((user) => user.email === email)
    if (!existing) {
      const credentials = await hashPassword(password)
      db.users.push({ id: randomBytes(16).toString('hex'), email, role: 'admin', emailVerified: true, ...credentials, createdAt: new Date().toISOString() })
      await persist()
    }
  }
  if (process.env.DEMO_MANAGER_EMAIL || process.env.DEMO_MANAGER_PASSWORD) {
    if (prod) throw new Error('Demo manager credentials are development-only; remove DEMO_MANAGER_EMAIL and DEMO_MANAGER_PASSWORD in production.')
    const email = String(process.env.DEMO_MANAGER_EMAIL || '').trim().toLowerCase()
    const password = process.env.DEMO_MANAGER_PASSWORD || ''
    if (!emailOk(email) || !passwordOk(password)) throw new Error('Set both DEMO_MANAGER_EMAIL and DEMO_MANAGER_PASSWORD; the password must be at least 12 characters.')
    const existing = db.users.find((user) => user.email === email)
    if (!existing) {
      const credentials = await hashPassword(password)
      db.users.push({ id: randomBytes(16).toString('hex'), email, role: 'manager', emailVerified: true, ...credentials, createdAt: new Date().toISOString() })
    } else if (existing.role !== 'manager') throw new Error('The configured demo manager email already belongs to a different role.')
  }
  await persist()
}

/**
 * Runs `work` against a freshly-read database snapshot while holding the same
 * cross-instance lock a request handler holds, then persists if `work` wrote.
 * Background jobs (payment reconciliation) use this instead of touching `db`
 * directly, so they can neither read stale state nor interleave with a request
 * that is mid-write. No network I/O should happen inside `work`.
 */
async function exclusive(work) {
  if (mongoCollection) {
    const previous = mongoQueue
    let release
    mongoQueue = new Promise((resolve) => { release = resolve })
    await previous
    try {
      const current = await mongoCollection.findOne({ _id: 'primary' })
      if (current?.state) db = { ...db, ...current.state }
      return await work()
    } finally {
      release()
    }
  }
  if (pgPool) {
    const client = await pgPool.connect()
    try {
      await client.query('BEGIN')
      await client.query('SELECT pg_advisory_xact_lock(742819340)')
      const result = await client.query('SELECT state FROM myr_app_state WHERE id = 1 FOR UPDATE')
      if (result.rows[0]?.state) db = { ...db, ...result.rows[0].state }
      requestClient = client
      const value = await work()
      await client.query('COMMIT')
      return value
    } catch (error) {
      try { await client.query('ROLLBACK') } catch {}
      throw error
    } finally {
      requestClient = undefined
      client.release()
    }
  }
  return await work()
}

async function withDatabaseSnapshot(req, res) {
  // Only API traffic goes through the snapshot queue; static requests share the
  // in-memory state and need no lock.
  if (!req.url?.startsWith('/api/')) return handle(req, res)
  try {
    await exclusive(() => handle(req, res))
  } catch (error) {
    if (!res.headersSent) json(res, 500, { error: 'Internal server error' })
    else res.destroy(error)
    console.error(error)
  }
}

/* ------------------------- SaaS catalog projection ------------------------- */
/**
 * This deployment's only product data is the published store catalog, so the
 * SaaS surfaces project it into the documented `{ products: [...] }` product/plan
 * shape instead of returning a bare array (which every client already treated as
 * an object, so the endpoint rendered nothing).
 *
 * Only products whose own name states a billing term become purchasable plans;
 * everything else is exposed with `interval: "custom"` and is therefore offered
 * as "contact sales" rather than being silently sold as a subscription.
 */
function saasPlanInterval(name) {
  if (/(monthly|per\s*month|\bmonth\b)/i.test(name)) return 'month'
  if (/(annual|yearly|per\s*year|\byear\b)/i.test(name)) return 'year'
  return 'custom'
}

function saasSlug(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()
}

function saasProducts() {
  const products = new Map()
  for (const item of db.catalog) {
    if (!item || typeof item.name !== 'string' || typeof item.slug !== 'string') continue
    const slug = saasSlug(item.slug)
    if (!slug) continue
    let product = products.get(slug)
    if (!product) {
      product = { id: slug, slug, name: item.name, summary: `${item.category || 'Software'} from MYR`, category: item.category || 'General', features: [], hasLaunchTarget: false, plans: [] }
      products.set(slug, product)
    } else if (item.name.length < product.name.length) {
      // The shortest label is the umbrella name; longer ones carry plan suffixes.
      product.name = item.name
    }
    product.plans.push({
      id: String(item.id),
      slug: `${slug}-${item.id}`,
      name: item.name,
      interval: saasPlanInterval(item.name),
      currency: 'INR',
      amountMinor: Number.isSafeInteger(item.price) ? item.price * 100 : null,
      price: item.price,
      trialDays: 0,
      limits: {},
      features: [],
      regionCodes: [],
      enterprise: false,
      enabled: true,
    })
  }
  return [...products.values()]
}

function saasOrganizationView(org) {
  return {
    id: org.id,
    name: org.name,
    countryCode: org.countryCode,
    billingCountryCode: org.billingCountryCode || org.countryCode,
    status: org.status,
    // There is no separate membership table in this deployment; ownership is the
    // only membership, and it is always the caller's own organization here.
    role: 'owner',
    createdAt: org.createdAt,
  }
}

async function handle(req, res) {
  res.setHeader('x-content-type-options', 'nosniff')
  res.setHeader('x-frame-options', 'DENY')
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin')
  if (prod) res.setHeader('strict-transport-security', 'max-age=31536000; includeSubDomains; preload')
  requestLog(req, res, () => {})
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathName = url.pathname

  // Global rate limit
  if (!globalLimit(req, res)) return

  // Per-endpoint rate limits
  if (pathName.startsWith('/api/auth/')) {
    if (pathName.includes('/otp/')) { if (!otpLimit(req, res)) return }
    else { if (!authLimit(req, res)) return }
  }
  if (pathName === '/api/orders' && req.method === 'POST') { if (!checkoutLimit(req, res)) return }
  if (pathName === '/api/inbox' && req.method === 'POST') { if (!authLimit(req, res)) return }
  if (/^\/api\/jobs\/[a-f0-9]+\/apply$/.test(pathName) && req.method === 'POST') { if (!jobApplyLimit(req, res)) return }

  if (!csrfCheck(req)) return json(res, 403, { error: 'Request origin rejected' })
  const sessionId = cookie(req, 'myr_session')
  const session = db.sessions.find((item) => item.id === sessionId && item.expiresAt > Date.now())
  const user = session && db.users.find((item) => item.id === session.userId)
  const requireRole = (...roles) => {
    if (!user) { json(res, 401, { error: 'Sign in required' }); return false }
    if (!roles.includes(user.role)) { json(res, 403, { error: 'Insufficient permissions' }); return false }
    if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && user.emailVerified === false) { json(res, 403, { error: 'Verify your email before using this feature.' }); return false }
    return true
  }
  try {
    if (req.method === 'GET' && pathName === '/api/health') {
      const checks = { ok: true, services: {} }
      try {
        if (mongoCollection) {
          await mongoCollection.findOne({ _id: 'health' }, { maxTimeMS: 3000 })
          checks.services.mongodb = 'connected'
        } else {
          checks.services.mongodb = 'not-configured'
        }
      } catch { checks.services.mongodb = 'error'; checks.ok = false }
      if (pgPool) {
        try { await pgPool.query('SELECT 1'); checks.services.postgresql = 'connected' } catch { checks.services.postgresql = 'error'; checks.ok = false }
      } else {
        checks.services.postgresql = 'not-configured'
      }
      checks.services.smtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ? 'configured' : 'not-configured'
      checks.services.payu = payuConfigured(payuConfig) ? 'configured' : 'not-configured'
      return json(res, checks.ok ? 200 : 503, checks)
    }
    if (req.method === 'POST' && pathName === '/api/test-email') {
      // Sending mail to an arbitrary address from an unauthenticated caller is an
      // open relay; only an admin may trigger a test delivery.
      if (!requireRole('admin')) return
      const input = await body(req)
      const to = String(input.to || process.env.ADMIN_EMAIL || '').trim()
      if (!to || !emailOk(to)) return json(res, 400, { error: 'Provide a valid recipient email in body { "to": "..." }' })
      const smtpOk = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM)
      const resendOk = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
      if (!smtpOk && !resendOk) return json(res, 503, { error: 'No email provider configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM or RESEND_API_KEY/EMAIL_FROM.' })
      const sent = await sendTransactionalEmail(to, 'MYR — SMTP Test Email', `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">SMTP email is working</h2><p>This is a test email from your MYR server.</p><p>Provider: ${smtpOk ? 'SMTP (' + process.env.SMTP_HOST + ')' : 'Resend'}</p><p>If you received this, all customer emails (welcome, order receipt, payment confirmation, form submission) will also be delivered.</p></div>`, { text: 'MYR SMTP test email — email delivery is active.' })
      return json(res, 200, { ok: true, sent, provider: smtpOk ? 'smtp' : 'resend', to })
    }
    if (req.method === 'GET' && pathName === '/api/auth/session') return json(res, 200, { user: user ? publicUser(user) : null })
    if (req.method === 'GET' && pathName === '/api/catalog') return json(res, 200, { products: db.catalog })

    /* --------------------------------- Careers --------------------------------- */
    /** Public job listing: only published, currently open positions. */
    if (req.method === 'GET' && pathName === '/api/jobs') {
      db.jobs ||= []
      const jobs = db.jobs
        .filter((job) => job.status === 'Published' && job.isOpen !== false)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      return json(res, 200, { jobs, count: jobs.length })
    }
    const jobApplyMatch = pathName.match(/^\/api\/jobs\/([a-f0-9]+)\/apply$/)
    if (jobApplyMatch && req.method === 'POST') {
      db.jobs ||= []
      const job = db.jobs.find((item) => item.id === jobApplyMatch[1] && item.status === 'Published')
      if (!job) return json(res, 404, { error: 'This position is not accepting applications.' })
      if (job.isOpen === false) return json(res, 409, { error: 'This position has been closed for applications.' })
      const input = await body(req)
      const humanCheck = await verifyHumanToken(input.humanToken)
      if (humanCheck.configured || authTurnstileRequired) {
        if (!humanCheck.configured) return json(res, 503, { error: 'Human verification is not configured.' })
        if (humanCheck.unavailable) return json(res, 503, { error: 'Human verification is temporarily unavailable. Please try again.' })
        if (!humanCheck.verified) return json(res, 403, { error: 'Human verification failed. Please try again.' })
      }
      const name = typeof input.name === 'string' ? input.name.trim() : ''
      const email = typeof input.email === 'string' ? input.email.trim() : ''
      const phone = typeof input.phone === 'string' ? input.phone.trim() : ''
      const experience = typeof input.experience === 'string' ? input.experience.trim().slice(0, 80) : ''
      const candidateLocation = typeof input.location === 'string' ? input.location.trim().slice(0, 180) : ''
      const portfolio = typeof input.portfolio === 'string' ? input.portfolio.trim().slice(0, 300) : ''
      const coverNote = typeof input.coverNote === 'string' ? input.coverNote.trim().slice(0, 4000) : ''
      if (name.length < 2 || name.length > 180) return json(res, 400, { error: 'Provide your full name.' })
      if (!emailOk(email)) return json(res, 400, { error: 'Provide a valid email address.' })
      if (phone && !/^[+()\d\s-]{6,20}$/.test(phone)) return json(res, 400, { error: 'Provide a valid phone number or leave it empty.' })
      if (portfolio && !/^https?:\/\/\S+\.\S+/.test(portfolio)) return json(res, 400, { error: 'Portfolio / LinkedIn link must be a valid URL.' })
      if (coverNote.length > 4000) return json(res, 400, { error: 'Cover note may not exceed 4,000 characters.' })
      db.jobApplications ||= []
      if (db.jobApplications.some((item) => item.jobId === job.id && item.email.toLowerCase() === email.toLowerCase())) {
        return json(res, 409, { error: 'You have already applied to this position with this email address.' })
      }
      const application = {
        id: randomBytes(12).toString('hex'),
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.department || '',
        name, email, phone, experience, location: candidateLocation, portfolio, coverNote,
        status: 'New',
        createdAt: new Date().toISOString(),
      }
      db.jobApplications.unshift(application)
      await persist()
      const fieldsHtml = [['Experience', application.experience], ['Location', application.location], ['Phone', application.phone], ['Portfolio / LinkedIn', application.portfolio]]
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:left"><strong>${escapeHtml(String(label))}</strong></td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:left">${escapeHtml(String(value))}</td></tr>`)
        .join('')
      triggerNotification({
        event: 'contact',
        includeUser: false,
        subject: `New job application — ${job.title}`,
        html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">New job application</h2><p><strong>${escapeHtml(job.title)}</strong>${job.department ? ` · ${escapeHtml(job.department)}` : ''}</p><p>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>${fieldsHtml ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr style="text-align:left;border-bottom:2px solid #e5e7eb;"><th style="padding:6px 10px">Field</th><th style="padding:6px 10px">Value</th></tr></thead><tbody>${fieldsHtml}</tbody></table>` : ''}${coverNote ? `<p style="white-space:pre-line">${escapeHtml(coverNote)}</p>` : ''}<p style="color:#6b7280;font-size:12px">Review it in the admin dashboard → Job applications (ref ${application.id}).</p></div>`,
        text: `New job application for ${job.title}: ${name} (${email})${application.experience ? `, ${application.experience}` : ''}.`,
      })
      if (email) {
        // Detached delivery — a slow/failed mail server must not stall the response.
        void Promise.resolve(sendTransactionalEmail(email, `We received your application — ${job.title}`, `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Thank you for applying to MYR</h2><p>Hi ${escapeHtml(name)},</p><p>We've received your application for <strong>${escapeHtml(job.title)}</strong> (reference ${application.id}). Our team reviews every application and will reach out if your profile matches the role.</p><p style="color:#6b7280;font-size:12px">This is an automated confirmation from MYR Advance Solution.</p></div>`, { text: `Thank you for applying to ${job.title} at MYR. Reference ${application.id}.` })).catch((error) => console.error('[notify] delivery failed', { event: 'job.apply.confirm', message: error?.message || error }))
      }
      return json(res, 201, { ok: true, applicationId: application.id, message: 'Application received. Our team will get back to you.' })
    }

    if (req.method === 'GET' && pathName === '/api/saas/products') {
      return json(res, 200, { products: saasProducts() })
    }

    if (req.method === 'GET' && pathName === '/api/saas/organizations') {
      if (!user) return json(res, 401, { error: 'Sign in required.' })
      const organizations = (db.organizations || []).filter((org) => org.ownerId === user.id).map(saasOrganizationView)
      return json(res, 200, { organizations })
    }

    if (req.method === 'POST' && pathName === '/api/saas/organizations') {
      if (!user) return json(res, 401, { error: 'Sign in required.' })
      const input = await body(req)
      const name = String(input.name || '').trim()
      const countryCode = String(input.countryCode || '').trim().toUpperCase()
      if (name.length < 2 || name.length > 180 || !/^[A-Z]{2}$/.test(countryCode)) return json(res, 400, { error: 'Provide a name (2–180 characters) and a two-letter country code.' })
      db.organizations = db.organizations || []
      const org = {
        id: randomBytes(12).toString('hex'),
        name,
        countryCode,
        status: 'pending',
        ownerId: user.id,
        createdAt: new Date().toISOString(),
      }
      db.organizations.unshift(org)
      await persist()
      return json(res, 201, { ok: true, organization: saasOrganizationView(org) })
    }
    const productReviewsMatch = pathName.match(/^\/api\/products\/(\d+)\/reviews$/)
    if (productReviewsMatch && req.method === 'GET') {
      const productId = Number(productReviewsMatch[1])
      const product = db.catalog.find((item) => item.id === productId)
      if (!product) return json(res, 404, { error: 'Product not found.' })
      const reviews = db.reviews.filter((item) => item.productId === productId && item.status === 'approved').sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(({ id, productId: idValue, productName, rating, title, comment, authorName, createdAt }) => ({ id, productId: idValue, productName, rating, title, comment, authorName, createdAt }))
      const averageRating = reviews.length ? Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length * 10) / 10 : null
      return json(res, 200, { reviews, count: reviews.length, averageRating })
    }
    if (productReviewsMatch && req.method === 'POST') {
      if (!requireRole('customer')) return
      const productId = Number(productReviewsMatch[1])
      const product = db.catalog.find((item) => item.id === productId)
      if (!product) return json(res, 404, { error: 'Product not found.' })
      const input = await body(req)
      const rating = Number(input.rating)
      const title = typeof input.title === 'string' ? input.title.trim() : ''
      const comment = typeof input.comment === 'string' ? input.comment.trim() : ''
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json(res, 400, { error: 'Rating must be a whole number from 1 to 5.' })
      if (title.length < 3 || title.length > 120) return json(res, 400, { error: 'Review title must be between 3 and 120 characters.' })
      if (comment.length < 10 || comment.length > 5000) return json(res, 400, { error: 'Review comment must be between 10 and 5,000 characters.' })
      const reviewPurchaseIds = productId === 2768 ? new Set([2768, 2773, 2774, 2775, 2776]) : new Set([productId])
      const purchased = db.orders.some((order) => order.userId === user.id && order.paymentStatus === 'paid' && order.items.some((item) => reviewPurchaseIds.has(item.id)))
      if (!purchased) return json(res, 403, { error: 'A verified purchase is required to review this product.' })
      if (db.reviews.some((review) => review.userId === user.id && review.productId === productId)) return json(res, 409, { error: 'You have already submitted a review for this product.' })
      const review = { id: randomBytes(12).toString('hex'), productId, productName: product.name, userId: user.id, authorName: user.profile?.name || 'Verified customer', rating, title, comment, status: 'pending', createdAt: new Date().toISOString() }
      db.reviews.unshift(review); await persist()
      const { userId, ...safeReview } = review
      return json(res, 201, { review: safeReview, message: 'Review submitted for moderation.' })
    }
    if (req.method === 'GET' && pathName === '/api/admin/reviews') {
      if (!requireRole('admin')) return
      const requestedStatus = url.searchParams.get('status') || 'pending'
      if (!['pending', 'approved', 'rejected', 'all'].includes(requestedStatus)) return json(res, 400, { error: 'Status must be pending, approved, rejected, or all.' })
      const reviews = db.reviews.filter((item) => requestedStatus === 'all' || item.status === requestedStatus).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      return json(res, 200, { reviews })
    }
    const adminReviewMatch = pathName.match(/^\/api\/admin\/reviews\/([a-f0-9]+)$/)
    if (adminReviewMatch && req.method === 'PATCH') {
      if (!requireRole('admin')) return
      const review = db.reviews.find((item) => item.id === adminReviewMatch[1])
      if (!review) return json(res, 404, { error: 'Review not found.' })
      const input = await body(req)
      if (!['approved', 'rejected', 'pending'].includes(input.status)) return json(res, 400, { error: 'Review status must be approved, rejected, or pending.' })
      const previousStatus = review.status
      review.status = input.status
      review.moderatedAt = new Date().toISOString()
      review.moderatedBy = user.id
      recordAudit(user, 'review.moderate', review.id, { productId: review.productId, previousStatus, status: review.status })
      await persist()
      return json(res, 200, { review })
    }
    /* ---------- Blog posts (public read, admin write) ---------- */
    if (req.method === 'GET' && pathName === '/api/blogs') {
      db.blogs ||= []
      const blogs = db.blogs.filter((item) => item.status !== 'draft').sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      return json(res, 200, { blogs })
    }
    const publicBlogMatch = pathName.match(/^\/api\/blogs\/([^/]+)$/)
    if (publicBlogMatch && req.method === 'GET') {
      db.blogs ||= []
      const slug = decodeURIComponent(publicBlogMatch[1])
      const blog = db.blogs.find((item) => item.slug === slug && item.status !== 'draft')
      if (!blog) return json(res, 404, { error: 'Post not found.' })
      return json(res, 200, { blog })
    }
    if (req.method === 'GET' && pathName === '/api/admin/blogs') {
      if (!requireRole('admin')) return
      db.blogs ||= []
      const blogs = db.blogs.slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      return json(res, 200, { blogs })
    }
    if (req.method === 'POST' && pathName === '/api/admin/blogs') {
      if (!requireRole('admin')) return
      const input = await body(req)
      const fields = sanitizeBlog(input, {})
      const invalid = validBlogFields(fields)
      if (invalid) return json(res, 400, { error: invalid })
      db.blogs ||= []
      if (db.blogs.some((item) => item.slug === fields.slug)) return json(res, 409, { error: 'A post with this slug already exists.' })
      const now = new Date().toISOString()
      const blog = { id: randomBytes(12).toString('hex'), ...fields, createdAt: now, updatedAt: now }
      db.blogs.unshift(blog)
      recordAudit(user, 'blog.create', blog.slug, { title: blog.title, status: blog.status })
      await persist()
      return json(res, 201, { blog })
    }
    const adminBlogMatch = pathName.match(/^\/api\/admin\/blogs\/([a-f0-9]+)$/)
    if (adminBlogMatch && req.method === 'PATCH') {
      if (!requireRole('admin')) return
      db.blogs ||= []
      const blog = db.blogs.find((item) => item.id === adminBlogMatch[1])
      if (!blog) return json(res, 404, { error: 'Post not found.' })
      const input = await body(req)
      const fields = sanitizeBlog(input, blog)
      const invalid = validBlogFields(fields)
      if (invalid) return json(res, 400, { error: invalid })
      if (db.blogs.some((item) => item.id !== blog.id && item.slug === fields.slug)) return json(res, 409, { error: 'A post with this slug already exists.' })
      const previousStatus = blog.status
      Object.assign(blog, fields, { updatedAt: new Date().toISOString() })
      recordAudit(user, 'blog.update', blog.slug, { title: blog.title, previousStatus, status: blog.status })
      await persist()
      return json(res, 200, { blog })
    }
    if (adminBlogMatch && req.method === 'DELETE') {
      if (!requireRole('admin')) return
      db.blogs ||= []
      const index = db.blogs.findIndex((item) => item.id === adminBlogMatch[1])
      if (index === -1) return json(res, 404, { error: 'Post not found.' })
      const [removed] = db.blogs.splice(index, 1)
      recordAudit(user, 'blog.delete', removed.slug, { title: removed.title })
      await persist()
      return json(res, 200, { ok: true })
    }

    /* ------------------------------- Admin: careers ------------------------------- */
    if (req.method === 'GET' && pathName === '/api/admin/jobs') {
      if (!requireRole('admin')) return
      db.jobs ||= []; db.jobApplications ||= []
      const jobs = [...db.jobs].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      const applicationCounts = {}
      for (const application of db.jobApplications) applicationCounts[application.jobId] = (applicationCounts[application.jobId] || 0) + 1
      return json(res, 200, { jobs, applicationCounts })
    }
    if (req.method === 'POST' && pathName === '/api/admin/jobs') {
      if (!requireRole('admin')) return
      const input = await body(req)
      const job = {
        id: randomBytes(12).toString('hex'),
        title: String(input.title || '').trim().slice(0, 160),
        department: String(input.department || '').trim().slice(0, 80) || 'General',
        location: String(input.location || '').trim().slice(0, 180) || 'Remote',
        employmentType: ['Full-time', 'Part-time', 'Contract', 'Internship'].includes(input.employmentType) ? input.employmentType : 'Full-time',
        experience: String(input.experience || '').trim().slice(0, 80),
        salaryRange: String(input.salaryRange || '').trim().slice(0, 120),
        description: String(input.description || '').trim().slice(0, 8000),
        requirements: String(input.requirements || '').trim().slice(0, 4000),
        status: input.status === 'Published' ? 'Published' : 'Draft',
        isOpen: input.isOpen !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (job.title.length < 3 || job.description.length < 10) return json(res, 400, { error: 'Provide a title (3+ characters) and a description (10+ characters).' })
      db.jobs ||= []
      db.jobs.unshift(job)
      recordAudit(user, 'job.create', job.id, { title: job.title, status: job.status })
      await persist()
      return json(res, 201, { job })
    }
    const adminJobMatch = pathName.match(/^\/api\/admin\/jobs\/([a-f0-9]+)$/)
    if (adminJobMatch && req.method === 'PATCH') {
      if (!requireRole('admin')) return
      db.jobs ||= []
      const job = db.jobs.find((item) => item.id === adminJobMatch[1])
      if (!job) return json(res, 404, { error: 'Job not found.' })
      const input = await body(req)
      const previousStatus = job.status
      if (input.title !== undefined) job.title = String(input.title).trim().slice(0, 160) || job.title
      if (input.department !== undefined) job.department = String(input.department).trim().slice(0, 80) || job.department
      if (input.location !== undefined) job.location = String(input.location).trim().slice(0, 180) || job.location
      if (input.employmentType !== undefined && ['Full-time', 'Part-time', 'Contract', 'Internship'].includes(input.employmentType)) job.employmentType = input.employmentType
      if (input.experience !== undefined) job.experience = String(input.experience).trim().slice(0, 80)
      if (input.salaryRange !== undefined) job.salaryRange = String(input.salaryRange).trim().slice(0, 120)
      if (input.description !== undefined) job.description = String(input.description).trim().slice(0, 8000) || job.description
      if (input.requirements !== undefined) job.requirements = String(input.requirements).trim().slice(0, 4000)
      if (input.status !== undefined && ['Draft', 'Published'].includes(input.status)) job.status = input.status
      if (input.isOpen !== undefined) job.isOpen = input.isOpen === true
      job.updatedAt = new Date().toISOString()
      recordAudit(user, 'job.update', job.id, { title: job.title, previousStatus, status: job.status, isOpen: job.isOpen })
      await persist()
      return json(res, 200, { job })
    }
    if (adminJobMatch && req.method === 'DELETE') {
      if (!requireRole('admin')) return
      db.jobs ||= []; db.jobApplications ||= []
      const job = db.jobs.find((item) => item.id === adminJobMatch[1])
      if (!job) return json(res, 404, { error: 'Job not found.' })
      db.jobs = db.jobs.filter((item) => item.id !== job.id)
      // Applications for a removed posting are orphaned — keep them so admins can
      // still review the candidates, but they can also be pruned explicitly.
      if (String(url.searchParams.get('pruneApplications')) === 'true') db.jobApplications = db.jobApplications.filter((item) => item.jobId !== job.id)
      recordAudit(user, 'job.delete', job.id, { title: job.title })
      await persist()
      return json(res, 200, { ok: true })
    }

    if (req.method === 'GET' && pathName === '/api/admin/job-applications') {
      if (!requireRole('admin')) return
      db.jobApplications ||= []
      const status = url.searchParams.get('status') || 'all'
      if (!['New', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected', 'all'].includes(status)) return json(res, 400, { error: 'Invalid status filter.' })
      const applications = db.jobApplications
        .filter((item) => status === 'all' || item.status === status)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      return json(res, 200, { applications, counts: { total: db.jobApplications.length, unread: db.jobApplications.filter((item) => item.status === 'New').length } })
    }
    const adminApplicationMatch = pathName.match(/^\/api\/admin\/job-applications\/([a-f0-9]+)$/)
    if (adminApplicationMatch && req.method === 'PATCH') {
      if (!requireRole('admin')) return
      db.jobApplications ||= []
      const application = db.jobApplications.find((item) => item.id === adminApplicationMatch[1])
      if (!application) return json(res, 404, { error: 'Application not found.' })
      const input = await body(req)
      if (!['New', 'Reviewed', 'Shortlisted', 'Hired', 'Rejected'].includes(input.status)) return json(res, 400, { error: 'Application status must be New, Reviewed, Shortlisted, Hired, or Rejected.' })
      const previousStatus = application.status
      application.status = input.status
      application.reviewedAt = new Date().toISOString()
      application.reviewedBy = user.id
      recordAudit(user, 'job.application.status', application.id, { jobTitle: application.jobTitle, candidate: application.email, previousStatus, status: application.status })
      await persist()
      return json(res, 200, { application })
    }
    if (adminApplicationMatch && req.method === 'DELETE') {
      if (!requireRole('admin')) return
      db.jobApplications ||= []
      const application = db.jobApplications.find((item) => item.id === adminApplicationMatch[1])
      if (!application) return json(res, 404, { error: 'Application not found.' })
      db.jobApplications = db.jobApplications.filter((item) => item.id !== application.id)
      recordAudit(user, 'job.application.delete', application.id, { jobTitle: application.jobTitle, candidate: application.email })
      await persist()
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/quote') {
      const input = await body(req); if (!Array.isArray(input.items) || !input.items.length || input.items.length > 30) return json(res, 400, { error: 'Cart is empty or invalid.' })
      const items = []
      for (const row of input.items) { const product = db.catalog.find((p) => p.id === Number(row.id)); const qty = Number(row.qty); if (!product || !Number.isSafeInteger(qty) || qty < 1 || !Number.isSafeInteger(product.price * qty)) return json(res, 400, { error: 'Product or quantity is invalid.' }); items.push({ id: product.id, name: product.name, price: product.price, qty, category: product.category }) }
      const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0); const shipping = items.some((item) => item.category === 'IP PBX Solution') ? db.settings.shippingFlat : 0; const tax = Math.round(subtotal * db.settings.taxRateBps / 10000); const total = subtotal + tax + shipping
      if (![subtotal, tax, shipping, total, total * 100].every(Number.isSafeInteger)) return json(res, 400, { error: 'Order total is too large. Reduce the quantity and try again.' })
      return json(res, 200, { items, subtotal, tax, shipping, total, currency: 'INR', commerceReady: db.settings.commerceVerified === true || testCheckoutEnabled, testMode: payuConfig.environment === 'test' && payuConfigured(payuConfig), paymentAvailable: payuConfigured(payuConfig) })
    }
    if (req.method === 'GET' && pathName === '/api/auth/verify-email') {
      const token = url.searchParams.get('token') || ''; const record = (db.emailTokens || []).find((item) => item.purpose === 'verify' && item.hash === tokenHash(token) && item.expiresAt > Date.now())
      if (!record) return json(res, 400, { error: 'Verification link is invalid or expired.' })
      const account = db.users.find((item) => item.id === record.userId); if (!account) return json(res, 404, { error: 'Account not found.' })
      account.emailVerified = true; db.emailTokens = db.emailTokens.filter((item) => item !== record); await persist()
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/auth/resend-verification') {
      if (!user) return json(res, 401, { error: 'Sign in required.' })
      if (user.emailVerified !== false) return json(res, 200, { ok: true, message: 'This email is already verified.' })
      if (!emailProviderConfigured()) return json(res, 503, { error: 'Email delivery is not configured yet.' })
      await issueEmailToken(user, 'verify')
      return json(res, 200, { ok: true, message: 'Verification email sent.' })
    }
if (req.method === 'GET' && pathName === '/api/saas/verify-email') {
      const token = url.searchParams.get('token') || ''
      const record = (db.emailTokens || [])
        .find((item) => item.purpose === 'saas_verify' && item.hash === tokenHash(token) && item.expiresAt > Date.now())
      if (!record) return json(res, 400, { error: 'Verification link is invalid or expired.' })
      const account = db.users.find((item) => item.id === record.userId)
      if (!account) return json(res, 404, { error: 'Account not found.' })
      account.saasVerified = true
      db.emailTokens = db.emailTokens.filter((item) => item !== record)
      await persist()
      return json(res, 200, { ok: true, message: 'SaaS email verified.' })
    }

    if (req.method === 'POST' && pathName === '/api/saas/email-verification/request') {
      if (!user) return json(res, 401, { error: 'Sign in required.' })
      if (user.saasVerified === true) return json(res, 200, { ok: true, message: 'This SaaS email is already verified.' })
      const smtpOk = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM)
      const resendOk = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
      if (!smtpOk && !resendOk) return json(res, 503, { error: 'No email provider configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM or RESEND_API_KEY/EMAIL_FROM.' })
      await issueSaasEmailToken(user)
      return json(res, 200, { ok: true, message: 'SaaS verification email sent.' })
    }
    if (req.method === 'POST' && pathName === '/api/saas/checkout') {
      if (!user) return json(res, 401, { error: 'Sign in required.' })
      if (user.saasVerified !== true) return json(res, 403, { error: 'Verify your SaaS email before using checkout.' })
      const input = await body(req)
      const organizationId = String(input.organizationId || '').trim()
      const planId = String(input.planId || '').trim()
      if (!organizationId || !planId) return json(res, 400, { error: 'organizationId and planId are required.' })
      const organization = (db.organizations || []).find((item) => item.id === organizationId && item.ownerId === user.id)
      if (!organization) return json(res, 404, { error: 'Organization not found or you do not have permission.' })
      if (organization.status !== 'pending' && organization.status !== 'active') return json(res, 400, { error: 'Organization is not in a valid state for checkout.' })
      const plan = (db.catalog || []).find((item) => String(item.id) === planId)
      if (!plan) return json(res, 404, { error: 'Plan not found in catalog.' })
      const interval = saasPlanInterval(plan.name)
      if (!['month', 'year'].includes(interval)) return json(res, 400, { error: 'Only monthly or annual plans can be purchased online. Contact sales for the rest.' })
      if (db.settings.commerceVerified !== true && !testCheckoutEnabled) return json(res, 409, { error: 'Checkout is paused until an admin verifies the tax and shipping settings.' })
      const taxRateBps = db.settings.taxRateBps || 0
      const subtotal = plan.price
      const tax = Math.round(subtotal * taxRateBps / 10000)
      // Software delivery has no shipping charge, so the store's flat rate is not
      // applied to a subscription order.
      const total = subtotal + tax
      if (!Number.isSafeInteger(total * 100) || total * 100 < 100) return json(res, 400, { error: 'The minimum online payment amount is ₹1.00.' })
      const orderId = 's-' + randomBytes(12).toString('hex')
      const order = {
        id: orderId,
        userId: user.id,
        email: user.email,
        organizationId: organization.id,
        planId: String(plan.id),
        items: [{ id: plan.id, name: plan.name, price: subtotal, qty: 1, category: plan.category || 'General' }],
        subtotal,
        tax,
        shipping: 0,
        total,
        currency: 'INR',
        paymentStatus: 'unpaid',
        status: 'Pending payment',
        payuTxnId: '',
        payuPaymentId: '',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (!payuConfigured(payuConfig)) return json(res, 503, { error: 'Online payment is not configured. Contact sales to complete this order.' })
      const payment = createPayUCheckout({ config: payuConfig, order, customer: { name: user.profile?.name, email: user.email, phone: user.profile?.phone }, origin: configuredOrigin(process.env.APP_ORIGIN), txnid: `MYR${Date.now()}${randomBytes(4).toString('hex')}` })
      order.payuTxnId = payment.params.txnid
      order.status = 'Awaiting payment'
      db.orders = db.orders || []
      db.orders.unshift(order)
      await persist()
      // The client posts this form straight to PayU; posting it back at our own
      // return URL (as this used to) meant PayU never received the payment.
      return json(res, 201, { order: { id: orderId, currency: 'INR', subtotalMinor: subtotal * 100, taxMinor: tax * 100, totalMinor: total * 100 }, payment: { ...payment, testMode: payuConfig.environment === 'test' } })
    }
    if (req.method === 'POST' && pathName === '/api/auth/request-password-reset') {
      if (!emailProviderConfigured()) return json(res, 503, { error: 'Password reset email is not configured. Contact support for account recovery.' })
      const input = await body(req); const email = String(input.email || '').trim().toLowerCase(); const account = db.users.find((item) => item.email === email)
      if (account) await issueEmailToken(account, 'reset')
      return json(res, 200, { ok: true, message: 'If an account exists for that email, reset instructions have been sent.' })
    }
    if (req.method === 'POST' && pathName === '/api/auth/reset-password') {
      const input = await body(req)
      if (!passwordOk(input.password)) return json(res, 400, { error: 'Use a password with at least 12 characters.' })
      const record = (db.emailTokens || []).find((item) => item.purpose === 'reset' && item.hash === tokenHash(String(input.token || '')) && item.expiresAt > Date.now())
      if (!record) return json(res, 400, { error: 'Reset link is invalid or expired.' })
      const account = db.users.find((item) => item.id === record.userId); if (!account) return json(res, 404, { error: 'Account not found.' })
      Object.assign(account, await hashPassword(input.password)); db.sessions = db.sessions.filter((item) => item.userId !== account.id); db.emailTokens = db.emailTokens.filter((item) => !(item.userId === account.id && item.purpose === 'reset')); await persist()
      return json(res, 200, { ok: true })
    }
    if ((req.method === 'POST' || req.method === 'GET') && pathName === '/api/payments/payu/return') {
      if (!payuConfigured(payuConfig)) return json(res, 503, { error: 'PayU is not configured.' })
      const input = req.method === 'GET' ? Object.fromEntries(url.searchParams) : await formBody(req)
      const redirectToAccount = (state) => {
        // A SaaS subscription lands back in the workspace it unlocks; a store
        // purchase lands in the account panel that lists it.
        const saasOrder = String(input.udf1 || '').startsWith('s-')
        const destination = new URL(saasOrder ? '/workspace/' : '/my-account/', configuredOrigin(process.env.APP_ORIGIN))
        destination.searchParams.set('payment', state)
        destination.searchParams.set('orderId', String(input.udf1 || ''))
        res.writeHead(303, { location: destination.toString(), 'cache-control': 'no-store' })
        res.end()
      }
      const order = db.orders.find((item) => item.id === input.udf1)
      if (!order) {
        console.error('[payu:return] unknown order reference', { udf1: String(input.udf1 || '').slice(0, 64), txnid: String(input.txnid || '').slice(0, 64) })
        return json(res, 400, { error: 'Order not found.' })
      }
      // The transaction id is only adopted from the callback once the response has
      // been authenticated: verifying against the ids we generated is what stops a
      // forged callback from rewriting the record before the check runs. Every id
      // previously issued for this order is accepted, so a retried checkout whose
      // first attempt is the one that captured money still verifies.
      const knownTxnIds = orderTxnIds(order)
      const callbackTxnId = String(input.txnid || '')
      const expectedOrder = knownTxnIds.includes(callbackTxnId) ? { ...order, payuTxnId: callbackTxnId } : order
      const callback = verifyPayUCallbackDetail(input, payuConfig, expectedOrder)
      if (!callback.ok) {
        console.error('[payu:return] rejected PayU response', { orderId: order.id, reason: callback.reason, providerStatus: String(input.status || ''), callbackAmount: String(input.amount || ''), callbackTxnId: callbackTxnId, expectedTxnIds: knownTxnIds, expectedAmount: order.total })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `rejected:${callback.reason}` }
        await persist()
        if (['merchant-key-mismatch', 'txnid-mismatch', 'order-reference-mismatch', 'amount-mismatch'].includes(callback.reason)) return json(res, 400, { error: 'PayU payment response does not match this order.', reason: callback.reason })
        return json(res, 400, { error: 'PayU payment response could not be verified.', reason: callback.reason })
      }
      rememberPayUTxnId(order, callbackTxnId)
      const providerStatus = String(input.status || '').toLowerCase()
      if (providerStatus !== 'success') {
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `provider:${providerStatus || 'unknown'}` }
        order.updatedAt = new Date().toISOString()
        await persist()
        return redirectToAccount(providerStatus === 'pending' ? 'pending' : 'failed')
      }
      if (order.paymentStatus === 'paid') return redirectToAccount('paid')
      let providerPayment
      try {
        providerPayment = await verifyPayUPayment(payuConfig, callbackTxnId)
      } catch (error) {
        console.error('[payu:return] Verify Payment unavailable', { orderId: order.id, txnid: callbackTxnId, message: error?.message })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: 'unavailable' }
        await persist()
        return redirectToAccount('pending')
      }
      if (!providerConfirmsOrder(providerPayment, order)) {
        console.error('[payu:return] Verify Payment did not confirm the order', { orderId: order.id, txnid: callbackTxnId, providerStatus: providerPayment?.status, providerTxnId: providerPayment?.txnid, providerAmount: providerPayment?.amt ?? providerPayment?.amount })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `provider-mismatch:${providerPayment?.status || 'unknown'}` }
        await persist()
        return redirectToAccount('failed')
      }
      await settlePaidOrder(order, providerPayment, 'PayU return callback')
      return redirectToAccount('paid')
    }
    if ((req.method === 'POST' || req.method === 'GET') && pathName === '/api/saas/payments/payu/webhook') {
      if (!payuConfigured(payuConfig)) return json(res, 503, { error: 'PayU is not configured.' })
      const input = req.method === 'GET' ? Object.fromEntries(url.searchParams) : await formBody(req)
      const order = db.orders.find((item) => item.id === input.udf1)
      if (!order) {
        console.error('[payu:webhook] unknown order reference', { udf1: String(input.udf1 || '').slice(0, 64), txnid: String(input.txnid || '').slice(0, 64) })
        return json(res, 400, { error: 'Order not found.' })
      }
      const knownTxnIds = orderTxnIds(order)
      const callbackTxnId = String(input.txnid || '')
      const expectedOrder = knownTxnIds.includes(callbackTxnId) ? { ...order, payuTxnId: callbackTxnId } : order
      const callback = verifyPayUCallbackDetail(input, payuConfig, expectedOrder)
      if (!callback.ok) {
        console.error('[payu:webhook] rejected PayU response', { orderId: order.id, reason: callback.reason, providerStatus: String(input.status || ''), callbackAmount: String(input.amount || ''), callbackTxnId: callbackTxnId, expectedTxnIds: knownTxnIds, expectedAmount: order.total })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `rejected:${callback.reason}` }
        await persist()
        return json(res, 400, { error: 'PayU payment response could not be verified.', reason: callback.reason })
      }
      rememberPayUTxnId(order, callbackTxnId)
      const providerStatus = String(input.status || '').toLowerCase()
      if (providerStatus !== 'success') {
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `provider:${providerStatus || 'unknown'}' }
        order.updatedAt = new Date().toISOString()
        await persist()
        return json(res, 200, { ok: false, reason: `provider_status:${providerStatus || 'unknown}' })
      }
      if (order.paymentStatus === 'paid') return json(res, 200, { ok: true })
      let providerPayment
      try {
        providerPayment = await verifyPayUPayment(payuConfig, callbackTxnId)
      } catch (error) {
        console.error('[payu:webhook] Verify Payment unavailable', { orderId: order.id, txnid: callbackTxnId, message: error?.message })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: 'unavailable' }
        await persist()
        return json(res, 200, { ok: false, reason: 'unavailable' })
      }
      if (!providerConfirmsOrder(providerPayment, order)) {
        console.error('[payu:webhook] Verify Payment did not confirm the order', { orderId: order.id, txnid: callbackTxnId, providerStatus: providerPayment?.status, providerTxnId: providerPayment?.txnid, providerAmount: providerPayment?.amt ?? providerPayment?.amount })
        order.lastPaymentCheck = { at: new Date().toISOString(), result: `provider-mismatch:${providerPayment?.status || 'unknown}' }
        await persist()
        return json(res, 200, { ok: false, reason: 'provider-mismatch' })
      }
      await settlePaidOrder(order, providerPayment, 'PayU webhook')
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/payments/payu/refund-callback') {
      const input = await formBody(req)
      const requestId = String(input.request_id || input.txn_update_id || '')
      const order = db.orders.find((item) => item.payuRefundRequestId && item.payuRefundRequestId === requestId)
      if (!order) return json(res, 200, { ok: true })
      try {
        const result = await checkPayURefundStatus(payuConfig, requestId)
        if (['success', 'failure', 'failed'].includes(result.status)) {
          if (result.status === 'success') { order.paymentStatus = 'refunded'; order.status = 'Refunded' }
          else { order.paymentStatus = 'paid'; order.status = 'Paid' }
          order.updatedAt = new Date().toISOString()
          await persist()
        }
      } catch { return json(res, 502, { error: 'Unable to reconcile PayU refund status.' }) }
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/auth/register') {
      if (!allowRegistration(req)) return json(res, 429, { error: 'Too many registration attempts. Try again in an hour.' })
      const input = await body(req)
      if (authTurnstileRequired) {
        const humanCheck = await verifyHumanToken(input.humanToken)
        if (!humanCheck.configured) return json(res, 503, { error: 'Human verification is not configured.' })
        if (humanCheck.unavailable) return json(res, 503, { error: 'Human verification is temporarily unavailable. Please try again.' })
        if (!humanCheck.verified) return json(res, 403, { error: 'Complete human verification before creating an account.' })
      }
      const email = String(input.email || '').trim().toLowerCase()
      if (!emailOk(email) || !passwordOk(input.password)) return json(res, 400, { error: 'Use a valid email and a password with at least 12 characters.' })
      if (db.users.some((item) => item.email === email)) return json(res, 409, { error: 'An account with this email already exists.' })
      // Require OTP verification when email verification is enforced
      // But only if the email service is actually configured; otherwise skip so
      // registration can succeed in deployments without SMTP/Resend set up.
      const emailServiceConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
        || (!!process.env.RESEND_API_KEY && process.env.EMAIL_FROM))
      const requireOtp = process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && emailServiceConfigured
      if (requireOtp && !otpVerifiedRecently(email)) return json(res, 403, { error: 'Email OTP verification is required before creating an account. Please verify your email first.' })
      const credentials = await hashPassword(input.password)
      const created = { id: randomBytes(16).toString('hex'), email, role: 'customer', emailVerified: true, ...credentials, createdAt: new Date().toISOString() }
      db.users.push(created)
      const newSession = { id: randomBytes(32).toString('hex'), userId: created.id, expiresAt: Date.now() + sessionTtl }
      db.sessions.push(newSession)
      await persist()
      if (db.settings.emailNotifications?.enabled !== false) {
        await triggerNotification({ user: { email: created.email, role: created.role }, event: 'account', subject: 'Welcome to MYR — your account is ready', html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Welcome to MYR</h2><p>Hi ${created.email},</p><p>Your account has been created successfully and your email is verified.</p><p><strong>Account email:</strong> ${created.email}</p><p><strong>Account ID:</strong> ${created.id}</p><p>Sign in at <a href="${new URL('/my-account/', configuredOrigin(process.env.APP_ORIGIN)).toString()}">your account panel</a>.</p><p style="color:#6b7280;font-size:12px">This is an automated welcome email from MYR.</p></div>`, text: `Welcome to MYR. Your account (${created.email}) has been created successfully. Sign in at ${new URL('/my-account/', configuredOrigin(process.env.APP_ORIGIN)).toString()} to browse products and place orders.` })
      }
      return json(res, 201, { user: publicUser(created) }, { 'set-cookie': cookieHeader(newSession.id, sessionTtl / 1000) })
    }
    if (req.method === 'POST' && pathName === '/api/auth/otp/send') {
      const input = await body(req)
      const email = normalizeOtpEmail(input.email)
      const purpose = String(input.purpose || 'register')
      if (!emailOk(email)) return json(res, 400, { error: 'Valid email is required.' })
      if (!['register', 'login', 'reset'].includes(purpose)) return json(res, 400, { error: 'Invalid OTP purpose.' })
      const entry = otpEntry(email)
      if (entry && Date.now() < entry.resendAt) return json(res, 429, { error: 'Please wait before requesting another code.' })
      // If registering, email must not already exist
      if (purpose === 'register' && db.users.some((item) => item.email === email)) return json(res, 409, { error: 'An account with this email already exists.' })
      // If login/reset, email must exist
      if (purpose !== 'register' && !db.users.some((item) => item.email === email)) return json(res, 404, { error: 'No account found with this email.' })
      const code = generateOtpCode()
      setOtp(email, code, purpose)
      const sent = await sendOtpEmail(email, code, purpose)
      if (!sent) { clearOtp(email); return json(res, 503, { error: 'Unable to send verification email. Please try again later.' }) }
      return json(res, 200, { ok: true, message: 'Verification code sent to your email.', expiresIn: Math.round(OTP_TTL_MS / 1000) })
    }
    if (req.method === 'POST' && pathName === '/api/auth/otp/verify') {
      const input = await body(req)
      const email = normalizeOtpEmail(input.email)
      const code = String(input.code || '').trim()
      const purpose = String(input.purpose || 'register')
      if (!emailOk(email) || !/^\d{6}$/.test(code)) return json(res, 400, { error: 'Valid email and 6-digit code are required.' })
      const entry = otpEntry(email)
      if (!entry) return json(res, 400, { error: 'No verification code found. Request a new one.' })
      if (entry.purpose !== purpose) return json(res, 400, { error: 'Verification code was issued for a different purpose.' })
      if (Date.now() > entry.expiresAt) { clearOtp(email); return json(res, 410, { error: 'Verification code has expired. Request a new one.' }) }
      if (entry.attempts >= OTP_MAX_ATTEMPTS) { clearOtp(email); return json(res, 429, { error: 'Too many verification attempts. Request a new code.' }) }
      incrementOtpAttempts(email)
      if (entry.code !== code) {
        if (entry.attempts >= OTP_MAX_ATTEMPTS) { clearOtp(email); return json(res, 429, { error: 'Too many verification attempts. Request a new code.' }) }
        return json(res, 400, { error: 'Incorrect verification code. Please try again.' })
      }
      clearOtp(email)
      if (purpose === 'register') markOtpVerified(email)
      return json(res, 200, { ok: true, email, purpose, verified: true })
    }
    if (req.method === 'POST' && pathName === '/api/auth/otp/resend') {
      const input = await body(req)
      const email = normalizeOtpEmail(input.email)
      const purpose = String(input.purpose || 'register')
      if (!emailOk(email)) return json(res, 400, { error: 'Valid email is required.' })
      const entry = otpEntry(email)
      if (!entry) return json(res, 400, { error: 'No existing verification to resend.' })
      if (Date.now() < entry.resendAt) return json(res, 429, { error: 'Please wait before requesting another code.' })
      if (purpose !== 'register' && !db.users.some((item) => item.email === email)) return json(res, 404, { error: 'No account found with this email.' })
      const code = generateOtpCode()
      setOtp(email, code, purpose)
      const sent = await sendOtpEmail(email, code, purpose)
      if (!sent) { clearOtp(email); return json(res, 503, { error: 'Unable to send verification email. Please try again later.' }) }
      return json(res, 200, { ok: true, message: 'A new verification code has been sent.', expiresIn: Math.round(OTP_TTL_MS / 1000) })
    }
    if (req.method === 'POST' && pathName === '/api/auth/login') {
      const input = await body(req)
      if (authTurnstileRequired) {
        const humanCheck = await verifyHumanToken(input.humanToken)
        if (!humanCheck.configured) return json(res, 503, { error: 'Human verification is not configured.' })
        if (humanCheck.unavailable) return json(res, 503, { error: 'Human verification is temporarily unavailable. Please try again.' })
        if (!humanCheck.verified) return json(res, 403, { error: 'Complete human verification before signing in.' })
      }
      const email = String(input.email || '').trim().toLowerCase()
      const attemptKey = `${clientIp(req)}:${email}`
      const attempts = loginAttempts.get(attemptKey) || { count: 0, reset: Date.now() + 15 * 60_000 }
      if (Date.now() > attempts.reset) { attempts.count = 0; attempts.reset = Date.now() + 15 * 60_000 }
      if (attempts.count >= 10) return json(res, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' })
      attempts.count += 1
      loginAttempts.set(attemptKey, attempts)
      const account = db.users.find((item) => item.email === email)
      const supplied = typeof input.password === 'string' ? input.password : ''
      const candidate = await hashPassword(supplied, account?.salt || '00000000000000000000000000000000')
      const valid = account && timingSafeEqual(Buffer.from(candidate.hash, 'hex'), Buffer.from(account.hash, 'hex'))
      if (!valid) return json(res, 401, { error: 'Email or password is incorrect.' })
      if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && !account.emailVerified) return json(res, 403, { error: 'Verify your email before signing in.' })
      loginAttempts.delete(attemptKey)
      const newSession = { id: randomBytes(32).toString('hex'), userId: account.id, expiresAt: Date.now() + sessionTtl }
      db.sessions = db.sessions.filter((item) => item.userId !== account.id && item.expiresAt > Date.now())
      db.sessions.push(newSession)
      await persist()
      return json(res, 200, { user: publicUser(account) }, { 'set-cookie': cookieHeader(newSession.id, sessionTtl / 1000) })
    }
    if (req.method === 'POST' && pathName === '/api/auth/logout') {
      if (sessionId) db.sessions = db.sessions.filter((item) => item.id !== sessionId)
      await persist()
      return json(res, 200, { ok: true }, { 'set-cookie': cookieHeader('', 0) })
    }
    if (req.method === 'GET' && pathName === '/api/account') {
      if (!requireRole('customer', 'manager', 'admin')) return
      return json(res, 200, { user: publicUser(user), orders: db.orders.filter((order) => order.userId === user.id).map(({ userId, ...order }) => order), inbox: db.inbox.filter((entry) => entry.ownerId === user.id).map(({ ownerId, ...entry }) => entry) })
    }
    if (req.method === 'GET' && pathName === '/api/account/profile') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const profile = user.profile || {}
      return json(res, 200, { profile: {
        email: user.email,
        role: user.role,
        name: profile.name || '',
        phone: profile.phone || '',
        timezone: profile.timezone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postalCode: profile.postalCode || '',
        country: profile.country || 'India',
      } })
    }
    if (req.method === 'PATCH' && pathName === '/api/account/profile') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req)
      const name = typeof input.name === 'string' ? input.name.trim() : ''
      const phone = typeof input.phone === 'string' ? input.phone.trim() : ''
      const timezone = typeof input.timezone === 'string' ? input.timezone.trim() : ''
      const address = typeof input.address === 'string' ? input.address.trim() : ''
      const city = typeof input.city === 'string' ? input.city.trim() : ''
      const state = typeof input.state === 'string' ? input.state.trim() : ''
      const postalCode = typeof input.postalCode === 'string' ? input.postalCode.trim() : ''
      const country = typeof input.country === 'string' && input.country.trim() ? input.country.trim() : 'India'
      if (name.length < 2 || name.length > 120) return json(res, 400, { error: 'Name must be between 2 and 120 characters.' })
      if (phone.length > 40 || (phone && !/^[+\d][\d\s().-]{5,39}$/.test(phone))) return json(res, 400, { error: 'Enter a valid phone number up to 40 characters.' })
      if (timezone.length > 80) return json(res, 400, { error: 'Timezone must be 80 characters or fewer.' })
      if (address.length > 300) return json(res, 400, { error: 'Address must be 300 characters or fewer.' })
      if (city.length > 120) return json(res, 400, { error: 'City must be 120 characters or fewer.' })
      if (state.length > 120) return json(res, 400, { error: 'State must be 120 characters or fewer.' })
      if (postalCode.length > 40) return json(res, 400, { error: 'Postal code must be 40 characters or fewer.' })
      if (country.length > 120) return json(res, 400, { error: 'Country must be 120 characters or fewer.' })
      user.profile = { ...(user.profile || {}), name, phone, timezone, address, city, state, postalCode, country }
      if (['admin', 'manager'].includes(user.role)) recordAudit(user, 'profile.update', user.id, { fields: ['name', 'phone', 'timezone', 'address', 'city', 'state', 'postalCode', 'country'] })
      await persist()
      return json(res, 200, { profile: { email: user.email, role: user.role, ...user.profile } })
    }
    if (pathName === '/api/account/cart' && req.method === 'GET') {
      if (!requireRole('customer', 'manager', 'admin')) return
      return json(res, 200, { items: db.carts?.[user.id] || [] })
    }
    if (pathName === '/api/account/cart' && req.method === 'PUT') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req); if (!Array.isArray(input.items) || input.items.length > 30) return json(res, 400, { error: 'Invalid cart.' })
      const items = []
      for (const row of input.items) { const product = db.catalog.find((p) => p.id === Number(row.id)); const qty = Number(row.qty); if (!product || !Number.isSafeInteger(qty) || qty < 1 || !Number.isSafeInteger(product.price * qty)) return json(res, 400, { error: 'Invalid product or quantity in cart.' }); items.push({ id: product.id, qty, variant: String(row.variant || '').slice(0, 100) }) }
      db.carts ||= {}; db.carts[user.id] = items; await persist(); return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/orders') {
      if (!requireRole('customer', 'manager', 'admin')) return
      if (db.settings.commerceVerified !== true && !testCheckoutEnabled) return json(res, 409, { error: 'Checkout is paused until an admin verifies the tax and shipping settings.' })
      const input = await body(req)
      if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 30) return json(res, 400, { error: 'Your cart is empty or invalid.' })
      const items = []
      for (const row of input.items) {
        const product = db.catalog.find((p) => p.id === Number(row.id))
        const qty = Number(row.qty)
        if (!product || !Number.isSafeInteger(qty) || qty < 1 || !Number.isSafeInteger(product.price * qty)) return json(res, 400, { error: 'A product or quantity in your cart is invalid.' })
        items.push({ id: product.id, name: product.name, price: product.price, qty, category: product.category })
      }
      const subtotal = items.reduce((n, item) => n + item.price * item.qty, 0); const shipping = items.some((item) => item.category === 'IP PBX Solution') ? db.settings.shippingFlat : 0; const tax = Math.round(subtotal * db.settings.taxRateBps / 10000)
      const total = subtotal + tax + shipping
      if (![subtotal, tax, shipping, total, total * 100].every(Number.isSafeInteger)) return json(res, 400, { error: 'Order total is too large. Reduce the quantity and try again.' })
      if (input.expectedTotal !== undefined && (!Number.isSafeInteger(input.expectedTotal) || input.expectedTotal !== total)) return json(res, 409, { error: 'The catalog price or checkout total changed. Review the updated total and try again.', currentTotal: total })
      const requiresShipping = items.some((item) => item.category === 'IP PBX Solution')
      const address = input.shippingAddress || {}
      const savedProfile = user.profile || {}
      const normalizedAddress = {
        name: typeof address.name === 'string' ? address.name.trim() : (savedProfile.name || ''),
        phone: typeof address.phone === 'string' ? address.phone.trim() : (savedProfile.phone || ''),
        address: typeof address.address === 'string' ? address.address.trim() : (savedProfile.address || ''),
        city: typeof address.city === 'string' ? address.city.trim() : (savedProfile.city || ''),
        state: typeof address.state === 'string' ? address.state.trim() : (savedProfile.state || ''),
        postalCode: typeof address.postalCode === 'string' ? address.postalCode.trim() : (savedProfile.postalCode || ''),
        country: typeof address.country === 'string' && address.country.trim() ? address.country.trim() : (savedProfile.country || 'India'),
      }
      if (requiresShipping && ['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'].some((key) => !normalizedAddress[key].trim())) return json(res, 400, { error: 'Complete the shipping address for physical products.' })
      const hasCustomerDetails = ['name', 'phone'].some((key) => normalizedAddress[key].trim())
      const storedAddress = hasCustomerDetails ? Object.fromEntries(['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'].map((key) => [key, String(normalizedAddress[key] || '').trim().slice(0, 300)])) : null
      user.profile = { ...(user.profile || {}), name: normalizedAddress.name || user.profile?.name || '', phone: normalizedAddress.phone || user.profile?.phone || '', address: normalizedAddress.address || user.profile?.address || '', city: normalizedAddress.city || user.profile?.city || '', state: normalizedAddress.state || user.profile?.state || '', postalCode: normalizedAddress.postalCode || user.profile?.postalCode || '', country: normalizedAddress.country || user.profile?.country || 'India', timezone: typeof user.profile?.timezone === 'string' ? user.profile.timezone : '' }
      const order = { id: `MYR-${randomBytes(6).toString('hex').toUpperCase()}`, userId: user.id, email: user.email, items, subtotal, tax, shipping, total, shippingAddress: storedAddress, status: 'Pending payment', paymentStatus: 'unpaid', date: new Date().toISOString(), notes: String(input.notes || '').slice(0, 2000) }
      if (!Number.isSafeInteger(order.total * 100) || order.total * 100 < 100) return json(res, 400, { error: 'The minimum online payment amount is ₹1.00.' })
      const payment = payuConfigured(payuConfig) ? createPayUCheckout({ config: payuConfig, order, customer: { name: user.profile?.name, email: user.email, phone: user.profile?.phone }, origin: configuredOrigin(process.env.APP_ORIGIN), txnid: `MYR${Date.now()}${randomBytes(4).toString('hex')}` }) : null
      if (payment) { order.payuTxnId = payment.params.txnid; order.status = 'Awaiting payment' }
      db.orders.unshift(order)
      db.inbox.unshift({ id: randomBytes(12).toString('hex'), type: 'order', subject: `Order ${order.id}`, name: user.email, email: user.email, message: items.map((item) => `${item.name} × ${item.qty}`).join(', '), date: order.date, status: 'New', source: 'Account checkout', ownerId: user.id })
      await persist()
      const orderItemsHtml = order.items.map((item) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb">${item.name}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:center">${item.qty}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price}</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price * item.qty}</td></tr>`).join('')
      await triggerNotification({ user: { email: user.email, role: user.role }, event: 'order', subject: `Order confirmation — ${order.id}`, html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Order confirmed — ${order.id}</h2><p>Hi ${user.profile?.name || user.email},</p><p>Your order <strong>${order.id}</strong> has been placed successfully.</p><table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr style="text-align:left;border-bottom:2px solid #e5e7eb;"><th style="padding:6px 10px">Item</th><th style="padding:6px 10px;text-align:center">Qty</th><th style="padding:6px 10px;text-align:right">Price</th><th style="padding:6px 10px;text-align:right">Total</th></tr></thead><tbody>${orderItemsHtml}</tbody></table><table style="width:100%;border-collapse:collapse;margin:16px 0;"><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Subtotal</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.subtotal}</td></tr><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Tax</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.tax}</td></tr><tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">Shipping</td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">₹${order.shipping}</td></tr><tr><td style="padding:8px 10px;border-top:2px solid #166534;text-align:right"><strong>Total</strong></td><td style="padding:8px 10px;border-top:2px solid #166534;text-align:right"><strong>₹${order.total}</strong></td></tr></table><p style="color:#6b7280;font-size:12px">Payment status: ${order.paymentStatus}. You will receive a separate confirmation once PayU verifies your payment.</p></div>`, text: `Your order ${order.id} has been placed. Items: ${order.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}. Total: ₹${order.total}. Payment status: ${order.paymentStatus}.` })
      const { userId, ...safeOrder } = order
      return json(res, 201, { order: safeOrder, ...(payment ? { payment: { ...payment, testMode: payuConfig.environment === 'test' } } : {}) })
    }
    const cancelOrderMatch = pathName.match(/^\/api\/account\/orders\/([A-Z0-9-]+)\/cancel$/)
    const retryPaymentMatch = pathName.match(/^\/api\/account\/orders\/([A-Z0-9-]+)\/payment$/)
    if (req.method === 'POST' && retryPaymentMatch) {
      if (!requireRole('customer', 'manager', 'admin')) return
      const order = db.orders.find((item) => item.id === retryPaymentMatch[1] && item.userId === user.id)
      if (!order) return json(res, 404, { error: 'Order not found.' })
      if (!['Pending payment', 'Awaiting payment'].includes(order.status) || order.paymentStatus === 'paid') return json(res, 409, { error: 'This order is not awaiting payment.' })
      if (!payuConfigured(payuConfig)) return json(res, 503, { error: 'Online payment is not configured. Contact support to complete this order.' })
      const payment = createPayUCheckout({ config: payuConfig, order, customer: { name: user.profile?.name, email: user.email, phone: user.profile?.phone }, origin: configuredOrigin(process.env.APP_ORIGIN), txnid: `MYR${Date.now()}${randomBytes(4).toString('hex')}` })
      // Keep the previous transaction id: the customer may return from the first
      // attempt having actually paid, and that payment must still be verifiable.
      rememberPayUTxnId(order, payment.params.txnid)
      order.status = 'Awaiting payment'; await persist()
      return json(res, 200, { orderId: order.id, payment: { ...payment, testMode: payuConfig.environment === 'test' } })
    }
    if (req.method === 'POST' && cancelOrderMatch) {
      if (!requireRole('customer', 'manager', 'admin')) return
      const order = db.orders.find((item) => item.id === cancelOrderMatch[1] && item.userId === user.id)
      if (!order) return json(res, 404, { error: 'Order not found.' })
      if (order.paymentStatus === 'paid' || !['Pending payment', 'Awaiting payment'].includes(order.status)) return json(res, 409, { error: 'This order can no longer be cancelled online. Contact support for help.' })
      order.status = 'Cancelled'; order.updatedAt = new Date().toISOString(); await persist()
      const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
    }
    if (req.method === 'POST' && pathName === '/api/account/support') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req)
      if (typeof input.subject !== 'string' || input.subject.trim().length < 3 || typeof input.message !== 'string' || input.message.trim().length < 5) return json(res, 400, { error: 'Add a subject and message.' })
      const entry = { id: randomBytes(12).toString('hex'), type: 'ticket', subject: input.subject.trim().slice(0, 180), name: user.email, email: user.email, message: input.message.trim().slice(0, 12000), replies: [], date: new Date().toISOString(), status: 'New', source: 'Customer account', ownerId: user.id }
      db.inbox.unshift(entry); await persist(); const { ownerId, ...safeEntry } = entry
      await triggerNotification({ user: { email: user.email, role: user.role }, event: 'support', subject: `Support request received: ${entry.subject}`, html: `<p>Hi ${user.email},</p><p>Your request <strong>${entry.subject}</strong> has been received.</p><p>Our team will get back to you soon.</p>`, text: `Your support request ${entry.subject} has been received.` })
      return json(res, 201, { entry: safeEntry })
    }
    const customerReplyMatch = pathName.match(/^\/api\/account\/support\/([a-f0-9]+)\/replies$/)
    if (req.method === 'POST' && customerReplyMatch) {
      if (!requireRole('customer', 'manager', 'admin')) return
      const entry = db.inbox.find((item) => item.id === customerReplyMatch[1] && item.ownerId === user.id)
      if (!entry) return json(res, 404, { error: 'Support request not found.' })
      const input = await body(req); const message = String(input.message || '').trim()
      if (message.length < 2 || message.length > 12000) return json(res, 400, { error: 'Reply must contain 2 to 12,000 characters.' })
      entry.replies ||= []; entry.replies.push({ id: randomBytes(8).toString('hex'), author: 'customer', message, date: new Date().toISOString() }); entry.status = 'New'; await persist()
      void triggerNotification({ user: { email: entry.email, role: 'customer' }, event: 'support', subject: `New update on your MYR request: ${entry.subject}`, html: `<p>Hi ${escapeHtml(entry.name || entry.email)},</p><p>We have a new update on your request: <strong>${escapeHtml(entry.subject)}</strong></p><p>${escapeHtml(message)}</p>`, text: `New update on your request: ${entry.subject}` })
      const { ownerId, ...safeEntry } = entry; return json(res, 201, { entry: safeEntry })
    }
    if (req.method === 'GET' && pathName === '/api/admin/users') {
      if (!requireRole('admin')) return
      return json(res, 200, { users: db.users.map(publicUser) })
    }
    if (req.method === 'PATCH' && pathName === '/api/admin/catalog') {
      if (!requireRole('admin')) return
      const input = await body(req)
      const product = db.catalog.find((p) => p.id === Number(input.id))
      if (!product) return json(res, 404, { error: 'Catalog item not found' })
      if (!Number.isSafeInteger(input.price) || input.price < 0 || input.price > 100_000_000) return json(res, 400, { error: 'Price must be a whole number of rupees.' })
      if (input.compareAt !== undefined && input.compareAt !== null && (!Number.isSafeInteger(input.compareAt) || input.compareAt < input.price || input.compareAt > 100_000_000)) return json(res, 400, { error: 'Compare-at price must be greater than or equal to the sale price.' })
      const previousPrice = product.price
      product.price = input.price
      if (input.compareAt !== undefined) product.compareAt = input.compareAt
      delete product.stock
      recordAudit(user, 'catalog.price.update', String(product.id), { previousPrice, price: product.price })
      await persist()
      return json(res, 200, { product })
    }
    if (req.method === 'PATCH' && pathName === '/api/admin/settings') {
      if (!requireRole('admin')) return
      const input = await body(req)
      if (!Number.isSafeInteger(input.taxRateBps) || input.taxRateBps < 0 || input.taxRateBps > 10000 || !Number.isSafeInteger(input.shippingFlat) || input.shippingFlat < 0 || input.shippingFlat > 1000000) return json(res, 400, { error: 'Tax must be 0–100% and shipping must be a non-negative whole number of rupees.' })
      const commerceVerified = input.commerceVerified === true
      const nextNotificationSettings = normalizeNotificationSettings(input.emailNotifications || db.settings.emailNotifications || {})
      const previous = db.settings
      db.settings = { ...db.settings, taxRateBps: input.taxRateBps, shippingFlat: input.shippingFlat, commerceVerified, emailNotifications: nextNotificationSettings }
      recordAudit(user, 'settings.commerce.update', 'commerce', { previous, current: db.settings })
      await persist()
      return json(res, 200, { settings: db.settings })
    }
    if (req.method === 'GET' && pathName === '/api/admin/settings') { if (!requireRole('admin')) return; return json(res, 200, { settings: db.settings, testMode: testCheckoutEnabled }) }
    if (req.method === 'GET' && pathName === '/api/admin/orders') {
      if (!requireRole('admin', 'manager')) return
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200)
      const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)
      const total = db.orders.length
      const orders = db.orders.slice(offset, offset + limit).map(({ userId, ...order }) => ({ ...order, customerId: userId }))
      return json(res, 200, { orders, total, limit, offset, hasMore: offset + orders.length < total })
    }
    const orderMatch = pathName.match(/^\/api\/admin\/orders\/([A-Z0-9-]+)$/)
    if (req.method === 'PATCH' && orderMatch) {
      if (!requireRole('admin', 'manager')) return
      const order = db.orders.find((item) => item.id === orderMatch[1])
      if (!order) return json(res, 404, { error: 'Order not found' })
      const input = await body(req)
      if (!['Pending payment', 'Awaiting payment', 'In progress', 'Completed', 'Cancelled'].includes(input.status)) return json(res, 400, { error: 'Invalid order status. Payment status is set only after verified payment.' })
      if (['refund_pending', 'refunded'].includes(order.paymentStatus)) return json(res, 409, { error: 'Order status cannot be changed while a refund is pending or after it is complete.' })
      if (['In progress', 'Completed'].includes(input.status) && order.paymentStatus !== 'paid') return json(res, 409, { error: 'Confirm payment before processing or completing this order.' })
      if (input.status === 'Cancelled' && order.paymentStatus === 'paid') return json(res, 409, { error: 'Paid orders require a refund instead of cancellation.' })
      // A verified payment must never be rolled back to an unpaid-looking status:
      // that would hide a captured sale from both panels and re-open checkout.
      if (order.paymentStatus === 'paid' && ['Pending payment', 'Awaiting payment'].includes(input.status)) return json(res, 409, { error: 'This order is paid. Payment status is set only by a verified PayU payment.' })
      const previousStatus = order.status
      order.status = input.status
      order.updatedAt = new Date().toISOString()
      recordAudit(user, 'order.status.update', order.id, { previousStatus, status: order.status })
      await persist(); const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
    }
    const refundMatch = pathName.match(/^\/api\/admin\/orders\/([A-Z0-9-]+)\/refund$/)
    if (req.method === 'POST' && refundMatch) {
      if (!requireRole('admin')) return
      const order = db.orders.find((item) => item.id === refundMatch[1])
      if (!order || !order.payuPaymentId || order.paymentStatus !== 'paid') return json(res, 409, { error: 'This order has no captured PayU payment to refund.' })
      if (!payuConfigured(payuConfig)) return json(res, 503, { error: 'PayU is not configured.' })
      const refundToken = `MYR${randomBytes(9).toString('hex')}`
      let data
      try { data = await initiatePayURefund(payuConfig, { paymentId: order.payuPaymentId, token: refundToken, amount: order.total, callbackUrl: `${configuredOrigin(process.env.APP_ORIGIN)}/api/payments/payu/refund-callback` }) } catch { return json(res, 502, { error: 'PayU could not accept the refund request.' }) }
      if (Number(data.status) !== 1 && Number(data.error_code) !== 102) return json(res, 502, { error: 'PayU could not accept the refund request.' })
      const refundRequestId = String(data.request_id || data.txn_update_id || '')
      if (!refundRequestId) return json(res, 502, { error: 'PayU accepted no trackable refund request. Check the PayU dashboard before retrying.' })
      order.paymentStatus = 'refund_pending'; order.status = 'Refund requested'; order.payuRefundRequestId = refundRequestId; order.updatedAt = new Date().toISOString()
      recordAudit(user, 'order.refund.request', order.id, { requestId: order.payuRefundRequestId }); await persist()
      void triggerNotification({ user: { email: order.email, role: 'customer' }, event: 'payment', subject: `Refund requested — order ${order.id}`, html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2>Your refund request is being processed</h2><p>Hi ${escapeHtml(order.email)},</p><p>We have requested a refund of <strong>₹${order.total}</strong> for order <strong>${order.id}</strong>. PayU will confirm once it settles; we will email you again then.</p></div>`, text: `We have requested a refund of ₹${order.total} for order ${order.id}.` })
      const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
    }
    const refundStatusMatch = pathName.match(/^\/api\/admin\/orders\/([A-Z0-9-]+)\/refund-status$/)
    if (req.method === 'POST' && refundStatusMatch) {
      if (!requireRole('admin')) return
      const order = db.orders.find((item) => item.id === refundStatusMatch[1])
      if (!order || order.paymentStatus !== 'refund_pending' || !order.payuRefundRequestId) return json(res, 409, { error: 'This order has no pending PayU refund to check.' })
      let result
      try { result = await checkPayURefundStatus(payuConfig, order.payuRefundRequestId) } catch { return json(res, 502, { error: 'Unable to check refund status with PayU.' }) }
      if (result.status === 'success') {
        const previousStatus = order.paymentStatus
        order.paymentStatus = 'refunded'; order.status = 'Refunded'
        recordAudit(user, 'order.refund.complete', order.id, { requestId: order.payuRefundRequestId, previousStatus, amount: order.total })
        void triggerNotification({ user: { email: order.email, role: 'customer' }, event: 'payment', subject: `Refund completed — order ${order.id}`, html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Your refund has been processed</h2><p>Hi ${escapeHtml(order.email)},</p><p>The refund of <strong>₹${order.total}</strong> for order <strong>${order.id}</strong> has been completed by PayU.</p><p>It typically reaches the original payment method within 5–7 working days.</p></div>`, text: `Your refund of ₹${order.total} for order ${order.id} has been completed by PayU.` })
      } else if (['failure', 'failed'].includes(result.status)) {
        const previousStatus = order.paymentStatus
        order.paymentStatus = 'paid'; order.status = 'Paid'; delete order.payuRefundRequestId
        recordAudit(user, 'order.refund.failed', order.id, { requestId: result.detail?.request_id || '', previousStatus, status: result.status })
      }
      order.updatedAt = new Date().toISOString(); await persist()
      const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder, refundStatus: result.status || 'pending' })
    }
    const roleMatch = pathName.match(/^\/api\/admin\/users\/([a-f0-9]+)\/role$/)
    if (req.method === 'PATCH' && roleMatch) {
      if (!requireRole('admin')) return
      const input = await body(req)
      const account = db.users.find((item) => item.id === roleMatch[1])
      if (!account) return json(res, 404, { error: 'User not found' })
      if (!['admin', 'manager', 'customer'].includes(input.role)) return json(res, 400, { error: 'Invalid role' })
      if (account.id === user.id && input.role !== 'admin') return json(res, 400, { error: 'You cannot remove your own admin role.' })
      const previousRole = account.role; account.role = input.role
      recordAudit(user, 'account.role.update', account.id, { previousRole, role: account.role })
      if (input.role !== 'admin') db.sessions = db.sessions.filter((item) => item.userId !== account.id)
      await persist()
      return json(res, 200, { user: publicUser(account) })
    }
    if (req.method === 'GET' && pathName === '/api/manager/inbox') {
      if (!requireRole('admin', 'manager')) return
      const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200)
      const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)
      const total = db.inbox.length
      const inbox = db.inbox.slice(offset, offset + limit).map(({ ownerId, ...entry }) => entry)
      return json(res, 200, { inbox, total, limit, offset, hasMore: offset + inbox.length < total })
    }
    if (req.method === 'GET' && pathName === '/api/admin/audit') {
      if (!requireRole('admin')) return
      return json(res, 200, { events: db.audit || [] })
    }
    const staffReplyMatch = pathName.match(/^\/api\/manager\/inbox\/([a-f0-9]+)\/replies$/)
    if (req.method === 'POST' && staffReplyMatch) {
      if (!requireRole('admin', 'manager')) return
      const entry = db.inbox.find((item) => item.id === staffReplyMatch[1]); if (!entry) return json(res, 404, { error: 'Inbox item not found.' })
      const input = await body(req); const message = String(input.message || '').trim()
      if (message.length < 2 || message.length > 12000) return json(res, 400, { error: 'Reply must contain 2 to 12,000 characters.' })
      entry.replies ||= []; entry.replies.push({ id: randomBytes(8).toString('hex'), author: user.email, message, date: new Date().toISOString() }); entry.status = 'In progress'; await persist()
      // One message to the customer only. The previous code sent a direct email and
      // then a notification with the same content, so every reply doubled up.
      void triggerNotification({ user: { email: entry.email, role: 'customer' }, event: 'support', roles: ['customer'], subject: `Staff update: ${entry.subject}`, html: `<p>Hi ${escapeHtml(entry.name || entry.email)},</p><p>Our team sent an update on your request: <strong>${escapeHtml(entry.subject)}</strong></p><p>${escapeHtml(message)}</p>`, text: `Our team sent an update on your request: ${entry.subject}` })
      const { ownerId, ...safeEntry } = entry; return json(res, 201, { entry: safeEntry })
    }
    if (req.method === 'GET' && pathName === '/api/manager/team') {
      if (!requireRole('admin', 'manager')) return
      return json(res, 200, { team: db.team || [] })
    }
    if (req.method === 'GET' && pathName === '/api/manager/tasks') {
      if (!requireRole('admin', 'manager')) return
      const tasks = [...db.tasks].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || b.createdAt.localeCompare(a.createdAt))
      return json(res, 200, { tasks })
    }
    if (req.method === 'POST' && pathName === '/api/manager/tasks') {
      if (!requireRole('admin', 'manager')) return
      const input = await body(req)
      const title = typeof input.title === 'string' ? input.title.trim() : ''
      const description = typeof input.description === 'string' ? input.description.trim() : ''
      const dueDate = input.dueDate ? String(input.dueDate) : ''
      const assignedTo = input.assignedTo ? String(input.assignedTo) : null
      if (title.length < 2 || title.length > 180) return json(res, 400, { error: 'Task title must be between 2 and 180 characters.' })
      if (description.length > 4000) return json(res, 400, { error: 'Task description must be 4,000 characters or fewer.' })
      if (dueDate && !dateOnlyOk(dueDate)) return json(res, 400, { error: 'Due date must use a valid YYYY-MM-DD date.' })
      if (assignedTo && !db.users.some((account) => account.id === assignedTo && ['admin', 'manager'].includes(account.role))) return json(res, 400, { error: 'Tasks can only be assigned to an active staff account.' })
      const task = { id: randomBytes(12).toString('hex'), title, description, dueDate: dueDate || null, assignedTo, status: 'Open', createdBy: user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.tasks.unshift(task); recordAudit(user, 'task.create', task.id, { assignedTo }); await persist()
      return json(res, 201, { task })
    }
    const taskMatch = pathName.match(/^\/api\/manager\/tasks\/([a-f0-9]+)$/)
    if (taskMatch && req.method === 'PATCH') {
      if (!requireRole('admin', 'manager')) return
      const task = db.tasks.find((item) => item.id === taskMatch[1])
      if (!task) return json(res, 404, { error: 'Task not found.' })
      const input = await body(req)
      if (input.title !== undefined) { if (typeof input.title !== 'string' || input.title.trim().length < 2 || input.title.trim().length > 180) return json(res, 400, { error: 'Task title must be between 2 and 180 characters.' }); task.title = input.title.trim() }
      if (input.description !== undefined) { if (typeof input.description !== 'string' || input.description.trim().length > 4000) return json(res, 400, { error: 'Task description must be 4,000 characters or fewer.' }); task.description = input.description.trim() }
      if (input.status !== undefined) { if (!['Open', 'In progress', 'Done'].includes(input.status)) return json(res, 400, { error: 'Task status must be Open, In progress, or Done.' }); task.status = input.status }
      if (input.dueDate !== undefined) { const dueDate = input.dueDate ? String(input.dueDate) : ''; if (dueDate && !dateOnlyOk(dueDate)) return json(res, 400, { error: 'Due date must use a valid YYYY-MM-DD date.' }); task.dueDate = dueDate || null }
      if (input.assignedTo !== undefined) { const assignedTo = input.assignedTo ? String(input.assignedTo) : null; if (assignedTo && !db.users.some((account) => account.id === assignedTo && ['admin', 'manager'].includes(account.role))) return json(res, 400, { error: 'Tasks can only be assigned to an active staff account.' }); task.assignedTo = assignedTo }
      task.updatedAt = new Date().toISOString(); recordAudit(user, 'task.update', task.id, { status: task.status, assignedTo: task.assignedTo }); await persist()
      return json(res, 200, { task })
    }
    if (taskMatch && req.method === 'DELETE') {
      if (!requireRole('admin', 'manager')) return
      const task = db.tasks.find((item) => item.id === taskMatch[1])
      if (!task) return json(res, 404, { error: 'Task not found.' })
      db.tasks = db.tasks.filter((item) => item.id !== task.id); recordAudit(user, 'task.delete', task.id); await persist()
      return json(res, 200, { ok: true })
    }
    if (req.method === 'GET' && pathName === '/api/manager/chat') {
      if (!requireRole('admin', 'manager')) return
      return json(res, 200, { messages: db.chatMessages.slice(-100) })
    }
    if (req.method === 'POST' && pathName === '/api/manager/chat') {
      if (!requireRole('admin', 'manager')) return
      const input = await body(req)
      const message = typeof input.message === 'string' ? input.message.trim() : ''
      if (message.length < 1 || message.length > 2000) return json(res, 400, { error: 'Chat messages must contain 1 to 2,000 characters.' })
      const entry = { id: randomBytes(12).toString('hex'), authorId: user.id, authorName: user.profile?.name || user.email, message, date: new Date().toISOString() }
      db.chatMessages.push(entry); if (db.chatMessages.length > 5000) db.chatMessages = db.chatMessages.slice(-5000)
      await persist()
      return json(res, 201, { message: entry })
    }
    if (req.method === 'POST' && pathName === '/api/manager/leads/import') {
      if (!requireRole('admin', 'manager')) return
      // 100 leads with up to 12,000-character notes each exceed the default
      // JSON body cap, so legitimate imports were rejected as "too large".
      const input = await body(req, 2 * 1024 * 1024)
      if (!Array.isArray(input.rows) || input.rows.length < 1 || input.rows.length > 100) return json(res, 400, { error: 'Import must include between 1 and 100 leads.' })
      const rows = []
      for (const row of input.rows) {
        const name = typeof row?.name === 'string' ? row.name.trim() : ''
        const email = typeof row?.email === 'string' ? row.email.trim().toLowerCase() : ''
        const notes = typeof row?.notes === 'string' ? row.notes.trim() : ''
        if (name.length < 2 || name.length > 180 || !emailOk(email) || notes.length > 12000) return json(res, 400, { error: 'Each lead must have a valid name and email; notes may not exceed 12,000 characters.' })
        rows.push({ name, email, notes })
      }
      const entries = rows.map((row) => ({ id: randomBytes(12).toString('hex'), type: 'lead', subject: 'Imported lead', name: row.name, email: row.email, message: row.notes, date: new Date().toISOString(), status: 'New', source: 'CRM CSV import', ownerId: user.id }))
      db.inbox.unshift(...entries)
      recordAudit(user, 'leads.import', 'inbox', { count: entries.length })
      await persist()
      return json(res, 201, { imported: entries.length })
    }
    if (req.method === 'POST' && pathName === '/api/manager/team') {
      if (!requireRole('admin')) return
      const input = await body(req); const name = String(input.name || '').trim(); const email = String(input.email || '').trim().toLowerCase(); const title = String(input.title || '').trim(); const department = String(input.department || '').trim()
      if (name.length < 2 || !emailOk(email) || title.length < 2 || department.length < 2) return json(res, 400, { error: 'Provide a name, valid email, title, and department.' })
      if (db.team.some((member) => member.email === email)) return json(res, 409, { error: 'A team member with this email already exists.' })
      const member = { id: randomBytes(12).toString('hex'), name: name.slice(0, 160), email, title: title.slice(0, 160), department: department.slice(0, 100), addedAt: new Date().toISOString() }
      db.team.unshift(member); recordAudit(user, 'team.add', member.id); await persist()
      return json(res, 201, { member })
    }
    const teamMatch = pathName.match(/^\/api\/manager\/team\/([a-f0-9]+)$/)
    if (req.method === 'DELETE' && teamMatch) {
      if (!requireRole('admin')) return
      const member = db.team.find((item) => item.id === teamMatch[1]); if (!member) return json(res, 404, { error: 'Team member not found.' })
      db.team = db.team.filter((item) => item.id !== teamMatch[1]); recordAudit(user, 'team.remove', teamMatch[1]); await persist()
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/inbox') {
      const input = await body(req)
      // Enforce the challenge whenever Turnstile is configured. Previously a
      // missing secret made every public form fail with a hard 503 even though
      // nothing was configured to check.
      const humanCheck = await verifyHumanToken(input.humanToken)
      if (humanCheck.configured || authTurnstileRequired) {
        if (!humanCheck.configured) return json(res, 503, { error: 'Human verification is not configured.' })
        if (humanCheck.unavailable) return json(res, 503, { error: 'Human verification is temporarily unavailable. Please try again.' })
        if (!humanCheck.verified) return json(res, 403, { error: 'Human verification failed. Please try again.' })
      }
      if (!['lead', 'ticket', 'form'].includes(input.type) || typeof input.subject !== 'string' || !input.subject.trim() || input.subject.length > 180 || typeof input.message !== 'string' || !input.message.trim() || input.message.length > 12_000 || (input.name !== undefined && (typeof input.name !== 'string' || input.name.length > 180)) || (input.email !== undefined && (typeof input.email !== 'string' || input.email.length > 254 || (input.email && !emailOk(input.email))))) return json(res, 400, { error: 'Invalid submission' })
      const entry = { id: randomBytes(12).toString('hex'), type: input.type, subject: input.subject, name: String(input.name || user?.email || 'Website visitor').slice(0, 180), email: String(input.email || user?.email || '').slice(0, 254), message: input.message, date: new Date().toISOString(), status: 'New', source: String(input.source || '').slice(0, 300), ownerId: user?.id || null }
      db.inbox.unshift(entry)
      await persist()
      if (entry.email) {
        const fieldsHtml = Object.entries(input).filter(([k]) => !['humanToken', 'type', 'subject', 'name', 'email', 'message', 'source'].includes(k)).map(([k, v]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:left"><strong>${escapeHtml(k)}</strong></td><td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:left">${escapeHtml(v)}</td></tr>`).join('')
        void triggerNotification({ user: { email: entry.email, role: 'customer' }, event: 'contact', includeUser: true, explicitEmails: [entry.email], subject: `We received your submission — ${entry.subject}`, html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#166534">Thank you for contacting MYR</h2><p>Hi ${escapeHtml(entry.name || 'there')},</p><p>We’ve received your submission and our team will get back to you shortly.</p><p><strong>Reference:</strong> ${entry.id}</p><p><strong>Subject:</strong> ${escapeHtml(entry.subject)}</p>${fieldsHtml ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr style="text-align:left;border-bottom:2px solid #e5e7eb;"><th style="padding:6px 10px">Field</th><th style="padding:6px 10px">Your value</th></tr></thead><tbody>${fieldsHtml}</tbody></table>` : ''}<p style="color:#6b7280;font-size:12px">This is an automated confirmation from MYR. Please keep this for your records.</p></div>`, text: `Thank you for contacting MYR. We received your submission "${entry.subject}" (reference ${entry.id}). Our team will get back to you shortly.` })
      }
      const { ownerId, ...safeEntry } = entry
      return json(res, 201, { entry: safeEntry })
    }
    const inboxMatch = pathName.match(/^\/api\/manager\/inbox\/([a-f0-9]+)$/)
    if (req.method === 'PATCH' && inboxMatch) {
      if (!requireRole('admin', 'manager')) return
      const entry = db.inbox.find((item) => item.id === inboxMatch[1])
      if (!entry) return json(res, 404, { error: 'Inbox item not found' })
      const input = await body(req)
      if (!['New', 'In progress', 'Resolved'].includes(input.status)) return json(res, 400, { error: 'Invalid status' })
      entry.status = input.status
      await persist()
      const { ownerId, ...safeEntry } = entry
      return json(res, 200, { entry: safeEntry })
    }
    if (pathName.startsWith('/api/')) return json(res, 404, { error: 'Not found' })
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 404, { error: 'Not found' })
    const distDir = path.resolve('./dist')
    if (pathName === '/sitemap.xml' || pathName === '/robots.txt') {
      const requestOrigin = `${prod ? 'https' : 'http'}://${req.headers.host || 'localhost'}`
      const siteOrigin = configuredOrigin(process.env.SITE_ORIGIN || process.env.APP_ORIGIN || requestOrigin)
      const assetPath = path.join(distDir, pathName.slice(1))
      let content = await readFile(assetPath, 'utf8')
      if (pathName === '/sitemap.xml') content = content.replace(/<loc>[^<]+<\/loc>/g, (loc) => `<loc>${siteOrigin}${new URL(loc.replace(/<\/?loc>/g, '')).pathname}</loc>`)
      else content = content.replace(/^Sitemap:.*$/m, `Sitemap: ${siteOrigin}/sitemap.xml`)
      res.writeHead(200, { 'content-type': pathName.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff' })
      return res.end(req.method === 'HEAD' ? undefined : content)
    }
    // A malformed percent-escape throws URIError; that is a bad request, not a 500.
    let decodedPath = pathName
    try { decodedPath = decodeURIComponent(pathName) } catch { return json(res, 400, { error: 'Malformed request path.' }) }
    const candidatePath = path.resolve(distDir, `.${decodedPath}`)
    let filePath = candidatePath.startsWith(`${distDir}${path.sep}`) ? candidatePath : path.join(distDir, 'index.html')
    try { if (!(await stat(filePath)).isFile()) filePath = path.join(distDir, 'index.html') } catch { filePath = path.join(distDir, 'index.html') }
    const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8' }
    const file = await readFile(filePath)
    const ext = path.extname(filePath)
    const isHashedAsset = /\.[a-zA-Z0-9]{8,}\.(js|css|png|jpg|jpeg|webp|svg|woff2|ico)$/.test(path.basename(filePath))
    const cacheControl = ext === '.html' ? 'public, max-age=0, must-revalidate' : isHashedAsset ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
    res.writeHead(200, { 'content-type': contentTypes[ext] || 'application/octet-stream', 'cache-control': cacheControl, 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', 'content-security-policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'; frame-ancestors 'none'" })
    return res.end(req.method === 'HEAD' ? undefined : file)
  } catch (error) {
    console.error(error)
    return json(res, error.status || 500, { error: error.status ? error.message : 'Internal server error' })
  }
}

await init()
// Recover payments whose browser callback never arrived (and retry any that
// could not be confirmed at return time).
const runPaymentReconciliation = () => { void reconcileAwaitingPayments().catch((error) => console.error('[payu] reconciliation failed', error?.message || error)) }
setTimeout(runPaymentReconciliation, 15_000).unref?.()
setInterval(runPaymentReconciliation, paymentReconcileIntervalMs).unref?.()
const server = createServer((req, res) => { void withDatabaseSnapshot(req, res) })
server.listen(port, '0.0.0.0', () => console.log(`MYR API listening on :${port}`))

let shuttingDown = false
async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`Received ${signal}; closing MYR server`)
  const forceExit = setTimeout(() => process.exit(1), 25_000)
  forceExit.unref()
  server.close(async (error) => {
    try {
      database?.close()
      await pgPool?.end()
      await mongoClient?.close()
      if (error) throw error
      process.exitCode = 0
    } catch (closeError) {
      console.error('Error while closing MYR storage:', closeError)
      process.exitCode = 1
    } finally {
      clearTimeout(forceExit)
    }
  })
}
process.on('SIGTERM', () => { void shutdown('SIGTERM') })
process.on('SIGINT', () => { void shutdown('SIGINT') })
// A stray rejected promise (from a detached email send, a provider call, etc.)
// would otherwise take the whole process down with an unhandled exception.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason)
})
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  // State may be half-written after an uncaught exception, so restart rather
  // than keep serving from it. Render brings the service straight back up.
  void shutdown('uncaughtException')
})
