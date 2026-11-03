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

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || !/^[a-f0-9]{128}$/i.test(left) || !/^[a-f0-9]{128}$/i.test(right)) return false
  return timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'))
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

export function verifyPayUCallback(data, config, order) {
  if (!payuConfigured(config) || !order || data.key !== config.key || data.txnid !== order.payuTxnId || data.udf1 !== order.id) return false
  const amountMinor = Math.round(Number(data.amount) * 100)
  if (!Number.isSafeInteger(amountMinor) || amountMinor !== order.total * 100) return false
  const hashParts = [
    config.salt,
    String(data.status || ''),
    String(data.splitInfo || ''),
    '', '', '', '', '',
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
  if (data.additional_charges) hashParts.unshift(String(data.additional_charges))
  return safeEqualHex(payuSha512(hashParts.join('|')), data.hash)
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