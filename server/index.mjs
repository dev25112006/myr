import { createServer } from 'node:http'
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { mkdir, readFile } from 'node:fs/promises'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { MongoClient } from 'mongodb'
import pg from 'pg'

const scrypt = promisify(scryptCallback)
const port = Number(process.env.PORT || 3001)
const dataDir = path.resolve(process.env.DATA_DIR || './data')
const dbPath = path.join(dataDir, 'myr.sqlite')
const legacyDbPath = path.join(dataDir, 'myr.json')
const prod = process.env.NODE_ENV === 'production'
const testCheckoutRequested = process.env.COMMERCE_TEST_MODE === 'true'
const testCheckoutEnabled = testCheckoutRequested && !prod && String(process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_test_') && Boolean(process.env.RAZORPAY_KEY_SECRET)
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
let db = { users: [], sessions: [], inbox: [], orders: [], reviews: [], catalog: initialCatalog, carts: {}, team: [], tasks: [], chatMessages: [], audit: [], webhookEvents: [], settings: { taxRateBps: 0, shippingFlat: 0 } }
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

async function persist() {
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
async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return false
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, html }) })
  if (!response.ok) { console.error('Email provider request failed:', response.status); return false }
  return true
}
async function issueEmailToken(user, purpose) {
  const token = randomBytes(32).toString('hex')
  db.emailTokens ||= []
  db.emailTokens = db.emailTokens.filter((item) => !(item.userId === user.id && item.purpose === purpose))
  db.emailTokens.push({ userId: user.id, purpose, hash: tokenHash(token), expiresAt: Date.now() + (purpose === 'reset' ? 60 : 24 * 60) * 60 * 1000 })
  await persist()
  const origin = configuredOrigin(process.env.APP_ORIGIN)
  const route = purpose === 'reset' ? '/my-account/reset-password/?token=' : '/my-account/verify-email/?token='
  await sendEmail(user.email, purpose === 'reset' ? 'Reset your MYR account password' : 'Verify your MYR account email', `<p>Use the link below to ${purpose === 'reset' ? 'reset your password' : 'verify your email'}:</p><p><a href="${origin}${route}${token}">Continue</a></p><p>This link expires in ${purpose === 'reset' ? '60 minutes' : '24 hours'}.</p>`)
}
function publicUser(user) { return { id: user.id, email: user.email, role: user.role, emailVerified: user.emailVerified !== false, createdAt: user.createdAt } }
function json(res, status, data, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers })
  res.end(JSON.stringify(data))
}
async function body(req) {
  let raw = ''
  for await (const chunk of req) { raw += chunk; if (raw.length > 32_000) throw Object.assign(new Error('Request too large'), { status: 413 }) }
  try { return raw ? JSON.parse(raw) : {} } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }) }
}
async function rawBody(req) {
  const chunks = []; let size = 0
  for await (const chunk of req) { size += chunk.length; if (size > 128_000) throw Object.assign(new Error('Request too large'), { status: 413 }); chunks.push(chunk) }
  return Buffer.concat(chunks).toString('utf8')
}
function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || !/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) return false
  const a = Buffer.from(left, 'hex'); const b = Buffer.from(right, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}
