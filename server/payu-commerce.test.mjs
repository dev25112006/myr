import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { createPayUCheckout, payuConfigFromEnv, payuServiceRequest, verifyPayUCallback } from './payu-commerce.mjs'

const config = { key: 'merchant-key', salt: 'merchant-salt', paymentUrl: 'https://test.payu.in/_payment', serviceUrl: 'https://test.payu.in/merchant/postservice.php?form=2' }
const order = { id: 'MYR-ABC123', userId: 'user-123', total: 1250, payuTxnId: 'MYR1720000000000abcd', items: [{ name: 'MYR Product' }] }
const customer = { name: 'A Customer', email: 'customer@example.com', phone: '9876543210' }

test('PayU configuration selects test and production endpoints', () => {
  assert.equal(payuConfigFromEnv({ PAYU_ENV: 'test' }).paymentUrl, 'https://test.payu.in/_payment')
  assert.equal(payuConfigFromEnv({ PAYU_ENV: 'production' }).serviceUrl, 'https://info.payu.in/merchant/postservice.php?form=2')
})

test('hosted checkout signs server-calculated transaction fields', () => {
  const checkout = createPayUCheckout({ config, order, customer, origin: 'https://shop.example', txnid: order.payuTxnId })
  assert.equal(checkout.provider, 'payu')
  assert.equal(checkout.action, config.paymentUrl)
  assert.equal(checkout.params.amount, '1250.00')
  assert.equal(checkout.params.udf1, order.id)
  const { hash, ...params } = checkout.params
  const values = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5'].map((key) => params[key] || '')
  const expected = createHash('sha512').update([...values, '', '', '', '', '', config.salt].join('|')).digest('hex')
  assert.equal(hash, expected)
})

test('PayU callback hash must match order identity and amount', () => {
  const callback = {
    key: config.key,
    txnid: order.payuTxnId,
    amount: '1250.00',
    productinfo: 'MYR Product',
    firstname: 'A Customer',
    email: customer.email,
    udf1: order.id,
    udf2: order.userId,
    udf3: '',
    udf4: '',
    udf5: '',
    status: 'success',
  }
  callback.hash = createHash('sha512').update([
    config.salt, callback.status, '', '', '', '', '', '', callback.udf5, callback.udf4, callback.udf3,
    callback.udf2, callback.udf1, callback.email, callback.firstname, callback.productinfo,
    callback.amount, callback.txnid, callback.key,
  ].join('|')).digest('hex')
  assert.equal(verifyPayUCallback(callback, config, order), true)
  assert.equal(verifyPayUCallback({ ...callback, amount: '1.00' }, config, order), false)
  assert.equal(verifyPayUCallback({ ...callback, hash: '0'.repeat(128) }, config, order), false)
})

test('PayU Verify Payment uses a signed form-encoded service request', async () => {
  let request
  const response = await payuServiceRequest(config, 'verify_payment', { var1: order.payuTxnId }, async (url, options) => {
    request = { url, options }
    return { ok: true, json: async () => ({ status: 1 }) }
  })
  assert.equal(response.status, 1)
  assert.equal(request.url, config.serviceUrl)
  assert.equal(request.options.method, 'POST')
  const form = new URLSearchParams(request.options.body)
  assert.equal(form.get('command'), 'verify_payment')
  assert.equal(form.get('var1'), order.payuTxnId)
  assert.equal(form.get('hash'), createHash('sha512').update(`${config.key}|verify_payment|${order.payuTxnId}|${config.salt}`).digest('hex'))
})

test('PayU refund status reads the nested request result', async () => {
  const requestId = 'refund-request-1'
  const response = await payuServiceRequest(config, 'check_action_status_txnid', { var1: requestId }, async () => ({
    ok: true,
    json: async () => ({ status: 1, transaction_details: { [requestId]: { [requestId]: { status: 'success' } } } }),
  }))
  assert.equal(response.transaction_details[requestId][requestId].status, 'success')
})