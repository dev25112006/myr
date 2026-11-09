import { CATALOG } from '@/lib/catalog'
import { useNavigate } from 'react-router-dom'
import { useCatalogPrice } from '@/lib/useCatalogPrice'
import { inr } from '@/lib/format'

interface SubscriptionPlansProps {
  productId: number
  name: string
  heading?: string
  sub?: string
}

export function SubscriptionPlans({
  productId,
  name,
  heading,
  sub,
}: SubscriptionPlansProps) {
  const price = useCatalogPrice(productId, 0)
  const billing = 'month'
  const navigate = useNavigate()

  const product = CATALOG[productId]
  const plans = product?.plans || []

  function handleBuyClick() {
    navigate('/checkout/')
  }

  if (!plans || plans.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-card">
      <h3 className="text-xl font-bold text-ink-950 mb-4">
        {heading || name}
      </h3>
      {sub && <p className="text-sm text-ink-500 mb-6">{sub}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.tier} className="p-4 rounded-border border-line">
            <h4 className="text-semibold text-ink-950 mb-2">
              {plan.name}{plan.isMostPopular && (
                <span className="text-[10px] font-semibold uppercase tracking-[.1em] bg-ink-950 text-white px-2 rounded-badge ml-2">
                  Most Popular
                </span>
              )}
            </h4>
            <p className="text-2xl font-bold text-flame-600 mb-2">
              {inr(price)} / {billing}
            </p>
            <button
              className="mt-3 w-full btn btn-primary btn-sm"
              onClick={handleBuyClick}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}