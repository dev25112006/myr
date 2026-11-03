import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCart, usePopup } from '@/lib/stores'
import { inr } from '@/lib/format'
import { submitPayUCheckout, type PayUCheckout } from '@/lib/payu-checkout'

type ShippingAddress = { name: string; address: string; city: string; state: string; postalCode: string; country: string; phone: string }
type Quote = { items: Array<{ id: number; name: string; price: number; qty: number }>; subtotal: number; tax: number; shipping: number; total: number; commerceReady: boolean; paymentAvailable: boolean; testMode: boolean }

export function CheckoutPage() {
  const { user } = useAuth(); const { items, clear } = useCart(); const { setOpen } = usePopup(); const navigate = useNavigate()
  const [notes, setNotes] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [shipping, setShipping] = useState<ShippingAddress>({ name: '', address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' })
  const requiresShipping = items.some((item) => item.id === 3056)

  useEffect(() => {
    if (!user) return
    void fetch('/api/account/profile', { credentials: 'same-origin' }).then(async (response) => {
      const data = await response.json()
      if (!response.ok) return
      const profile = data.profile || {}
      setShipping({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postalCode: profile.postalCode || '',
        country: profile.country || 'India',
      })
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!items.length) { setQuote(null); setMessage(''); return }
    setQuote(null); setMessage('')
    void fetch('/api/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setQuote(data) })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to calculate order total.'))
  }, [items])

  const submit = async () => {
    if (!user) { setOpen('login'); return }
    if (shipping.name.trim().length < 2 || !shipping.phone.trim()) { setMessage('Enter your name and phone number to continue.'); return }
    if (!quote) { setMessage('The current price quote is loading. Please try again.'); return }
    setBusy(true); setMessage('')
    try {
      const profilePayload = {
        name: shipping.name.trim(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim() || 'India',
      }
      const profileResponse = await fetch('/api/account/profile', { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(profilePayload) })
      if (!profileResponse.ok) {
        const profileError = await profileResponse.json()
        throw new Error(profileError.error || 'Unable to save your customer details.')
      }
      const response = await fetch('/api/orders', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })), expectedTotal: quote.total, notes, ...(requiresShipping ? { shippingAddress: shipping } : {}) }) })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 409) {
          const refreshed = await fetch('/api/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) }) })
          const currentQuote = await refreshed.json()
          if (refreshed.ok) setQuote(currentQuote)
          else setQuote(null)
        }
        throw new Error(data.error || 'Could not place your order.')
      }
      if (data.payment) {
        submitPayUCheckout(data.payment as PayUCheckout)
      } else { clear(); navigate('/my-account/', { state: { orderConfirmation: { type: 'request', orderId: data.order.id, testMode: quote.testMode } } }) }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not place your order.') } finally { setBusy(false) }
  }

  return <section className="container-page py-12 sm:py-16"><p className="eyebrow">Checkout</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Review your order</h1>{items.length ? <div className="mt-7 grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-3xl border border-line bg-white p-5">{(quote?.items || items).map((item) => <div key={`${item.id}-${item.qty}`} className="flex justify-between gap-4 border-b border-line py-4"><span>{item.name} × {item.qty}</span><strong>{inr(item.price * item.qty)}</strong></div>)}<fieldset className="mt-5 grid gap-3 sm:grid-cols-2"><legend className="label mb-3">Customer details</legend>{([['name', 'Full name'], ['phone', 'Phone']] as const).map(([key, label]) => <input key={key} className="input" required aria-label={label} placeholder={label} value={shipping[key]} onChange={(e) => setShipping((previous) => ({ ...previous, [key]: e.target.value }))} />)}</fieldset>{requiresShipping && <fieldset className="mt-5 grid gap-3 sm:grid-cols-2"><legend className="label mb-3">Shipping address</legend>{([['address', 'Street address'], ['city', 'City'], ['state', 'State'], ['postalCode', 'Postal code'], ['country', 'Country']] as const).map(([key, label]) => <input key={key} className="input" required aria-label={label} placeholder={label} value={shipping[key]} onChange={(e) => setShipping((previous) => ({ ...previous, [key]: e.target.value }))} />)}</fieldset>}<label className="label mt-5 block">Order notes<textarea className="input mt-2 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} /></label></div><aside className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="font-bold">Order summary</h2>{quote ? <div className="mt-4 space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{inr(quote.subtotal)}</span></p><p className="flex justify-between"><span>Tax</span><span>{inr(quote.tax)}</span></p><p className="flex justify-between"><span>Shipping</span><span>{inr(quote.shipping)}</span></p><p className="flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total</span><span>{inr(quote.total)}</span></p></div> : <p className="mt-3 text-sm text-ink-400">{message || 'Calculating your order total…'}</p>}<p className="mt-4 text-sm text-ink-400">Your total uses the current catalog price, verified tax, and applicable delivery charge. Order quantities are not limited by stock.</p>{quote?.testMode && <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><strong>PayU test mode:</strong> This transaction uses PayU's sandbox. No production payment is being made. The tax and shipping values must be verified before launch.</p>}{quote && !quote.commerceReady && <p className="mt-2 text-sm text-amber-800">Checkout is paused while an admin confirms the store’s tax and shipping settings. No stock count is required.</p>}{quote?.commerceReady && !quote.paymentAvailable && <p className="mt-2 text-sm text-amber-800">Online payment is not configured. You can submit an order request, and our team will contact you.</p>}{message && quote && <p role="alert" className="mt-4 text-sm text-flame-600">{message}</p>}<button disabled={busy || !quote || !quote.commerceReady} onClick={() => void submit()} className="btn btn-primary btn-md mt-5 w-full">{busy ? 'Starting checkout…' : !quote?.commerceReady ? 'Checkout unavailable' : user ? quote?.testMode ? 'Place test order' : quote?.paymentAvailable ? 'Place order and pay' : 'Place order request' : 'Sign in to continue'}</button>{!user && <Link to="/my-account/" className="mt-3 block text-center text-sm font-semibold text-accent-600">Go to sign in</Link>}</aside></div> : <div className="mt-6 rounded-2xl bg-white p-8">Your cart is empty. <Link to="/tech-store/" className="font-semibold text-accent-600">Browse products</Link></div>}</section>
}
