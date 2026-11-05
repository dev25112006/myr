import { createHash, timingSafeEqual } from 'node:crypto'

export function payuConfigFromEnv(env = process.env) {
  const environment = env.PAYU_ENV === 'production' ? 'production' : 'test'
  return {
    key: String(env.PAYU_MERCHANT_KEY || '').trim(),
    salt: String(env.PAYU_MERCHANT_SALT || '').trim(),
    environment,
    paymentUrl: environment === 'production' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment',
    serviceUrl: environment === 'production' ? 'https://info.payu.in/merchant/postservice.php?form=2' : 'https://test.payu.in/merchant/postservice.php?form=2',
  }
}

export function payuConfigured(config) {
  return Boolean(config?.key && config?.salt)
}

export function payuSha512(value) {
  return createHash('sha512').update(value, 'utf8').digest('hex')
}

function requestHash(config, params) {
  return payuSha512([
    config.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1,
    params.udf2,
    params.udf3,
    params.udf4,
    params.udf5,
    '', '', '', '', '',
    config.salt,
  ].join('|'))
}

export function createPayUCheckout({ config, order, customer, origin, txnid }) {
  if (!payuConfigured(config)) throw new Error('PayU merchant credentials are not configured.')
  const params = {
    key: config.key,
    txnid,
    amount: Number(order.total).toFixed(2),
    productinfo: order.items.map((item) => item.name).join(', ').slice(0, 100),
    firstname: String(customer.name || customer.email.split('@')[0]).trim().slice(0, 60),
    email: String(customer.email).trim().slice(0, 254),
    phone: String(customer.phone || '').trim().slice(0, 20),
    udf1: order.id,
    udf2: order.userId,
    udf3: '',
    udf4: '',
    udf5: '',
    surl: `${origin}/api/payments/payu/return`,
    furl: `${origin}/api/payments/payu/return`,
  }
  params.hash = requestHash(config, params)
  return { provider: 'payu', action: config.paymentUrl, params }
}

/**
 * PayU documents four reverse-hash shapes. Which one a merchant receives depends on
 * whether the account has payment splitting enabled and whether PayU added
 * `additional_charges` to the transaction, so a non-split transaction must NOT be
 * hashed with a `splitInfo` slot (that was the production bug: every response was
 * hashed as a split response and therefore never matched).
 *
 *   sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 *   sha512(SALT|status|splitInfo||||||udf5|...|key)
 *   sha512(additional_charges|SALT|status||||||udf5|...|key)
 *   sha512(additional_charges|SALT|status|splitInfo||||||udf5|...|key)
 *
 * The empty slot count between `status`/`splitInfo` and `udf5` is always five.
 * Every candidate is derived from the merchant salt, so accepting any of them still
 * proves the response was produced by PayU. The `splitInfo` slot is emitted both
 * with PayU's echoed value and as an empty slot, because PayU posts the field only
 * on some account configurations.
 */
export function payuReverseHashCandidates(data, config) {
  const tail = [
    String(data.udf5 || ''),
    String(data.udf4 || ''),
    String(data.udf3 || ''),
    String(data.udf2 || ''),
    String(data.udf1 || ''),
    String(data.email || ''),
    String(data.firstname || ''),
    String(data.productinfo || ''),
    String(data.amount || ''),
    String(data.txnid || ''),
    String(data.key || ''),
  ]
  const status = String(data.status || '')
  const emptySlots = ['', '', '', '', '']
  const splitInfo = String(data.splitInfo || '')
  const structures = [
    [config.salt, status, ...emptySlots, ...tail],
    [config.salt, status, splitInfo, ...emptySlots, ...tail],
    [config.salt, status, '', ...emptySlots, ...tail],
  ]
  const charges = data.additional_charges === undefined || data.additional_charges === null ? '' : String(data.additional_charges)
  const candidates = []
  for (const parts of structures) {
    candidates.push(parts.join('|'))
    if (charges) candidates.push([charges, ...parts].join('|'))
  }
  return candidates
}

function matchesAnyCandidate(data, config) {
  if (typeof data.hash !== 'string' || !/^[a-f0-9]{128}$/i.test(data.hash)) return false
  const supplied = Buffer.from(data.hash, 'hex')
  return payuReverseHashCandidates(data, config).some((candidate) => {
    const expected = Buffer.from(payuSha512(candidate), 'hex')
    return expected.length === supplied.length && timingSafeEqual(expected, supplied)
  })
}

/**
 * Full PayU response validation with a machine-readable reason so a failed
 * callback can be diagnosed from server logs instead of a generic 400.
 */
export function verifyPayUCallbackDetail(data, config, order) {
  if (!payuConfigured(config)) return { ok: false, reason: 'payu-not-configured' }
  if (!order) return { ok: false, reason: 'order-not-found' }
  if (!data || typeof data !== 'object') return { ok: false, reason: 'malformed-response' }
  if (data.key !== config.key) return { ok: false, reason: 'merchant-key-mismatch' }
  if (data.txnid !== order.payuTxnId) return { ok: false, reason: 'txnid-mismatch' }
  if (data.udf1 !== order.id) return { ok: false, reason: 'order-reference-mismatch' }
  const amountMinor = Math.round(Number(data.amount) * 100)
  if (!Number.isSafeInteger(amountMinor)) return { ok: false, reason: 'amount-unreadable' }
  if (amountMinor !== order.total * 100) return { ok: false, reason: 'amount-mismatch' }
  if (!matchesAnyCandidate(data, config)) return { ok: false, reason: 'hash-mismatch' }
  return { ok: true, reason: 'verified' }
}

export function verifyPayUCallback(data, config, order) {
  return verifyPayUCallbackDetail(data, config, order).ok
}

export async function payuServiceRequest(config, command, variables, fetchImpl = fetch) {
  if (!payuConfigured(config)) throw new Error('PayU merchant credentials are not configured.')
  const var1 = String(variables.var1 || '')
  const hash = payuSha512(`${config.key}|${command}|${var1}|${config.salt}`)
  const form = new URLSearchParams({ key: config.key, command, ...variables, hash })
  const response = await fetchImpl(config.serviceUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error('PayU service request failed.')
  return response.json()
}

export async function verifyPayUPayment(config, txnid, fetchImpl = fetch) {
  const response = await payuServiceRequest(config, 'verify_payment', { var1: txnid }, fetchImpl)
  return response?.transaction_details?.[txnid] || null
}

export async function initiatePayURefund(config, { paymentId, token, amount, callbackUrl }, fetchImpl = fetch) {
  return payuServiceRequest(config, 'cancel_refund_transaction', {
    var1: paymentId,
    var2: token,
    var3: Number(amount).toFixed(2),
    var5: callbackUrl,
  }, fetchImpl)
}

export async function checkPayURefundStatus(config, requestId, fetchImpl = fetch) {
  const response = await payuServiceRequest(config, 'check_action_status_txnid', { var1: requestId }, fetchImpl)
  const result = response?.transaction_details?.[requestId]
  const detail = result?.[requestId] || result || response
  return {
    response,
    detail,
    status: String(detail?.refund_status || detail?.status || '').toLowerCase(),
  }
}