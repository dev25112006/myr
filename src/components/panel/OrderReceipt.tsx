import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** The subset of an order the receipt needs. Extra fields are ignored. */
export type ReceiptOrder = {
  id: string
  date: string
  status: string
  paymentStatus: string
  items: Array<{ name: string; qty: number; price: number }>
  subtotal?: number
  tax?: number
  shipping?: number
  total: number
  currency?: string
  payuPaymentId?: string
  payuTxnId?: string
}

const COMPANY = 'MYR Advance Solution'

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char,
  )
}

function money(value: number, currency = 'INR') {
  if (currency === 'INR') return `₹${Number(value).toLocaleString('en-IN')}`
  return `${currency} ${Number(value).toLocaleString()}`
}

function rows(order: ReceiptOrder) {
  return order.items
    .map(
      (item) => `<tr>
        <td>${escapeHtml(item.name)}</td>
        <td class="num">${item.qty}</td>
        <td class="num">${money(item.price)}</td>
        <td class="num">${money(item.price * item.qty)}</td>
      </tr>`,
    )
    .join('')
}

function breakdown(order: ReceiptOrder) {
  const subtotal = order.subtotal ?? order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const lines: Array<[string, string]> = [['Subtotal', money(subtotal, order.currency)]]
  if (typeof order.tax === 'number' && order.tax > 0) lines.push(['Tax', money(order.tax, order.currency)])
  if (typeof order.shipping === 'number' && order.shipping > 0) lines.push(['Shipping', money(order.shipping, order.currency)])
  return lines
}

