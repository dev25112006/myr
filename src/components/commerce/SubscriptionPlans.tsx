import { CATALOG } from '@/lib/catalog'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
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
  const navigate = useNavigate()
  const [isMonthly, setIsMonthly] = useState(() => {
    const saved = localStorage.getItem('pricing_view') || 'monthly'
    return saved === 'monthly'
  })

  const product = CATALOG[productId]
  const plans = product?.plans || []

  function handleBuyClick() {
    navigate('/checkout/')
    localStorage.setItem('pricing_view', isMonthly ? 'yearly' : 'monthly')
  }

  if (!plans || plans.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-card max-w-6xl mx-auto">
      {/* Toggle section */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-ink-500">View as:</span>
        <div className="flex gap-2">
          {/* Monthly button */}
          <button
            onClick={() => setIsMonthly(true)}
            className={`rounded-btn p-2 ${isMonthly ? 'bg-black text-white border border-gold-500' : 'bg-white border border-gold-500 text-black'}`}
            aria-pressed={isMonthly}
            title="Monthly">
            <span className="text-[10px] font-semibold uppercase tracking-[.1em]">Monthly</span>
          </button>
          {/* Yearly button */}
          <button
            onClick={() => setIsMonthly(false)}
            className={`rounded-btn p-2 ${!isMonthly ? 'bg-black text-white border border-gold-500' : 'bg-white border border-gold-500 text-black'}`}
            aria-pressed={!isMonthly}
            title="Yearly">
            <span className="text-[10px] font-semibold uppercase tracking-[.1em]">Yearly</span>
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-ink-950 mb-4">
        {heading || name || 'Pricing Plans'}
      </h2>

      {sub && <p className="text-sm text-ink-500 mb-6">{sub}</p>}

      {/* Three plan blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => {
          // Get the appropriate pricing data based on billing cycle
          const planData = isMonthly ? plan.monthly : plan.yearly
          const price = planData.price
          const compareAt = planData.compareAt
          const label = isMonthly ? 'month' : 'year'

          return (
            <div
              key={plan.tier}
              className={`p-5 rounded-xl border ${isMonthly ? 'border-flame-200' : 'border-line'} ${
                plan.isMostPopular ? 'bg-flame-50 border-flame-200' : 'bg-white'
              } transition-colors duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-ink-950">
                  {plan.name}{plan.isMostPopular && (
                    <span className="text-[8px] font-semibold uppercase tracking-[.1em] bg-flame-600 text-white px-2 rounded-badge ml-2">
                      Most Popular
                    </span>
                  )}
                </h4>
                <span className="text-sm text-ink-500">
                  {isMonthly ? 'from' : 'from'}
                </span>
              </div>

              <p className="text-3xl font-bold text-flame-600 mb-2">
                {inr(price)} / {label}
              </p>

              {compareAt && (
                <p className="text-sm text-ink-400 line-through mb-4">
                  {inr(compareAt)} / {label}
                </p>
              )}

              {plan.description && (
                <p className="text-sm text-ink-500 mb-4 line-clamp-2">
                  {plan.description}
                </p>
              )}

              <ul className="space-y-1 text-sm text-ink-500">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-4 w-full btn btn-primary btn-sm"
                onClick={handleBuyClick}
              >
                {isMonthly ? 'Subscribe Monthly' : 'Subscribe Yearly'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}