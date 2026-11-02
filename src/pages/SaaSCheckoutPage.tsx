import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/lib/stores'

type Plan = { id: string; name: string; interval: string; currency: string; amountMinor: number | null; trialDays: number; enterprise: boolean; regionCodes?: string[] }
type Product = { id: string; name: string; plans: Plan[] }
type Organization = { id: string; name: string; countryCode: string; billingCountryCode?: string; role: string; status: string }
type Checkout = { order: { id: string; currency: string; subtotalMinor: number; taxMinor: number; totalMinor: number }; payment: { action: string; params: Record<string, string> } }

export function SaaSCheckoutPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [planId, setPlanId] = useState(searchParams.get('planId') || '')
  const [organizationId, setOrganizationId] = useState('')
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [autoRenew, setAutoRenew] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const plans = useMemo(() => products.flatMap((product) => product.plans.map((plan) => ({ ...plan, productName: product.name }))), [products])
  const selectedOrganization = organizations.find((org) => org.id === organizationId)
  const eligiblePlans = plans.filter((plan) => plan.currency === 'INR' && ['month','year'].includes(plan.interval) && plan.amountMinor != null && !plan.enterprise && plan.trialDays === 0 && (!plan.regionCodes?.length || !selectedOrganization || plan.regionCodes.includes(selectedOrganization.billingCountryCode || selectedOrganization.countryCode)))
  const chosen = eligiblePlans.find((plan) => plan.id === planId)

  useEffect(() => {
    let active = true
    void Promise.all([
      fetch('/api/saas/products').then(async (response) => response.ok ? response.json() : Promise.reject(new Error('SaaS plans are unavailable.'))),
      user ? fetch('/api/saas/organizations', { credentials: 'same-origin' }).then(async (response) => response.ok ? response.json() : Promise.reject(new Error('Sign in and verify your SaaS email before checkout.'))) : Promise.resolve({ organizations: [] }),
    ]).then(([catalog, workspace]) => {
      if (!active) return
      const billingOrganizations = (workspace.organizations || []).filter((org: Organization) => ['owner', 'admin', 'billing'].includes(org.role))
      setProducts(catalog.products || []); setOrganizations(billingOrganizations)
      const planOptions = (catalog.products || []).flatMap((product: Product) => product.plans.map((plan) => ({ ...plan, productName: product.name })))
      if (!planOptions.some((plan: Plan) => plan.id === planId)) {
        const firstEligible = planOptions.find((plan: Plan) => plan.currency === 'INR' && ['month','year'].includes(plan.interval) && plan.amountMinor != null && !plan.enterprise && plan.trialDays === 0)
        if (firstEligible) setPlanId(firstEligible.id)
      }
      if (billingOrganizations[0]) setOrganizationId(billingOrganizations[0].id)
    }).catch((error) => { if (active) setMessage(error instanceof Error ? error.message : 'Unable to load checkout.') })
    return () => { active = false }
  }, [user?.id])

  const createCheckout = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage(''); setCheckout(null)
    try {
      const response = await fetch('/api/saas/checkout', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ planId, organizationId, billing: autoRenew ? 'auto' : 'one_time' }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to start checkout.')
      setCheckout(data)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to start checkout.') }
    finally { setBusy(false) }
  }

  const continueToPayU = () => {
    if (!checkout) return
    const form = document.createElement('form'); form.method = 'POST'; form.action = checkout.payment.action
    for (const [name, value] of Object.entries(checkout.payment.params)) { const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.append(input) }
    document.body.append(form); form.submit()
  }

  return <section className="section-light min-h-[70vh] py-12 sm:py-16"><div className="container-page max-w-3xl"><p className="eyebrow">MYR Software billing</p><h1 className="mt-2 text-3xl font-bold text-ink-950 sm:text-4xl">Review your subscription term</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">Pay once for the selected term through PayU hosted checkout. If MYR has enabled recurring mandates for the merchant account, you can also authorize automatic renewal of the same term amount.</p>
    {message && <p role="status" className="mt-5 rounded-xl border border-line bg-white p-4 text-sm text-ink-700">{message}</p>}
    {!user ? <div className="mt-6 rounded-2xl border border-line bg-white p-6"><p className="text-sm text-ink-600">Sign in and verify your MYR Software email, then create a workspace to continue.</p><Link to="/my-account/" className="btn btn-primary btn-md mt-4 inline-flex">Go to account</Link></div> : <form onSubmit={(event) => void createCheckout(event)} className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-8">
      <label className="label block">Plan<select className="input mt-2" required value={chosen ? planId : ''} onChange={(event) => { setPlanId(event.target.value); setCheckout(null) }}><option value="">Choose an eligible INR plan</option>{eligiblePlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.productName} · {plan.name} · {plan.interval} · INR {(plan.amountMinor! / 100).toFixed(2)}</option>)}</select></label>{plans.length > eligiblePlans.length && <p className="mt-2 text-xs text-ink-400">Other published plans are not currently eligible for this PayU checkout, region, interval, trial, or currency. <Link to="/talk-to-sales/" className="font-semibold text-accent-700">Contact MYR about availability.</Link></p>}
      <label className="label mt-4 block">Workspace and billing country<select className="input mt-2" required value={organizationId} onChange={(event) => { setOrganizationId(event.target.value); setCheckout(null) }}><option value="">Choose a billing-enabled workspace</option>{organizations.map((org) => <option key={org.id} value={org.id}>{org.name} · {org.billingCountryCode || org.countryCode} · {org.status}</option>)}</select></label>
      {!organizations.length && <p className="mt-3 text-sm text-amber-800">Create a workspace after verifying your email in <Link className="font-semibold underline" to="/workspace/">Workspace</Link>.</p>}
      {chosen && <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-600">Charge for this {chosen.interval} term: {chosen.currency} {chosen.amountMinor == null ? 'Contact sales' : (chosen.amountMinor / 100).toFixed(2)} before configured tax.{autoRenew ? ' Your PayU mandate will renew this term automatically until you cancel; pre-debit notices are sent before each renewal charge.' : ' There is no automatic renewal with a one-time payment.'} The server will show the exact tax and total before you continue to PayU.</p>}
      <label className="mt-4 flex items-start gap-3 rounded-xl border border-line p-4 text-sm text-ink-700"><input type="checkbox" className="mt-0.5" checked={autoRenew} onChange={(event) => { setAutoRenew(event.target.checked); setCheckout(null) }} /><span><strong>Renew automatically via PayU mandate</strong><span className="mt-1 block text-xs text-ink-500">PayU will ask for an e-mandate authorization on its hosted page. The same term amount is charged on each renewal date until you cancel; cancelling revokes the mandate. Available only when MYR has enabled recurring billing.</span></span></label>
      {!checkout ? <button className="btn btn-primary btn-md mt-5 w-full" disabled={busy || !organizations.length || !chosen}>{busy ? 'Preparing secure checkout…' : 'Review tax and total'}</button> : <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="font-bold text-emerald-950">Order total</h2><dl className="mt-3 space-y-2 text-sm text-emerald-950"><div className="flex justify-between"><dt>Subtotal</dt><dd>{checkout.order.currency} {(checkout.order.subtotalMinor / 100).toFixed(2)}</dd></div><div className="flex justify-between"><dt>Tax</dt><dd>{checkout.order.currency} {(checkout.order.taxMinor / 100).toFixed(2)}</dd></div><div className="flex justify-between border-t border-emerald-200 pt-2 font-bold"><dt>Total due now</dt><dd>{checkout.order.currency} {(checkout.order.totalMinor / 100).toFixed(2)}</dd></div></dl><button type="button" onClick={continueToPayU} className="btn btn-primary btn-md mt-5 w-full">Continue to PayU</button></div>}
    </form>}
    <p className="mt-5 text-xs leading-relaxed text-ink-400">Checkout requires MYR-approved tax treatment and PayU merchant configuration. Closing the PayU page leaves this order pending; product access starts only after server-side payment verification.</p>
  </div></section>
}
