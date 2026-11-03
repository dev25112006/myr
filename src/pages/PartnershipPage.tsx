import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, StatCounters, type Stat } from '@/components/ui'
import { usePopup } from '@/lib/stores'

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

const WHITE_LABEL_PRODUCTS = [
  { icon: '🏫', title: 'White Label School ERP', body: 'Admissions, attendance, exams, fees and campus operations — branded as yours.' },
  { icon: '🎓', title: 'White Label College ERP', body: 'Departments, semesters, placements and institutional oversight under your brand.' },
  { icon: '📚', title: 'White Label Coaching ERP', body: 'Enquiries, batches, test series and fee follow-ups for coaching institutes.' },
  { icon: '🤝', title: 'White Label CRM', body: 'Pipeline management, lead tracking and sales automation — your logo, your pricing.' },
  { icon: '👥', title: 'White Label HRM', body: 'Onboarding, attendance, payroll and performance management for any workforce.' },
  { icon: '🛒', title: 'White Label E-commerce', body: 'Full online stores with catalogue, cart, checkout and payment gateway.' },
  { icon: '🧾', title: 'White Label Billing Software', body: 'GST billing, invoicing, stock and reports for retail and restaurants.' },
  { icon: '🌐', title: 'White Label Website Development', body: 'Responsive, SEO-ready websites delivered under your agency brand.' },
  { icon: '📣', title: 'White Label Digital Marketing', body: 'SEO, social and paid campaigns your clients will thank you for.' },
]

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const reduceMotion = useReducedMotion()
  const { setOpen } = usePopup()
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
            <button type="button" onClick={() => setOpen('partner')} className="btn btn-primary btn-md">
              Become a Partner
            </button>
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

function WhiteLabelSection() {
  const { setOpen } = usePopup()
  return (
    <section id="white-label" className="section-deep scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Get a White Label solution under your own brand"
          sub="Pick any product below — we deliver it fully white-labelled with your logo, your domain and your pricing."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHITE_LABEL_PRODUCTS.map((p) => (
            <StaggerItem key={p.title} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-flame-500/10 text-2xl transition group-hover:bg-flame-500/20" aria-hidden>
                  {p.icon}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-950">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">{p.body}</p>
              <button type="button" onClick={() => setOpen('partner')} className="mt-4 self-start text-xs font-bold text-flame-600 group-hover:underline">
                Request partner details →
              </button>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 rounded-2xl border border-flame-500/25 bg-gradient-to-br from-flame-500/10 to-transparent p-6 text-center">
          <p className="text-sm leading-relaxed text-ink-500">
            Need a custom bundle or partner quote? Tell us what you’re looking for and our team will follow up.
          </p>
          <button type="button" onClick={() => setOpen('partner')} className="btn btn-primary btn-md mt-4">Request a partner quote</button>
        </Reveal>
      </div>
    </section>
  )
}

function ContactSection() {
  const { setOpen } = usePopup()
  return (
    <section id="partner-contact" className="section-dark scroll-mt-20 border-t border-line py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Contact our partnership team</p>
          <h2 className="mt-3 text-2xl font-bold text-ink-950 sm:text-3xl">
            Tell us which segments you want to sell
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
            Fill in the form and select the white-label products you are interested in — School ERP,
            College ERP, Coaching ERP, CRM, HRM and more. Our team responds within one business day
            with margin details and onboarding steps.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-500">
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Protected partner margins</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Full white-label branding — your logo, your domain</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Sales enablement & marketing collateral</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Dedicated technical & onboarding support</li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
              Chat on WhatsApp ↗
            </a>
            <button type="button" onClick={() => setOpen('partner')} className="btn btn-ghost-dark btn-md">Fill partnership form</button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex min-h-64 flex-col justify-center rounded-3xl border border-line bg-paper p-6 shadow-card sm:p-8">
            <p className="eyebrow">Partner inquiry</p>
            <h3 className="mt-2 text-xl font-bold text-ink-950">Let’s shape the right partnership for your business.</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">Share your details and the products you’re interested in. Our partnership team will follow up with tailored terms.</p>
            <button type="button" onClick={() => setOpen('partner')} className="btn btn-primary btn-md mt-5 self-start">Open partnership form</button>
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
      <WhiteLabelSection />
      <WhySection />
      <ContactSection />
    </>
  )
}
