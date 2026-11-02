import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, StatCounters, type Stat } from '@/components/ui'

/* ------------------------------- source data ------------------------------ */

type PartnershipType = 'white-label' | 'reseller' | 'distributor'

const typeOptions: { label: string; value: PartnershipType; icon: string; blurb: string }[] = [
  { label: 'White Label Partnership', value: 'white-label', icon: '🏷️', blurb: 'Sell our solutions under your own brand — full creative and pricing control.' },
  { label: 'Reseller Partnership', value: 'reseller', icon: '🤝', blurb: 'Authorised reseller with protected margins and sales enablement.' },
  { label: 'Distribution Partnership', value: 'distributor', icon: '🌍', blurb: 'Territory distribution with volume pricing and market leadership.' },
]

type Step = { title: string; content: string; thought: string }

const journey: Record<PartnershipType, Step[]> = {
  'white-label': [
    { title: 'Partner Discovery', content: 'We identify businesses that align with our vision and values.', thought: '💡 Choose partners who share your commitment.' },
    { title: 'White Label Discussion', content: 'Define the brand positioning and pricing structure.', thought: '🚀 White labeling lets you offer premium software under your own brand.' },
    { title: 'Partnership Agreement', content: 'Formalize the partnership agreement covering revenue sharing and terms.', thought: '📝 A well-structured agreement protects both partners.' },
    { title: 'Launch & Scale', content: 'Launch your white-labeled solution and monitor performance.', thought: '📈 The sky is the limit when you have the right partner.' },
  ],
  reseller: [
    { title: 'Partner Discovery', content: 'We identify businesses that align with our vision and values.', thought: '💡 Choose partners who share your commitment.' },
    { title: 'Reseller Agreement', content: 'Establish the reseller partnership terms.', thought: '🚀 Becoming an authorised reseller gives you access to proven products.' },
    { title: 'Sales & Support', content: 'Start selling MYR solutions to your customers.', thought: '🛒 Every sale is a step toward financial independence.' },
    { title: 'Scale Your Business', content: 'Expand your reseller portfolio by onboarding more customers.', thought: '📈 Scale your business by serving more customers.' },
  ],
  distributor: [
    { title: 'Partner Discovery', content: 'We identify businesses that align with our vision and values.', thought: '💡 Choose partners who share your commitment.' },
    { title: 'Distribution Agreement', content: 'Establish the distribution partnership defining territories.', thought: '🚀 Distribution partnerships offer the broadest market reach.' },
    { title: 'Orders & Fulfillment', content: 'Receive customer orders and manage delivery or implementation.', thought: '🛒 Distribution is about volume and reach.' },
    { title: 'Market Leadership', content: 'Establish your region as the go-to destination for MYR solutions.', thought: '🏆 Market leadership is within reach — earnings scale with your dominance.' },
  ],
}

const STATS: Stat[] = [
  { label: 'Active Partners', value: 120, suffix: '+' },
  { label: 'Partner Earnings Paid', value: 2.5, suffix: ' Cr+', decimals: 1 },
  { label: 'Cities Covered', value: 45, suffix: '+' },
  { label: 'Support Response', value: 2, suffix: ' min' },
]

const WHY_PARTNER = [
  { icon: '🏆', title: 'Established Brand', body: 'Leverage the MYR Advance Solution reputation and proven track record in the IT industry.' },
  { icon: '⚙️', title: 'High-Quality Products', body: 'Our software solutions are built with cutting-edge technology and rigorously tested for reliability.' },
  { icon: '💰', title: 'Competitive Earnings', body: 'Lucrative commission structures and revenue sharing models that reward your success.' },
  { icon: '📣', title: 'Marketing Support', body: 'Get co-branded marketing materials, sales collateral, and campaign support to help you succeed.' },
  { icon: '🧪', title: 'Technical Excellence', body: 'Our team provides technical support, training, and ongoing assistance to ensure your success.' },
  { icon: '🚀', title: 'Fast Onboarding', body: 'Get certified and revenue-ready in days, not months — with guided enablement at every step.' },
]

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-flame-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page relative z-10 text-center">
        <Reveal>
          <p className="eyebrow">Partner with Us</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
            Grow With MYR — <span className="text-gradient">Build a Thriving Partnership Business</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Join our growing partner network and build a thriving business while helping organizations
            transform their operations with our innovative software solutions.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
              Become a Partner
            </a>
            <a href="#journey" className="btn btn-ghost-dark btn-md">
              See the Journey ↓
            </a>
          </div>
        </Reveal>
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, rgb(245 248 247), transparent)' }}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </section>
  )
}

function StatsSection() {
  return (
    <section className="section-dark border-y border-line py-12">
      <div className="container-page">
        <StatCounters stats={STATS} tone="light" />
      </div>
    </section>
  )
}

function JourneySection() {
  const [activeType, setActiveType] = useState<PartnershipType>('white-label')
  const reduceMotion = useReducedMotion()
  const steps = journey[activeType]

  return (
    <section id="journey" className="section-deep scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Choose your partnership type" sub="Three ways to work with us — pick one to see the step-by-step journey." />

        {/* Type selector cards */}
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
          {typeOptions.map((opt) => {
            const active = activeType === opt.value
            return (
              <StaggerItem key={opt.value}>
                <button
                  type="button"
                  onClick={() => setActiveType(opt.value)}
                  aria-pressed={active}
                  className={`h-full w-full rounded-2xl border p-5 text-left transition duration-300 ${
                    active
                      ? 'border-flame-500 bg-white shadow-xl shadow-flame-500/10'
                      : 'border-line bg-white/70 hover:border-flame-400/50 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl" aria-hidden>{opt.icon}</span>
                  <h3 className={`mt-3 font-bold ${active ? 'text-flame-600' : 'text-ink-950'}`}>{opt.label}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{opt.blurb}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${active ? 'text-flame-600' : 'text-ink-400'}`}>
                    {active ? 'Selected' : 'Choose this'} →
                  </span>
                </button>
              </StaggerItem>
            )
          })}
        </Stagger>

        {/* Animated journey steps */}
        <div id="partnership-journey" className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={activeType}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-flame-500/10 text-sm font-bold text-flame-600">
                    {i + 1}
                  </span>
                  <h4 className="mt-4 font-bold text-ink-950">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.content}</p>
                  <p className="mt-4 border-t border-line pt-3 text-xs font-medium leading-relaxed text-flame-600">
                    {step.thought}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Why Partner with Us?" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_PARTNER.map((w) => (
            <StaggerItem key={w.title} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-flame-500/10 text-2xl transition group-hover:bg-flame-500/20" aria-hidden>
                {w.icon}
              </span>
              <h3 className="text-base font-bold text-ink-950">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{w.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-flame-500/25 bg-gradient-to-br from-flame-500/10 via-white to-accent-400/10 p-8 text-center sm:p-12">
          <p className="eyebrow">Ready when you are</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-ink-950 sm:text-3xl">
            Start the partnership conversation today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
            Tell us about your business and the partnership model you prefer — our team will get back
            with a tailored proposal.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/contact-us/?interest=partnership#contact-form" className="btn btn-primary btn-md">
              Start Partnership Conversation
            </Link>
            <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
              Talk to sales ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function PartnershipPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <JourneySection />
      <WhySection />
      <CtaSection />
    </>
  )
}
