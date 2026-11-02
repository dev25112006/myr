import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCart } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'
import { inr } from '@/lib/format'

/* ------------------------------- slide data ------------------------------- */

const heroSlides = [
  {
    title: 'Transforming Your Vision into a Digital Reality with Speed and Precision',
    subtitle: 'Websites ready in 24 hours — purchase today, go live tomorrow.',
    cta: 'Choose Plan',
    to: '/website-development/',
    image: '/assets/2025-01-website-front-hero-image.png',
    tag: 'Website Development',
  },
  {
    title: 'Your Business, Your CRM – Tailored for Success.',
    subtitle: 'Manage leads, pipelines and client interactions in one custom-built CRM.',
    cta: 'Sign Up',
    to: '/crm-development/',
    image: '/assets/2024-09-crm-development.png',
    tag: 'CRM Solutions',
  },
  {
    title: 'Digital Marketing Solutions to Drive Growth and Results',
    subtitle: 'SEO, social and paid campaigns that put your brand in front of the right people.',
    cta: 'Choose Plan',
    to: '/digital-marketing/',
    image: '/assets/2024-09-digital-marketing.jpg',
    tag: 'Digital Marketing',
  },
  {
    title: 'Your Business, Connected: Advanced IP PBX for Smarter Communication',
    subtitle: 'One number for all your customers — crystal-clear VoIP with IVR built in.',
    cta: 'Buy Now',
    to: '/ip-pbx/',
    image: '/assets/2024-09-myrlink-ip-pbx.png',
    tag: 'IP PBX',
  },
]

const SLIDE_MS = 5000

/* ------------------------------- other data ------------------------------- */

const categories = [
  { title: 'Digital Marketing', cta: 'Choose Plan', to: '/digital-marketing/', image: '/assets/2024-09-digital-marketing.jpg' },
  { title: 'CCTV Solution', cta: 'Shop Now', to: '/cctv-solutions/', image: '/assets/2024-08-buy-cctv.png' },
  { title: 'Network Product', cta: 'Shop Now', to: '/network-product/', image: '/assets/2024-10-network-category.jpg' },
  { title: 'PBX & IP Telephone', cta: 'Shop Now', to: '/ip-pbx/', image: '/assets/2024-08-ipbx-768x644-1.png' },
]

const promos = [
  { badge: 'UP TO 70% OFF DEAL', title: 'Digital Marketing Plans', desc: 'Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs', price: '₹11,988.00', original: '₹30,000.00', to: '/digital-marketing/', cta: 'BUY NOW', image: '/assets/2024-09-Special-Sale-Launch-Your-Website-Save-Big.png' },
  { badge: 'BEST DEAL', title: 'Streamline Your Calls: One Number for All Your Customers!', desc: 'Buy MYRLINK IPBX Now and Transform Communication', price: '₹65,499.00', original: '₹150,000.00', to: '/ip-pbx/', cta: 'BUY NOW', image: '/assets/2024-09-Best-Deal-on-IP-PBX-myrlink.png' },
  { badge: '', title: 'Your Vision, Our Code – Website Development', desc: 'Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs', price: '₹11,988.00', original: '₹30,000.00', to: '/website-development/', cta: 'BUY NOW', image: '/assets/2024-08-gradient-responsive-website.png' },
  { badge: '', title: 'Effortless Connectivity, Delivered Fast', desc: 'Buy MYRLINK IPBX Now & Transform Communication', price: '₹65,499.00', original: '₹150,000.00', to: '/ip-pbx/', cta: 'BUY NOW', image: '/assets/2024-09-ip-pbx-1.png' },
]

type StoreProduct = {
  id: number
  name: string
  category: string
  fallbackPrice: number
  compareAt?: number
  to: string
  image: string
  desc: string
  badge?: string
  monthly?: boolean
}

