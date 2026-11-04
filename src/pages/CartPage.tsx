import { Link } from 'react-router-dom'
import { useCart } from '@/lib/stores'
import { inr } from '@/lib/format'

export function CartPage() {
  const { items, total, setQty, remove } = useCart()
  return <section className="container-page min-h-[60vh] py-12 sm:py-16">
    <p className="eyebrow">Your shopping cart</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Cart</h1>
    {!items.length ? <div className="mt-7 rounded-3xl border border-line bg-white p-8 text-center"><p className="text-ink-500">Your cart is currently empty.</p><Link className="btn btn-primary btn-md mt-5" to="/tech-store/">Return to store</Link></div> : <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="overflow-hidden rounded-3xl border border-line bg-white">{items.map((item) => <article key={`${item.id}-${item.variant || ''}`} className="flex flex-wrap items-center gap-4 border-b border-line p-5 last:border-0">
        <img src={item.image || '/assets/2024-09-website-development.jpg'} alt={item.name} className="h-20 w-24 rounded-xl bg-paper object-contain p-2" loading="lazy" />
        <div className="min-w-40 flex-1"><h2 className="font-semibold text-ink-950">{item.name}</h2>{item.variant && <p className="text-xs text-ink-400">{item.variant}</p>}<p className="mt-1 text-sm text-ink-500">{inr(item.price)}</p></div>
        <label className="text-xs text-ink-500">Quantity<input aria-label={`Quantity for ${item.name}`} className="input mt-1 w-24" type="number" min="1" step="1" value={item.qty} onChange={(e) => setQty(item.id, Math.max(1, Math.floor(Number(e.target.value) || 1)), item.variant)} /></label>
        <strong className="min-w-24 text-right">{inr(item.price * item.qty)}</strong><button className="text-sm text-flame-600 underline" onClick={() => remove(item.id, item.variant)}>Remove</button>
      </article>)}</div>
      <aside className="h-fit rounded-3xl border border-line bg-white p-6"><h2 className="font-bold text-ink-950">Cart totals</h2><p className="mt-4 flex justify-between border-b border-line pb-3 text-sm"><span>Subtotal</span><strong>{inr(total)}</strong></p><p className="mt-3 text-xs leading-relaxed text-ink-400">Tax and shipping are calculated securely at checkout.</p><Link className="btn btn-primary btn-md mt-5 w-full" to="/checkout/">Proceed to checkout</Link><Link className="mt-4 block text-center text-sm font-semibold text-accent-600" to="/tech-store/">Continue shopping</Link></aside>
    </div>}
  </section>
}
