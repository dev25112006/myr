import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CATALOG, type CatalogProduct } from '@/lib/catalog'
import { SubscriptionPlans } from '@/components/commerce/SubscriptionPlans'
import { useAuth, useCart } from '@/lib/stores'
import { inr } from '@/lib/format'
import { CHAT_SALES } from '@/components/layout/nav'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

type CategoryKind = 'website' | 'it' | 'pbx' | 'digital'

const CATEGORY_INFO: Record<CategoryKind, { title: string; description: string; crumbs: string[] }> = {
  website: {
    title: 'Website Development',
    description: 'Choose a website plan built around your business, from a strong first online presence to a fully customized ecommerce experience.',
    crumbs: ['Website Development'],
  },
  it: {
    title: 'IT Products',
    description: 'Explore dependable IT hardware and infrastructure solutions for your workplace, network, and security needs.',
    crumbs: ['IT Products'],
  },
  pbx: {
    title: 'PBX & IP Telephone',
    description: 'Business phone systems and IP telephony equipment designed for clear, flexible team communication.',
    crumbs: ['PBX'],
  },
  digital: {
    title: 'AI Digital Marketing',
    description: 'Compare monthly and annual AI digital marketing plans for SEO, social content, lead generation, and advertising.',
    crumbs: ['AI Digital Marketing'],
  },
}

const HARDWARE = [
  { name: 'Dell Laptops', image: '/assets/2024-08-buy-dell-laptop.png' },
  { name: 'HP Laptops', image: '/assets/2024-08-buy-hp-laptop.png' },
  { name: 'Hikvision Security', image: '/assets/2024-08-buy-hikvision.png' },
  { name: 'D-Link Networking', image: '/assets/2024-08-buy-dlink.png' },
  { name: 'Grandstream Telephony', image: '/assets/2024-08-buy-grandstream.png' },
  { name: 'Avaya Communication', image: '/assets/2024-08-buy-avaya.png' },
]

function Breadcrumbs({ current }: { current: string }) {
  return <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500"><Link to="/tech-store/" className="hover:text-rose-600">Tech Store</Link><span className="mx-2">/</span><span className="text-slate-800">{current}</span></nav>
}

type ProductReview = { id: string; rating: number; title: string; comment: string; authorName: string; createdAt: string }
function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [rating, setRating] = useState('5')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const load = () => { void fetch(`/api/products/${productId}/reviews`).then((r) => r.ok ? r.json() : null).then((d) => { if (d) setReviews(d.reviews) }).catch(() => {}) }
  useEffect(() => { load() }, [productId])
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rating: Number(rating), title, comment }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to submit review.')
      setTitle(''); setComment(''); setMessage(data.message || 'Review submitted for moderation.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to submit review.') }
    finally { setBusy(false) }
  }
  return <div className="grid gap-8 py-7 lg:grid-cols-[1fr_.9fr]"><div><h2 className="text-xl font-bold text-slate-900">Customer reviews</h2>{reviews.length ? <div className="mt-4 space-y-3">{reviews.map((review) => <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p><h3 className="mt-1 font-semibold text-slate-900">{review.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{review.comment}</p><p className="mt-3 text-xs text-slate-400">{review.authorName} · {new Date(review.createdAt).toLocaleDateString()}</p></article>)}</div> : <p className="mt-3 text-sm text-slate-500">No approved reviews yet.</p>}</div><div className="rounded-2xl bg-slate-50 p-5"><h2 className="text-lg font-bold text-slate-900">Write a review</h2>{user ? <form className="mt-4 space-y-3" onSubmit={(e) => void submit(e)}><label className="block text-sm font-medium text-slate-700">Rating<select className="input mt-1" value={rating} onChange={(e) => setRating(e.target.value)}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} out of 5</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Review title<input className="input mt-1" required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)}/></label><label className="block text-sm font-medium text-slate-700">Your review<textarea className="input mt-1 min-h-28" required minLength={10} maxLength={5000} value={comment} onChange={(e) => setComment(e.target.value)}/></label><button disabled={busy} className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">{busy ? 'Submitting…' : 'Submit review'}</button>{message && <p role="status" className="text-sm text-slate-600">{message}</p>}</form> : <p className="mt-3 text-sm text-slate-500">Sign in with the account used to purchase this product to submit a review. <Link className="font-semibold text-rose-600" to="/my-account/">Sign in</Link></p>}</div></div>
}

