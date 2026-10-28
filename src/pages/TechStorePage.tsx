import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CATALOG, type CatalogProduct } from '@/lib/catalog'
import { useCart } from '@/lib/stores'
import { inr } from '@/lib/format'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

const categories = [
  { name: 'Website Development', image: '/assets/2024-09-website-development.jpg', href: '/product-category/website-development/' },
  { name: 'AI Digital Marketing', image: '/assets/2024-09-digital-marketing.jpg', href: '/digital-marketing/' },
  { name: 'CCTV & Security', image: '/assets/2024-08-buy-cctv.png', href: '/cctv-solution/' },
  { name: 'Networking', image: '/assets/2024-10-network-category.jpg', href: '/product-category/it-products/' },
  { name: 'PBX & IP Telephone', image: '/assets/2024-10-ip-telephone-category.jpg', href: '/product-category/pbx/' },
]

const products: CatalogProduct[] = [CATALOG[2424], CATALOG[2768], CATALOG[2765], CATALOG[2766], CATALOG[2767], CATALOG[3056]]

const storeNavItems = [
  { label: 'Website Development', href: '/product-category/website-development/', icon: 'M3 4h18v13H3z M8 21h8 M12 17v4' },
  { label: 'PBX', href: '/product-category/pbx/', icon: 'M7 3h10v18H7z M10 6h4 M11 18h2' },
  { label: 'IT Products', href: '/product-category/it-products/', icon: 'M3 5h18v12H3z M8 21h8 M12 17v4' },
  { label: 'IP PBX Solution', href: '/ipbx-solution/', icon: 'M5 8a7 7 0 0 1 14 0v7 M5 11H3v5h4v-5H5z M19 11h2v5h-4v-5h2z M17 19c-1 1-3 1-5 1' },
  { label: 'AI Digital Marketing', href: '/digital-marketing/', icon: 'M3 10v4h4l9 5V5l-9 5H3z M7 14l2 6h4l-3-5 M19 9a4 4 0 0 1 0 6' },
]

const promotions = [
  { eyebrow: 'UP TO 70% OFF DEAL', title: 'Your Vision, Our Code – Website Development', price: 11988, productId: 2765, was: 30000, image: '/assets/2024-09-Special-Sale-Launch-Your-Website-Save-Big.png', href: '/website-development/', action: 'Choose Plan' },
  { eyebrow: 'WEBSITES READY IN 24HRS', title: 'Purchase Today, Go Live Tomorrow', image: '/assets/2024-09-website-development.jpg', href: '/website-development/', action: 'Buy Now' },
  { eyebrow: 'MYRLINK IP PBX OFFER', title: 'One Number for All Your Customers', price: 65499, productId: 3056, was: 150000, image: '/assets/2024-09-Best-Deal-on-IP-PBX-myrlink.png', href: '/product/myrlink-ip-pbx-ip100-v3/', action: 'Buy Now' },
]

function PromotionCard({ promo }: { promo: (typeof promotions)[number] }) {
  const dynamicPrice = useCatalogPrice(promo.productId ?? 0, promo.price ?? 0)
  const price = promo.price === undefined ? undefined : dynamicPrice
  return <Link to={promo.href} className="group grid min-h-48 grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg sm:grid-cols-[.85fr_1.15fr]"><div className="flex flex-col justify-center p-5"><p className="text-[10px] font-bold tracking-[.14em] text-rose-600">{promo.eyebrow}</p><h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">{promo.title}</h2>{price !== undefined && <p className="mt-2 font-semibold text-slate-900">{promo.was && <span className="mr-2 text-sm text-slate-400 line-through">{inr(promo.was, { paise: false })}</span>}{inr(price, { paise: false })}</p>}<span className="mt-3 text-sm font-semibold text-rose-600">{promo.action} <span aria-hidden>→</span></span></div><div className="min-h-full overflow-hidden bg-slate-50"><img src={promo.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /></div></Link>
}

