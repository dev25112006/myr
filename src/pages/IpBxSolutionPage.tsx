import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, SupportBlock, TestimonialCard, type Story } from '@/components/ui'
import { useCart } from '@/lib/stores'
import { useNavigate } from 'react-router-dom'
import { useCatalogPrice } from '@/lib/useCatalogPrice'

/* ------------------------------- source data ------------------------------ */

const FEATURES = [
  {
    title: 'Unified Communication',
    body: '“All your communication channels – voice, video, messaging – work seamlessly in one place, ensuring smoother collaboration.”',
  },
  {
    title: 'Call Routing & Management',
    body: '“Intelligent call handling ensures that your customers get the right response, at the right time.”',
  },
  {
    title: 'Multi-site Deployment',
    body: '“Whether you’re managing one office or several, MYR LINK IP PBX keeps communication consistent across locations.”',
  },
  {
    title: 'VoIP Technology',
    body: '“Enjoy the cost-saving benefits of VoIP with crystal-clear calls over the internet.”',
  },
  {
    title: 'Advanced IVR',
    body: '“Provide your customers with a professional experience, directing them to the right department effortlessly.”',
  },
  {
    title: 'Scalable Solution',
    body: '“No matter the size of your business, MYR LINK IP PBX grows with you, making expansion simple.”',
  },
]

/** Spec pairs — description + exact source label (label appears after copy in source). */
const SPECS_A = [
  {
    body: 'Enjoy unlimited concurrent calls based on the number of users, ensuring smooth communication at all times.',
    label: 'Max Concurrent Calls:',
  },
  {
    body: 'With built-in call center functionalities, you can manage customer interactions efficiently and elevate your service levels.',
    label: 'Sophisticated Call Center Included:',
  },
]

const SPEC_LICENSE = {
  body: 'The IP PBX comes loaded with essential features like Instant Messaging, Phone Book, and CRM Integration, ensuring that your communication is not just seamless but also integrated with your business processes.',
  label: 'Functionalities License:',
}

const SPEC_VOICE_LOGGER = {
  body: ': Record incoming and outgoing calls, host bridge conferences, implement a multi-level IVR, and utilize a public address system – all from one comprehensive solution.',
  label: 'Voice Logger & Advanced Features',
}

const BENEFITS =
  'Not only does MYR LINK IP PBX reduce your communication costs, but it also enhances your business flexibility by allowing your team to work from anywhere. With built-in security features, you can trust that all your communications are private and secure. It’s the perfect solution for businesses with remote or hybrid workforces.'

const STORIES: Story[] = [
  {
    name: 'Ankit Verma',
    role: 'Operations Manager, Financial Services',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"The MYR LINK IP PBX system has transformed the way our team communicates. With unlimited concurrent calls and seamless CRM integration, we’ve significantly improved customer service and operational efficiency."',
  },
  {
    name: 'Ritika Sharma',
    role: 'IT Director, Education Sector',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"As a growing company, scalability is key for us, and MYR LINK IP PBX delivered exactly what we needed. The system’s flexibility to support up to 600 users is a game-changer for our expanding network of offices."',
  },
  {
    name: 'Sanjay Mishra',
    role: 'Customer Support Manager, Healthcare Industry',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"The built-in call center features and instant messaging have made internal and external communication so much smoother. We can now handle higher call volumes with ease and track all interactions efficiently."',
  },
  {
    name: 'Pooja Iyer',
    role: 'CTO, E-commerce Industry',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"MYR LINK IP PBX provided us with a cost-effective, future-proof solution. The voice logging and multi-level IVR features are exceptional for managing client calls and improving our overall workflow."',
  },
  {
    name: 'Nitin Arora',
    role: 'Head of Communications, Manufacturing Sector',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"We’ve implemented MYR LINK IP PBX across multiple locations, and the results have been outstanding. The ability to bridge conferences and the public address system integration has been crucial for our business communications."',
  },
  {
    name: 'Kavita Mehta',
    role: 'COO, Retail Industry',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"We needed a reliable system that could handle high call volumes and streamline customer interactions, and MYR LINK IP PBX delivered beyond expectations. The CRM integration and call management features have boosted productivity across the board."',
  },
]

