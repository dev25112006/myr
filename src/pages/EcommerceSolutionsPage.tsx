import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, SectionHeading, Stagger, StaggerItem, TiltCard } from '@/components/ui'
import { cn } from '@/lib/format'

/* Recolored store mockup — same layout as before, but in the house palette
   (ink navy / accent rose / flame coral / paper) instead of the old green + cream. */
function StoreMockup() {
  const reduceMotion = useReducedMotion()
  return <div className="relative mx-auto w-full max-w-[620px] [perspective:1400px]">
    <TiltCard className="relative">
      <div className="overflow-hidden rounded-[1.4rem] border border-line bg-white p-2 shadow-[0_35px_100px_-30px_rgba(5,12,95,.45)] sm:rounded-[1.8rem] sm:p-3">
        <div className="overflow-hidden rounded-[1rem] bg-paper sm:rounded-[1.25rem]">
          <div className="flex items-center justify-between border-b border-line px-3 py-3 sm:px-5"><span className="text-[10px] font-black tracking-[.18em] text-ink-950 sm:text-xs">FORME<span className="text-accent-600"> /</span> OBJECTS</span><div className="hidden gap-4 text-[9px] font-medium text-ink-500 sm:flex"><span>Shop</span><span>Our story</span><span>Journal</span></div><span className="rounded-full bg-ink-950 px-3 py-1.5 text-[8px] font-semibold text-white sm:text-[9px]">Bag · 02</span></div>
          <div className="grid min-h-[260px] grid-cols-[1fr_.82fr] sm:min-h-[340px]">
            <div className="flex flex-col justify-center px-4 py-7 sm:px-8 sm:py-10"><span className="text-[8px] font-bold uppercase tracking-[.2em] text-accent-600 sm:text-[9px]">Objects for slower living</span><h2 className="mt-3 max-w-[250px] text-3xl font-bold leading-[.95] tracking-tight text-ink-950 sm:mt-4 sm:text-5xl">Made for<br />everyday.</h2><p className="mt-3 max-w-[220px] text-[9px] leading-relaxed text-ink-500 sm:mt-5 sm:text-xs">Thoughtful forms. Honest materials. A little more beauty in the everyday.</p><span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-accent-500 px-3.5 py-2 text-[8px] font-bold text-white sm:mt-7 sm:px-5 sm:py-2.5 sm:text-[9px]">Explore collection <span>↗</span></span></div>
            <div className="relative flex items-center justify-center overflow-hidden bg-accent-400/15"><div className="absolute h-40 w-40 rounded-full bg-accent-400/40 blur-[1px] sm:h-64 sm:w-64" /><div className="relative flex h-36 w-28 rotate-[-8deg] items-end justify-center rounded-[42%_42%_18%_18%] bg-gradient-to-br from-white via-accent-300 to-flame-400 shadow-[16px_25px_35px_rgba(5,12,95,.28)] after:absolute after:-top-8 after:h-14 after:w-14 after:rounded-full after:bg-gradient-to-r after:from-flame-400 after:to-accent-300 after:shadow-inner sm:h-48 sm:w-36"><span className="mb-6 text-[8px] font-bold tracking-[.16em] text-ink-500 sm:mb-8 sm:text-[10px]">FORME</span></div><div className="absolute bottom-5 left-3 rounded-xl border border-line bg-white/80 p-2 shadow-lg backdrop-blur sm:bottom-7 sm:left-5 sm:p-3"><span className="block text-[7px] font-semibold text-ink-500 sm:text-[8px]">CERAMIC VASE · 01</span><span className="mt-1 block text-[9px] font-bold text-ink-950 sm:text-[11px]">Sculpted vessel · $48</span></div></div>
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[7px] text-ink-400 sm:px-5 sm:py-3 sm:text-[8px]"><span>Free shipping over $75</span><span>Secure checkout · Easy returns</span><span>Designed with care</span></div>
        </div>
      </div>
    </TiltCard>
    <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 1, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-2 top-[16%] rounded-xl border border-white/10 bg-ink-950/95 p-2.5 text-white shadow-xl backdrop-blur sm:-left-9 sm:p-3.5"><span className="text-[8px] text-white/50">TODAY’S ORDERS</span><p className="mt-1 text-sm font-bold sm:text-lg">+ 24.8% <span className="text-accent-300">↗</span></p></motion.div>
    <motion.div animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [0, -1.5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: .4 }} className="absolute -right-1 bottom-[13%] rounded-xl border border-line bg-white p-2.5 shadow-xl sm:-right-5 sm:p-3"><span className="text-[8px] text-ink-400">CHECKOUT</span><p className="mt-1 text-[10px] font-bold text-ink-950 sm:text-xs">Payment secured <span className="text-accent-600">✓</span></p></motion.div>
  </div>
}