const storeSlides = [
  { eyebrow: 'WEBSITE DEVELOPMENT', title: 'Transforming Your Vision into a Digital Reality with Speed and Precision', action: 'Choose Plan', href: '/website-development/', image: '/assets/2024-09-website-development.jpg' },
  { eyebrow: 'ALL-IN-ONE LEAD CRM', title: 'Your Business, Your CRM – Tailored for Success.', action: 'Sign Up', href: '/privyr/', image: '/assets/2024-09-crm-development.png' },
  { eyebrow: 'AI DIGITAL MARKETING', title: 'AI Digital Marketing Solutions to Drive Growth and Results', action: 'Choose Plan', href: '/digital-marketing/', image: '/assets/2024-09-digital-marketing.jpg' },
  { eyebrow: 'SMART IP PBX', title: 'Your Business, Connected: Advanced IP PBX for Smarter Communication', action: 'Buy Now', href: '/ipbx-solution/', image: '/assets/2024-09-myrlink-ip-pbx.png' },
]

function ProductCard({ product }: { product: CatalogProduct }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const price = useCatalogPrice(product.id, product.price)
  const isVariable = product.type === 'variable'
  const image = product.image ?? (product.category === 'Digital Marketing' ? '/assets/2024-09-digital-marketing.jpg' : '/assets/2024-09-website-development.jpg')
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-lg">
      <Link to={product.slug} className="flex h-52 items-center justify-center bg-paper p-5">
        <img src={image} alt={product.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{product.category === 'Digital Marketing' ? 'AI Digital Marketing' : product.category}</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{product.name}</h3>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold text-slate-900">{isVariable ? 'From ' : ''}{inr(price, { paise: false })}</span>
          {product.compareAt && <span className="text-sm text-ink-400 line-through">{inr(product.compareAt, { paise: false })}</span>}
        </div>
        <div className="mt-5 flex gap-2">
          {isVariable ? <Link to={product.slug} className="btn btn-sm flex-1 bg-rose-600 text-center text-white hover:bg-rose-700">Select options</Link> : <button className="btn btn-sm flex-1 bg-rose-600 text-white hover:bg-rose-700" onClick={() => { add({ id: product.id, price }); navigate('/cart/') }}>Add to cart</button>}
          {!isVariable && <Link to={product.slug} className="btn btn-outline-light btn-sm">Details</Link>}
        </div>
      </div>
    </article>
  )
}