const products: StoreProduct[] = [
  // ERP
  { id: 6001, name: 'School ERP', category: 'ERP', fallbackPrice: 5000, monthly: true, to: '/education-erp/school/', image: '/assets/2024-09-website-designing-service-7.png', desc: 'Admissions, attendance, exams, fees and campus operations for schools.', badge: 'Popular' },
  { id: 6002, name: 'College ERP', category: 'ERP', fallbackPrice: 7000, monthly: true, to: '/education-erp/college/', image: '/assets/2025-02-it-expert-2.png', desc: 'Departments, semesters, placements and institutional oversight in one view.' },
  { id: 6003, name: 'Coaching ERP', category: 'ERP', fallbackPrice: 4000, monthly: true, to: '/education-erp/coaching/', image: '/assets/2024-08-start-mission-success-strategy-beginning-concept.png', desc: 'Enquiries, batches, test series and fee follow-ups for coaching institutes.' },
  // CRM / HRM / E-commerce / Billing
  { id: 6004, name: 'CRM Software', category: 'CRM', fallbackPrice: 8000, monthly: true, to: '/crm-development/', image: '/assets/2024-09-customized-crm-development.png', desc: 'Tailored CRM — pipeline management, customer tracking and sales automation.', badge: 'Custom build' },
  { id: 6005, name: 'HRM Software', category: 'HRM', fallbackPrice: 3000, monthly: true, to: '/hrm-solutions/', image: '/assets/2024-08-buy-time-attendance.png', desc: 'Employee onboarding, attendance, payroll and performance management.' },
  { id: 6006, name: 'E-commerce Website', category: 'E-commerce', fallbackPrice: 24999, to: '/ecommerce-solutions/', image: '/assets/2024-08-gradient-responsive-website-design.png', desc: 'Full online store with product catalogue, cart, checkout and payments.' },
  { id: 6007, name: 'Billing Software', category: 'Billing', fallbackPrice: 4999, to: '/contact-us/', image: '/assets/2024-08-buy-restaurant-billing-software.png', desc: 'GST billing, invoices, stock and reports for retail and restaurants.' },
  // Website / Digital / PBX
  { id: 2424, name: 'Website Development', category: 'Website', fallbackPrice: 14499, to: '/website-development/', image: '/assets/2024-09-website-development.jpg', desc: 'Responsive, SEO-ready websites crafted to convert visitors into customers.' },
  { id: 2768, name: 'Digital Marketing', category: 'Digital Marketing', fallbackPrice: 6999, to: '/digital-marketing/', image: '/assets/2024-09-digital-marketing.jpg', desc: 'Search, social and paid campaigns managed for measurable growth.' },
  { id: 2765, name: 'NewBiz Essentials', category: 'Website', fallbackPrice: 14499, compareAt: 30000, to: '/website-development/', image: '/assets/2024-08-gradient-responsive-website-design.png', desc: 'Everything a new business needs to launch a professional online presence.', badge: 'Sale' },
  { id: 2766, name: 'RevampCommerce Lite', category: 'Website', fallbackPrice: 24499, compareAt: 60999, to: '/website-development/', image: '/assets/2025-02-website-design-MyR-Advance-Solution-3.png', desc: 'Refresh your storefront with a fast, mobile-first e-commerce redesign.', badge: 'Sale' },
  { id: 2767, name: 'EliteCustom Suite', category: 'Website', fallbackPrice: 59499, compareAt: 75000, to: '/website-development/', image: '/assets/2025-02-website-expert.jpg', desc: 'Bespoke design, custom functionality and priority build for premium brands.', badge: 'Sale' },
  { id: 3056, name: 'MYRLINK IP PBX IP100 V3', category: 'PBX', fallbackPrice: 65499, compareAt: 150000, to: '/ip-pbx/', image: '/assets/2024-09-myrlink-ip-pbx.png', desc: 'Business phone system with IVR, call recording and up to 600 users.', badge: 'Best deal' },
]

const filters = ['All', 'ERP', 'CRM', 'HRM', 'E-commerce', 'Billing', 'Website', 'Digital Marketing', 'PBX']

