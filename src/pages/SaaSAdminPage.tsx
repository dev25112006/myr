import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/stores'

type Product = { id: string; slug: string; name: string; summary: string; launchUrl: string | null; status: 'draft' | 'active' | 'disabled'; features: string[] }
type Plan = { id: string; productId: string; productSlug: string; slug: string; name: string; interval: string; currency: string; amountMinor: number | null; trialDays: number; limits: Record<string, number>; features: string[]; regionCodes: string[]; enterprise: boolean; enabled: boolean }

const card = 'rounded-3xl border border-line bg-white p-6'
export function SaaSAdminPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [productForm, setProductForm] = useState({ slug: '', name: '', summary: '', launchUrl: '', features: '' })
  const [planForm, setPlanForm] = useState({ productId: '', slug: '', name: '', interval: 'month', currency: 'INR', amount: '', trialDays: '0', limits: '{}', features: '[]', regionCodes: '[]', enterprise: false })
  const [busy, setBusy] = useState(false)
  const refresh = async () => {
    setLoading(true)
    try {
      const [productResponse, planResponse] = await Promise.all([
        fetch('/api/saas/admin/products', { credentials: 'same-origin' }),
        fetch('/api/saas/admin/plans', { credentials: 'same-origin' }),
      ])
      const productData = await productResponse.json(); const planData = await planResponse.json()
      if (!productResponse.ok || !planResponse.ok) throw new Error(productData.error || planData.error || 'Unable to load SaaS catalog.')
      setProducts(productData.products); setPlans(planData.plans)
      if (!planForm.productId && productData.products[0]) setPlanForm((current) => ({ ...current, productId: productData.products[0].id }))
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load SaaS catalog.') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (user?.role === 'admin') void refresh() }, [user?.id])
  const submitProduct = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/saas/admin/products', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...productForm, status: 'draft', launchUrl: productForm.launchUrl || null, features: JSON.parse(productForm.features || '[]') }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to create product.')
      setProductForm({ slug: '', name: '', summary: '', launchUrl: '', features: '' }); setMessage('Draft product created.'); await refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Check the product fields and feature JSON.') }
    finally { setBusy(false) }
  }
  const submitPlan = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/saas/admin/plans', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: planForm.productId, slug: planForm.slug, name: planForm.name, interval: planForm.interval, currency: planForm.currency, amountMinor: planForm.enterprise ? null : Math.round(Number(planForm.amount) * 100), trialDays: Number(planForm.trialDays), limits: JSON.parse(planForm.limits), features: JSON.parse(planForm.features), regionCodes: JSON.parse(planForm.regionCodes), enterprise: planForm.enterprise, enabled: false }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to create plan.')
      setPlanForm((current) => ({ ...current, slug: '', name: '', amount: '' })); setMessage('Disabled plan created. Enable it only after product, currency, price and terms are approved.'); await refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Check plan values and JSON fields.') }
    finally { setBusy(false) }
  }
  const updateProduct = async (product: Product, patch: Partial<Product>) => {
    const response = await fetch(`/api/saas/admin/products/${product.id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) })
    const data = await response.json(); if (!response.ok) { setMessage(data.error || 'Unable to update product.'); return }
    setProducts((current) => current.map((item) => item.id === product.id ? data.product : item)); setMessage('Product saved.')
  }
  const updatePlan = async (plan: Plan, enabled: boolean) => {
    const response = await fetch(`/api/saas/admin/plans/${plan.id}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ enabled }) })
    const data = await response.json(); if (!response.ok) { setMessage(data.error || 'Unable to update plan.'); return }
    setPlans((current) => current.map((item) => item.id === plan.id ? data.plan : item)); setMessage(enabled ? 'Plan enabled.' : 'Plan disabled.')
  }
  if (!user) return <section className="container-page py-20 text-center"><h1 className="text-3xl font-bold">Sign in required</h1><Link className="mt-5 inline-flex text-accent-700" to="/my-account/">Go to account</Link></section>
  if (user.role !== 'admin') return <section className="container-page py-20 text-center"><h1 className="text-3xl font-bold">Administrator access only</h1><Link className="mt-5 inline-flex text-accent-700" to="/workspace/">Back to workspace</Link></section>
  return <section className="section-light min-h-screen py-12"><div className="container-page"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">MYR Software</p><h1 className="mt-2 text-3xl font-bold text-ink-950">Catalog administration</h1><p className="mt-2 text-sm text-ink-500">All changes require an MFA-verified admin session and are audited.</p></div><div className="flex gap-4"><Link to="/saas-admin/support/" className="text-sm font-semibold text-accent-700">Support admin →</Link><Link to="/workspace/" className="text-sm font-semibold text-accent-700">Workspace →</Link></div></div>{message && <p role="status" className="mt-5 rounded-xl border border-line bg-white p-4 text-sm">{message}</p>}{loading && <p className="mt-5 text-sm text-ink-400">Loading catalog…</p>}
    <div className="mt-6 grid gap-5 lg:grid-cols-2"><form onSubmit={(event) => void submitProduct(event)} className={card}><h2 className="text-xl font-bold">Create product draft</h2><p className="mt-1 text-sm text-ink-500">Publish only after features and product access are verified.</p><div className="mt-4 grid gap-3"><input className="input" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="slug" value={productForm.slug} onChange={(event) => setProductForm({ ...productForm, slug: event.target.value })}/><input className="input" required maxLength={120} placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}/><textarea className="input min-h-20" maxLength={2000} placeholder="Summary" value={productForm.summary} onChange={(event) => setProductForm({ ...productForm, summary: event.target.value })}/><input className="input" type="url" placeholder="HTTPS launch URL (optional)" value={productForm.launchUrl} onChange={(event) => setProductForm({ ...productForm, launchUrl: event.target.value })}/><input className="input" placeholder={'Verified features JSON, e.g. ["Admissions"]'} value={productForm.features} onChange={(event) => setProductForm({ ...productForm, features: event.target.value })}/><button disabled={busy} className="btn btn-primary btn-md">Create draft</button></div></form>
      <form onSubmit={(event) => void submitPlan(event)} className={card}><h2 className="text-xl font-bold">Create disabled plan</h2><p className="mt-1 text-sm text-ink-500">Use minor-unit pricing data; plan starts disabled until approved.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><select className="input sm:col-span-2" required value={planForm.productId} onChange={(event) => setPlanForm({ ...planForm, productId: event.target.value })}><option value="">Choose product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.status}</option>)}</select><input className="input" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="plan slug" value={planForm.slug} onChange={(event) => setPlanForm({ ...planForm, slug: event.target.value })}/><input className="input" required maxLength={80} placeholder="Plan name" value={planForm.name} onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })}/><select className="input" value={planForm.interval} onChange={(event) => setPlanForm({ ...planForm, interval: event.target.value })}><option value="month">Monthly</option><option value="year">Annual</option><option value="custom">Custom</option></select><select className="input" value={planForm.currency} onChange={(event) => setPlanForm({ ...planForm, currency: event.target.value })}><option>INR</option><option>USD</option><option>GBP</option></select><input className="input" type="number" min="0" step="0.01" placeholder="Amount (major units)" value={planForm.amount} onChange={(event) => setPlanForm({ ...planForm, amount: event.target.value })} disabled={planForm.enterprise} required={!planForm.enterprise}/><input className="input" type="number" min="0" max="365" step="1" placeholder="Trial days" value={planForm.trialDays} onChange={(event) => setPlanForm({ ...planForm, trialDays: event.target.value })}/><textarea className="input min-h-16" placeholder='Limits JSON, e.g. {"users":5}' value={planForm.limits} onChange={(event) => setPlanForm({ ...planForm, limits: event.target.value })}/><textarea className="input min-h-16" placeholder='Features JSON, e.g. ["Reports"]' value={planForm.features} onChange={(event) => setPlanForm({ ...planForm, features: event.target.value })}/><input className="input sm:col-span-2" placeholder='Region codes JSON, e.g. ["IN"]' value={planForm.regionCodes} onChange={(event) => setPlanForm({ ...planForm, regionCodes: event.target.value })}/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={planForm.enterprise} onChange={(event) => setPlanForm({ ...planForm, enterprise: event.target.checked })}/>Enterprise/custom terms</label><button disabled={busy || !products.length} className="btn btn-primary btn-md sm:col-span-2">Create disabled plan</button></div></form></div>
    <section className={`${card} mt-6`}><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Products</h2><button onClick={() => void refresh()} className="text-sm font-semibold text-accent-700">Refresh</button></div><div className="mt-4 space-y-3">{products.map((product) => <article key={product.id} className="grid gap-3 rounded-2xl border border-line p-4 md:grid-cols-[1fr_auto_auto]"><div><strong>{product.name}</strong><p className="text-xs text-ink-400">{product.slug}</p><p className="mt-1 text-sm text-ink-500">{product.summary}</p></div><select className="input !w-auto" value={product.status} onChange={(event) => void updateProduct(product, { status: event.target.value as Product['status'] })}><option value="draft">Draft</option><option value="active">Active</option><option value="disabled">Disabled</option></select><span className="self-center text-xs text-ink-400">{product.features.length} verified features listed</span></article>)}</div></section>
    <section className={`${card} mt-6`}><h2 className="text-xl font-bold">Plans</h2><div className="mt-4 space-y-3">{plans.map((plan) => <article key={plan.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4"><div><strong>{plan.productSlug} · {plan.name}</strong><p className="mt-1 text-xs text-ink-500">{plan.currency} {plan.amountMinor == null ? 'Custom' : (plan.amountMinor / 100).toFixed(2)} / {plan.interval} · trial {plan.trialDays} days · {Object.entries(plan.limits).map(([key,value]) => `${key}: ${value}`).join(', ') || 'limits not set'}</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={plan.enabled} onChange={(event) => void updatePlan(plan, event.target.checked)}/>Enabled</label></article>)}{!plans.length && <p className="text-sm text-ink-400">No plans configured.</p>}</div></section>
  </div></section>
}