export function EcommerceSolutionsPage() {
  const reduceMotion = useReducedMotion()
  return <div className="overflow-hidden bg-paper text-ink-900">
    {/* Hero */}
    <section id="commerce-experience" className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <Reveal>
          <p className="eyebrow"><i className="h-1.5 w-1.5 rounded-full bg-flame-400" />E-commerce website solutions</p>
          <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
            Your next store should feel like <span className="text-gradient">your brand.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-400">A considered online storefront, built to make browsing feel effortless and buying feel simple. Bring your products, story and checkout together in one responsive shop.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/product/revampcommerce-lite/" className="btn btn-primary btn-md">Explore the store plan <span>↗</span></Link>
            <a href="#shopping-journey" className="btn btn-ghost-dark btn-md">See what’s included <span>↓</span></a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-400"><span>✳ Mobile-first design</span><span>✳ Secure payment flow</span><span>✳ Product-ready catalog</span></div>
        </Reveal>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <StoreMockup />
        </Reveal>
      </div>
    </section>

    {/* Shopping journey */}
    <section id="shopping-journey" className="section-light py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="A complete shopping journey"
          title={<span>Every detail helps customers move from <span className="text-accent-600">curious to checkout.</span></span>}
          sub="The storefront, product pages and purchase flow work together as one cohesive experience across phones, tablets and desktop."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'A storefront with character', 'Custom visual direction that brings your brand, products and point of view to life.'],
            ['02', 'Clear product discovery', 'Organized collections, product details and calls to action that make browsing easy.'],
            ['03', 'A smoother checkout', 'Integrated payment gateway flow designed to help customers complete their purchase.'],
            ['04', 'Ready for every screen', 'Responsive layouts and touch-friendly controls from the first visit to the final order.'],
          ].map(([number, title, body]) => (
            <StaggerItem key={number} className="card h-full p-5 sm:p-6">
              <span className="text-xs font-bold tracking-widest text-accent-600">{number} /</span>
              <h3 className="mt-4 text-lg font-bold text-ink-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-300">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>

    {/* Whole journey */}
    <section className="section-dark border-y border-line py-16 sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Built for the whole journey</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.1] text-ink-950 sm:text-4xl">A better shop is more than a beautiful homepage.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-400">Your ecommerce website brings the practical pieces together, with room for your catalog to grow and a clear path for customers to discover and purchase.</p>
          <ul className="mt-6 grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
            {['Custom storefront and inner pages', 'Product catalog structure', 'Payment gateway integration', 'Responsive layouts', 'Product-focused calls to action', 'Support for your launch'].map((item) => (
              <li key={item} className="flex items-start gap-2"><span className="mt-0.5 text-accent-600">✓</span>{item}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12} className="relative [perspective:1000px]">
          <div className={cn('rounded-[1.6rem] bg-ink-950 p-4 text-white shadow-card sm:rounded-[2rem] sm:p-7', !reduceMotion && 'transition-transform')}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><span className="text-[9px] font-bold uppercase tracking-[.18em] text-accent-300">Store overview</span><h3 className="mt-1 text-sm font-bold sm:text-base">Your business at a glance</h3></div>
              <span className="rounded-full bg-accent-400/10 px-3 py-1.5 text-[9px] text-accent-300">THIS MONTH</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[.06] p-4"><p className="text-[9px] text-white/45">Orders</p><p className="mt-1 text-2xl font-bold">1,248</p><p className="mt-1 text-[9px] text-accent-300">↑ 12.4% vs last month</p></div>
              <div className="rounded-xl bg-white/[.06] p-4"><p className="text-[9px] text-white/45">Conversion</p><p className="mt-1 text-2xl font-bold">3.8%</p><p className="mt-1 text-[9px] text-accent-300">↑ 0.6% vs last month</p></div>
            </div>
            <div className="mt-4 rounded-xl bg-white/[.06] p-4">
              <div className="flex items-center justify-between text-[9px] text-white/45"><span>Weekly store activity</span><span>Orders</span></div>
              <div className="mt-5 flex h-24 items-end gap-2">
                {[38, 55, 44, 72, 58, 84, 67, 94, 73, 100, 81, 90].map((height, i) => (
                  <motion.span key={i} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: .7, delay: i * .045 }} className="flex-1 rounded-t bg-gradient-to-t from-ink-800 to-accent-400" />
                ))}
              </div>
            </div>
          </div>
          <motion.span animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-5 -left-3 rounded-xl border border-line bg-white px-4 py-3 text-xs font-semibold text-ink-950 shadow-lg sm:-left-5">Easy product updates <span className="text-accent-600">✳</span></motion.span>
        </Reveal>
      </div>
    </section>

    {/* Plan banner */}
    <section className="section-light py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="overflow-hidden rounded-[1.75rem] bg-ink-950 text-white shadow-card sm:rounded-[2.25rem]">
          <div className="grid-noise grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="eyebrow !text-accent-300">RevampCommerce Lite</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.1] sm:text-4xl">Make space for your next chapter in commerce.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">A premium ecommerce-ready website plan with responsive design and payment gateway integration.</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold">₹24,499</span>
                <span className="text-sm text-white/40 line-through">₹60,999</span>
                <span className="rounded-full bg-accent-400/15 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-300">Save 60%</span>
              </div>
              <p className="mt-2 text-xs text-white/40">Hosting renewal ₹1,649/month after the included first year.</p>
            </div>
            <div className="px-6 pb-7 sm:px-10 lg:p-12">
              <Link to="/product/revampcommerce-lite/" className="btn btn-light btn-md whitespace-nowrap">View plan details <span>↗</span></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Final CTA */}
    <section className="section-deep border-t border-line py-12 sm:py-14">
      <div className="container-page flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <Reveal>
          <p className="eyebrow">Ready when you are</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-950 sm:text-3xl">Let’s build a shop your customers remember.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/contact-us/?interest=ecommerce#contact-form" className="btn btn-primary btn-md">Talk with our team ↗</Link>
        </Reveal>
      </div>
    </section>
  </div>
}