/** Source verified: product id 3056, price ₹65,499 (Buy Now → /Checkout/?add-to-cart=3056). */
const PRODUCT_ID = 3056
const PRODUCT_PRICE = 65499

/* -------------------------------- helpers --------------------------------- */

function SpecList({ items, className }: { items: { body: string; label: string }[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((s) => (
        <li key={s.label} className="rounded-2xl border border-line bg-ink-950/[0.04] p-5">
          <p className="text-sm leading-relaxed text-ink-300">{s.body}</p>
          <p className="mt-2 text-sm font-bold text-accent-600">{s.label}</p>
        </li>
      ))}
    </ul>
  )
}

function useBuyNow() {
  const { add } = useCart()
  const navigate = useNavigate()
  const price = useCatalogPrice(PRODUCT_ID, PRODUCT_PRICE)
  return () => {
    add({ id: PRODUCT_ID, qty: 1, price, name: 'MYRLINK IP PBX IP100 V3' })
    navigate('/checkout/')
  }
}

/* --------------------------------- sections -------------------------------- */

function MobileIpbxTablet({ index }: { index: number }) {
  const reduceMotion = useReducedMotion()
  const feature = FEATURES[index]
  const panels = [
    { title: 'Team communications', metric: 'Connected channels', value: '03', items: ['Voice calls online', 'Video meeting room ready', 'Team messages synced'] },
    { title: 'Call queue monitor', metric: 'Calls answered', value: '97%', items: ['Sales queue · 4 agents', 'Support queue · 6 agents', 'Reception · 2 agents'] },
    { title: 'Office connections', metric: 'Locations online', value: '03', items: ['Lucknow · Main office', 'Dubai · Branch office', 'Dammam · Branch office'] },
    { title: 'VoIP call quality', metric: 'Call connection', value: 'HD', items: ['SIP trunk connected', 'Secure voice channel', 'Network status stable'] },
    { title: 'IVR call flow', metric: 'Menu levels', value: '03', items: ['Press 1 · Sales', 'Press 2 · Support', 'Press 0 · Reception'] },
    { title: 'Flexible capacity', metric: 'Expandable users', value: '600', items: ['100 users supported', 'Capacity upgrade ready', 'Add extensions as needed'] },
  ][index]
  return (
    <div className="mx-auto w-full max-w-[520px] rounded-2xl border-[3px] border-slate-700 bg-slate-700 p-1 shadow-lg">
      <div className="relative aspect-[1.36/1] overflow-hidden rounded-[.9rem] bg-[#f3f5f8] p-[5%] text-[clamp(8px,2.4vw,12px)] text-slate-800">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={index} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: .3 }} className="absolute inset-0 flex flex-col p-[5%]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-[3%]"><span className="font-bold text-rose-700">MYR<span className="text-slate-800"> LINK</span><span className="ml-2 font-normal text-slate-400">/ IP PBX</span></span><span className="rounded-full bg-emerald-100 px-2 py-1 text-[.7em] font-semibold text-emerald-700">● Online</span></div>
            <div className="mt-[4%]"><p className="text-[.75em] text-slate-400">Feature 0{index + 1}</p><h4 className="mt-1 truncate text-[1.25em] font-bold text-slate-900">{feature.title}</h4></div>
            <div className="mt-[3%] grid flex-1 grid-cols-[1fr_1fr] gap-[3%]">
              <div className="flex flex-col justify-between rounded-xl bg-white p-[5%] shadow-sm"><div><p className="text-[.75em] text-slate-400">{panels.metric}</p><p className="mt-1 text-[1.6em] font-bold text-slate-900">{panels.value}</p><p className="mt-1 text-[.72em] text-slate-500">{panels.title}</p></div><div className="mt-2 flex h-[32%] items-end gap-[4%] border-b border-l border-slate-100 px-[3%]">{[42, 63, 50, 78, 64, 93, 82, 100].map((height, barIndex) => <span key={barIndex} className="flex-1 rounded-t-sm bg-rose-400" style={{ height: `${height}%`, opacity: .45 + barIndex * .07 }} />)}</div></div>
              <div className="rounded-xl bg-white p-[5%] shadow-sm"><p className="font-semibold text-slate-700">Live system</p><div className="mt-[8%] space-y-[9%]">{panels.items.map((item, itemIndex) => <p key={item} className="flex items-start gap-2 text-[.76em] leading-snug text-slate-500"><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${itemIndex ? 'bg-rose-300' : 'bg-emerald-500'}`} />{item}</p>)}</div></div>
            </div>
            <div className="mx-auto mt-[2%] h-1 w-[16%] rounded-full bg-slate-400/60" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function HeroSection() {
  const buyNow = useBuyNow()
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">IPBX Solution</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Your All-in-One Telecommunication Solution:{' '}
              <span className="text-gradient">Scalable, Reliable, and Future-Ready</span>
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <button type="button" onClick={buyNow} className="btn btn-ghost-dark btn-md">
                Buy Now
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative grid grid-cols-2 items-center gap-4">
          <img
            src="/assets/2024-09-ip-pbx-1.png"
            alt="MYR LINK IP PBX system"
            width={396}
            height={360}
            className="w-full rounded-2xl border border-line bg-white object-contain p-3 shadow-card"
          />
          <img
            src="/assets/2024-09-MYR-LINK.png"
            alt="MYR LINK"
            width={300}
            height={300}
            className="w-full rounded-2xl border border-line bg-white object-contain p-3 shadow-card"
          />
        </Reveal>
      </div>
      <div className="container-page mt-10 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="text-base leading-relaxed text-ink-300 sm:text-lg">
            MYR LINK IP PBX is designed to take your business communication to the next level with
            unparalleled scalability and advanced features. This powerful system supports up to{' '}
            <strong className="text-ink-950">100 users</strong>, with the flexibility to scale up to{' '}
            <strong className="text-ink-950">600 users</strong>, ensuring that your telecommunication
            infrastructure grows with your business.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <a href="/product/myrlink-ip-pbx-ip100-v3/" className="block transition hover:-translate-y-1">
            <img
              src="/assets/2024-09-Best-Deal-on-IP-PBX-myrlink.png"
              alt="Best deal on IP PBX — MYRLINK"
              loading="lazy"
              width={851}
              height={315}
              className="w-full rounded-2xl border border-line object-cover"
            />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const features = Array.from(document.querySelectorAll<HTMLElement>('[data-ipbx-feature]'))
    if (!features.length) return
    let frame = 0
    const updateActiveFeature = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2
        let nearest = 0
        let nearestDistance = Number.POSITIVE_INFINITY
        features.forEach((feature, index) => {
          const rect = feature.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)
          if (distance < nearestDistance) {
            nearest = index
            nearestDistance = distance
          }
        })
        setActiveIndex((current) => current === nearest ? current : nearest)
      })
    }
    updateActiveFeature()
    window.addEventListener('scroll', updateActiveFeature, { passive: true })
    window.addEventListener('resize', updateActiveFeature)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveFeature)
      window.removeEventListener('resize', updateActiveFeature)
    }
  }, [])

  const dashboard = [
    { label: 'Channels ready', values: ['Voice · Video · Chat', 'Auto attendant on', 'Team presence on'], title: 'Unified communications', stats: [['Extensions', '100'], ['Channels', '3'], ['Availability', 'Online']], activity: ['Team presence synchronized', 'Video meeting room ready', 'Messages delivered'] },
    { label: 'Call routing', values: ['Sales queue · 4 agents', 'Support queue · 6 agents', 'Reception · 2 agents'], title: 'Live call management', stats: [['Calls today', '248'], ['In queue', '06'], ['Answered', '97%']], activity: ['Call routed to Sales', 'Support queue available', 'Missed call alert enabled'] },
    { label: 'Connected offices', values: ['Lucknow · Main office', 'Dubai · Branch office', 'Dammam · Branch office'], title: 'Multi-site network', stats: [['Locations', '03'], ['Extensions', '100'], ['Network', 'Secure']], activity: ['Main office connected', 'Branch sync complete', 'Shared directory updated'] },
    { label: 'VoIP service', values: ['SIP trunk connected', 'HD voice enabled', 'Secure connection'], title: 'Internet calling', stats: [['Call quality', 'HD'], ['SIP trunk', 'Active'], ['Uptime', '99.9%']], activity: ['SIP registration active', 'Voice quality stable', 'Secure call established'] },
    { label: 'IVR call flow', values: ['Press 1 · Sales', 'Press 2 · Support', 'Press 0 · Reception'], title: 'Smart call routing', stats: [['Menu levels', '03'], ['Wait time', '00:18'], ['Calls routed', '184']], activity: ['Welcome message played', 'Caller sent to Sales', 'After-hours rule ready'] },
    { label: 'Scale your team', values: ['Current capacity · 100 users', 'Upgrade capacity · up to 600', 'Add extensions as needed'], title: 'Built to grow', stats: [['Users', '100'], ['Capacity', '600'], ['Expansion', 'Ready']], activity: ['New extension available', 'License capacity monitored', 'System ready to scale'] },
  ][activeIndex]

  return (
    <section className="section-deep py-14 sm:py-18">
      <div className="container-page">
        <SectionHeading title="Key Features:" />
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <div>
            {FEATURES.map((feature, index) => (
              <article key={feature.title} data-ipbx-feature={index} className="flex min-h-[26vh] items-center py-1 sm:min-h-[30vh]">
                <div className={`w-full rounded-2xl border p-4 transition duration-300 sm:p-5 ${activeIndex === index ? 'border-accent-400/50 bg-white shadow-lg' : 'border-line bg-white/70'}`}>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-accent-600">Feature 0{index + 1} <span className="mx-1 text-ink-400">/</span> 0{FEATURES.length}</p>
                  <h3 className="mt-3 text-xl font-bold text-ink-950 sm:text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">{feature.body.replace(/[“”]/g, '').trim()}</p>
                  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.45 }} className="mt-5 lg:hidden"><MobileIpbxTablet index={index} /></motion.div>
                  <p className="mt-5 text-xs font-semibold text-ink-400">Scroll to explore</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:sticky lg:top-[14vh] lg:flex lg:h-[72vh] lg:items-center">
            <div className="mx-auto w-full max-w-[680px] rounded-[1.5rem] border-[4px] border-slate-800 bg-slate-800 p-1 shadow-2xl sm:rounded-[2rem] sm:border-[6px] sm:p-1.5">
              <div className="relative aspect-[1.36/1] overflow-hidden rounded-[1.1rem] bg-[#f3f5f8] sm:rounded-[1.6rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={activeIndex} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .32, ease: 'easeOut' }} className="absolute inset-0 flex flex-col p-[5%] text-[clamp(9px,1.2vw,15px)] text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-[3%]"><div><span className="font-bold tracking-tight text-rose-700">MYR<span className="text-slate-800"> LINK</span></span><span className="ml-3 text-slate-400">/ Business phone system</span></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-[.75em] font-semibold text-emerald-700">● System online</span></div>
                    <div className="mt-[4%] flex min-h-0 flex-1 gap-[4%] overflow-hidden">
                      <aside className="hidden w-[22%] shrink-0 space-y-3 rounded-xl bg-white p-[3%] shadow-sm sm:block">{['Overview', 'Call flows', 'Extensions', 'Reports'].map((item, index) => <div key={item} className={`rounded-lg px-2 py-1.5 text-[.78em] ${index === activeIndex % 4 ? 'bg-rose-50 font-semibold text-rose-700' : 'text-slate-400'}`}>{item}</div>)}</aside>
                      <div className="flex min-w-0 flex-1 flex-col gap-[3%]">
                        <div><p className="text-[.75em] text-slate-400">MYRLINK control panel</p><h3 className="mt-1 truncate text-[1.35em] font-bold text-slate-900">{dashboard.title}</h3></div>
                        <div className="grid grid-cols-3 gap-[3%]">{dashboard.stats.map(([label, value]) => <div key={label} className="rounded-xl bg-white p-[8%] shadow-sm"><p className="truncate text-[.7em] text-slate-400">{label}</p><p className="mt-1 text-[1.15em] font-bold text-slate-900">{value}</p><span className="text-[.65em] font-semibold text-emerald-600">● Active</span></div>)}</div>
                        <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_1fr] gap-[3%]">
                          <div className="rounded-xl bg-white p-[4%] shadow-sm"><div className="flex items-center justify-between"><span className="font-semibold text-slate-700">{dashboard.label}</span><span className="text-[.7em] text-slate-400">Live</span></div><div className="mt-[4%] space-y-[4%]">{dashboard.values.map((value, index) => <div key={value} className="flex items-center gap-2 rounded-lg bg-slate-50 px-[4%] py-[3%] text-[.78em] text-slate-600"><span className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-rose-400'}`} />{value}</div>)}</div></div>
                          <div className="overflow-hidden rounded-xl bg-white p-[4%] shadow-sm"><span className="font-semibold text-slate-700">Recent activity</span><div className="mt-[5%] space-y-[7%]">{dashboard.activity.map((item, index) => <div key={item} className="flex items-start gap-2 text-[.72em] text-slate-500"><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-rose-400'}`} />{item}</div>)}</div></div>
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

function PricingSection() {
  const buyNow = useBuyNow()
  const price = useCatalogPrice(PRODUCT_ID, PRODUCT_PRICE)
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="card p-6 sm:p-8">
          <p className="eyebrow">MYRLINK IP PBX IP100 V3</p>
          <h3 className="mt-3 font-display text-4xl font-bold text-ink-950">₹ {price.toLocaleString('en-IN')} .00</h3>
          <button type="button" onClick={buyNow} className="btn btn-primary btn-md mt-5 w-full">
            BUY NOW
          </button>
          <p className="mt-4 text-xs text-ink-400">
            Source Buy Now → <code>/Checkout/?add-to-cart=3056</code> — adds to demo cart.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <SpecList items={[...SPECS_A, SPEC_LICENSE, SPEC_VOICE_LOGGER]} className="grid gap-4" />
        </Reveal>
      </div>
    </section>
  )
}

function NotOnlySection() {
  const buyNow = useBuyNow()
  const price = useCatalogPrice(PRODUCT_ID, PRODUCT_PRICE)
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Not only IP PBX (Private Branch Exchange)" />
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <img
              src="/assets/2024-09-ip-pbx-1.png"
              alt="IP PBX system"
              loading="lazy"
              width={300}
              height={251}
              className="mx-auto w-64 rounded-2xl border border-line bg-white object-contain p-3"
            />
            <SpecList items={SPECS_A} className="mt-6 grid gap-4" />
          </Reveal>
          <Reveal delay={0.1} className="card p-6 sm:p-8">
            {/* FLAG §7.14: three different price strings for the same product on one page (source). */}
            <p className="text-sm text-ink-400 line-through">₹ 95,499 .00</p>
            <h3 className="mt-1 font-display text-4xl font-bold text-ink-950">₹ {price.toLocaleString('en-IN')}.00 .00</h3>
            <p className="mt-1 text-xs text-flame-600">
              Price string preserved exactly as source (malformed — flagged §7.14).
            </p>
            <button type="button" onClick={buyNow} className="btn btn-primary btn-md mt-5 w-full">
              BUY NOW
            </button>
            <div className="mt-6 grid gap-4">
              <SpecList items={[SPEC_LICENSE, SPEC_VOICE_LOGGER]} className="grid gap-4" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Benefits" />
        <Reveal className="mx-auto mt-10 max-w-4xl">
          <blockquote className="rounded-[1.75rem] border border-line bg-ink-950/[0.04] p-6 text-base leading-relaxed text-ink-300 sm:p-8 sm:text-lg">
            {BENEFITS}
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Our Success Stories Speak for Themselves" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {STORIES.map((s) => (
            <TestimonialCard key={s.name} story={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SupportSection() {
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
            image="/assets/2024-09-male-network-support-e1726830127733.png"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function IpBxSolutionPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <NotOnlySection />
      <BenefitsSection />
      <StoriesSection />
      <SupportSection />
    </>
  )
}
