import { Link } from 'react-router-dom'
import { useCart } from '@/lib/stores'
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
  to?: string
  badge?: string
}

/** Compact buy card with admin-controlled live price + add-to-cart, embeddable on solution pages. */
export function ProductBuyCard({ id, name, desc, fallbackPrice, monthly, compareAt, image, to, badge }: Props) {
  const price = useCatalogPrice(id, fallbackPrice)
  const { add, items, remove } = useCart()
  const inCart = items.some((item) => item.id === id)
  const onSale = compareAt != null && price < compareAt

  const toggleCart = () => {
    if (inCart) remove(id)
    else add({ id, price, name })
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:border-flame-400/50 hover:shadow-xl">
      {image && (
        <div className="relative h-40 overflow-hidden bg-paper">
          <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex gap-2">
            {(onSale || badge === 'Sale') && (
              <span className="rounded-full bg-flame-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow">Sale!</span>
            )}
            {badge && badge !== 'Sale' && (
              <span className="rounded-full bg-ink-950/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">{badge}</span>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-ink-950">{name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-400">{desc}</p>
        <div className="mt-3 flex items-baseline gap-2">
          {compareAt != null && price < compareAt && (
            <span className="text-xs text-ink-400 line-through">{inr(compareAt)}</span>
          )}
          <span className="text-lg font-bold text-flame-600">{inr(price)}</span>
          {monthly && <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">/ month</span>}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={toggleCart}
            aria-pressed={inCart}
            className={`inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-bold transition ${
              inCart
                ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                : 'border-flame-500 text-flame-600 group-hover:bg-flame-500 group-hover:text-white'
            }`}
          >
            {inCart ? '✓ Added' : 'Add to cart'}
          </button>
          {inCart && (
            <button
              type="button"
              onClick={() => remove(id)}
              aria-label={`Remove ${name} from cart`}
              title="Remove from cart"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-ink-400 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
            >
              ✕
            </button>
          )}
          {to && (
            <Link
              to={to}
              aria-label={`View ${name}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-ink-400 transition hover:border-flame-500 hover:text-flame-600"
            >
              ↗
            </Link>
          )}
        </div>
        {inCart && (
          <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
            In your cart · <button type="button" onClick={() => remove(id)} className="underline hover:text-red-600">Remove</button>
          </p>
        )}
      </div>
    </div>
  )
}