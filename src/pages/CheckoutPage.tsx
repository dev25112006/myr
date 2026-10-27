import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '@/lib/stores'
import { inr } from '@/lib/format'

type ShippingAddress = { name: string; address: string; city: string; state: string; postalCode: string; country: string; phone: string }
type Quote = { items: Array<{ id: number; name: string; price: number; qty: number }>; subtotal: number; tax: number; shipping: number; total: number; paymentAvailable: boolean }
type PaymentWindow = { open: () => void; on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void }

async function loadRazorpay() {
  if (!document.getElementById('razorpay-checkout-script')) {
    const script = document.createElement('script'); script.id = 'razorpay-checkout-script'; script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true; document.body.appendChild(script)
    await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Unable to load the payment window.')) })
  }
  return (window as Window & { Razorpay?: new (options: Record<string, unknown>) => PaymentWindow }).Razorpay
}

export function CheckoutPage() {
  const { user } = useAuth(); const { items, clear } = useCart(); const navigate = useNavigate()
  const [notes, setNotes] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [order, setOrder] = useState<{ id: string; total: number } | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [shipping, setShipping] = useState<ShippingAddress>({ name: '', address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' })
  const requiresShipping = items.some((item) => item.id === 3056)

  useEffect(() => {
    if (!items.length) { setQuote(null); return }
    void fetch('/api/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setQuote(data) })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to calculate order total.'))
  }, [items])

  const complete = async (paymentData: { orderId: string; result: Record<string, string> }) => {
    try {
      const response = await fetch('/api/payments/verify', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ orderId: paymentData.orderId, ...paymentData.result }) })
      const data = await response.json()
      if (!response.ok) { setMessage(data.error || 'Payment verification failed.'); return }
      clear(); navigate('/my-account/', { state: { order: data.order } })
    } catch { setMessage(`Payment was received, but confirmation could not be completed. Your order ${paymentData.orderId} is saved; contact support before retrying.`) }
  }

  const submit = async () => {
    if (!user) { setMessage('Please sign in or create an account before placing your order.'); return }
    if (!quote) { setMessage('The current price quote is loading. Please try again.'); return }
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/orders', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })), notes, ...(requiresShipping ? { shippingAddress: shipping } : {}) }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not place your order.')
      if (data.payment) {
        const Razorpay = await loadRazorpay(); if (!Razorpay) throw new Error(`Payment checkout unavailable. Order ${data.order.id} is saved in your account.`)
        const checkout = new Razorpay({ key: data.payment.keyId, amount: data.payment.amount, currency: data.payment.currency, name: 'MYR Advance Solution', description: `Order ${data.order.id}`, order_id: data.payment.orderId, prefill: { email: user.email }, handler: (result: Record<string, string>) => void complete({ orderId: data.order.id, result }), modal: { ondismiss: () => setMessage(`Payment was not completed. Order ${data.order.id} is saved in your account.`) } })
        checkout.on('payment.failed', (response) => setMessage(response.error?.description || `Payment failed. Order ${data.order.id} is saved in your account; you can retry from My Account.`))
        checkout.open()
      } else { clear(); setOrder(data.order); navigate('/my-account/', { state: { order: data.order } }) }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not place your order.') } finally { setBusy(false) }
  }

  if (order) return null
  return <section className="container-page py-12 sm:py-16"><p className="eyebrow">Checkout</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Review your order</h1>{items.length ? <div className="mt-7 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-3xl border border-line bg-white p-5">{(quote?.items || items).map((item) => <div key={`${item.id}-${item.qty}`} className="flex justify-between gap-4 border-b border-line py-4"><span>{item.name} × {item.qty}</span><strong>{inr(item.price * item.qty)}</strong></div>)}{requiresShipping && <fieldset className="mt-5 grid gap-3 sm:grid-cols-2"><legend className="label mb-3">Shipping address</legend>{([['name', 'Full name'], ['phone', 'Phone'], ['address', 'Street address'], ['city', 'City'], ['state', 'State'], ['postalCode', 'Postal code'], ['country', 'Country']] as const).map(([key, label]) => <input key={key} className="input" required aria-label={label} placeholder={label} value={shipping[key]} onChange={(e) => setShipping((previous) => ({ ...previous, [key]: e.target.value }))} />)}</fieldset>}<label className="label mt-5 block">Order notes<textarea className="input mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} /></label></div><aside className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="font-bold">Order summary</h2>{quote ? <div className="mt-4 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{inr(quote.subtotal)}</span></p><p className="flex justify-between"><span>Tax</span><span>{inr(quote.tax)}</span></p><p className="flex justify-between"><span>Shipping</span><span>{inr(quote.shipping)}</span></p><p className="flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total</span><span>{inr(quote.total)}</span></p></div> : <p className="mt-3 text-sm text-ink-400">Calculating current prices…</p>}<p className="mt-4 text-sm text-ink-400">Prices, tax, shipping, and stock are confirmed by the server when you place the order.</p>{quote && !quote.paymentAvailable && <p className="mt-2 text-sm text-amber-800">Online payment is not configured. The team will follow up to collect payment.</p>}{message && <p role="alert" className="mt-4 text-sm text-flame-600">{message}</p>}<button disabled={busy || !quote} onClick={() => void submit()} className="btn btn-primary btn-md mt-5 w-full">{busy ? 'Starting checkout…' : user ? quote?.paymentAvailable ? 'Place order and pay' : 'Place order request' : 'Sign in to continue'}</button>{!user && <Link to="/my-account/" className="mt-3 block text-center text-sm font-semibold text-accent-600">Go to sign in</Link>}</aside></div> : <div className="mt-6 rounded-2xl bg-white p-8">Your cart is empty. <Link to="/tech-store/" className="font-semibold text-accent-600">Browse products</Link></div>}</section>
}
