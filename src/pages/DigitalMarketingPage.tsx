import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, SupportBlock, TiltCard } from '@/components/ui'
import { useCart } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

/* ------------------------------- source data ------------------------------ */

const SERVICES = [
  {
    title: 'AI-Assisted SEO & Search Insights',
    body: 'Use AI-assisted keyword research, search trend analysis, and content briefs to find opportunities faster. Our team reviews recommendations and shapes the strategy, technical fixes, and on-page improvements around your business.',
  },
  {
    title: 'AI-Assisted Social Media Management',
    body: 'Plan and manage Facebook, Instagram, and LinkedIn with AI-assisted content ideas, audience insights, and scheduling. Our team reviews every post and manages community engagement to keep your brand voice consistent.',
  },
  {
    title: 'AI-Aided Content Creation & Publishing',
    body: 'Create brand-aligned post concepts and captions with AI assistance, then refine them with our creative team before scheduling. Keep your social pages active with content tailored to your audience and campaign goals.',
  },
  {
    title: 'AI-Enhanced Lead Generation',
    body: 'Turn more of your traffic into qualified enquiries with better audience targeting, landing pages, and campaign insights. AI-assisted analysis helps identify promising segments while your team stays in control of qualification and follow-up.',
  },
  {
    title: 'AI-Assisted Ad Campaigns',
    body: 'Build and manage campaigns across Google and social platforms with AI-supported audience research, creative testing, and performance analysis. We use campaign data to guide human-reviewed optimizations and improve return on ad spend.',
  },
]

/** Twitter-intent share URLs — byte-identical to source. */
const WHY_CHOOSE = [
  {
    body: 'Our marketing team combines practical campaign experience with AI-assisted research and analysis, reviewing recommendations before they shape your strategy.',
    label: 'AI-Supported, Expert-Led Marketing:',
    share:
      'https://twitter.com/intent/tweet?text=Our%20team%20has%20years%20of%20experience%20delivering%20successful%20SEO%2C%20social%20accounts%2C%20and%20lead%20generation%20campaigns%20for%20businesses%20of%20all%20sizes.',
  },
  {
    body: 'We use audience and campaign insights to shape a marketing strategy around your goals, customers, and brand voice.',
    label: 'Strategies Built Around Your Audience:',
    share:
      'https://twitter.com/intent/tweet?text=We%20create%20personalized%20digital%20marketing%20strategies%20that%20align%20with%20your%20business%20goals%20and%20target%20audience.',
  },
  {
    body: 'Performance data and AI-assisted analysis help us spot patterns, test ideas, and make informed campaign improvements.',
    label: 'Insights That Guide Better Decisions:',
    share:
      'https://twitter.com/intent/tweet?text=Every%20decision%20we%20make%20is%20based%20on%20data%20analysis%20to%20ensure%20you%20get%20the%20best%20results.',
  },
  {
    body: 'From search and content to social media, lead generation, and ads, our team brings AI-assisted tools into a connected marketing workflow.',
    label: 'Connected AI Digital Marketing:',
    share:
      'https://twitter.com/intent/tweet?text=From%20designing%20engaging%20social%20account%20posts%20to%20executing%20lead-generating%20ad%20campaigns%2C%20we%20cover%20all%20your%20digital%20marketing%20needs.',
  },
]

type DmPlan = {
  productId: number
  name: string
  tagline: string
  save: string
  was: string
  priceDisplay: string
  price: number
  billedNote?: string
  extras?: string[]
  bullets: string[]
  details: string[]
}

