import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  features: string[]
  heading: string
  sub?: string
}

/** Interactive buy section: left = core features + direct "Buy now" (checkout), right = animated purchase preview. */
export function BuyShowcase({ id, name, desc, fallbackPrice, monthly, compareAt, image, features, heading, sub }: Props) {
  const price = useCatalogPrice(id, fallbackPrice)
  const { add } = useCart()
  const navigate = useNavigate()

  const buyNow = () => {
    add({ id, price, name })
    navigate('/checkout/')
  }

  return (
    <section className="section-light py-14 sm:py-20">
      <div className="container-page grid items-center gap-8 sm:grid-cols-2">
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
            <button type="button" onClick={buyNow} className="btn btn-primary btn-lg">
              Buy now
            </button>
            <a href="/contact-us/" className="text-sm font-semibold text-accent-600 hover:underline">
              Talk to sales →
            </a>
          </div>
          <p className="mt-3 text-xs text-ink-400">{desc}</p>
        </div>
        {/* Right: animated purchase preview */}
        <div className="flex justify-center sm:justify-end">
          <PurchaseAnimation name={name} price={price} monthly={!!monthly} image={image} />
        </div>
      </div>
    </section>
  )
}

function PurchaseAnimation({ name, price, monthly, image }: { name: string; price: number; monthly: boolean; image?: string }) {
  const [step, setStep] = useState(0) // 0 idle, 1 processing, 2 success
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
            <button type="button" className="w-full rounded-lg bg-ink-950 py-2.5 text-sm font-bold text-white">
              Buy now
            </button>
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