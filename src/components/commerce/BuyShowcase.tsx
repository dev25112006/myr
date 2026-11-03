import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, usePopup } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'
import { inr } from '@/lib/format'

type Props = {
  id: number
  name: string
  desc: string
  fallbackPrice: number
  monthly?: boolean
  compareAt?: number
  image?: string
  features: string[]
  heading: string
  sub?: string
}

type Details = { name: string; phone: string; address: string; city: string; state: string; postalCode: string; country: string; notes: string }

/** Interactive buy section: left = core features + direct "Buy now" (Razorpay), right = animated purchase preview. */
export function BuyShowcase({ id, name, desc, fallbackPrice, monthly, compareAt, image, features, heading, sub }: Props) {
  const price = useCatalogPrice(id, fallbackPrice)
  const { user } = useAuth()
  const { setOpen } = usePopup()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [details, setDetails] = useState<Details>({ name: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'India', notes: '' })

  const loadRazorpay = async () => {
    if (document.getElementById('razorpay-checkout-script')) {
      return (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: 'payment.failed', h: (r: { error?: { description?: string } }) => void) => void } }).Razorpay
    }
    const script = document.createElement('script')
    script.id = 'razorpay-checkout-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Unable to load payment checkout.')) })
    return (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: 'payment.failed', h: (r: { error?: { description?: string } }) => void) => void } }).Razorpay
  }

  const startBuy = () => {
    if (!user) { setOpen('login'); return }
    setDetails((d) => ({ ...d, name: d.name || (user?.email.split('@')[0] ?? '') }))
    setShowForm(true)
  }

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!details.name.trim() || !details.phone.trim()) { setMessage('Name and phone are required.'); return }
    setBusy(true)
    setMessage('')
    try {
      const quoteRes = await fetch('/api/quote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: [{ id, qty: 1 }] }) })
      const quote = await quoteRes.json()
      if (!quoteRes.ok) throw new Error(quote.error || 'Unable to calculate price.')

      const orderRes = await fetch('/api/orders', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: [{ id, qty: 1 }], expectedTotal: quote.total, notes: details.notes, shippingAddress: { name: details.name, phone: details.phone, address: details.address, city: details.city, state: details.state, postalCode: details.postalCode, country: details.country } }) })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order.')

      if (!orderData.payment) {
        setMessage('Online payment is not configured. Our team will contact you.')
        setBusy(false)
        return
      }

      setShowForm(false)
      const Razorpay = await loadRazorpay()
      if (!Razorpay) throw new Error('Payment checkout unavailable.')

      const checkout = new Razorpay({
        key: orderData.payment.keyId,
        amount: orderData.payment.amount,
        currency: orderData.payment.currency,
        name: 'MYR Advance Solution',
        description: `${name} order`,
        order_id: orderData.payment.orderId,
        prefill: { email: user!.email, name: details.name, contact: details.phone },
        handler: async (result: Record<string, string>) => {
          const verify = await fetch('/api/payments/verify', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ orderId: orderData.order.id, ...result }) })
          const verifyData = await verify.json()
          if (!verify.ok) { setMessage(verifyData.error || 'Payment verification failed.'); return }
          navigate('/my-account/', { state: { orderConfirmation: { type: 'paid', orderId: verifyData.order.id, testMode: quote.testMode === true } } })
        },
        modal: { ondismiss: () => setMessage('Payment was not completed. Your order is saved in your account.') },
      })
      checkout.on('payment.failed', (response) => setMessage(response.error?.description || 'Payment failed. Please try again.'))
      checkout.open()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to start payment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section-light py-14 sm:py-20">
      <div className="container-page grid items-center gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Left: features + buy */}
        <div>
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">{heading}</h2>
          {sub && <p className="mt-2 text-sm text-ink-600">{sub}</p>}
          <ul className="mt-5 space-y-2 text-sm text-ink-700">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline gap-2">
            {compareAt != null && price < compareAt && (
              <span className="text-sm text-ink-400 line-through">{inr(compareAt)}</span>
            )}
            <span className="text-2xl font-bold text-flame-600">{inr(price)}</span>
            {monthly && <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">/ month</span>}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={startBuy} disabled={busy} className="btn btn-primary btn-lg">
              {busy ? 'Starting…' : 'Buy now'}
            </button>
            <a href="/contact-us/" className="text-sm font-semibold text-accent-600 hover:underline">
              Talk to sales →
            </a>
          </div>
          {message && <p role="alert" className="mt-3 text-sm text-flame-600">{message}</p>}
          <p className="mt-3 text-xs text-ink-400">{desc}</p>
        </div>
        {/* Right: animated purchase preview */}
        <div className="flex justify-center sm:justify-end">
          <PurchaseAnimation name={name} price={price} monthly={!!monthly} image={image} />
        </div>
      </div>

      {/* Details modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-ink-950">Checkout details</h3>
            <p className="mt-1 text-sm text-ink-500">Fill in your details. We’ll use these for your order and invoice.</p>
            <form onSubmit={submitDetails} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">Full name<input className="input mt-1" required value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} /></label>
              <label className="text-sm">Phone<input className="input mt-1" required value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} /></label>
              <label className="text-sm">Country<input className="input mt-1" value={details.country} onChange={(e) => setDetails({ ...details, country: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2">Street address<input className="input mt-1" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} /></label>
              <label className="text-sm">City<input className="input mt-1" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} /></label>
              <label className="text-sm">State<input className="input mt-1" value={details.state} onChange={(e) => setDetails({ ...details, state: e.target.value })} /></label>
              <label className="text-sm">Postal code<input className="input mt-1" value={details.postalCode} onChange={(e) => setDetails({ ...details, postalCode: e.target.value })} /></label>
              <label className="text-sm sm:col-span-2">Order notes<textarea className="input mt-1 min-h-20" value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} /></label>
              {message && <p role="alert" className="sm:col-span-2 text-sm text-flame-600">{message}</p>}
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-light btn-md">Cancel</button>
                <button type="submit" disabled={busy} className="btn btn-primary btn-md">{busy ? 'Processing…' : 'Continue to payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function PurchaseAnimation({ name, price, monthly, image }: { name: string; price: number; monthly: boolean; image?: string }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const cycle = () => {
      setStep(0)
      t = setTimeout(() => setStep(1), 1800)
      setTimeout(() => setStep(2), 3200)
      setTimeout(cycle, 5200)
    }
    cycle()
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {image && (
        <div className="h-32 overflow-hidden bg-paper">
          <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-base font-bold text-ink-950">{name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold text-flame-600">{inr(price)}</span>
          {monthly && <span className="text-[10px] font-semibold uppercase text-ink-400">/ month</span>}
        </div>
        <div className="mt-4">
          {step === 0 && (
            <div className="w-full rounded-lg bg-ink-950 py-2.5 text-center text-sm font-bold text-white">
              Buy now
            </div>
          )}
          {step === 1 && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-ink-700">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-ink-950" />
              Processing payment…
            </div>
          )}
          {step === 2 && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white">
              ✓ Purchased
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-[10px] text-ink-400">
          {step === 2 ? 'Redirecting to your account…' : 'Secure checkout · Razorpay'}
        </p>
      </div>
    </div>
  )
}