const MONTHLY_PLANS: DmPlan[] = [
  {
    productId: 2773,
    name: 'Standard',
    tagline: 'For Small Businesses & Startups',
    save: 'Save 68%',
    was: '₹ 25000 /mo',
    priceDisplay: '₹ 7999 .00',
    price: 7999,
    bullets: [
      'SEO: Optimize 5 pages.',
      'Digital Community: Handle 2 accounts.',
      'Posts: 10/month.',
      'Lead Generation: Basic setup.',
      'Ads: 1 campaign.',
      'Customer Support Within 72 Hrs',
    ],
    details: [
      '**SEO:** Basic on-page optimization for up to 5 pages (keywords, meta tags, image ALT tags).',
      '**Digital Community:** Account handling of up to 2 social accounts (Facebook, Instagram).',
      '**Post Design and Posting:** 10 posts per month (customized designs for social account).',
      '**Lead Generation:** Basic lead generation setup (landing page optimization, call-to-action strategies).',
      '**Ads Campaign Design:** 1 campaign setup and monitoring (Google Ads or Digital Community Ads).',
    ],
  },
  {
    productId: 2774,
    name: 'Pro+',
    tagline: 'Ideal for Growing Businesses',
    save: 'Save 51%',
    was: '₹ 35000 /mo',
    priceDisplay: '₹ 16999 .00',
    price: 16999,
    bullets: [
      'SEO: Optimize 10 pages.',
      'Digital Community: Handle 4 accounts.',
      'Posts: 20/month.',
      'Lead Generation: Advanced setup.',
      'Ads: 3 campaigns.',
      'Priority Support',
    ],
    details: [
      '**SEO:** Comprehensive on-page and off-page SEO for up to 10 pages (keyword strategy, backlinking, local SEO).',
      '**Digital Community:** Account handling of up to 4 social accounts (Facebook, Instagram, LinkedIn, X). **Post Design and Posting:** 20 posts per month (customized for each platform with content strategy).',
      '**Lead Generation:** Advanced lead generation strategies (landing page creation, email marketing setup).',
      '**Ads Campaign Design:** 3 campaign setups (Google Ads and/or Digital Community Ads) with monthly optimization.',
    ],
  },
]

const YEARLY_PLANS: DmPlan[] = [
  {
    productId: 2775,
    name: 'Standard',
    tagline: 'For Small Businesses & Startups',
    save: 'Save 72%',
    was: '₹ 25000 /mo',
    priceDisplay: '₹ 6999 .00',
    price: 6999,
    billedNote: 'Billed Annually',
    extras: ['+ 2 month extra'],
    bullets: [
      'SEO: Optimize 5 pages.',
      'Digital Community: Handle 2 accounts.',
      'Posts: 10/month.',
      'Lead Generation: Basic setup.',
      'Ads: 1 campaign.',
      'Customer Support Within 72 Hrs',
    ],
    details: [
      '**SEO:** Basic on-page optimization for up to 5 pages (keywords, meta tags, image ALT tags).',
      '**Digital Community:** Handling of up to 2 social accounts (Facebook, Instagram).',
      '**Post Design and Posting:** 10 posts per month (customized designs for social account).',
      '**Lead Generation:** Basic lead generation setup (landing page optimization, call-to-action strategies).',
      '**Ads Campaign Design:** 1 campaign setup and monitoring (Google Ads or Digital Community Ads).',
    ],
  },
  {
    productId: 2776,
    name: 'Pro+',
    tagline: 'Ideal for Growing Businesses',
    save: 'Save 57.1%',
    was: '₹ 35000 /mo',
    priceDisplay: '₹ 14999 .00',
    price: 14999,
    billedNote: 'Billed Annually',
    extras: ['+ 2 month extra'],
    bullets: [
      'SEO: Optimize 10 pages.',
      'Digital Community: Handle 4 accounts.',
      'Posts: 20/month.',
      'Lead Generation: Advanced setup.',
      'Ads: 3 campaigns.',
      'Priority Support',
    ],
    details: [
      '**SEO:** Comprehensive on-page and off-page SEO for up to 10 pages (keyword strategy, backlinking, local SEO).',
      '**Social Channel:** Handling of up to 4 social accounts (Facebook, Instagram, LinkedIn, X). **Post Design and Posting:** 20 posts per month (customized for each platform with content strategy).',
      '**Lead Generation:** Advanced lead generation strategies (landing page creation, email marketing setup).',
      '**Ads Campaign Design:** 3 campaign setups (Google Ads and/or Digital Community Ads) with monthly optimization.',
    ],
  },
]