/** Product card with admin-controlled live price + add-to-cart. */
function ProductCard({ product, index, reduceMotion }: { product: StoreProduct; index: number; reduceMotion: boolean }) {
  const price = useCatalogPrice(product.id, product.fallbackPrice)
  const { add, items, remove } = useCart()
  const inCart = items.some((item) => item.id === product.id)
  const onSale = product.compareAt != null && price < product.compareAt

  const toggleCart = () => {
    if (inCart) remove(product.id)
    else add({ id: product.id, price, name: product.name })
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.25) }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:border-flame-400/50 hover:shadow-xl"
    >
      {/* Product image on top */}
      <div className="relative h-44 overflow-hidden bg-paper">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          {(onSale || product.badge === 'Sale') && (
            <span className="rounded-full bg-flame-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow">
              Sale!
            </span>
          )}
          {product.badge && product.badge !== 'Sale' && (
            <span className="rounded-full bg-ink-950/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
              {product.badge}
            </span>
          )}
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink-500 backdrop-blur">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-ink-950">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-400">{product.desc}</p>
        <div className="mt-3 flex items-baseline gap-2">
          {product.compareAt != null && price < product.compareAt && (
            <span className="text-xs text-ink-400 line-through">{inr(product.compareAt)}</span>
          )}
          <span className="text-lg font-bold text-flame-600">{inr(price)}</span>
          {product.monthly && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">/ month</span>
          )}
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
              onClick={() => remove(product.id)}
              aria-label={`Remove ${product.name} from cart`}
              title="Remove from cart"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-ink-400 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
            >
              ✕
            </button>
          )}
          <Link
            to={product.to}
            aria-label={`View ${product.name}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-ink-400 transition hover:border-flame-500 hover:text-flame-600"
          >
            ↗
          </Link>
        </div>
        {inCart && (
          <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
            In your cart · <button type="button" onClick={() => remove(product.id)} className="underline hover:text-red-600">Remove</button>
          </p>
        )}
      </div>
    </motion.article>
  )
}

/* --------------------------------- page ---------------------------------- */

export function TechStorePage() {
  const [slide, setSlide] = useState(0)
  const [filter, setFilter] = useState('All')
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const reduceMotion = useReducedMotion()
  const timerRef = useRef<number | null>(null)
  const startRef = useRef(Date.now())

  const goTo = useCallback((i: number) => {
    setSlide(i)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  const next = useCallback(() => {
    setSlide((s) => (s + 1) % heroSlides.length)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  // Auto-advance with progress bar (pauses on hover)
  useEffect(() => {
    if (paused || reduceMotion) return
    startRef.current = Date.now()
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(elapsed / SLIDE_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        setSlide((s) => (s + 1) % heroSlides.length)
        startRef.current = Date.now()
        setProgress(0)
      }
    }, 50)
    timerRef.current = tick
    return () => window.clearInterval(tick)
  }, [paused, reduceMotion, slide])

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)
  const current = heroSlides[slide]

  return (
    <div className="overflow-hidden bg-paper text-ink-100">
      {/* ══════════ Auto-running hero slider ══════════ */}
      <section
        className="section-dark relative isolate overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_30%,rgba(232,117,42,.2),transparent_38%),radial-gradient(ellipse_at_12%_90%,rgba(5,12,95,.08),transparent_34%)]" />

        {/* floating orbs */}
        {!reduceMotion && (
          <>
            <motion.span aria-hidden className="pointer-events-none absolute left-[8%] top-[20%] h-16 w-16 rounded-full bg-flame-500/15 blur-xl"
              animate={{ y: [0, -18, 0], x: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.span aria-hidden className="pointer-events-none absolute right-[12%] bottom-[18%] h-24 w-24 rounded-full bg-accent-400/15 blur-xl"
              animate={{ y: [0, 16, 0], x: [0, -12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
          </>
        )}

        <div className="container-page relative z-10 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            {/* Copy side */}
            <div className="relative min-h-[300px] sm:min-h-[330px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={reduceMotion ? false : { opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 32 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.17em] text-flame-600">
                    <motion.i className="h-1.5 w-1.5 rounded-full bg-flame-500"
                      animate={reduceMotion ? {} : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                    {current.tag}
                  </span>
                  <h1 className="mt-5 max-w-xl text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
                    {current.title}
                  </h1>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-400 sm:text-base">
                    {current.subtitle}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link to={current.to} className="inline-flex min-h-12 items-center rounded-xl bg-flame-500 px-6 text-sm font-bold text-white shadow-lg shadow-flame-500/25 transition hover:-translate-y-0.5 hover:bg-flame-600">
                      {current.cta} ↗
                    </Link>
                    <Link to="/tech-store/#store-products" className="inline-flex min-h-12 items-center rounded-xl border border-line px-6 text-sm font-semibold text-ink-500 transition hover:border-flame-400/50 hover:text-flame-600">
                      Browse all products ↓
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots with running progress */}
              <div className="mt-9 flex items-center gap-3">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.tag}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}: ${s.tag}`}
                    aria-current={i === slide}
                    className="group relative h-2 overflow-hidden rounded-full bg-ink-100/15 transition-all"
                    style={{ width: i === slide ? 56 : 20 }}
                  >
                    {i === slide && (
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full bg-flame-500"
                        style={{ width: `${progress * 100}%` }}
                      />
                    )}
                    {i !== slide && <span className="absolute inset-0 rounded-full bg-ink-100/30 transition group-hover:bg-flame-400/60" />}
                  </button>
                ))}
                <button
                  onClick={next}
                  aria-label="Next slide"
                  className="ml-1 grid h-8 w-8 place-items-center rounded-full border border-line text-ink-500 transition hover:border-flame-500 hover:text-flame-600"
                >
                  →
                </button>
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {paused ? 'Paused' : 'Auto'}
                </span>
              </div>
            </div>

            {/* Image side — animated per slide */}
            <div className="relative">
              <div className="absolute inset-4 rounded-[2.5rem] bg-flame-500/10 blur-3xl" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, rotate: 2 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-2xl"
                >
                  <img
                    src={current.image}
                    alt={current.tag}
                    className="h-56 w-full object-cover sm:h-72 lg:h-80"
                  />
                  <div className="flex items-center justify-between px-5 py-3.5 text-[11px]">
                    <span className="font-bold text-ink-950">{current.tag}</span>
                    <span className="rounded-full bg-flame-500/10 px-3 py-1 font-bold text-flame-600">
                      {slide + 1} / {heroSlides.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Promo banners ══════════ */}
      <section className="container-page py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promos.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:border-flame-400/50 hover:shadow-xl"
            >
              <div className="relative h-28 overflow-hidden bg-paper">
                <img src={b.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                {b.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-flame-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                    {b.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold leading-snug text-ink-950">{b.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">{b.desc}</p>
                <div className="mt-auto pt-3 flex items-baseline gap-2">
                  {b.original && <span className="text-xs text-ink-400 line-through">{b.original}</span>}
                  <span className="text-lg font-bold text-flame-600">{b.price}</span>
                </div>
                <Link to={b.to} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-flame-500 px-4 text-xs font-bold text-white transition hover:bg-flame-600">
                  {b.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ Category cards with images ══════════ */}
      <section id="store-browse" className="container-page scroll-mt-20 py-6 sm:py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08 }}>
              <Link
                to={c.to}
                className="group relative block h-44 overflow-hidden rounded-2xl border border-line shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-sm font-bold text-white">{c.title}</span>
                  <span className="mt-1 inline-block text-xs font-semibold text-flame-400 transition group-hover:translate-x-1">
                    {c.cta} →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ Products with images + filter ══════════ */}
      <section id="store-products" className="container-page scroll-mt-20 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Shop products</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">Popular products & plans</h2>
          <p className="mt-2 text-sm text-ink-500">Filter by category — every plan is configurable and backed by MYR support.</p>
        </div>

        <div className="mt-7 mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`min-h-10 rounded-full border px-4 text-xs font-semibold transition sm:text-sm ${
                filter === f
                  ? 'border-flame-500 bg-flame-500 text-white shadow-lg shadow-flame-500/15'
                  : 'border-line bg-white text-ink-500 hover:border-flame-400/50 hover:text-flame-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} reduceMotion={!!reduceMotion} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-10 rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-400">
            No products in this category yet — check back soon.
          </p>
        )}
      </section>

      {/* ══════════ IP Telephony banner ══════════ */}
      <section id="store-categories" className="section-dark scroll-mt-20 border-y border-line py-14">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">
            Connect Smarter, Communicate Better – Upgrade to IP Telephony Today!
          </h2>
          <p className="mt-3 text-sm text-ink-400">Smart Networking Devices</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/ip-pbx/" className="inline-flex min-h-12 items-center rounded-xl bg-flame-500 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-flame-600">
              Explore IP PBX ↗
            </Link>
            <Link to="/cctv-solutions/" className="inline-flex min-h-12 items-center rounded-xl border border-line px-6 text-sm font-semibold text-ink-500 transition hover:border-flame-400/50 hover:text-flame-600">
              CCTV Solutions ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ Footer CTA ══════════ */}
      <section id="store-contact" className="section-deep scroll-mt-20 py-14 text-center">
        <div className="container-page">
          <p className="eyebrow">Ready to grow?</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">
            We Can Take Your Business To The Next Level.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
            Elevate your business with our comprehensive suite of IT services and solutions, encompassing IPBX systems, CCTV security, computer networking, CRM development, digital marketing, website development and design, billing solutions and more.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact-us/" className="btn btn-primary">Contact Us</Link>
            <Link to="/partner/" className="btn btn-ghost-dark">Partner with Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
