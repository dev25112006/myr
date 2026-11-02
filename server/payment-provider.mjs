/**
 * Provider-neutral boundary for hosted SaaS payments and recurring mandates.
 *
 * Adapters receive trusted, server-calculated order data and return a provider
 * handoff. Provider callback parsing/verification stays behind the adapter.
 *
 * The PayU adapter implements the documented India recurring (standing
 * instruction) surface:
 *  - Consent transaction via hosted checkout: si=1, api_version=7 and the
 *    si_details billing JSON (docs.payu.in "Payment Consent Transaction using
 *    PayU Hosted Checkout").
 *  - Pre-debit notification command pre_debit_SI (RBI-mandated advance notice).
 *  - Recurring charge command si_transaction (server-to-server debit).
 *  - Mandate status commands check_mandate_status / NB_mandate_status /
 *    upi_mandate_status and revoke commands mandate_revoke / upi_mandate_revoke.
 *
 * Every mandate method is only reachable when MYR explicitly enables mandates
 * (SAAS_MANDATE_ENABLED=true) with confirmed merchant eligibility; nothing here
 * activates recurring charging by itself.
 */
export class PaymentProvider {
  constructor(name) { this.name = name }
  createCheckout() { throw new Error(`${this.name} does not implement hosted checkout.`) }
  verifyCallback() { throw new Error(`${this.name} does not implement callback verification.`) }
  reconcile() { throw new Error(`${this.name} does not implement reconciliation.`) }
  createMandateCheckout() { throw new Error(`${this.name} does not implement mandate enrollment.`) }
  checkMandateStatus() { throw new Error(`${this.name} does not implement mandate status checks.`) }
  preDebitNotice() { throw new Error(`${this.name} does not implement pre-debit notices.`) }
  chargeRecurring() { throw new Error(`${this.name} does not implement recurring charges.`) }
  revokeMandate() { throw new Error(`${this.name} does not implement mandate revocation.`) }
}

export function payuMandateCycle(interval, amountMinor) {
  const cycle = interval === 'year' ? 'YEARLY' : interval === 'month' ? 'MONTHLY' : null
  if (!cycle) throw new Error('PayU mandates support monthly and annual cycles only.')
  return { billingCycle: cycle, billingInterval: 1, billingAmount: (amountMinor / 100).toFixed(2) }
}