/* -------------------------------- helpers --------------------------------- */

function DetailText({ text }: { text: string }) {
  /* Minimal **bold:** support for detail lines. */
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-ink-950">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  )
}

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">AI Digital Marketing</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              AI Digital Marketing to{' '}
              <span className="text-gradient">Reach, Engage, and Convert</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300">
              AI-assisted SEO, content, audience insights, lead generation, and campaign optimization—guided by marketing experts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <a href="#dm" className="btn btn-ghost-dark btn-md">
                Pricing
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <TiltCard className="relative">
            <img
              src="/assets/2024-09-document-marketing-strategy-business-concept.png"
              alt="AI-assisted digital marketing strategy concept"
              className="w-full rounded-[2rem] border border-line object-cover shadow-card"
              width={2000}
              height={1093}
            />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}

function IntroSection() {
  return (
    <section className="section-dark border-y border-line py-14">
      <div className="container-page">
        <Reveal>
          <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">
            At MYR ADVANCE SOLUTION PVT. LTD.,
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink-300">
            we provide AI-assisted digital marketing designed to strengthen your online presence, generate
            qualified leads, and grow your business. Our team combines AI-supported research and analysis
            with human-reviewed SEO, social content, audience targeting, and ad campaigns. Every strategy
            is tailored to your goals, brand, and customers, with performance reviewed and refined over time.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function MobileMarketingTablet({ index }: { index: number }) {
  const reduceMotion = useReducedMotion()
  const service = SERVICES[index]
  const summaries = [
    { metric: 'Organic clicks', value: '+38%', detail: 'Keyword visibility is trending up', activity: ['Technical audit complete', 'New page indexed'] },
    { metric: 'Community reach', value: '24.8k', detail: 'Audience engagement is growing', activity: ['Comments replied to', 'New followers this week'] },
    { metric: 'Posts scheduled', value: '18', detail: 'Brand content ready to publish', activity: ['Carousel approved', 'Post scheduled'] },
    { metric: 'New leads', value: '286', detail: 'Lead quality improved this month', activity: ['Lead form received', 'Follow-up sequence active'] },
    { metric: 'Ad conversions', value: '318', detail: 'Campaign performance is on track', activity: ['New creative approved', 'Budget optimized'] },
  ][index]

  return (
    <div className="mx-auto w-full max-w-[520px] rounded-2xl border-[3px] border-slate-700 bg-slate-700 p-1 shadow-lg">
      <div className="relative aspect-[1.36/1] overflow-hidden rounded-[.9rem] bg-[#f3f5f8] p-[5%] text-[clamp(8px,2.4vw,12px)] text-slate-800">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={index} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: .3 }} className="absolute inset-0 flex flex-col p-[5%]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-[3%]"><span className="font-bold text-rose-700">MYR<span className="text-slate-800"> GROW</span><span className="ml-2 font-normal text-slate-400">/ Workspace</span></span><span className="rounded-full bg-emerald-100 px-2 py-1 text-[.7em] font-semibold text-emerald-700">Campaign active</span></div>
            <div className="mt-[4%]"><p className="text-[.75em] text-slate-400">Marketing service 0{index + 1}</p><h4 className="mt-1 truncate text-[1.25em] font-bold text-slate-900">{service.title}</h4></div>
            <div className="mt-[3%] grid flex-1 grid-cols-[1.1fr_.9fr] gap-[3%]">
              <div className="flex flex-col justify-between rounded-xl bg-white p-[5%] shadow-sm"><div><p className="text-[.75em] text-slate-400">{summaries.metric}</p><p className="mt-1 text-[1.6em] font-bold text-slate-900">{summaries.value}</p><p className="mt-1 text-[.72em] text-slate-500">{summaries.detail}</p></div><div className="flex h-[32%] items-end gap-[4%] border-b border-l border-slate-100 px-[3%]">{[36, 58, 45, 75, 63, 92, 78, 100].map((height, barIndex) => <span key={barIndex} className="flex-1 rounded-t-sm bg-rose-400" style={{ height: `${height}%`, opacity: .45 + barIndex * .07 }} />)}</div></div>
              <div className="rounded-xl bg-white p-[5%] shadow-sm"><p className="font-semibold text-slate-700">Latest activity</p><div className="mt-[8%] space-y-[10%]">{summaries.activity.map((item, activityIndex) => <p key={item} className="flex items-start gap-2 text-[.76em] leading-snug text-slate-500"><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${activityIndex ? 'bg-rose-300' : 'bg-emerald-500'}`} />{item}</p>)}</div></div>
            </div>
            <div className="mx-auto mt-[2%] h-1 w-[16%] rounded-full bg-slate-400/60" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-marketing-service]'))
    if (!items.length) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const center = window.innerHeight * 0.5
        let nearest = 0
        let distance = Number.POSITIVE_INFINITY
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect()
          const itemCenter = rect.top + rect.height / 2
          const currentDistance = Math.abs(itemCenter - center)
          if (currentDistance < distance) {
            distance = currentDistance
            nearest = index
          }
        })
        setActiveIndex((current) => current === nearest ? current : nearest)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const current = SERVICES[activeIndex]
  return (
    <section className="section-deep py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading title="AI Digital Marketing Services" />
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
          <div>
            {SERVICES.map((service, index) => (
              <article key={service.title} data-marketing-service={index} className="flex min-h-[30vh] items-center py-1.5 sm:min-h-[34vh]">
                <div className={`w-full rounded-[1.5rem] border p-5 transition duration-500 sm:p-6 ${activeIndex === index ? 'border-accent-400/55 bg-white shadow-xl shadow-accent-950/5' : 'border-line bg-white/70'}`}>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-accent-600">Service 0{index + 1} <span className="px-1 text-ink-300">/</span> 0{SERVICES.length}</p>
                  <h3 className="mt-3 text-xl font-bold text-ink-950 sm:text-2xl">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">{service.body.replace(/[“”]/g, '').trim()}</p>
                  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.45 }} className="mt-5 lg:hidden"><MobileMarketingTablet index={index} /></motion.div>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-400"><span className={`h-2 w-2 rounded-full ${activeIndex === index ? 'bg-accent-500' : 'bg-ink-300'}`} /> Scroll to explore</div>
                </div>
              </article>
            ))}
            <div className="py-8">
              <div className="rounded-[1.75rem] border border-accent-400/30 bg-gradient-to-br from-accent-400/12 to-transparent p-6 sm:p-8">
                <p className="text-lg font-bold text-ink-950">Ready to grow?</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">Talk to sales</a>
                  <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">Live Chat</a>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:sticky lg:top-[14vh] lg:flex lg:h-[72vh] lg:items-center">
            <div className="mx-auto w-full max-w-[680px] rounded-[1.5rem] border-[4px] border-slate-800 bg-slate-800 p-1 shadow-2xl shadow-slate-950/20 sm:rounded-[2rem] sm:border-[6px] sm:p-1.5">
              <div className="relative aspect-[1.36/1] overflow-hidden rounded-[1.1rem] bg-[#f4f6fa] sm:rounded-[1.6rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={activeIndex} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="absolute inset-0 flex flex-col p-[5%] text-[clamp(9px,1.2vw,15px)] text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-[3%]"><div><span className="font-bold tracking-tight text-indigo-700">MYR<span className="text-slate-800">GROW</span></span><span className="ml-3 text-slate-400">/ Marketing workspace</span></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-[.75em] font-semibold text-emerald-700">Campaign active</span></div>
                    <div className="mt-[4%] flex flex-1 gap-[4%] overflow-hidden">
                      <aside className="hidden w-[22%] shrink-0 space-y-3 rounded-xl bg-white p-[3%] shadow-sm sm:block">{['Overview', 'Campaigns', 'Audience', 'Reports'].map((label, i) => <div key={label} className={`rounded-lg px-2 py-1.5 text-[.78em] ${i === activeIndex % 4 ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-400'}`}>{label}</div>)}</aside>
                      <div className="flex min-w-0 flex-1 flex-col gap-[3%]">
                        <div><p className="text-[.75em] text-slate-400">Marketing overview</p><h3 className="mt-1 line-clamp-1 text-[1.35em] font-bold text-slate-900">{current.title}</h3></div>
                        <div className="grid grid-cols-3 gap-[3%]">{(activeIndex === 0 ? [['Organic clicks', '+38%'], ['Keywords', '124'], ['Visibility', '76%']] : activeIndex === 1 ? [['Reach', '24.8k'], ['Engagement', '8.6%'], ['Accounts', '4']] : activeIndex === 2 ? [['Posts ready', '18'], ['Scheduled', '12'], ['Engagement', '+32%']] : activeIndex === 3 ? [['New leads', '286'], ['Qualified', '74%'], ['Cost / lead', '₹42']] : [['Ad reach', '42.6k'], ['Conversions', '318'], ['ROAS', '4.8x']]).map(([label, value]) => <div key={label} className="rounded-xl bg-white p-[8%] shadow-sm"><p className="truncate text-[.7em] text-slate-400">{label}</p><p className="mt-1 text-[1.2em] font-bold text-slate-900">{value}</p><span className="text-[.65em] font-semibold text-emerald-600">↑ this month</span></div>)}</div>
                        <div className="grid min-h-0 flex-1 grid-cols-[1.4fr_1fr] gap-[3%]">
                          <div className="rounded-xl bg-white p-[4%] shadow-sm"><div className="flex justify-between"><span className="font-semibold text-slate-700">{activeIndex === 0 ? 'Search visibility' : activeIndex === 1 ? 'Community growth' : activeIndex === 2 ? 'Content performance' : activeIndex === 3 ? 'Lead conversion' : 'Campaign results'}</span><span className="text-[.7em] text-slate-400">Last 30 days</span></div><div className="mt-[4%] flex h-[68%] items-end gap-[3%] border-b border-l border-slate-100 px-[3%]">{[34, 47, 41, 61, 53, 74, 66, 88, 78, 96, 83, 100].map((height, i) => <span key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-500 to-violet-400" style={{ height: `${height}%`, opacity: .5 + i * .04 }} />)}</div></div>
                          <div className="overflow-hidden rounded-xl bg-white p-[4%] shadow-sm"><span className="font-semibold text-slate-700">Recent activity</span><div className="mt-[5%] space-y-[6%]">{(activeIndex === 0 ? ['Keyword rankings improved', 'Technical audit complete', 'New page indexed'] : activeIndex === 1 ? ['New comments replied', 'Audience grew by 12%', 'Inbox cleared'] : activeIndex === 2 ? ['June post published', 'Carousel scheduled', 'Brand kit applied'] : activeIndex === 3 ? ['Lead form submitted', '12 leads qualified', 'Landing page updated'] : ['Search ad optimized', 'Budget pacing on track', 'New creative approved']).map((item, i) => <div key={item} className="flex items-start gap-2 text-[.72em] text-slate-500"><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-indigo-400'}`} />{item}</div>)}</div></div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto mt-[2%] h-1 w-[16%] rounded-full bg-slate-400/60" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan }: { plan: DmPlan }) {
  const { add } = useCart()
  const price = useCatalogPrice(plan.productId, plan.price)
  const [openDetail, setOpenDetail] = useState(false)

  const buy = () => {
    add({ id: plan.productId, qty: 1, price, name: `AI Digital Marketing ${plan.name}` })
    window.location.assign('/checkout/')
  }

  return (
    <div className="card relative flex h-full flex-col p-6 sm:p-7">
      <span className="absolute -top-3 left-6 rounded-full bg-lime-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
        {plan.save}
      </span>
      <h3 className="text-lg font-bold text-ink-950">{plan.name}</h3>
      <p className="mt-1 text-sm text-ink-400">{plan.tagline}</p>
      <p className="mt-4 text-sm text-ink-400 line-through">{plan.was}</p>
      <p className="font-display text-4xl font-bold text-ink-950">₹ {price.toLocaleString('en-IN')} .00</p>
      {plan.billedNote && <p className="mt-1 text-xs font-semibold text-accent-600">{plan.billedNote}</p>}
      {plan.extras?.map((e) => (
        <p key={e} className="mt-0.5 text-xs italic text-ink-400">
          {e}
        </p>
      ))}
      <button type="button" onClick={buy} className="btn btn-primary btn-md mt-5 w-full">
        Buy Now
      </button>
      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {plan.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-sm text-ink-200">
            <span className="text-accent-600" aria-hidden>✓</span>
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setOpenDetail((v) => !v)}
          className="text-sm font-semibold text-accent-600 underline underline-offset-2"
          aria-expanded={openDetail}
        >
          {openDetail ? 'Close Detail' : 'See Detail'}
        </button>
        {openDetail && (
          <ul className="mt-3 space-y-2">
            {plan.details.map((d) => (
              <li key={d} className="flex gap-2.5 text-sm text-ink-300">
                <span className="text-accent-600" aria-hidden>•</span>
                <DetailText text={d} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function CustomPlanCard() {
  return (
    <div className="card flex h-full flex-col p-6 sm:p-7">
      <h3 className="text-lg font-bold text-ink-950">Custom Plan</h3>
      <p className="mt-1 text-sm text-ink-400">Tailored Solutions for Your Unique Needs</p>
      <div className="mt-5 flex flex-col gap-2">
        <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
          Talk to sales
        </a>
        <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
          Live Chat
        </a>
      </div>
      <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink-300">
        <li>
          Not seeing the right fit? We can create a custom plan based on your business goals. Whether
          it’s more social media focus, enhanced SEO, or a larger lead generation funnel, we’ll develop a
          strategy that works for you.
        </li>
        <li>
          Contact us for a personalized quote. We can tailor AI-assisted research, content workflows,
          campaign management, and expert review to your marketing goals.
        </li>
      </ul>
    </div>
  )
}

function PricingSection() {
  /* Monthly / Yearly toggle — both groups preserved exactly (flag §7.4). */
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const plans = billing === 'monthly' ? MONTHLY_PLANS : YEARLY_PLANS

  return (
    <section id="dm" className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="AI Digital Marketing Plans"
          title="Pick Your Perfect Plan"
          sub="Get started in complete confidence. Choose monthly or yearly billing."
        />
        <Reveal className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-line bg-ink-950/[0.04] p-1" role="tablist" aria-label="Billing period">
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                type="button"
                role="tab"
                aria-selected={billing === b}
                onClick={() => setBilling(b)}
                className={
                  billing === b
                    ? 'rounded-full bg-accent-400 px-6 py-2 text-sm font-semibold text-ink-950'
                    : 'rounded-full px-6 py-2 text-sm font-medium text-ink-300 transition hover:text-accent-600'
                }
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </Reveal>
        <Stagger key={billing} className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <StaggerItem key={`${billing}-${p.productId}`}>
              <PlanCard plan={p} />
            </StaggerItem>
          ))}
          <StaggerItem>
            <CustomPlanCard />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Why Choose us ?" /* sic spacing preserved */ />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
          {WHY_CHOOSE.map((w) => (
            <StaggerItem key={w.label} className="card h-full p-6">
              <p className="text-sm leading-relaxed text-ink-300">{w.body}</p>
              <a
                href={w.share}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-accent-600 underline underline-offset-2 hover:text-accent-600"
              >
                {w.label}
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function HelpSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SupportBlock
            bullets={[
              <>Access expert support whenever you need it via live chat and email</>,
              <>Our specialists are adept at handling diverse needs, so you can be sure communication and support will be seamless.</>,
              <>Spend less time waiting, our speedy support team typically responds in under 2 minutes</>,
            ]}
            ctaLabel="Still Have Questions ? Live Chat Now"
            image="/assets/2024-08-young-girl-white-shirt-headphones.png"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function DigitalMarketingPage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <PricingSection />
      <WhyChooseSection />
      <HelpSection />
    </>
  )
}
