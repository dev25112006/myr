import { Link, useNavigate } from 'react-router-dom'
import { WEBSITE_PLANS, type WebsitePlan } from '@/content/plans'
import { Reveal, SectionHeading } from '@/components/ui'
import { useCart } from '@/lib/stores'
import { cn, inr } from '@/lib/format'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

const TONE: Record<NonNullable<WebsitePlan['tag']>['tone'], string> = {
  deal: 'bg-flame-500 text-white',
  popular: 'bg-accent-400 text-ink-950',
  save: 'bg-lime-400 text-ink-950',
}

function PlanCard({ plan, featured }: { plan: WebsitePlan; featured?: boolean }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const price = useCatalogPrice(plan.productId, plan.price)

  const choose = () => {
    add({ id: plan.productId, qty: 1, price, name: plan.name })
    navigate('/checkout/')
  }

  return (
    <Reveal
      delay={featured ? 0.08 : 0}
      className={cn(
        'relative flex flex-col rounded-[1.75rem] border p-6 sm:p-7',
        featured
          ? 'border-accent-400/60 bg-white shadow-glow lg:-my-4 lg:py-10'
          : 'border-line bg-white',
      )}
    >
      {plan.tag && (
        <span
          className={cn(
            'absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
            TONE[plan.tag.tone],
          )}
        >
          {plan.tag.label}
        </span>
      )}
      <h3 className="text-lg font-bold text-ink-950">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-ink-400">{plan.blurb}</p>

      <div className="mt-5 flex items-end gap-3">
        <span className="font-display text-4xl font-bold text-ink-950">
          {inr(price, { paise: false })}
        </span>
        <span className="pb-1 text-sm text-ink-400 line-through">{inr(plan.was, { paise: false })}</span>
      </div>

      <button type="button" onClick={choose} className="btn btn-primary btn-md mt-5 w-full">
        Choose plan
      </button>
      <p className="mt-2 text-center text-[11px] text-ink-400">{plan.renewal}</p>

      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {plan.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-sm text-ink-200">
            <span className="text-accent-600">✓</span>
            {b}
          </li>
        ))}
      </ul>

      <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-accent-600">
        {plan.featureTitle}
      </h4>
      <ul className="mt-2.5 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-ink-300">
            <span className="text-accent-600">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

/**
 * "Pick Your Perfect Plan" pricing block — homepage + website-development page.
 * CTA: adds plan to cart → /checkout/ (source: checkout/?add-to-cart=ID).
 */
export function PricingPlans({
  eyebrow = 'Exclusive Website Pricing',
  title = 'Pick Your Perfect Plan',
  sub = 'Transparent one-time build pricing — renew hosting later at the listed monthly rate.',
  showHeading = true,
  id,
}: {
  eyebrow?: string
  title?: string
  sub?: string
  showHeading?: boolean
  id?: string
}) {
  return (
    <section id={id} className="section-light py-20 sm:py-24">
      <div className="container-page">
        {showHeading && (
          <SectionHeading
            tone="light"
            eyebrow={eyebrow}
            title={title}
            sub={sub}
          />
        )}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {WEBSITE_PLANS.map((p) => (
            <PlanCard key={p.productId} plan={p} featured={p.tag?.tone === 'popular'} />
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/website-development/#viewallfeatures" className="btn btn-outline-light btn-md">
            View all features
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