export function TechStorePage() {
  const [query, setQuery] = useState('')
  const [slideIndex, setSlideIndex] = useState(0)
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const shownProducts = useMemo(() => products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query])
  const normalizedQuery = query.trim().toLowerCase()
  const showHrm = !normalizedQuery || 'hrm human resource management'.includes(normalizedQuery)
  const showCrm = !normalizedQuery || 'crm customer relationship lead management'.includes(normalizedQuery)
  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => setSlideIndex((index) => (index + 1) % storeSlides.length), 6500)
    return () => window.clearInterval(timer)
  }, [reduceMotion])
  return (
    <>
      <div className="border-b border-slate-200 bg-[#f7f7f7] py-3 sm:py-4">
        <nav className="container-page flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-2.5 lg:flex-row lg:items-center lg:gap-3" aria-label="Store categories">
          <div className="hidden shrink-0 items-center gap-2 border-r border-slate-200 px-3 lg:flex">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden><path d="M4 8h16l-1 12H5L4 8z M3 4h18l-1 4H4L3 4z M9 12v4 M15 12v4" strokeLinejoin="round" strokeLinecap="round"/></svg></span>
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Browse</span>
          </div>
          <div className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 lg:flex-1">
            {storeNavItems.map(({ label, href, icon }) => {
              const active = pathname === href || pathname.startsWith(href)
              return <Link key={label} to={href} aria-current={active ? 'page' : undefined} className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? 'text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                {active && <motion.span layoutId="store-nav-active" className="absolute inset-0 rounded-xl bg-rose-50" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" className="relative h-4 w-4" aria-hidden><path d={icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="relative">{label}</span>
              </Link>
            })}
          </div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-400 transition focus-within:border-rose-300 focus-within:bg-white lg:max-w-[270px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0" aria-hidden><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5" strokeLinecap="round"/></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the store" className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" aria-label="Search products" />
            {query && <button type="button" onClick={() => setQuery('')} className="text-xs font-semibold text-slate-500 hover:text-rose-600" aria-label="Clear search">Clear</button>}
          </label>
        </nav>
      </div>

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f7f7] text-slate-900" aria-roledescription="carousel" aria-label="Featured store solutions">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={slideIndex} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: .65 }} className="absolute inset-0 bg-[#f7f7f7]" aria-hidden>
            <img src={storeSlides[slideIndex].image} alt="" className="absolute inset-y-0 right-0 h-full w-[58%] object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f7f7] via-[#f7f7f7]/95 to-white/10" />
          </motion.div>
        </AnimatePresence>
        <div className="container-page relative flex min-h-[420px] items-center py-14 sm:min-h-[490px] lg:py-20">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`copy-${slideIndex}`} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: .45 }}>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-rose-600">{storeSlides[slideIndex].eyebrow}</p>
                <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">{storeSlides[slideIndex].title}</h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">Explore MYR services and technology products, built to help your business grow.</p>
                <div className="mt-7 flex flex-wrap gap-3"><Link to={storeSlides[slideIndex].href} className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">{storeSlides[slideIndex].action}</Link><a href="#store-products" className="btn btn-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-50">Shop products</a></div>
              </motion.div>
            </AnimatePresence>
          <div className="mt-9 flex items-center gap-2" role="group" aria-label="Choose featured slide">{storeSlides.map((slide, index) => <button key={slide.eyebrow} onClick={() => setSlideIndex(index)} aria-label={`Show ${slide.eyebrow}`} aria-current={slideIndex === index} className={`h-1.5 rounded-full transition-all ${slideIndex === index ? 'w-8 bg-rose-600' : 'w-2.5 bg-slate-300 hover:bg-slate-500'}`} />)}</div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="container-page grid gap-4 lg:grid-cols-3">
          {promotions.map((promo) => <PromotionCard key={promo.title} promo={promo} />)}
        </div>
      </section>

      <section id="store-browse" className="bg-[#f7f7f7] py-14 sm:py-16">
        <div className="container-page"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Browse the store</p><h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Find the right solution for your business</h2><p className="mt-3 text-base leading-relaxed text-slate-600">Explore our most requested services and technology categories.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.map((category) => <Link to={category.href} key={category.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"><div className="flex h-32 items-center justify-center overflow-hidden bg-white p-4"><img src={category.image} alt="" className="h-full w-full object-contain transition duration-300 group-hover:scale-105" /></div><div className="flex items-center justify-between border-t border-slate-100 p-3"><span className="text-sm font-semibold text-slate-800">{category.name}</span><span className="text-rose-600" aria-hidden>→</span></div></Link>)}</div>
        </div>
      </section>

      <section id="store-products" className="bg-white py-14 sm:py-16">
        <div className="container-page"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Shop our best sellers</p><h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Popular products & plans</h2></div><Link to="/website-development/" className="btn btn-sm border border-slate-300 bg-white text-slate-800 hover:bg-slate-50">Explore all services</Link></div>
          {shownProducts.length || showHrm || showCrm ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {showHrm && <article className="group flex flex-col overflow-hidden rounded-2xl border border-indigo-100 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
              <Link to="/hrm-solutions/" aria-label="Explore HRM Solutions" className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-950 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(99,102,241,.48),transparent_55%),linear-gradient(135deg,#111827,#090b16)]" />
                <div className="relative w-full max-w-[240px] rounded-xl border border-white/15 bg-white/[.08] p-4 shadow-2xl backdrop-blur-sm transition duration-500 group-hover:rotate-1 group-hover:scale-[1.03]">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-indigo-200">MYR · People</span><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-semibold text-emerald-300">All systems ready</span></div>
                  <div className="mt-5 grid grid-cols-3 gap-2">{[['PEOPLE','248'],['ON LEAVE','08'],['OPEN ROLES','12']].map(([label,value])=><div key={label} className="rounded-lg border border-white/10 bg-slate-950/50 p-2"><p className="text-[8px] text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p></div>)}</div>
                  <div className="mt-3 flex items-end gap-1.5">{[34,54,43,76,58,92,68,100,73,86,62,95].map((height,index)=><span key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600 to-cyan-300 opacity-80" style={{height:`${height}px`}} />)}</div>
                </div>
                <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[9px] font-bold tracking-wide text-white">LIVE HRM PREVIEW</span>
              </Link>
              <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">HRM Solutions</p><h3 className="mt-2 text-lg font-bold text-slate-900">Human Resource Management</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">People, attendance, leave, onboarding and team operations in one workspace.</p><div className="mt-4 flex items-baseline gap-2"><span className="text-xl font-bold text-slate-900">{inr(34999, { paise: false })}</span><span className="text-sm text-slate-400 line-through">{inr(44999, { paise: false })}</span><span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600">OFFER</span></div><Link to="/hrm-solutions/" className="btn btn-sm mt-5 w-full bg-indigo-600 text-center text-white hover:bg-indigo-700">Explore HRM</Link></div>
            </article>}
            {showCrm && <article className="group flex flex-col overflow-hidden rounded-2xl border border-lime-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-lime-300 hover:shadow-xl">
              <Link to="/privyr/#privyrpricing" aria-label="Explore CRM Solutions and pricing" className="relative flex h-52 items-center justify-center overflow-hidden bg-[#10120f] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_18%,rgba(190,242,100,.24),transparent_55%),linear-gradient(135deg,#151812,#090b09)]" />
                <div className="relative w-full max-w-[240px] rounded-xl border border-white/10 bg-[#171a15] p-4 shadow-2xl transition duration-500 group-hover:-rotate-1 group-hover:scale-[1.03]">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-lime-300">MYR · Sales CRM</span><span className="rounded-full bg-lime-300/10 px-2 py-1 text-[9px] font-semibold text-lime-300">Live pipeline</span></div>
                  <div className="mt-4 flex items-end justify-between"><div><p className="text-[9px] text-slate-400">Qualified leads</p><p className="mt-1 text-2xl font-bold text-white">1,284</p></div><p className="text-[9px] font-semibold text-lime-300">↑ 18.6%</p></div>
                  <div className="mt-4 space-y-2">{[['New enquiries', '72%'], ['Follow-ups', '54%'], ['Won deals', '86%']].map(([label, width]) => <div key={label}><div className="mb-1 flex justify-between text-[8px] text-slate-400"><span>{label}</span><span>{width}</span></div><div className="h-1 rounded-full bg-white/10"><span className="block h-full rounded-full bg-lime-300" style={{width}} /></div></div>)}</div>
                </div>
                <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[9px] font-bold tracking-wide text-white">CRM WORKSPACE</span>
              </Link>
              <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-wide text-lime-700">All-in-One CRM</p><h3 className="mt-2 text-lg font-bold text-slate-900">Customer Relationship Management</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Capture leads, organize follow-ups and track sales across your team.</p><div className="mt-4"><p className="text-xl font-bold text-slate-900">From ₹1,305<span className="text-sm font-medium text-slate-500">/month</span></p><p className="mt-1 text-xs leading-relaxed text-slate-500">Annual plan rate. Per-team-account fee applies; see plan details.</p></div><Link to="/privyr/#privyrpricing" className="btn btn-sm mt-5 w-full bg-lime-600 text-center text-white hover:bg-lime-700">View CRM plans</Link></div>
            </article>}
            {shownProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div> : <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-500">No products match “{query}”. Try another search.</p>}
        </div>
      </section>
      <section id="store-categories" className="bg-[#f7f7f7] py-12 sm:py-14">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          <Link to="/ipbx-solution/" className="group flex min-h-56 items-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"><img src="/assets/2024-10-ip-telephone-category.jpg" alt="" className="h-40 w-2/5 rounded-lg object-cover"/><div><p className="text-xs font-bold uppercase tracking-wide text-rose-600">MYRLINK IP TELEPHONY</p><h2 className="mt-2 text-xl font-bold text-slate-900">Connect Smarter, Communicate Better</h2><span className="mt-3 inline-block text-sm font-semibold text-rose-600">Upgrade to IP Telephony →</span></div></Link>
          <Link to="/product-category/it-products/" className="group flex min-h-56 items-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"><img src="/assets/2024-10-network-category.jpg" alt="" className="h-40 w-2/5 rounded-lg object-cover"/><div><p className="text-xs font-bold uppercase tracking-wide text-rose-600">NETWORK PRODUCTS</p><h2 className="mt-2 text-xl font-bold text-slate-900">Smart Networking Devices</h2><span className="mt-3 inline-block text-sm font-semibold text-rose-600">Browse IT products →</span></div></Link>
        </div>
      </section>
      <section id="store-contact" className="border-t border-slate-200 bg-white py-12"><div className="container-page flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">Need a recommendation?</p><h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Talk with a technology specialist.</h2></div><Link to="/contact-us/" className="btn btn-md bg-rose-600 text-white hover:bg-rose-700">Contact our team</Link></div></section>
    </>
  )
}