function recordAudit(actor, action, target, detail = {}) {
  db.audit ||= []
  db.audit.unshift({ id: randomBytes(8).toString('hex'), actorId: actor.id, actorEmail: actor.email, action, target, detail, date: new Date().toISOString() })
  db.audit = db.audit.slice(0, 2000)
}
function cookie(req, name) {
  return (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}
function cookieHeader(value, maxAge) {
  return `myr_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${prod ? '; Secure' : ''}`
}
function csrfCheck(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return true
  if (req.url?.startsWith('/api/payments/webhook')) return true
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
function dateOnlyOk(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
function passwordOk(password) { return typeof password === 'string' && password.length >= 12 && password.length <= 200 }
function rateLimit() {
  const buckets = new Map()
  return (req, res) => {
    const key = req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const current = buckets.get(key) || { count: 0, reset: now + 60_000 }
    if (now > current.reset) { current.count = 0; current.reset = now + 60_000 }
    current.count += 1
    buckets.set(key, current)
    if (current.count > 120) { json(res, 429, { error: 'Too many requests' }); return false }
    return true
  }
}
const limit = rateLimit()
const loginAttempts = new Map()

async function init() {
  let saved
  if (testCheckoutRequested && !testCheckoutEnabled) throw new Error('COMMERCE_TEST_MODE requires non-production mode and Razorpay test credentials (rzp_test_ key ID and secret).')
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
  db.settings = { taxRateBps: 0, shippingFlat: 0, commerceVerified: false, ...(db.settings || {}) }
  if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true' && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) throw new Error('Set RESEND_API_KEY and EMAIL_FROM before requiring email verification.')
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

async function withDatabaseSnapshot(req, res) {
  if (mongoCollection && req.url?.startsWith('/api/')) {
    const previous = mongoQueue
    let release
    mongoQueue = new Promise((resolve) => { release = resolve })
    await previous
    try {
      const current = await mongoCollection.findOne({ _id: 'primary' })
      if (current?.state) db = { ...db, ...current.state }
      await handle(req, res)
    } catch (error) {
      if (!res.headersSent) json(res, 500, { error: 'Internal server error' })
      else res.destroy(error)
      console.error(error)
    } finally {
      release()
    }
    return
  }
  if (!pgPool || !req.url?.startsWith('/api/')) return handle(req, res)
  const client = await pgPool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(742819340)')
    const result = await client.query('SELECT state FROM myr_app_state WHERE id = 1 FOR UPDATE')
    if (result.rows[0]?.state) db = { ...db, ...result.rows[0].state }
    requestClient = client
    await handle(req, res)
    await client.query('COMMIT')
  } catch (error) {
    try { await client.query('ROLLBACK') } catch {}
    if (!res.headersSent) json(res, 500, { error: 'Internal server error' })
    else res.destroy(error)
    console.error(error)
  } finally { requestClient = undefined; client.release() }
}

async function handle(req, res) {
  res.setHeader('x-content-type-options', 'nosniff')
  if (!limit(req, res)) return
  if (!csrfCheck(req)) return json(res, 403, { error: 'Request origin rejected' })
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const pathName = url.pathname
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
    if (req.method === 'GET' && pathName === '/api/health') return json(res, 200, { ok: true })
    if (req.method === 'GET' && pathName === '/api/auth/session') return json(res, 200, { user: user ? publicUser(user) : null })
    if (req.method === 'GET' && pathName === '/api/catalog') return json(res, 200, { products: db.catalog })
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
    if (req.method === 'POST' && pathName === '/api/quote') {
      const input = await body(req); if (!Array.isArray(input.items) || !input.items.length || input.items.length > 30) return json(res, 400, { error: 'Cart is empty or invalid.' })
      const items = []
      for (const row of input.items) { const product = db.catalog.find((p) => p.id === Number(row.id)); const qty = Number(row.qty); if (!product || !Number.isSafeInteger(qty) || qty < 1 || !Number.isSafeInteger(product.price * qty)) return json(res, 400, { error: 'Product or quantity is invalid.' }); items.push({ id: product.id, name: product.name, price: product.price, qty, category: product.category }) }
      const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0); const shipping = items.some((item) => item.category === 'IP PBX Solution') ? db.settings.shippingFlat : 0; const tax = Math.round(subtotal * db.settings.taxRateBps / 10000); const total = subtotal + tax + shipping
      if (![subtotal, tax, shipping, total, total * 100].every(Number.isSafeInteger)) return json(res, 400, { error: 'Order total is too large. Reduce the quantity and try again.' })
      return json(res, 200, { items, subtotal, tax, shipping, total, currency: 'INR', commerceReady: db.settings.commerceVerified === true || testCheckoutEnabled, testMode: testCheckoutEnabled, paymentAvailable: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) })
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
      if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return json(res, 503, { error: 'Email delivery is not configured yet.' })
      await issueEmailToken(user, 'verify')
      return json(res, 200, { ok: true, message: 'Verification email sent.' })
    }
    if (req.method === 'POST' && pathName === '/api/auth/request-password-reset') {
      if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return json(res, 503, { error: 'Password reset email is not configured. Contact support for account recovery.' })
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
      Object.assign(account, await hashPassword(input.password)); db.sessions = db.sessions.filter((item) => item.userId !== account.id); db.emailTokens = db.emailTokens.filter((item) => item.userId !== account.id && item.purpose !== 'reset'); await persist()
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/payments/webhook') {
      const raw = await rawBody(req); const signature = req.headers['x-razorpay-signature']
      if (!process.env.RAZORPAY_WEBHOOK_SECRET || !safeEqualHex(createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex'), signature)) return json(res, 401, { error: 'Invalid webhook signature' })
      const event = JSON.parse(raw); const eventId = req.headers['x-razorpay-event-id']
      db.webhookEvents ||= []
      if (eventId && db.webhookEvents.includes(eventId)) return json(res, 200, { ok: true, duplicate: true })
      if (eventId) db.webhookEvents.push(eventId)
      const payment = event.payload?.payment?.entity
      const rzpOrderId = payment?.order_id || event.payload?.order?.entity?.id
      const order = db.orders.find((item) => item.razorpayOrderId === rzpOrderId)
      if (order && ['order.paid', 'payment.captured'].includes(event.event)) { order.paymentStatus = 'paid'; order.status = order.status === 'Cancelled' ? order.status : 'Paid'; order.razorpayPaymentId = payment?.id || order.razorpayPaymentId; order.updatedAt = new Date().toISOString() }
      await persist(); return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && pathName === '/api/auth/register') {
      const input = await body(req)
      const email = String(input.email || '').trim().toLowerCase()
      if (!emailOk(email) || !passwordOk(input.password)) return json(res, 400, { error: 'Use a valid email and a password with at least 12 characters.' })
      if (db.users.some((item) => item.email === email)) return json(res, 409, { error: 'An account with this email already exists.' })
      const credentials = await hashPassword(input.password)
      const created = { id: randomBytes(16).toString('hex'), email, role: 'customer', emailVerified: !process.env.EMAIL_VERIFICATION_REQUIRED, ...credentials, createdAt: new Date().toISOString() }
      db.users.push(created)
      const newSession = { id: randomBytes(32).toString('hex'), userId: created.id, expiresAt: Date.now() + sessionTtl }
      db.sessions.push(newSession)
      await persist()
      if (process.env.RESEND_API_KEY && process.env.EMAIL_VERIFICATION_REQUIRED === 'true') await issueEmailToken(created, 'verify')
      return json(res, 201, { user: publicUser(created) }, { 'set-cookie': cookieHeader(newSession.id, sessionTtl / 1000) })
    }
    if (req.method === 'POST' && pathName === '/api/auth/login') {
      const input = await body(req)
      const email = String(input.email || '').trim().toLowerCase()
      const attemptKey = `${req.socket.remoteAddress}:${email}`
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
      return json(res, 200, { profile: { email: user.email, role: user.role, name: user.profile?.name || '', phone: user.profile?.phone || '', timezone: user.profile?.timezone || '', address: user.profile?.address || '', city: user.profile?.city || '', state: user.profile?.state || '', postalCode: user.profile?.postalCode || '', country: user.profile?.country || 'India', notes: user.profile?.notes || '' } })
    }
    if (req.method === 'PATCH' && pathName === '/api/account/profile') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req)
      const name = typeof input.name === 'string' ? input.name.trim() : (user.profile?.name || '')
      const phone = typeof input.phone === 'string' ? input.phone.trim() : (user.profile?.phone || '')
      const timezone = typeof input.timezone === 'string' ? input.timezone.trim() : (user.profile?.timezone || '')
      if (name && (name.length < 2 || name.length > 120)) return json(res, 400, { error: 'Name must be between 2 and 120 characters.' })
      if (phone.length > 40 || (phone && !/^[+\d][\d\s().-]{5,39}$/.test(phone))) return json(res, 400, { error: 'Enter a valid phone number up to 40 characters.' })
      if (timezone.length > 80) return json(res, 400, { error: 'Timezone must be 80 characters or fewer.' })
      const address = typeof input.address === 'string' ? input.address.trim().slice(0, 300) : (user.profile?.address || '')
      const city = typeof input.city === 'string' ? input.city.trim().slice(0, 120) : (user.profile?.city || '')
      const state = typeof input.state === 'string' ? input.state.trim().slice(0, 120) : (user.profile?.state || '')
      const postalCode = typeof input.postalCode === 'string' ? input.postalCode.trim().slice(0, 20) : (user.profile?.postalCode || '')
      const country = typeof input.country === 'string' ? input.country.trim().slice(0, 80) : (user.profile?.country || 'India')
      const notes = typeof input.notes === 'string' ? input.notes.trim().slice(0, 2000) : (user.profile?.notes || '')
      user.profile = { name, phone, timezone, address, city, state, postalCode, country, notes }
      if (['admin', 'manager'].includes(user.role)) recordAudit(user, 'profile.update', user.id, { fields: ['name', 'phone', 'timezone', 'address'] })
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
      if (requiresShipping && ['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'].some((key) => typeof address[key] !== 'string' || !address[key].trim())) return json(res, 400, { error: 'Complete the shipping address for physical products.' })
      const hasCustomerDetails = ['name', 'phone'].some((key) => typeof address[key] === 'string' && address[key].trim())
      const storedAddress = hasCustomerDetails ? Object.fromEntries(['name', 'address', 'city', 'state', 'postalCode', 'country', 'phone'].map((key) => [key, String(address[key] || '').trim().slice(0, 300)])) : null
      const order = { id: `MYR-${randomBytes(6).toString('hex').toUpperCase()}`, userId: user.id, email: user.email, items, subtotal, tax, shipping, total, shippingAddress: storedAddress, status: 'Pending payment', paymentStatus: 'unpaid', date: new Date().toISOString(), notes: String(input.notes || '').slice(0, 2000) }
      if (!Number.isSafeInteger(order.total * 100) || order.total * 100 < 100) return json(res, 400, { error: 'The minimum online payment amount is ₹1.00.' })
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        let response
        try { response = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`, 'content-type': 'application/json' }, body: JSON.stringify({ amount: order.total * 100, currency: 'INR', receipt: order.id, notes: { myrOrderId: order.id, customerId: user.id } }) }) } catch { return json(res, 502, { error: 'Payment provider is unavailable. Please retry.' }) }
        let result
        try { result = await response.json() } catch { return json(res, 502, { error: 'Payment provider returned an invalid response.' }) }
        if (!response.ok) return json(res, 502, { error: 'Payment provider could not start checkout. Please try again.' })
        order.razorpayOrderId = result.id; order.status = 'Awaiting payment'
      }
      db.orders.unshift(order)
      if (storedAddress) { user.profile = { ...(user.profile || {}), name: storedAddress.name || user.profile?.name || '', phone: storedAddress.phone || user.profile?.phone || '', address: storedAddress.address || user.profile?.address || '', city: storedAddress.city || user.profile?.city || '', state: storedAddress.state || user.profile?.state || '', postalCode: storedAddress.postalCode || user.profile?.postalCode || '', country: storedAddress.country || user.profile?.country || 'India', notes: input.notes ? String(input.notes).slice(0, 2000) : (user.profile?.notes || '') } }
      db.inbox.unshift({ id: randomBytes(12).toString('hex'), type: 'order', subject: `Order ${order.id}`, name: user.email, email: user.email, message: items.map((item) => `${item.name} × ${item.qty}`).join(', '), date: order.date, status: 'New', source: 'Account checkout', ownerId: user.id })
      await persist()
      const { userId, ...safeOrder } = order
      return json(res, 201, { order: safeOrder, ...(order.razorpayOrderId ? { payment: { provider: 'razorpay', keyId: process.env.RAZORPAY_KEY_ID, orderId: order.razorpayOrderId, amount: order.total * 100, currency: 'INR', testMode: testCheckoutEnabled } } : {}) })
    }
    const cancelOrderMatch = pathName.match(/^\/api\/account\/orders\/([A-Z0-9-]+)\/cancel$/)
    const retryPaymentMatch = pathName.match(/^\/api\/account\/orders\/([A-Z0-9-]+)\/payment$/)
    if (req.method === 'POST' && retryPaymentMatch) {
      if (!requireRole('customer', 'manager', 'admin')) return
      const order = db.orders.find((item) => item.id === retryPaymentMatch[1] && item.userId === user.id)
      if (!order) return json(res, 404, { error: 'Order not found.' })
      if (!['Pending payment', 'Awaiting payment'].includes(order.status) || order.paymentStatus === 'paid') return json(res, 409, { error: 'This order is not awaiting payment.' })
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return json(res, 503, { error: 'Online payment is not configured. Contact support to complete this order.' })
      const response = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`, 'content-type': 'application/json' }, body: JSON.stringify({ amount: order.total * 100, currency: 'INR', receipt: order.id, notes: { myrOrderId: order.id, customerId: user.id } }) })
      const data = await response.json(); if (!response.ok) return json(res, 502, { error: 'Payment provider could not restart checkout.' })
      order.razorpayOrderId = data.id; order.status = 'Awaiting payment'; await persist()
      return json(res, 200, { orderId: order.id, payment: { keyId: process.env.RAZORPAY_KEY_ID, orderId: data.id, amount: order.total * 100, currency: 'INR', testMode: testCheckoutEnabled } })
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
    if (req.method === 'POST' && pathName === '/api/payments/verify') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req)
      if (typeof input.orderId !== 'string' || typeof input.razorpay_order_id !== 'string' || typeof input.razorpay_payment_id !== 'string' || typeof input.razorpay_signature !== 'string' || !input.razorpay_order_id || !input.razorpay_payment_id || !input.razorpay_signature) return json(res, 400, { error: 'Payment order, payment, and signature fields are required.' })
      const order = db.orders.find((item) => item.id === input.orderId && item.userId === user.id)
      if (!order || !order.razorpayOrderId || order.razorpayOrderId !== input.razorpay_order_id) return json(res, 404, { error: 'Payment order not found.' })
      const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${order.razorpayOrderId}|${input.razorpay_payment_id}`).digest('hex')
      if (!process.env.RAZORPAY_KEY_SECRET || !safeEqualHex(expected, input.razorpay_signature)) return json(res, 400, { error: 'Payment verification failed.' })
      let paymentStatus
      try {
        const providerResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(String(input.razorpay_payment_id || ''))}`, { headers: { authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}` } })
        const providerPayment = await providerResponse.json()
        if (!providerResponse.ok || providerPayment.order_id !== order.razorpayOrderId || providerPayment.amount !== order.total * 100) return json(res, 400, { error: 'Payment details do not match this order.' })
        paymentStatus = providerPayment.status
      } catch { return json(res, 502, { error: 'Unable to confirm payment status with the provider.' }) }
      if (paymentStatus !== 'captured') return json(res, 409, { error: 'Payment is not captured yet. The order will update after the provider confirms it.' })
      order.paymentStatus = 'paid'; order.status = 'Paid'; order.razorpayPaymentId = String(input.razorpay_payment_id); order.updatedAt = new Date().toISOString()
      await persist(); const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
    }
    if (req.method === 'POST' && pathName === '/api/account/support') {
      if (!requireRole('customer', 'manager', 'admin')) return
      const input = await body(req)
      if (typeof input.subject !== 'string' || input.subject.trim().length < 3 || typeof input.message !== 'string' || input.message.trim().length < 5) return json(res, 400, { error: 'Add a subject and message.' })
      const entry = { id: randomBytes(12).toString('hex'), type: 'ticket', subject: input.subject.trim().slice(0, 180), name: user.email, email: user.email, message: input.message.trim().slice(0, 12000), replies: [], date: new Date().toISOString(), status: 'New', source: 'Customer account', ownerId: user.id }
      db.inbox.unshift(entry); await persist(); const { ownerId, ...safeEntry } = entry
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
      const previous = db.settings; db.settings = { taxRateBps: input.taxRateBps, shippingFlat: input.shippingFlat, commerceVerified }; recordAudit(user, 'settings.commerce.update', 'commerce', { previous, current: db.settings }); await persist(); return json(res, 200, { settings: db.settings })
    }
    if (req.method === 'GET' && pathName === '/api/admin/settings') { if (!requireRole('admin')) return; return json(res, 200, { settings: db.settings, testMode: testCheckoutEnabled }) }
    if (req.method === 'GET' && pathName === '/api/admin/orders') {
      if (!requireRole('admin', 'manager')) return
      return json(res, 200, { orders: db.orders.map(({ userId, ...order }) => ({ ...order, customerId: userId })) })
    }
    const orderMatch = pathName.match(/^\/api\/admin\/orders\/([A-Z0-9-]+)$/)
    if (req.method === 'PATCH' && orderMatch) {
      if (!requireRole('admin', 'manager')) return
      const order = db.orders.find((item) => item.id === orderMatch[1])
      if (!order) return json(res, 404, { error: 'Order not found' })
      const input = await body(req)
      if (!['Pending payment', 'Awaiting payment', 'In progress', 'Completed', 'Cancelled'].includes(input.status)) return json(res, 400, { error: 'Invalid order status. Payment status is set only after verified payment.' })
      if (['In progress', 'Completed'].includes(input.status) && order.paymentStatus !== 'paid') return json(res, 409, { error: 'Confirm payment before processing or completing this order.' })
      if (input.status === 'Cancelled' && order.paymentStatus === 'paid') return json(res, 409, { error: 'Paid orders require a refund instead of cancellation.' })
      order.status = input.status
      recordAudit(user, 'order.status.update', order.id, { status: order.status })
      await persist(); const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
    }
    const refundMatch = pathName.match(/^\/api\/admin\/orders\/([A-Z0-9-]+)\/refund$/)
    if (req.method === 'POST' && refundMatch) {
      if (!requireRole('admin')) return
      const order = db.orders.find((item) => item.id === refundMatch[1])
      if (!order || !order.razorpayPaymentId || order.paymentStatus !== 'paid') return json(res, 409, { error: 'This order has no captured payment to refund.' })
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return json(res, 503, { error: 'Payment provider is not configured.' })
      const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(order.razorpayPaymentId)}/refund`, { method: 'POST', headers: { authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`, 'content-type': 'application/json' }, body: JSON.stringify({ amount: order.total * 100, notes: { myrOrderId: order.id } }) })
      const data = await response.json()
      if (!response.ok) return json(res, 502, { error: 'The payment provider could not process this refund.' })
      order.paymentStatus = 'refunded'; order.status = 'Refunded'; order.razorpayRefundId = data.id; order.updatedAt = new Date().toISOString(); recordAudit(user, 'order.refund', order.id, { refundId: data.id }); await persist()
      const { userId, ...safeOrder } = order
      return json(res, 200, { order: safeOrder })
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
      return json(res, 200, { inbox: db.inbox.map(({ ownerId, ...entry }) => entry) })
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
      await sendEmail(entry.email, `Update on your MYR request: ${entry.subject}`, `<p>${message.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])}</p>`)
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
      const input = await body(req)
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
      if (!['lead', 'ticket', 'form'].includes(input.type) || typeof input.subject !== 'string' || !input.subject.trim() || input.subject.length > 180 || typeof input.message !== 'string' || !input.message.trim() || input.message.length > 12_000 || (input.name !== undefined && (typeof input.name !== 'string' || input.name.length > 180)) || (input.email !== undefined && (typeof input.email !== 'string' || input.email.length > 254 || (input.email && !emailOk(input.email))))) return json(res, 400, { error: 'Invalid submission' })
      const entry = { id: randomBytes(12).toString('hex'), type: input.type, subject: input.subject, name: String(input.name || user?.email || 'Website visitor').slice(0, 180), email: String(input.email || user?.email || '').slice(0, 254), message: input.message, date: new Date().toISOString(), status: 'New', source: String(input.source || '').slice(0, 300), ownerId: user?.id || null }
      db.inbox.unshift(entry)
      await persist()
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
    const candidatePath = path.resolve(distDir, `.${decodeURIComponent(pathName)}`)
    let filePath = candidatePath.startsWith(`${distDir}${path.sep}`) ? candidatePath : path.join(distDir, 'index.html')
    try { if (!(await stat(filePath)).isFile()) filePath = path.join(distDir, 'index.html') } catch { filePath = path.join(distDir, 'index.html') }
    const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8' }
    const file = await readFile(filePath)
    res.writeHead(200, { 'content-type': contentTypes[path.extname(filePath)] || 'application/octet-stream', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', 'content-security-policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' https://checkout.razorpay.com; connect-src 'self' https://api.razorpay.com; frame-src https://api.razorpay.com https://checkout.razorpay.com; base-uri 'self'; frame-ancestors 'none'" })
    return res.end(req.method === 'HEAD' ? undefined : file)
  } catch (error) {
    console.error(error)
    return json(res, error.status || 500, { error: error.status ? error.message : 'Internal server error' })
  }
}

await init()
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