function AddButton({ product, label = 'Add to cart' }: { product: CatalogProduct; label?: string }) {
  const { add, count } = useCart()
  const price = useCatalogPrice(product.id, product.price)
  const [added, setAdded] = useState(false)
  return <div>
    <button type="button" onClick={() => { add({ id: product.id, price }); setAdded(true) }} className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">{added ? 'Added to cart ✓' : label}</button>
    {added && <p role="status" className="mt-2 text-xs text-slate-500">Cart now has {count} item{count === 1 ? '' : 's'}. <Link to="/tech-store/" className="font-semibold text-rose-600">Continue shopping</Link></p>}
  </div>
}

function ProductCard({ product }: { product: CatalogProduct }) {
  const isVariable = product.type === 'variable'
  const price = useCatalogPrice(product.id, product.price)
  const image = product.image ?? (product.category === 'Digital Marketing' ? '/assets/2024-09-digital-marketing.jpg' : '/assets/2024-09-website-development.jpg')
  return <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg">
    <div className="flex h-52 items-center justify-center bg-white p-5"><img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain" /></div>
    <div className="flex flex-1 flex-col border-t border-slate-100 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{product.category === 'Digital Marketing' ? 'AI Digital Marketing' : product.category}</p>
      <h2 className="mt-2 text-lg font-bold text-slate-900">{product.name}</h2>
      <p className="mt-3 flex items-baseline gap-2"><span className="text-xl font-bold text-slate-900">{isVariable ? 'From ' : ''}{inr(price, { paise: false })}</span>{product.compareAt && <span className="text-sm text-slate-400 line-through">{inr(product.compareAt, { paise: false })}</span>}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{product.id === 2765 ? 'A polished business website to establish your brand online.' : product.id === 2766 ? 'A custom website with integrated ecommerce functionality.' : product.id === 2767 ? 'A tailored web experience with advanced features and integrations.' : product.id === 2424 ? 'Choose from website development plans designed for different business needs.' : product.id === 2768 ? 'AI-assisted SEO, social content, lead generation, and campaign plans to support business growth.' : 'A scalable business communication system with advanced calling features.'}</p>
      <div className="mt-5">{isVariable ? <Link to={product.id === 2768 ? '/product/digital-marketing/' : '/website-development/'} className="btn btn-md w-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50">Select options</Link> : <AddButton product={product} />}</div>
    </div>
  </article>
}

