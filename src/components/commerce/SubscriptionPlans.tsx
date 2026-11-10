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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-ink-950 sm:text-2xl">
          {heading || name}
        </h3>
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-sm ${isMonthly ? 'bg-flame-600 text-ink-950' : 'bg-ink-950 text-flame-600'}`}
            onClick={() => setIsMonthly(!isMonthly)}
          >
            {isMonthly ? 'Yearly' : 'Monthly'}
          </button>
        </div>
      </div>
      {sub && <p className="text-sm text-ink-500 mb-6">{sub}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const planData = isMonthly ? plan.monthly : plan.yearly
          const monthlyLabel = isMonthly ? 'month' : 'year'
          
          return (
            <div
              key={plan.tier}
              className={`p-4 rounded-border border-line ${
                plan.isMostPopular ? 'bg-flame-100 border-flame-500' : ''
              }`}
            >
              <h4 className="text-semibold text-ink-950 mb-2">
                {plan.name}{plan.isMostPopular && (
                  <span className="text-[10px] font-semibold uppercase tracking-[.1em] bg-flame-600 text-white px-2 rounded-badge ml-2">
                    Most Popular
                  </span>
                )}
              </h4>
              <p className="text-2xl font-bold text-flame-600 mb-3">
                {inr(planData.price)} / {monthlyLabel}
              </p>
              {plan.description && (
                <p className="text-sm text-ink-500 mb-4 line-clamp-3">
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
                className="mt-3 w-full btn btn-primary btn-sm"
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