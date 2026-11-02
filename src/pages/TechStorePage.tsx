import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const heroSlides = [
  {
    title: 'Transforming Your Vision into a Digital Reality with Speed and Precision',
    cta: 'Choose Plan',
    to: '/website-development/',
  },
  {
    title: 'Your Business, Your CRM – Tailored for Success.',
    cta: 'Sign Up',
    to: '/crm-development/',
  },
  {
    title: 'Digital Marketing Solutions to Drive Growth and Results',
    cta: 'Choose Plan',
    to: '/digital-marketing/',
  },
  {
    title: 'Your Business, Connected: Advanced IP PBX for Smarter Communication',
    cta: 'Buy Now',
    to: '/ip-pbx/',
  },
]

const categories = [
  { title: 'Digital Marketing', cta: 'Choose Plan', to: '/digital-marketing/', icon: '📊' },
  { title: 'CCTV Solution', cta: 'Shop Now', to: '/cctv-solutions/', icon: '📹' },
  { title: 'Network Product', cta: 'Shop Now', to: '/tech-store/#store-products', icon: '🌐' },
  { title: 'PBX & IP Telephone', cta: 'Shop Now', to: '/ip-pbx/', icon: '📞' },
]

const products = [
  {
    name: 'Website Development',
    category: 'Website',
    price: 'From ₹14,499.00',
    original: null as string | null,
    sale: false,
    to: '/website-development/',
  },
  {
    name: 'Digital Marketing',
    category: 'Digital Marketing',
    price: 'From ₹7,999.00',
    original: null as string | null,
    sale: false,
    to: '/digital-marketing/',
  },
  {
    name: 'NewBiz Essentials',
    category: 'Website',
    price: '₹14,499.00',
    original: '₹30,000.00',
    sale: true,
    to: '/website-development/',
  },
  {
    name: 'RevampCommerce Lite',
    category: 'Website',
    price: '₹24,499.00',
    original: '₹60,999.00',
    sale: true,
    to: '/website-development/',
  },
  {
    name: 'EliteCustom Suite',
    category: 'Website',
    price: '₹59,499.00',
    original: '₹75,000.00',
    sale: true,
    to: '/website-development/',
  },
]

const filters = ['All', 'Website', 'Digital Marketing', 'PBX', 'IT Products']

export function TechStorePage() {
  const [slide, setSlide] = useState(0)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="overflow-hidden bg-[#f5f8f7] text-[#132c32]">
      {/* Hero Slider */}
      <section className="relative bg-[#102b31] py-16 text-white sm:py-24">
        <div className="container-page relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {heroSlides[slide].title}
              </h1>
              <Link
                to={heroSlides[slide].to}
                className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-teal-300 px-6 text-sm font-bold text-[#102b31] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {heroSlides[slide].cta} ↗
              </Link>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex justify-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 w-8 rounded-full transition ${i === slide ? 'bg-teal-300' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="container-page py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { badge: 'UP TO 70% OFF DEAL', title: 'Digital Marketing Plans', desc: 'Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs', price: '₹11,988.00', original: '₹30,000.00', to: '/digital-marketing/', cta: 'BUY NOW' },
            { badge: '', title: 'Streamline Your Calls: One Number for All Your Customers!', desc: 'Buy MYRLINK IPBX Now and Transform Communication', price: '₹65,499.00', original: '₹150,000.00', to: '/ip-pbx/', cta: 'BUY NOW' },
            { badge: '', title: 'Your Vision, Our Code – Website Development', desc: 'Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs', price: '₹11,988.00', original: '₹30,000.00', to: '/website-development/', cta: 'BUY NOW' },
            { badge: '', title: 'Effortless Connectivity, Delivered Fast – Buy MYRLINK IPBX Now', desc: 'Buy MYRLINK IPBX Now & Transform Communication', price: '₹65,499.00', original: '₹150,000.00', to: '/ip-pbx/', cta: 'BUY NOW' },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-teal-300">
              {b.badge && (
                <span className="mb-2 inline-block rounded-full bg-red-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600">
                  {b.badge}
                </span>
              )}
              <h3 className="text-sm font-bold leading-snug">{b.title}</h3>
              <p className="mt-1.5 text-[11px] text-ink-500">{b.desc}</p>
              <div className="mt-3 flex items-baseline gap-2">
                {b.original && <span className="text-xs text-ink-400 line-through">{b.original}</span>}
                <span className="text-lg font-bold text-teal-700">{b.price}</span>
              </div>
              <Link to={b.to} className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-xs font-bold text-white transition hover:bg-teal-600">
                {b.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section id="store-browse" className="container-page scroll-mt-20 py-6 sm:py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-2xl border border-line bg-white p-6 text-center shadow-card transition hover:border-teal-400 hover:shadow-lg"
            >
              <span className="text-3xl">{c.icon}</span>
              <h3 className="mt-3 text-sm font-bold">{c.title}</h3>
              <span className="mt-2 inline-block text-xs font-semibold text-teal-600 group-hover:underline">
                {c.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Products with Filter */}
      <section id="store-products" className="container-page scroll-mt-20 py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                filter === f
                  ? 'border-teal-700 bg-teal-700 text-white'
                  : 'border-line bg-white text-ink-500 hover:border-teal-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.name} className="group rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-teal-300 hover:shadow-lg">
              {p.sale && (
                <span className="mb-2 inline-block rounded-full bg-red-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600">
                  Sale!
                </span>
              )}
              <span className="ml-2 rounded bg-teal-50 px-2 py-0.5 text-[9px] font-semibold text-teal-600">
                {p.category}
              </span>
              <h3 className="mt-3 text-base font-bold">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                {p.original && <span className="text-xs text-ink-400 line-through">{p.original}</span>}
                <span className="text-lg font-bold text-teal-700">{p.price}</span>
              </div>
              <Link
                to={p.to}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-teal-700 text-xs font-bold text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white"
              >
                {p.sale ? 'Add to cart' : 'Select options'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* IP Telephony Banner */}
      <section id="store-categories" className="scroll-mt-20 bg-[#102b31] py-14 text-white">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Connect Smarter, Communicate Better – Upgrade to IP Telephony Today!
          </h2>
          <p className="mt-3 text-sm text-slate-300">Smart Networking Devices</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/ip-pbx/" className="inline-flex min-h-12 items-center rounded-xl bg-teal-300 px-6 text-sm font-bold text-[#102b31] transition hover:bg-white">
              Explore IP PBX ↗
            </Link>
            <Link to="/cctv-solutions/" className="inline-flex min-h-12 items-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
              CCTV Solutions ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section id="store-contact" className="scroll-mt-20 container-page py-14 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          We Can Take Your Business To The Next Level.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
          Elevate your business with our comprehensive suite of IT services and solutions, encompassing IPBX systems, CCTV security, computer networking, CRM development, digital marketing, website development and design, billing solutions and more.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/contact-us/" className="btn btn-primary">Contact Us</Link>
          <Link to="/partner/" className="btn btn-ghost-dark">Partner with Us</Link>
        </div>
      </section>
    </div>
  )
}
