import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, useCart, usePopup, type InboxEntry } from '@/lib/stores'
import { inr } from '@/lib/format'
import { submitPayUCheckout, type PayUCheckout } from '@/lib/payu-checkout'
import { PanelShell, PanelIcons, type PanelNavItem } from '@/components/panel/PanelShell'
import { OrderReceiptDialog, type ReceiptOrder } from '@/components/panel/OrderReceipt'

type OrderConfirmation = { type: 'paid' | 'request'; orderId: string; testMode?: boolean }
type Order = ReceiptOrder & {
  id: string
  items: Array<{ id: number; name: string; qty: number; price: number }>
}

const box = 'rounded-3xl border border-line bg-white p-5 sm:p-6'

export function AccountPage() {
  const { user } = useAuth()
  const { setOpen } = usePopup()
  const { items, count, total, setQty, remove, clear } = useCart()
  const location = useLocation()

  const confirmation = (location.state as { orderConfirmation?: OrderConfirmation } | null)?.orderConfirmation
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<InboxEntry[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null)
  const [notice, setNotice] = useState(() => {
    const payment = new URLSearchParams(location.search).get('payment')
    const orderId = new URLSearchParams(location.search).get('orderId')
    if (payment === 'paid') return `Payment confirmed for order ${orderId || ''}. Your receipt has been sent to your email.`
    if (payment === 'pending') return `We received your payment for order ${orderId || ''} but are still confirming it with PayU. It will appear in your orders and by email as soon as confirmation completes — no further action is needed.`
    if (payment === 'failed') return 'Payment was not completed. Your order is saved and can be retried from this account.'
    return ''
  })
  // A payment return lands on the panel straight in the orders section.
  const [section, setSection] = useState<string>(() => (new URLSearchParams(location.search).get('payment') ? 'orders' : 'home'))

  const [profile, setProfile] = useState({ name: '', phone: '', timezone: '', address: '', city: '', state: '', postalCode: '', country: 'India' })

  const loadAccount = async () => {
    const r = await fetch('/api/account', { credentials: 'same-origin' })
    if (!r.ok) throw new Error('Unable to load account data.')
    const d = await r.json()
    setOrders(d.orders)
    setTickets((d.inbox || []).filter((entry: InboxEntry) => entry.type === 'ticket'))
  }
  const loadProfile = async () => {
    const r = await fetch('/api/account/profile', { credentials: 'same-origin' })
    if (!r.ok) throw new Error('Unable to load profile.')
    const d = await r.json()
    setProfile({ name: d.profile?.name || '', phone: d.profile?.phone || '', timezone: d.profile?.timezone || '', address: d.profile?.address || '', city: d.profile?.city || '', state: d.profile?.state || '', postalCode: d.profile?.postalCode || '', country: d.profile?.country || 'India' })
  }
  useEffect(() => {
    if (user) {
      void loadAccount().catch((e) => setNotice(e.message))
      void loadProfile().catch((e) => setNotice(e.message))
    }
  }, [user])
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('payment') === 'paid') {
      clear()
      void loadAccount().catch(() => {})
    }
  }, [location.search, clear])

  const cancelOrder = async (id: string) => {
    const r = await fetch(`/api/account/orders/${id}/cancel`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const d = await r.json()
    if (!r.ok) { setNotice(d.error || 'Unable to cancel order.'); return }
    setOrders((previous) => previous.map((o) => (o.id === id ? d.order : o)))
  }
  const payOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/account/orders/${id}/payment`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      submitPayUCheckout(data.payment as PayUCheckout)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to start payment.')
    }
  }
  const submitSupport = async (e: FormEvent) => {
    e.preventDefault()
    setNotice('')
    try {
      const r = await fetch('/api/account/support', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subject, message }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setTickets((previous) => [d.entry, ...previous])
      setSubject('')
      setMessage('')
      setNotice('Support request sent. Our team will follow up.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to submit support request.')
    }
  }
  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setNotice('')
    try {
      const response = await fetch('/api/account/profile', { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(profile) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save profile.')
      setProfile({ name: data.profile.name || '', phone: data.profile.phone || '', timezone: data.profile.timezone || '', address: data.profile.address || '', city: data.profile.city || '', state: data.profile.state || '', postalCode: data.profile.postalCode || '', country: data.profile.country || 'India' })
      setNotice('Profile saved. We will reuse these details for future purchases.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save profile.')
    }
  }
  const resendVerification = async () => {
    const r = await fetch('/api/auth/resend-verification', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}' })
    const d = await r.json()
    setNotice(d.message || d.error || 'Request complete.')
  }
  const sendReply = async (ticket: InboxEntry) => {
    const text = (replyText[ticket.id] || '').trim()
    if (!text) return
    const r = await fetch(`/api/account/support/${ticket.id}/replies`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: text }) })
    const d = await r.json()
    if (!r.ok) { setNotice(d.error || 'Unable to send reply.'); return }
    setTickets((previous) => previous.map((item) => (item.id === ticket.id ? d.entry : item)))
    setReplyText((previous) => ({ ...previous, [ticket.id]: '' }))
  }

  if (!user) {
    return (
      <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
        <div className="max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <p className="eyebrow">My account</p>
          <h1 className="mt-3 text-3xl font-bold text-ink-950">Sign in to your account</h1>
          <p className="mt-3 text-sm text-ink-400">Access your orders, cart, profile and customer support requests.</p>
          <button className="btn btn-primary btn-md mt-6" onClick={() => setOpen('login')}>Log in or register</button>
        </div>
      </div>
    )
  }

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length
  const paidOrder = orders.find((o) => o.paymentStatus === 'paid')

  const nav: PanelNavItem[] = [
    { id: 'home', label: 'Home', icon: PanelIcons.home },
    { id: 'cart', label: 'Cart', icon: PanelIcons.cart, badge: count || undefined },
    { id: 'orders', label: 'My orders', icon: PanelIcons.orders, badge: orders.length || undefined },
    { id: 'profile', label: 'Profile', icon: PanelIcons.user },
    { id: 'support', label: 'Customer support', icon: PanelIcons.support, badge: openTickets || undefined },
  ]

  const stats = [
    { label: 'Orders placed', value: orders.length.toString() },
    { label: 'Paid orders', value: paidOrders.length.toString() },
    { label: 'Items in cart', value: count.toString() },
    { label: 'Open tickets', value: openTickets.toString() },
  ]

  return (
    <PanelShell
      storageKey="myr.panel.account"
      eyebrow="My account"
      title="Your panel"
      meta={user.email}
      nav={nav}
      active={section}
      onSelect={setSection}
    >
      {confirmation && (
        <section className={`mb-5 rounded-2xl border p-5 ${confirmation.testMode ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-emerald-200 bg-emerald-50 text-emerald-950'}`} role="status" aria-live="polite">
          <p className="text-sm font-bold">
            {confirmation.testMode
              ? 'Test payment succeeded — no real charge was made.'
              : confirmation.type === 'paid'
                ? 'Payment confirmed — thank you for choosing MYR.'
                : 'Order request received — thank you for choosing MYR.'}
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            {confirmation.testMode
              ? 'This sandbox order is saved for testing only and will not be processed as a real purchase.'
              : confirmation.type === 'paid'
                ? 'Your order is now with our team. A specialist will contact you within 24 hours to review the next steps, share any tailored quote or project details, and answer your questions.'
                : 'Our team will contact you within 24 hours to confirm your requirements, share a clear quote, and discuss the next step.'}
          </p>
          <p className="mt-3 text-xs font-semibold">Order reference: {confirmation.orderId}. You can also follow its status in My orders below.</p>
        </section>
      )}
      {user.emailVerified === false && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <span>Verify your email to unlock account actions.</span>
          <button type="button" className="font-semibold underline" onClick={() => void resendVerification()}>Resend verification</button>
        </div>
      )}
      {notice && (
        <p role="status" className="mb-5 rounded-xl border border-line bg-paper p-3 text-sm">{notice}</p>
      )}

      {/* ---------------------------------- home --------------------------------- */}
      {section === 'home' && (
        <section className={box}>
          <p className="eyebrow">Overview</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">Welcome back</h2>
          <p className="mt-1 text-sm text-ink-400">Signed in as {user.email} · {user.role}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-ink-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary btn-md">Go to home page →</Link>
            <Link to="/tech-store/" className="btn btn-outline-light btn-md">Browse the store</Link>
            <button type="button" className="btn btn-outline-light btn-md" onClick={() => setSection('orders')}>View my orders</button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => setSection('cart')} className="rounded-2xl border border-line p-4 text-left transition hover:border-accent-400">
              <p className="font-bold text-ink-950">Cart</p>
              <p className="mt-1 text-sm text-ink-400">{count ? `${count} item(s) · ${inr(total)}` : 'Your cart is empty'}</p>
            </button>
            <button type="button" onClick={() => setSection('profile')} className="rounded-2xl border border-line p-4 text-left transition hover:border-accent-400">
              <p className="font-bold text-ink-950">Profile</p>
              <p className="mt-1 text-sm text-ink-400">Update your saved details</p>
            </button>
            <button type="button" onClick={() => setSection('support')} className="rounded-2xl border border-line p-4 text-left transition hover:border-accent-400">
              <p className="font-bold text-ink-950">Customer support</p>
              <p className="mt-1 text-sm text-ink-400">{openTickets ? `${openTickets} open ticket(s)` : 'Raise a new ticket'}</p>
            </button>
          </div>
        </section>
      )}

      {/* ---------------------------------- cart --------------------------------- */}
      {section === 'cart' && (
        <section className={box}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Your shopping cart</p>
              <h2 className="mt-2 text-2xl font-bold text-ink-950">Cart</h2>
            </div>
            <Link to="/tech-store/" className="text-sm font-semibold text-accent-600">Continue shopping →</Link>
          </div>
          {!items.length ? (
            <div className="mt-5 rounded-2xl border border-line bg-paper p-8 text-center">
              <p className="text-ink-500">Your cart is currently empty.</p>
              <Link className="btn btn-primary btn-md mt-5" to="/tech-store/">Return to store</Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="overflow-hidden rounded-2xl border border-line">
                {items.map((item) => (
                  <article key={`${item.id}-${item.variant || ''}`} className="flex flex-wrap items-center gap-4 border-b border-line p-4 last:border-0 sm:p-5">
                    <img src={item.image || '/assets/2024-09-website-development.jpg'} alt={item.name} className="h-16 w-20 rounded-xl bg-paper object-contain p-2" loading="lazy" />
                    <div className="min-w-32 flex-1">
                      <h3 className="font-semibold text-ink-950">{item.name}</h3>
                      {item.variant && <p className="text-xs text-ink-400">{item.variant}</p>}
                      <p className="mt-1 text-sm text-ink-500">{inr(item.price)}</p>
                    </div>
                    <label className="text-xs text-ink-500">
                      Quantity
                      <input aria-label={`Quantity for ${item.name}`} className="input mt-1 w-24" type="number" min="1" step="1" value={item.qty} onChange={(e) => setQty(item.id, Math.max(1, Math.floor(Number(e.target.value) || 1)), item.variant)} />
                    </label>
                    <strong className="min-w-24 text-right">{inr(item.price * item.qty)}</strong>
                    <button type="button" className="text-sm text-flame-600 underline" onClick={() => remove(item.id, item.variant)}>Remove</button>
                  </article>
                ))}
              </div>
              <aside className="h-fit rounded-2xl border border-line bg-paper p-5">
                <h3 className="font-bold text-ink-950">Cart totals</h3>
                <p className="mt-4 flex justify-between border-b border-line pb-3 text-sm">
                  <span>Subtotal</span>
                  <strong>{inr(total)}</strong>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-400">Tax and shipping are calculated securely at checkout.</p>
                <Link className="btn btn-primary btn-md mt-5 w-full" to="/checkout/">Proceed to checkout</Link>
                <Link className="mt-4 block text-center text-sm font-semibold text-accent-600" to="/tech-store/">Continue shopping</Link>
              </aside>
            </div>
          )}
        </section>
      )}

      {/* --------------------------------- orders -------------------------------- */}
      {section === 'orders' && (
        <div className="space-y-5">
          {paidOrder && (
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5" role="status" aria-live="polite">
              <h2 className="text-xl font-bold text-emerald-900">✅ Payment confirmed — order received</h2>
              <p className="mt-1 text-sm text-emerald-800">Your payment has been verified by PayU and a receipt has been sent to your email.</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-emerald-800">Order ID</span><span className="font-semibold text-emerald-900">{paidOrder.id}</span></p>
                <p className="flex justify-between"><span className="text-emerald-800">Date</span><span className="font-semibold text-emerald-900">{new Date(paidOrder.date).toLocaleString()}</span></p>
                <p className="flex justify-between"><span className="text-emerald-800">Status</span><span className="font-semibold text-emerald-700 uppercase">{paidOrder.status}</span></p>
                <p className="flex justify-between"><span className="text-emerald-800">Payment</span><span className="font-semibold text-emerald-700 uppercase">{paidOrder.paymentStatus}</span></p>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-emerald-800">
                {paidOrder.items.map((i, index) => (
                  <li key={`${i.name}-${index}`} className="flex justify-between"><span>{i.name} × {i.qty}</span><span className="font-semibold">{inr(i.price * i.qty)}</span></li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-emerald-200 pt-2 text-base font-bold text-emerald-900"><span>Total</span><span>{inr(paidOrder.total)}</span></p>
            </section>
          )}

          <section className={box}>
            <p className="eyebrow">My orders</p>
            <h2 className="mt-2 text-2xl font-bold text-ink-950">Order history</h2>
            <p className="mt-1 text-sm text-ink-400">Every order you have placed, with a printable and downloadable receipt for paid orders.</p>

            {orders.length ? (
              <div className="mt-5 space-y-4">
                {orders.map((o) => (
                  <article key={o.id} className="rounded-2xl border border-line p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <strong className="break-all text-ink-950">{o.id}</strong>
                        <p className="mt-1 text-xs text-ink-400">{new Date(o.date).toLocaleString()} · Payment: {o.paymentStatus}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-paper text-ink-300'}`}>{o.status}</span>
                        {o.paymentStatus === 'paid' && (
                          <>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setReceiptOrder(o)}>Receipt · print / download</button>
                          </>
                        )}
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm">
                      {o.items.map((i, index) => (
                        <li key={`${i.name}-${index}`} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{inr(i.price * i.qty)}</span></li>
                      ))}
                    </ul>
                    <p className="mt-3 border-t border-line pt-2 text-right font-bold">{inr(o.total)}</p>
                    {['Pending payment', 'Awaiting payment'].includes(o.status) && (
                      <div className="mt-3 flex gap-4">
                        <button type="button" onClick={() => void payOrder(o.id)} className="text-sm font-semibold text-accent-600">Pay now</button>
                        <button type="button" onClick={() => void cancelOrder(o.id)} className="text-sm font-semibold text-flame-600">Cancel order</button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-paper p-4 text-sm text-ink-400">
                No orders yet. <Link className="text-accent-600" to="/tech-store/">Browse the store.</Link>
              </p>
            )}
          </section>

          <section className={box}>
            <h2 className="text-xl font-bold text-ink-950">Your purchased services and products</h2>
            <p className="mt-1 text-sm text-ink-400">Paid purchases appear here after payment is confirmed.</p>
            {paidOrders.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {paidOrders.flatMap((o) =>
                  o.items.map((item, index) => (
                    <article key={`${o.id}-${item.name}-${index}`} className="rounded-2xl border border-line bg-paper p-4">
                      <p className="font-semibold text-ink-950">{item.name}</p>
                      <p className="mt-1 text-xs text-ink-400">Order {o.id} · Purchased {new Date(o.date).toLocaleDateString()}</p>
                      <p className="mt-2 text-sm font-semibold text-emerald-700">Payment confirmed</p>
                      <button type="button" className="mt-2 text-xs font-semibold text-accent-600 underline" onClick={() => setReceiptOrder(o)}>View receipt</button>
                    </article>
                  )),
                )}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-400">Your paid services and products will appear here after checkout is confirmed.</p>
            )}
          </section>
        </div>
      )}

      {/* --------------------------------- profile ------------------------------- */}
      {section === 'profile' && (
        <div className="space-y-5">
          <section className={box}>
            <p className="eyebrow">Profile</p>
            <h2 className="mt-2 text-2xl font-bold text-ink-950">Account details</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Email address</p>
                <p className="mt-1 break-all font-semibold text-ink-950">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Role</p>
                <p className="mt-1 font-semibold capitalize text-ink-950">{user.role}</p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Email status</p>
                <p className="mt-1 font-semibold text-ink-950">{user.emailVerified !== false ? 'Verified' : 'Not verified'}</p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Member since</p>
                <p className="mt-1 font-semibold text-ink-950">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {user.emailVerified === false && (
              <button type="button" className="mt-4 text-sm font-semibold text-accent-600 underline" onClick={() => void resendVerification()}>Resend verification email</button>
            )}
          </section>

          <section className={box}>
            <h2 className="text-xl font-bold text-ink-950">Saved customer details</h2>
            <p className="mt-1 text-sm text-ink-400">These details are reused for future purchases and invoices.</p>
            <form onSubmit={(event) => void saveProfile(event)} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">Full name<input className="input mt-1" required minLength={2} maxLength={120} value={profile.name} onChange={(e) => setProfile((current) => ({ ...current, name: e.target.value }))} /></label>
              <label className="text-sm">Phone<input className="input mt-1" required value={profile.phone} onChange={(e) => setProfile((current) => ({ ...current, phone: e.target.value }))} /></label>
              <label className="text-sm">Timezone<input className="input mt-1" value={profile.timezone} onChange={(e) => setProfile((current) => ({ ...current, timezone: e.target.value }))} placeholder="Asia/Kolkata" /></label>
              <label className="text-sm sm:col-span-2">Street address<input className="input mt-1" value={profile.address} onChange={(e) => setProfile((current) => ({ ...current, address: e.target.value }))} /></label>
              <label className="text-sm">City<input className="input mt-1" value={profile.city} onChange={(e) => setProfile((current) => ({ ...current, city: e.target.value }))} /></label>
              <label className="text-sm">State<input className="input mt-1" value={profile.state} onChange={(e) => setProfile((current) => ({ ...current, state: e.target.value }))} /></label>
              <label className="text-sm">Postal code<input className="input mt-1" value={profile.postalCode} onChange={(e) => setProfile((current) => ({ ...current, postalCode: e.target.value }))} /></label>
              <label className="text-sm">Country<input className="input mt-1" value={profile.country} onChange={(e) => setProfile((current) => ({ ...current, country: e.target.value }))} /></label>
              <div className="flex justify-end sm:col-span-2"><button className="btn btn-primary btn-md">Save details</button></div>
            </form>
          </section>
        </div>
      )}

      {/* --------------------------------- support ------------------------------- */}
      {section === 'support' && (
        <section className={box}>
          <p className="eyebrow">Customer support</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-950">Raise a support ticket</h2>
          <p className="mt-1 text-sm text-ink-400">Send a request and track its status here. Our team replies by email and in this panel.</p>
          <form onSubmit={(e) => void submitSupport(e)} className="mt-5 space-y-3">
            <label className="block text-sm">Subject
              <input className="input mt-1" required minLength={3} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            </label>
            <label className="block text-sm">How can we help?
              <textarea className="input mt-1 min-h-28" required minLength={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue" />
            </label>
            <button className="btn btn-primary btn-md" type="submit">Send support request</button>
          </form>

          <div className="mt-7 border-t border-line pt-5">
            <h3 className="text-lg font-bold text-ink-950">Your tickets</h3>
            {tickets.length ? (
              <div className="mt-4 space-y-3">
                {tickets.map((t) => (
                  <article key={t.id} className="rounded-2xl border border-line p-4">
                    <div className="flex justify-between gap-3">
                      <strong className="min-w-0 break-words">{t.subject}</strong>
                      <span className="shrink-0 text-xs">{t.status}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-ink-400">{t.message}</p>
                    {t.replies?.map((reply) => (
                      <div key={reply.id} className="mt-2 rounded-lg bg-paper p-3 text-sm">
                        <p className="font-semibold">{reply.author === 'customer' ? 'You' : 'MYR support'}</p>
                        <p className="mt-1 whitespace-pre-line">{reply.message}</p>
                      </div>
                    ))}
                    <div className="mt-3 flex gap-2">
                      <input className="input" value={replyText[t.id] || ''} onChange={(e) => setReplyText((previous) => ({ ...previous, [t.id]: e.target.value }))} placeholder="Add a reply" />
                      <button type="button" className="btn btn-outline-light btn-sm" onClick={() => void sendReply(t)}>Reply</button>
                    </div>
                    <p className="mt-2 text-xs text-ink-300">{new Date(t.date).toLocaleString()}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-400">No support tickets yet — send the form above to open your first one.</p>
            )}
          </div>
        </section>
      )}

      {receiptOrder && <OrderReceiptDialog order={receiptOrder} email={user.email} onClose={() => setReceiptOrder(null)} />}
    </PanelShell>
  )
}