/** The visual receipt, shared by the on-screen preview and the print copy. */
function ReceiptBody({ order, email }: { order: ReceiptOrder; email: string }) {
  const paid = order.paymentStatus === 'paid'
  return (
    <div className="text-ink-950">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="text-lg font-black tracking-tight">{COMPANY}</p>
          <p className="text-xs text-ink-400">Tax invoice · receipt</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Receipt for</p>
          <p className="mt-0.5 text-sm font-bold break-all">{order.id}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Billed to</p>
          <p className="mt-1 font-semibold break-all">{email}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Order date</p>
          <p className="mt-1 font-semibold">{new Date(order.date).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Order status</p>
          <p className="mt-1 font-semibold">{order.status}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Payment</p>
          <p className="mt-1 font-semibold">{paid ? 'Paid' : order.paymentStatus}</p>
        </div>
      </div>

      <table className="mt-5 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink-950 text-left text-xs uppercase tracking-wide">
            <th className="py-2 pr-3">Item</th>
            <th className="py-2 pr-3 text-right">Qty</th>
            <th className="py-2 pr-3 text-right">Price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={`${item.name}-${index}`}>
              <td>{item.name}</td>
              <td className="num">{item.qty}</td>
              <td className="num">{money(item.price, order.currency)}</td>
              <td className="num">{money(item.price * item.qty, order.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 ml-auto max-w-64 space-y-1.5 text-sm">
        {breakdown(order).map(([label, value]) => (
          <p key={label} className="flex justify-between gap-4">
            <span className="text-ink-400">{label}</span>
            <span className="font-semibold">{value}</span>
          </p>
        ))}
        <p className="flex justify-between gap-4 border-t-2 border-ink-950 pt-2 text-base font-black">
          <span>Total</span>
          <span>{money(order.total, order.currency)}</span>
        </p>
      </div>

      {(order.payuPaymentId || order.payuTxnId) && (
        <p className="mt-5 text-xs text-ink-400">
          {order.payuPaymentId && <>PayU payment ID: <span className="font-mono">{order.payuPaymentId}</span> · </>}
          {order.payuTxnId && <>Transaction: <span className="font-mono">{order.payuTxnId}</span></>}
        </p>
      )}
      <p className="mt-6 border-t border-line pt-3 text-xs text-ink-400">
        Thank you for your purchase. This receipt was generated by {COMPANY}. Keep it for your records.
      </p>
    </div>
  )
}

/** A self-contained HTML document so the downloaded file prints standalone. */
export function receiptHtml(order: ReceiptOrder, email: string) {
  const subtotal = order.subtotal ?? order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const lines: Array<[string, string]> = [['Subtotal', money(subtotal, order.currency)]]
  if (typeof order.tax === 'number' && order.tax > 0) lines.push(['Tax', money(order.tax, order.currency)])
  if (typeof order.shipping === 'number' && order.shipping > 0) lines.push(['Shipping', money(order.shipping, order.currency)])
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Receipt ${escapeHtml(order.id)}</title>
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #0b1020; margin: 0; padding: 2rem; background: #fff; }
  .doc { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 1.25rem; margin: 0; }
  .muted { color: #6b7280; font-size: 0.8rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1rem; font-size: 0.9rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 1.25rem; font-size: 0.9rem; }
  th, td { padding: 0.5rem 0.6rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  th:last-child, td:last-child, .num { text-align: right; }
  thead tr { border-bottom: 2px solid #0b1020; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .totals { margin-left: auto; max-width: 260px; margin-top: 1rem; font-size: 0.9rem; }
  .totals p { display: flex; justify-content: space-between; gap: 1rem; margin: 0.35rem 0; }
  .totals .grand { border-top: 2px solid #0b1020; padding-top: 0.5rem; font-weight: 800; font-size: 1.05rem; }
  .head { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; }
  footer { margin-top: 1.5rem; border-top: 1px solid #e5e7eb; padding-top: 0.75rem; font-size: 0.75rem; color: #6b7280; }
  @media print { body { padding: 0; } }
</style></head>
<body><div class="doc">
  <div class="head"><div><h1>${COMPANY}</h1><p class="muted">Tax invoice · receipt</p></div>
  <div style="text-align:right"><p class="muted">Receipt for</p><strong>${escapeHtml(order.id)}</strong></div></div>
  <div class="grid">
    <div><p class="muted">Billed to</p><strong>${escapeHtml(email)}</strong></div>
    <div><p class="muted">Order date</p><strong>${escapeHtml(new Date(order.date).toLocaleString())}</strong></div>
    <div><p class="muted">Order status</p><strong>${escapeHtml(order.status)}</strong></div>
    <div><p class="muted">Payment</p><strong>${order.paymentStatus === 'paid' ? 'Paid' : escapeHtml(order.paymentStatus)}</strong></div>
  </div>
  <table><thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
  <tbody>${rows(order)}</tbody></table>
  <div class="totals">
    ${lines.map(([label, value]) => `<p><span class="muted">${label}</span><strong>${value}</strong></p>`).join('')}
    <p class="grand"><span>Total</span><span>${money(order.total, order.currency)}</span></p>
  </div>
  ${(order.payuPaymentId || order.payuTxnId) ? `<p class="muted" style="margin-top:1rem">PayU payment ID: ${escapeHtml(order.payuPaymentId || '')} · Transaction: ${escapeHtml(order.payuTxnId || '')}</p>` : ''}
  <footer>Thank you for your purchase. This receipt was generated by ${COMPANY}. Keep it for your records.</footer>
</div></body></html>`
}

type DialogProps = {
  order: ReceiptOrder
  email: string
  onClose: () => void
}

/**
 * Receipt viewer with both delivery methods the account panel promises:
 * "Print" opens the browser print dialog against a portal-printed copy (the
 * app UI is hidden via `body.receipt-printing`), "Download" saves a standalone
 * HTML receipt the customer can print or archive later.
 */
export function OrderReceiptDialog({ order, email, onClose }: DialogProps) {
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!printing) return
    document.body.classList.add('receipt-printing')
    const timer = window.setTimeout(() => window.print(), 80)
    const done = () => {
      document.body.classList.remove('receipt-printing')
      setPrinting(false)
    }
    window.addEventListener('afterprint', done)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('afterprint', done)
      document.body.classList.remove('receipt-printing')
    }
  }, [printing])

  const download = () => {
    const blob = new Blob([receiptHtml(order, email)], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `receipt-${order.id}.html`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const modal: ReactNode = (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/50 p-4" role="dialog" aria-modal="true" aria-label={`Receipt for ${order.id}`}>
      <div className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-600">Receipt</p>
            <h2 className="mt-1 text-xl font-bold text-ink-950">{order.id}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close receipt" className="rounded-lg p-1.5 text-ink-300 transition hover:bg-paper hover:text-ink-950">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="mt-4 rounded-2xl border border-line p-4">
          <ReceiptBody order={order} email={email} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary btn-md" onClick={() => setPrinting(true)}>
            Print receipt
          </button>
          <button type="button" className="btn btn-outline-light btn-md" onClick={download}>
            Download receipt
          </button>
          <button type="button" className="btn btn-ghost-dark btn-md" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-400">Printing opens your browser's print dialog — choose "Save as PDF" to keep a PDF copy.</p>
      </div>
    </div>
  )

  return (
    <>
      {modal}
      {printing && createPortal(<div className="receipt-doc">{<ReceiptBody order={order} email={email} />}</div>, document.body)}
    </>
  )
}