export function createPayUProvider({ config, hashRequest, hashSiRequest, verifyPayment, postService }) {
  const mandateCommandFor = (mode) => mode === 'upi' ? 'upi_mandate_status' : mode === 'netbanking' ? 'NB_mandate_status' : 'check_mandate_status'
  const revokeCommandFor = (mode) => mode === 'upi' ? 'upi_mandate_revoke' : 'mandate_revoke'
  return {
    name: 'payu',
    createCheckout(order, customer, origin) {
      const values = {
        txnid: order.payuTxnId,
        amount: order.payuAmount,
        productinfo: `${order.productName} - ${order.planName}`.slice(0, 100),
        firstname: customer.name,
        email: customer.email,
        udf1: order.id,
        udf2: order.organizationId,
        udf3: order.planId,
        udf4: '',
        udf5: '',
      }
      return {
        provider: this.name,
        action: config.paymentUrl,
        params: {
          key: config.key,
          ...values,
          phone: customer.phone || '',
          surl: `${origin}/api/saas/payments/payu/return`,
          furl: `${origin}/api/saas/payments/payu/return`,
          hash: hashRequest(config, values),
        },
      }
    },
    /**
     * Hosted consent (standing-instruction) checkout. The first debit is the
     * consent amount; si_details describe the recurring billing schedule that
     * PayU registers for subsequent debits.
     */
    createMandateCheckout(order, customer, origin, mandate) {
      const values = {
        txnid: order.payuTxnId,
        amount: order.payuAmount,
        productinfo: `${order.productName} - ${order.planName}`.slice(0, 100),
        firstname: customer.name,
        email: customer.email,
        udf1: order.id,
        udf2: order.organizationId,
        udf3: order.planId,
        udf4: mandate.id,
        udf5: '',
      }
      const siDetails = JSON.stringify({
        billingAmount: mandate.billingAmount,
        billingCurrency: mandate.billingCurrency,
        billingCycle: mandate.billingCycle,
        billingInterval: mandate.billingInterval,
        paymentStartDate: mandate.paymentStartDate,
        paymentEndDate: mandate.paymentEndDate,
      })
      return {
        provider: this.name,
        action: config.paymentUrl,
        recurring: true,
        params: {
          key: config.key,
          ...values,
          phone: customer.phone || '',
          surl: `${origin}/api/saas/payments/payu/return`,
          furl: `${origin}/api/saas/payments/payu/return`,
          api_version: '7',
          si: '1',
          si_details: siDetails,
          hash: hashSiRequest(config, values, siDetails),
        },
      }
    },
    async verifyCallback(data, order) {
      if (!data.txnid || data.txnid !== order.payuTxnId || data.udf1 !== order.id) return { ok: false, reason: 'order_mismatch' }
      const verified = await verifyPayment(config, order.payuTxnId)
      const detail = verified.details
      const matches = verified.payload?.status === 1 && detail
        && detail.txnid === order.payuTxnId
        && Math.round(Number(detail.amt || detail.amount) * 100) === order.totalMinor
        && detail.udf1 === order.id
        && detail.udf2 === order.organizationId
        && detail.udf3 === order.planId
      if (!matches) return { ok: false, reason: 'provider_mismatch', verified }
      return { ok: true, detail }
    },
    reconcile(order) { return verifyPayment(config, order.payuTxnId) },
    async checkMandateStatus(mandate) {
      const payload = await postService(config, mandateCommandFor(mandate.mode), JSON.stringify({ authpayuid: mandate.authPayuId }))
      return { payload, active: mandateStatusActive(payload) }
    },
    async preDebitNotice(mandate, { amount, debitDate, invoiceDisplayNumber, mandateSeqNo }) {
      const var1 = { authpayuid: mandate.authPayuId, requestId: mandate.requestId, debitDate, amount, invoiceDisplayNumber }
      if (mandateSeqNo) var1.mandateSeqNo = mandateSeqNo
      const payload = await postService(config, 'pre_debit_SI', JSON.stringify(var1))
      return { payload, ok: Number(payload?.status) === 1 }
    },
    async chargeRecurring(mandate, { amount, txnid, invoiceDisplayNumber, phone, email, mandateSeqNo }) {
      const var1 = { authpayuid: mandate.authPayuId, invoiceDisplayNumber, amount, txnid, phone: phone || '', email: email || '', udf1: '', udf2: '', udf3: '', udf4: '', udf5: '' }
      if (mandateSeqNo) var1.mandateSeqNo = mandateSeqNo
      const payload = await postService(config, 'si_transaction', JSON.stringify(var1))
      const detail = payload?.details?.[txnid]
      const status = String(detail?.status || '').toLowerCase()
      return { payload, detail, status, ok: Number(payload?.status) === 1 && Boolean(detail) }
    },
    async revokeMandate(mandate) {
      const payload = await postService(config, revokeCommandFor(mandate.mode), JSON.stringify({ authpayuid: mandate.authPayuId }))
      return { payload, ok: Number(payload?.status) === 1 }
    },
  }
}

function mandateStatusActive(payload) {
  if (!payload || Number(payload.status ?? payload?.status) === 0) return false
  const detail = payload.mandateDetails || payload.mandate_details || {}
  const state = String(detail.mandateStatus || detail.status || payload.message || '').toLowerCase()
  if (!state) return true
  return ['active', 'created', 'confirmed', 'pending'].some((token) => state.includes(token)) && !['cancel', 'revoke', 'reject', 'expire', 'pause'].some((token) => state.includes(token))
}
