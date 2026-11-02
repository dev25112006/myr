import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CHAT_SUPPORT, CHAT_SALES } from '@/components/layout/nav'
import { Reveal, SectionHeading, Stagger, StaggerItem, StatCounters, SupportBlock, TestimonialCard, type Story, type Stat } from '@/components/ui'
import { LEAD_FORM_4500 } from '@/content/leadForms'
import { SmartForm } from '@/components/forms/SmartForm'

/* ------------------------------- source data ------------------------------ */

const FEATURES = [
  {
    icon: '📹',
    title: 'High-Definition Surveillance',
    body: 'Capture every detail with crystal-clear HD and 4K cameras. From entrances to storage rooms, see what matters with night vision and wide-angle coverage that never sleeps.',
  },
  {
    icon: '🧠',
    title: 'AI Video Analytics',
    body: 'Smart detection goes beyond motion alerts — identify faces, read licence plates, detect intrusion zones and get instant notifications for unusual activity.',
  },
  {
    icon: '☁️',
    title: 'Cloud & Remote Access',
    body: 'Watch your premises from anywhere in the world. Stream live feeds, review recordings and manage multiple sites from one dashboard on any device.',
  },
  {
    icon: '🔗',
    title: 'Seamless Integration',
    body: 'Connect cameras with access control, alarms, billing systems and your existing IT network — a unified security layer for your entire operation.',
  },
  {
    icon: '🗄️',
    title: 'Smart Storage & Playback',
    body: 'Efficient compression keeps months of footage without exhausting storage. Intelligent playback finds the exact moment you need in seconds.',
  },
  {
    icon: '🛡️',
    title: 'Enterprise-Grade Security',
    body: 'Encrypted streams, role-based access and tamper alerts keep your surveillance data private and your system resilient against threats.',
  },
]

const USE_CASES = [
  { title: 'Retail Stores', body: 'Prevent shrinkage, monitor footfall and keep staff and customers safe across every outlet.' },
  { title: 'Offices & Corporates', body: 'Control access zones, monitor common areas and integrate with your visitor management system.' },
  { title: 'Schools & Campuses', body: 'Protect students with perimeter coverage, corridor monitoring and instant alert workflows.' },
  { title: 'Warehouses & Industry', body: 'Track inventory movement, secure loading bays and deter theft around the clock.' },
  { title: 'Hospitals & Clinics', body: 'Safeguard sensitive areas, monitor pharmacies and ensure patient safety at every corner.' },
  { title: 'Residential Societies', body: 'Gate monitoring, parking surveillance and community-wide visibility for every resident.' },
]

const STATS: Stat[] = [
  { label: 'Installations Delivered', value: 500, suffix: '+' },
  { label: 'Cameras Managed', value: 12000, suffix: '+' },
  { label: 'Uptime Guaranteed', value: 99.9, suffix: '%', decimals: 1 },
  { label: 'Support Response', value: 2, suffix: ' min' },
]

const STEPS = [
  { n: '01', title: 'Site Assessment', body: 'We survey your premises, identify risk points and design a camera layout that covers every critical angle.' },
  { n: '02', title: 'System Design', body: 'Choose the right cameras, storage and analytics — a tailored bill of materials with transparent pricing.' },
  { n: '03', title: 'Professional Install', body: 'Certified technicians mount, wire and configure everything with minimal disruption to your operations.' },
  { n: '04', title: 'Train & Handover', body: 'Your team learns to drive the dashboard, set alerts and pull recordings — then we go live.' },
  { n: '05', title: '24/7 Support', body: 'Proactive monitoring, remote diagnostics and on-site service keep your security running non-stop.' },
]

const STORIES: Story[] = [
  {
    name: 'Rahul Malhotra',
    role: 'Retail Chain Owner',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"MYR installed CCTV across all 8 of our showrooms. The AI alerts have reduced theft to nearly zero, and I can check any store from my phone while travelling."',
  },
  {
    name: 'Sunita Rao',
    role: 'School Principal',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"Parents trust us more since the camera rollout. The team was professional, finished ahead of schedule and trained our staff thoroughly."',
  },
  {
    name: 'Amit Khanna',
    role: 'Operations Head, Logistics',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"Warehouse surveillance used to be a headache with blurry footage. MYR gave us 4K coverage with cloud playback — finding an incident takes seconds now."',
  },
]

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">CCTV Solution & Installation</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              See Everything. Miss Nothing.{' '}
              <span className="text-gradient">Intelligent Security for Modern Business</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              End-to-end CCTV design, installation and monitoring — HD cameras, AI analytics and cloud
              access, backed by 24/7 support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SALES} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Get a Free Quote
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <Link to="/contact-us/" className="btn btn-ghost-dark btn-md">
                Book a Site Visit
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-card"
          >
            {/* Animated CCTV monitor mock */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="text-sm font-bold text-ink-950">MYR <span className="text-flame-600">SecureView</span></span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">● 6 cameras live</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              {['Gate', 'Lobby', 'Parking', 'Warehouse', 'Roof', 'Exit'].map((zone, i) => (
                <motion.div
                  key={zone}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-ink-950 to-ink-800 p-2"
                >
                  <span className="absolute left-1.5 top-1.5 text-[7px] font-bold uppercase tracking-wider text-white/70">{zone}</span>
                  <motion.span
                    className="absolute inset-x-0 top-1/2 h-px bg-flame-400/70"
                    initial={reduceMotion ? false : { y: -24, opacity: 0 }}
                    animate={reduceMotion ? {} : { y: [ -24, 24, -24 ], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                  />
                  <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 text-[7px] font-semibold text-red-400">
                    <motion.i
                      className="h-1.5 w-1.5 rounded-full bg-red-500"
                      animate={reduceMotion ? {} : { opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    REC
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[10px] text-ink-400">
              <span>AI analytics active · Motion + Face detect</span>
              <span className="font-bold text-emerald-600">99.9% uptime</span>
            </div>
          </motion.div>
        </Reveal>
      </div>
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

function FeaturesSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Everything you need to protect what matters" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-flame-500/10 text-2xl transition group-hover:bg-flame-500/20" aria-hidden>
                {f.icon}
              </span>
              <h3 className="text-lg font-bold text-ink-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{f.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="How we deliver" sub="From first survey to 24/7 monitoring — a proven five-step rollout." />
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block" aria-hidden />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <StaggerItem key={s.n} className="relative">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-line bg-white text-sm font-bold text-flame-600 shadow-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Built for every environment" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <StaggerItem key={u.title} className="rounded-2xl border border-line bg-white p-6 transition hover:border-flame-400/50 hover:shadow-lg">
              <h3 className="text-base font-bold text-ink-950">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{u.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
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

function EnquirySection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Request a quote</p>
          <h2 className="mt-3 text-2xl font-bold text-ink-950 sm:text-3xl">
            Tell us about your site — we'll design the right camera plan.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">
            Share your premises type, number of entry points and any specific concerns. Our security
            specialists respond within one business day with a tailored recommendation and transparent
            pricing.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-500">
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Free site assessment & camera layout</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> No-obligation transparent quotation</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Professional installation & training</li>
            <li className="flex gap-3"><span className="text-flame-600">✓</span> Ongoing maintenance & 24/7 support</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
            <SmartForm config={LEAD_FORM_4500} light />
          </div>
        </Reveal>
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

export function CctvSolutionPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <UseCasesSection />
      <StoriesSection />
      <EnquirySection />
      <SupportSection />
    </>
  )
}