export function ProductCategoryPage({ kind }: { kind: CategoryKind }) {
  const info = CATEGORY_INFO[kind]
  const products = kind === 'website'
    ? [CATALOG[2767], CATALOG[2765], CATALOG[2766], CATALOG[2424]]
    : kind === 'digital'
      ? [CATALOG[2768], CATALOG[2768], CATALOG[2768], CATALOG[2768]]
    : kind === 'pbx'
      ? [CATALOG[3056]]
      : [CATALOG[3056]]

  return <>
    <section className="border-b border-slate-200 bg-[#f7f7f7] py-10 sm:py-14">
      <div className="container-page"><Breadcrumbs current={info.title} /><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Shop category</p><h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{info.title}</h1><p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{info.description}</p></div>
    </section>

    {kind === 'it' && <section className="bg-white py-10"><div className="container-page"><h2 className="text-xl font-bold text-slate-900">Browse IT product ranges</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{HARDWARE.map((item) => <a key={item.name} href={CHAT_SALES} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-rose-200 hover:shadow-sm"><div className="flex h-16 w-20 items-center justify-center rounded-lg bg-slate-50 p-2"><img src={item.image} alt={item.name} className="h-full w-full object-contain" loading="lazy" /></div><div><h3 className="font-semibold text-slate-900">{item.name}</h3><span className="mt-1 block text-sm text-rose-600">Ask about availability →</span></div></a>)}</div></div></section>}

    <section className="bg-white py-12 sm:py-16">
      <div className="container-page"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">{kind === 'digital' ? 'Explore available plans' : `Showing all ${products.length} results`}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{kind === 'website' ? 'Website plans' : kind === 'digital' ? 'AI marketing plans' : kind === 'pbx' ? 'PBX systems' : 'Featured IT solution'}</h2></div><Link to="/tech-store/" className="text-sm font-semibold text-rose-600 hover:text-rose-700">Back to Tech Store →</Link></div>{kind === 'digital' ? <DigitalMarketingProductPage /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</div>
    </section>

    {/* Subscription plans — every product row shows all three plans */}
    <section className="border-b border-slate-200 bg-paper py-14 sm:py-20">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Subscription plans</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Choose your subscription</h2>
            <p className="mt-2 text-sm text-slate-500">Every product row below shows all three plans — Starter, Pro and Enterprise (per-user) — with monthly and yearly billing.</p>
          </div>
          <Link to="/tech-store/" className="text-sm font-semibold text-rose-600 hover:text-rose-700">Back to Tech Store →</Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[6004, 6005, 6001, 6002, 6003, 6006].map((productId) => {
            const product = CATALOG[productId]
            if (!product) return null
            return (
              <div key={productId} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img src={product.image ?? '/assets/2024-09-website-development.jpg'} alt={product.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" loading="lazy" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{product.category}</p>
                  </div>
                </div>
                <SubscriptionPlans productId={productId} name={product.name} />
              </div>
            )
          })}
        </div>
      </div>
    </section>

    <section className="border-t border-slate-200 bg-[#f7f7f7] py-10"><div className="container-page flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wide text-rose-600">Need help choosing?</p><h2 className="mt-2 text-xl font-bold text-slate-900">Talk with our product team.</h2></div><a href={CHAT_SALES} target="_blank" rel="noreferrer" className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">Ask our team</a></div></section>
  </>
}

export function WebsitePlanProductPage({ productId }: { productId: 2765 | 2766 | 2767 }) {
  const product = CATALOG[productId]
  const price = useCatalogPrice(product.id, product.price)
  const { add, count } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const descriptions: Record<number, string> = {
    2765: 'A professional website package for businesses building a clear, trusted online presence.',
    2766: 'A flexible ecommerce website package designed to help businesses present and sell their products online.',
    2767: 'A tailored website package for businesses that need a custom design and advanced functionality.',
  }
  return <>
    <section className="bg-white py-10 sm:py-14"><div className="container-page"><Breadcrumbs current={product.name}/><div className="grid items-center gap-9 lg:grid-cols-2">
      <div className="flex min-h-[340px] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8"><img src={product.image} alt={product.name} className="max-h-[400px] w-full object-contain"/></div>
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Website Development</p><h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{product.name}</h1><p className="mt-5 flex items-center gap-3">{product.compareAt && <span className="text-lg text-slate-400 line-through">{inr(product.compareAt, { paise: false })}</span>}<strong className="text-3xl text-slate-900">{inr(price, { paise: false })}</strong></p><p className="mt-5 leading-relaxed text-slate-600">{descriptions[product.id]}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3"><label className="sr-only" htmlFor="plan-quantity">Quantity</label><input id="plan-quantity" className="input w-24" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))}/><button className="btn btn-md bg-rose-600 text-white hover:bg-rose-700" onClick={() => { add({ id: product.id, qty: quantity, price }); setAdded(true) }}>{added ? 'Added to cart ✓' : 'Add to cart'}</button><Link className="btn btn-md border border-slate-300" to="/checkout/" onClick={() => add({ id: product.id, qty: quantity, price })}>Buy now</Link></div>
      {added && <p role="status" className="mt-3 text-sm text-slate-500">Cart has {count} item{count === 1 ? '' : 's'}. <Link className="font-semibold text-rose-600" to="/cart/">View cart</Link></p>}
      <p className="mt-7 border-t border-slate-200 pt-5 text-sm text-slate-500">Category: <Link className="text-rose-600" to="/product-category/website-development/">Website Development</Link></p></div>
    </div></div></section>
    <section className="border-y border-slate-200 bg-[#f7f7f7] py-12"><div className="container-page max-w-4xl"><h2 className="text-2xl font-bold text-slate-900">Description</h2><p className="mt-4 leading-relaxed text-slate-600">{descriptions[product.id]} Our team will coordinate the project details and next steps after your order request.</p><h2 className="mt-8 text-xl font-bold text-slate-900">Need help choosing?</h2><p className="mt-2 text-slate-600">Compare all website plans on our <Link className="text-rose-600 underline" to="/website-development/#viewallfeatures">website development page</Link>.</p></div></section>
    <section className="bg-white py-10"><div className="container-page"><ProductReviews productId={product.id}/></div></section>
    <section className="bg-[#f7f7f7] py-12"><div className="container-page"><h2 className="text-2xl font-bold text-slate-900">Related website plans</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[2765,2766,2767].filter((id)=>id!==product.id).map((id)=><ProductCard key={id} product={CATALOG[id]}/>)}</div></div></section>
  </>
}

const IPBX_SPECS: [string, string][] = [
  ['Model', 'MYRLINK IP100 V3'],
  ['User capacity', '100 users (upgradable to 600 users)'],
  ['Concurrent calls', 'Unlimited, as per user capacity'],
  ['Call center features', 'Sophisticated call center functionalities'],
  ['Functionalities', 'Instant messaging, phone book, CRM integration'],
  ['Voice logger', 'Available for incoming and outgoing calls'],
  ['Conference support', 'Bridge conference for multi-party calls'],
  ['Multi-level IVR', 'Included for advanced call routing'],
  ['Public address system', 'Integrated for mass communication'],
  ['Storage', '512 GB SSD'],
  ['SIP trunk', 'SIP network trunk with multiple trunk support'],
  ['Dimensions / weight', '18 × 18 × 4 cm / 2 kg'],
]

export function Ip100ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const product = CATALOG[3056]
  const price = useCatalogPrice(3056, product.price)
  const { add, count } = useCart()
  const [added, setAdded] = useState(false)
  return <>
    <section className="bg-white py-8 sm:py-12"><div className="container-page"><Breadcrumbs current={product.name} /><div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8"><img src="/assets/2024-09-ip-pbx-1.png" alt="MYRLINK IP PBX IP100 V3" className="max-h-[440px] w-full object-contain" /></div>
      <div className="pt-2"><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Sale · IP PBX Solution</p><h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">MYRLINK IP PBX IP100 V3</h1><p className="mt-5 flex flex-wrap items-baseline gap-3"><span className="text-lg text-slate-400 line-through">{inr(150000, { paise: false })}</span><span className="text-3xl font-bold text-slate-900">{inr(price, { paise: false })}</span></p><p className="mt-5 leading-relaxed text-slate-600">Designed for seamless business communication with SIP trunk support, built-in call center features, CRM integration, multi-level IVR, and voice logging. It is scalable for growing teams and supports advanced routing and conferencing.</p>
        <div className="mt-7 flex flex-wrap items-center gap-3"><div className="flex h-11 items-center rounded-lg border border-slate-300"><button type="button" className="h-full px-3 text-slate-600 hover:text-rose-600" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button><span className="min-w-8 text-center text-sm font-semibold text-slate-900">{quantity}</span><button type="button" className="h-full px-3 text-slate-600 hover:text-rose-600" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button></div><button type="button" onClick={() => { add({ id: product.id, qty: quantity }); setAdded(true) }} className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">{added ? 'Added to cart ✓' : 'Add to cart'}</button></div>
        {added && <p role="status" className="mt-3 text-sm text-slate-500">Cart now has {count} item{count === 1 ? '' : 's'}. <Link to="/tech-store/" className="font-semibold text-rose-600">Continue shopping</Link></p>}
        <div className="mt-7 border-t border-slate-200 pt-5 text-sm text-slate-500"><p>SKU: <span className="text-slate-800">MYR-IT-254301TS</span></p><p className="mt-2">Categories: <Link className="text-rose-600 hover:underline" to="/product-category/pbx/">PBX</Link>, <Link className="text-rose-600 hover:underline" to="/product-category/it-products/">IT Products</Link>, <Link className="text-rose-600 hover:underline" to="/ipbx-solution/">IP PBX Solution</Link></p></div>
      </div>
    </div></div></section>
    <section className="border-y border-slate-200 bg-[#f7f7f7] py-10 sm:py-14"><div className="container-page"><div className="flex flex-wrap gap-6 border-b border-slate-200"><button onClick={() => setTab('description')} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${tab === 'description' ? 'border-rose-600 text-slate-900' : 'border-transparent text-slate-500'}`}>Description</button><button onClick={() => setTab('specifications')} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${tab === 'specifications' ? 'border-rose-600 text-slate-900' : 'border-transparent text-slate-500'}`}>Additional information</button><button onClick={() => setTab('reviews')} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${tab === 'reviews' ? 'border-rose-600 text-slate-900' : 'border-transparent text-slate-500'}`}>Reviews</button></div>
      {tab === 'description' ? <div className="max-w-4xl py-7"><h2 className="text-2xl font-bold text-slate-900">Enhance Your Business Communication with MYRLINK IP100 V3</h2><p className="mt-4 leading-relaxed text-slate-600">The MYRLINK IP100 V3 brings call handling, CRM integration, and team communication into one scalable system. It supports multi-level IVR, call logging, conference calls, and voice recording for incoming and outgoing calls.</p><p className="mt-3 leading-relaxed text-slate-600">The system supports up to 100 users, with upgrade capacity up to 600 users. Multiple SIP trunks help adapt calling capacity to your business needs.</p></div> : tab === 'specifications' ? <div className="max-w-4xl py-6"><dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{IPBX_SPECS.map(([label, value]) => <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[220px_1fr]"><dt className="font-semibold text-slate-800">{label}</dt><dd className="text-slate-600">{value}</dd></div>)}</dl></div> : <ProductReviews productId={product.id}/>}
    </div></section>
    <section className="bg-white py-10"><div className="container-page"><div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wide text-rose-600">Need a hand?</p><h2 className="mt-2 text-xl font-bold text-slate-900">Talk to us about your IP PBX setup.</h2></div><a href={CHAT_SALES} target="_blank" rel="noreferrer" className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">Talk to sales</a></div><h2 className="mt-10 text-2xl font-bold text-slate-900">You may also like</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[CATALOG[2765],CATALOG[2766],CATALOG[2767]].map((item)=><ProductCard key={item.id} product={item}/>)}</div></div></section>
  </>
}

const DM_PLANS = [
  { id: 2773, name: 'Standard', price: 7999, duration: 'Monthly', tagline: 'For small businesses and startups', features: ['SEO for up to 5 pages', 'Manage up to 2 social accounts', '10 custom posts per month', 'Basic lead generation setup', '1 ad campaign'] },
  { id: 2774, name: 'Pro+', price: 16999, duration: 'Monthly', tagline: 'For growing businesses', features: ['SEO for up to 10 pages', 'Manage up to 4 social accounts', '20 custom posts per month', 'Advanced lead generation', '3 optimized ad campaigns'] },
  { id: 2775, name: 'Standard', price: 6999, duration: 'Annual billing', tagline: 'Annual plan for small businesses', features: ['SEO for up to 5 pages', 'Manage up to 2 social accounts', '10 custom posts per month', 'Basic lead generation setup', '1 ad campaign'] },
  { id: 2776, name: 'Pro+', price: 14999, duration: 'Annual billing', tagline: 'Annual plan for growing businesses', features: ['SEO for up to 10 pages', 'Manage up to 4 social accounts', '20 custom posts per month', 'Advanced lead generation', '3 optimized ad campaigns'] },
]

export function DigitalMarketingProductPage() {
  const product = CATALOG[2768]
  const dmPrices = [useCatalogPrice(2773, 7999), useCatalogPrice(2774, 16999), useCatalogPrice(2775, 6999), useCatalogPrice(2776, 14999)]
  return <>
    <section className="border-b border-slate-200 bg-[#f7f7f7] py-8 sm:py-12"><div className="container-page"><Breadcrumbs current="AI Digital Marketing"/><div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]"><div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6"><img src="/assets/2024-09-digital-marketing.jpg" alt="AI digital marketing service" className="max-h-80 w-full object-contain"/></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">AI Digital Marketing Plans</p><h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">AI Digital Marketing</h1><p className="mt-4 leading-relaxed text-slate-600">Grow your reach with a practical mix of search optimization, social account management, content creation, lead generation, and paid campaign design.</p><p className="mt-5 text-2xl font-bold text-slate-900">From {inr(Math.min(...dmPrices), { paise: false })} <span className="text-sm font-normal text-slate-500">/ month</span></p><p className="mt-4 text-sm text-slate-500">Select a plan below to compare included services and add it to your cart.</p></div></div></div></section>
    <section className="bg-white py-12 sm:py-16"><div className="container-page"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Choose your plan</p><h2 className="mt-2 text-3xl font-bold text-slate-900">AI marketing support that scales with you</h2><p className="mt-3 text-slate-600">Both monthly and annual options include a focused set of services to support your growth.</p></div><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{DM_PLANS.map((plan, index) => <article key={plan.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg"><p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{plan.duration}</p><h3 className="mt-2 text-xl font-bold text-slate-900">{plan.name}</h3><p className="mt-1 text-sm text-slate-500">{plan.tagline}</p><p className="mt-5 text-3xl font-bold text-slate-900">{inr(dmPrices[index], { paise: false })}<span className="text-sm font-normal text-slate-500">{plan.duration === 'Monthly' ? ' /mo' : ' /mo, billed yearly'}</span></p><ul className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-relaxed text-slate-600"><span className="text-rose-600">✓</span>{feature}</li>)}</ul><div className="mt-6"><AddButton product={{ ...product, id: plan.id, price: plan.price, name: `AI Digital Marketing ${plan.name} (${plan.duration})` }} /></div></article>)}</div></div></section>
    <section className="border-t border-slate-200 bg-[#f7f7f7] py-10"><div className="container-page"><ProductReviews productId={product.id}/><h2 className="mt-8 text-2xl font-bold text-slate-900">Related products</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[CATALOG[2765],CATALOG[3056]].map((item)=><ProductCard key={item.id} product={item}/>)}</div></div></section>
  </>
}
