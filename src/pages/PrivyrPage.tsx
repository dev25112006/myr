import { usePopup } from '@/lib/stores'
import { Reveal, SectionHeading, Stagger, StaggerItem, CountUp, TestimonialCard, type Story } from '@/components/ui'
import type { ReactNode } from 'react'

/* ------------------------------- source data ------------------------------ */

const AUDIENCES: { title: string; icon: ReactNode }[] = [
  {
    title: 'Real Estate Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V21H3z" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    title: 'Financial Advisors',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Trainers & Coaches',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Marketing Agencies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M3 10v4h4l7 4V6l-7 4H3zM18 9a4 4 0 0 1 0 6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Direct Sales Agents',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M16 7h5m-2.5-2.5v5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Wedding Planners',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
        <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const LEAD_SOURCES = [
  { name: 'WhatsApp', img: '/assets/2024-12-WhatsApp-1.jpg' },
  { name: 'Facebook', img: '/assets/2024-12-Facebook.jpg' },
  { name: 'TikTok', img: '/assets/2024-12-TikTok.jpg' },
  { name: 'Phone Call', img: '/assets/2024-12-PhoneCall.jpg' },
  { name: 'LinkedIn', img: '/assets/2024-12-Linkedin.jpg' },
  { name: 'ClickFunnels', img: '/assets/2024-12-ClickFunnels.jpg' },
  { name: 'Google', img: '/assets/2024-12-Google.jpg' },
  { name: 'Gmail', img: '/assets/2024-12-Gmail.jpg' },
  { name: 'SMS', img: '/assets/2024-12-SMS.jpg' },
  { name: 'Wordpress', img: '/assets/2024-12-Wordpress.jpg' },
  { name: 'Jotform', img: '/assets/2024-12-Jotform.jpg' },
  { name: 'iMessage', img: '/assets/2024-12-iMessage.jpg' },
]

const FEATURES = [
  // High-resolution Pexels photos (free use): Monstera Production, Kampus Production,
  // and Ivan S. Source pages: pexels.com/photo/woman-using-phone-9488833,
  // pexels.com/photo/a-woman-using-smartphone-8171169,
  // pexels.com/photo/colleagues-working-together-on-a-project-5428994.
  {
    title: 'Instant New Lead Alerts',
    body: 'Receive your leads instantly through the Privyr app and email. Access contact details, personalized responses, and ad campaign insights with just a tap.',
    closer: 'No more hassle of downloading CSV files just to track your leads.',
    image: '/assets/privyr-lead-alerts.jpg',
  },
  {
    title: 'Contact Your Leads in Seconds',
    body: 'Effortlessly send auto-personalized introductions through WhatsApp, SMS, or email using the one-touch QUICK RESPONSE feature—no typing, copying, pasting, or saving contacts required.',
    closer: 'Keeping up with your leads has never been simpler.',
    image: '/assets/privyr-quick-contact.jpg',
  },
  {
    title: 'Distribute Leads to Your Clients and Teammates',
    body: 'Easily share leads via email, even with those who don’t use Privyr. Add multiple recipients for each lead source and decide whether to forward leads to all or assign them evenly using a round-robin method.',
    closer: 'Leads are delivered instantly to everyone, with no manual forwarding required.',
    image: '/assets/privyr-team-distribution.jpg',
  },
  {
    title: 'Manage Leads from your Phone',
    body: 'Effortlessly manage new leads and existing clients with notes, follow-up reminders, client timelines, trackable files and pages, bulk sending, and more. With Privyr’s lightweight mobile CRM, your relationships are always just a tap away.',
    closer: 'Never miss a lead again.',
    image: '/assets/privyr-crm-phone.svg',
  },
]

const STORIES: Story[] = [
  {
    name: 'Emily Davis',
    role: 'Sales Manager',
    image: '/assets/2024-08-female-icon.jpg',
    quote:
      '"This CRM has been a lifesaver for managing both new and existing clients. The ability to track leads and set reminders has significantly improved our team\'s efficiency. We\'ve definitely seen a boost in sales and productivity."',
  },
  {
    name: 'Vikram Singh',
    role: 'Entrepreneur',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"I’ve tried several CRMs, but none compare to this one. It’s easy to use, integrates effortlessly with all my lead sources, and saves me so much time. The auto-personalized responses and follow-up reminders are key to staying on top of leads!"',
  },
  {
    name: 'David Johnson',
    role: 'Digital Marketing Specialist',
    image: '/assets/2024-08-male-icon.jpg',
    quote:
      '"Since using this CRM, my lead conversion rate has dramatically increased. The seamless integration with multiple platforms and quick response feature have made follow-ups so much easier. It\'s been a total game-changer for my business!"',
  },
]

const APP_QUOTES = [
  '“… If you’re a business owner, this is a must-try!”',
  '“Excellent! Lead nurturing is now effortless and smooth!”',
  '“A must-have app for every business owner!”',
]

const ROCKET_LINE =
  'Skyrocket your sales and productivity today 🚀 Capture, engage, and manage every lead from your phone.'

/** Razorpay plan links — exact URLs from source (external, content UNVERIFIED). */
const RZP_MONTHLY = 'https://rzp.io/rzp/c4ZG37v'
const RZP_ANNUAL = 'https://rzp.io/rzp/BRYPjee'
const RZP_ANNUAL_ALT = 'https://rzp.io/rzp/o8XYLr6j'

/* --------------------------------- sections -------------------------------- */

function HeroSection() {
  const { setOpen } = usePopup()
  return (
    <section className="section-dark grid-noise relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">All-in-One Lead CRM</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Transform Your Leads into Loyal Clients,{' '}
              <span className="text-shimmer">Right from Your Phone</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Boost your sales with instant lead notifications, automated personalized content,
              interest monitoring, seamless follow-ups, and efficient lead management—all
              conveniently accessible from your phone in just seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#privyrpricing" className="btn btn-primary btn-md">
                View Pricing
              </a>
              <button type="button" onClick={() => setOpen('privyr-signup')} className="btn btn-ghost-dark btn-md">
                Get Started
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} duration={0.8} once={false} variant="right" className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-accent-400/12 blur-3xl" aria-hidden />
          <img
            src="/assets/privyr-hero-notifications.jpg"
            alt="Businesswoman checking her phone while working on a laptop"
            className="relative w-full rounded-[2rem] border border-line object-cover shadow-card"
            width={1600}
            height={1000}
          />
        </Reveal>
      </div>
    </section>
  )
}

function AudienceSection() {
  return (
    <section id="lead-management" className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Designed for Small Businesses, Marketers, and Solopreneurs"
          sub="Privyr caters to sales and marketing professionals who rely on online lead generation. It provides a hassle-free solution to connect, manage, and convert leads directly from your phone or laptop. Trusted by professionals across countless industries, Privyr is your go-to tool for streamlined success."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <StaggerItem key={a.title} className="card flex h-full items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-400/12 text-accent-600">
                {a.icon}
              </span>
              <h3 className="text-base font-bold text-ink-950 sm:text-lg">{a.title}</h3>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-base leading-relaxed text-ink-300">
            The mobile CRM seamlessly connects with popular lead sources like Facebook, TikTok,
            Google, and WordPress, while integrating smoothly with WhatsApp, SMS, iMessage, email,
            and phone calls.
          </p>
        </Reveal>
        <Stagger className="mt-8 flex flex-wrap items-center justify-center gap-3" stagger={0.04}>
          {LEAD_SOURCES.map((l, i) => (
            <StaggerItem key={l.name}>
              <Reveal as="span" once={false} duration={0.55} variant={i % 2 === 0 ? 'right' : 'left'} className="block">
                <img
                  src={l.img}
                  alt={l.name}
                  loading="lazy"
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-xl border border-line object-cover transition hover:-translate-y-1 hover:border-accent-400/50"
                />
              </Reveal>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats: { value: ReactNode; caption: string }[] = [
    { value: <CountUp to={250000} locale="en-US" />, caption: 'Businesses' },
    { value: <CountUp to={100} suffix="+" />, caption: 'Countries' },
    { value: <>100 Million</>, caption: 'Leads RECEIVED' },
    { value: <CountUp to={300} prefix="+" suffix="%" />, caption: 'Sales Improvement' },
  ]
  return (
    <section className="section-dark border-y border-line py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Trusted by over 250,000 businesses across 100+ countries"
          sub="Privyr has empowered sales and marketing professionals globally to receive, engage, and convert more than 100 million leads."
        />
        {/* FLAG §7.2: 250,000/100+ differ from homepage "9,000+ customers" — both preserved. */}
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.caption} className="card p-6 text-center">
              <p className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-accent-600">
                {s.caption}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CrmPhoneMockup() {
  return (
    <div
      role="img"
      aria-label="Phone showing a CRM app with lead counts, contact records, and follow-up statuses"
      className="flex aspect-[4/3] min-h-[360px] w-full items-center justify-center overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-orange-50 via-white to-violet-100 p-4 sm:p-6"
    >
      <div className="relative h-[94%] max-h-[520px] w-auto max-w-[58%] flex-none aspect-[.48] rounded-[2.25rem] border-[8px] border-slate-800 bg-slate-950 p-1.5 shadow-[0_24px_55px_-20px_rgba(15,23,42,.65)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-slate-50 px-3 pb-3 pt-5 text-slate-900 sm:px-4 sm:pb-4 sm:pt-6">
          <span className="absolute left-1/2 top-1.5 h-2 w-14 -translate-x-1/2 rounded-full bg-slate-950" />
          <div className="flex items-center justify-between text-[9px] font-semibold sm:text-[10px]"><span>9:41</span><span>●●●  Wi-Fi</span></div>
          <div className="mt-5 flex items-center justify-between">
            <div><h4 className="text-base font-bold sm:text-lg">My Leads</h4><p className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px]">Good morning, Alex</p></div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">AM</span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">New leads</p>
            <div className="mt-1 flex items-end justify-between"><strong className="text-2xl leading-none">128</strong><span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">+12 today</span></div>
          </div>
          <div className="mt-3 flex items-center justify-between"><h5 className="text-[11px] font-bold">Follow up</h5><span className="text-[9px] font-semibold text-orange-600">View all</span></div>
          <div className="mt-1.5 space-y-1.5">
            {[
              ['PS', 'Priya Sharma', 'Website enquiry · 10:42', 'FOLLOW UP', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700'],
              ['RK', 'Rahul Khanna', 'Facebook lead · 9:18', 'NEW LEAD', 'bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700'],
              ['AM', 'Anita Mehra', 'WhatsApp · Yesterday', 'QUALIFIED', 'bg-emerald-100 text-emerald-700', 'bg-emerald-100 text-emerald-700'],
            ].map(([initials, name, source, status, avatarTone, statusTone]) => (
              <div key={name} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[8px] font-bold ${avatarTone}`}>{initials}</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-[9px]">{name}</strong><small className="block truncate text-[7px] text-slate-500">{source}</small></span>
                <span className={`rounded-full px-1.5 py-1 text-[6px] font-bold ${statusTone}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-white">
            <span className="block text-[7px] font-semibold tracking-wide text-white/80">TODAY'S ACTIVITY</span>
            <span className="mt-0.5 block text-[11px] font-bold">8 leads to follow up</span>
          </div>
          <div className="mt-2 flex justify-around border-t border-slate-200 pt-2 text-[8px] font-semibold text-orange-700"><span>● Leads</span><span className="text-slate-400">Messages</span><span className="text-slate-400">Profile</span></div>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="crm-features" className="section-deep py-20 sm:py-24">
      <div className="container-page space-y-14">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
          >
            <Reveal variant={i % 2 === 0 ? 'left' : 'right'}>
              <h3 className="text-2xl font-bold text-ink-950 sm:text-3xl">{f.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-ink-300">{f.body}</p>
              <p className="mt-4 text-base font-semibold text-accent-600">{f.closer}</p>
            </Reveal>
            <Reveal delay={0.1} duration={0.8} once={false} variant={i % 2 === 0 ? 'right' : 'left'}>
              {f.title === 'Manage Leads from your Phone' ? (
                <CrmPhoneMockup />
              ) : (
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  width={1600}
                  height={1200}
                  className="aspect-[4/3] w-full rounded-[1.75rem] border border-line object-cover"
                />
              )}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

function SetupSection() {
  return (
    <section id="quick-setup" className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Effortless 30-Second Setup" align="left" className="max-w-3xl" />
        <Reveal className="mt-8 max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-ink-300">
            <p>
              The mobile CRM connects directly to lead sources like Facebook Lead Ads, TikTok Lead
              Generation, Google Ad Lead Forms, WordPress contact forms, and more—no need to set up
              or manage another platform to access your leads.
            </p>
            <p>
              It also works instantly with{' '}
              <strong className="text-ink-950">WhatsApp, SMS, iMessage, email, and phone calls.</strong>
            </p>
            <p className="font-semibold text-accent-600">You’ll be ready to go in just 30 seconds!</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="See what our customers have to say."
          sub="On average, users experience a 300% boost in sales and productivity."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STORIES.map((s) => (
            <TestimonialCard key={s.name} story={s} once={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AppDownloadsSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page text-center">
        <SectionHeading title="More than 100,000 app downloads" />
        <Stagger className="mx-auto mt-8 flex max-w-3xl flex-col gap-2" stagger={0.06}>
          {APP_QUOTES.map((q) => (
            <StaggerItem key={q}>
              <p className="text-base italic text-ink-300">{q}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Reveal as="span" once={false} duration={0.7} variant="left" className="block">
            <img
              src="/assets/2024-12-Google_Play_logo.png"
              alt="Get it on Google Play"
              loading="lazy"
              className="h-16 w-auto"
            />
          </Reveal>
          <Reveal as="span" once={false} duration={0.7} variant="right" className="block">
            <img
              src="/assets/2024-12-Download_on_the_App_Store_RGB_blk.svg.png"
              alt="Download on the App Store"
              loading="lazy"
              className="h-16 w-auto rounded-lg"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SelectPlan({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary btn-md w-full justify-center"
      title="External Razorpay payment page (UNVERIFIED content — flagged in QA)"
    >
      {children}
    </a>
  )
}

function PricingSection() {
  return (
    <section id="privyrpricing" className="section-deep py-20 sm:py-24 scroll-mt-24">
      <div className="container-page">
        <SectionHeading title="Flexible plans for teams of all sizes" />

        {/* Desktop/tablet — source widget `elementor-hidden-mobile` (₹1,599 / ₹1,439). */}
        <Reveal className="mx-auto mt-12 hidden max-w-4xl md:block">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-line p-5 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-300">MONTHLY PLAN</p>
              </div>
              <div className="relative border-b border-line p-5 text-center">
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                  SAVE 10%
                </span>
                <p className="text-sm font-bold uppercase tracking-wider text-ink-300">ANNUAL PLAN</p>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-line">
              <div className="p-6 text-center">
                <p className="font-display text-4xl font-bold text-ink-950">
                  ₹1,599<span className="text-lg font-medium text-ink-400">/month</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
                <p className="mt-3 text-sm text-accent-600">+₹ 1,449 per team account per month</p>
                <div className="mt-5">
                  <SelectPlan href={RZP_MONTHLY}>SELECT PLAN</SelectPlan>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="font-display text-4xl font-bold text-ink-950">
                  ₹1,439<span className="text-lg font-medium text-ink-400">/month</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
                <p className="mt-3 text-sm text-accent-600">+₹ 1,305 per team account per month</p>
                <div className="mt-5">
                  <SelectPlan href={RZP_ANNUAL}>SELECT PLAN</SelectPlan>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile-only — source widgets `elementor-hidden-desktop/tablet` (₹1,449 / ₹1,305).
            FLAG §7.15: mobile prices differ from desktop — both preserved exactly. */}
        <div className="mt-10 grid gap-5 md:hidden">
          <Reveal className="card p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-ink-300">MONTHLY PLAN</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink-950">
              ₹1,449<span className="text-lg font-medium text-ink-400">/month</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
            <p className="mt-3 text-sm text-accent-600">+₹ 1,449 per team account per month</p>
            <div className="mt-5">
              <SelectPlan href={RZP_MONTHLY}>SELECT PLAN</SelectPlan>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="card relative p-6 text-center">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              SAVE 10%
            </span>
            <p className="text-sm font-bold uppercase tracking-wider text-ink-300">ANNUAL PLAN</p>
            <p className="mt-3 font-display text-4xl font-bold text-ink-950">
              ₹1,305<span className="text-lg font-medium text-ink-400">/month</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">{ROCKET_LINE}</p>
            <p className="mt-3 text-sm text-accent-600">+₹ 1,305 per team account per month</p>
            <div className="mt-5">
              <SelectPlan href={RZP_ANNUAL_ALT}>SELECT PLAN</SelectPlan>
            </div>
            <p className="mt-3 text-xs text-ink-400">Automatic renewal. Cancel anytime</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function PrivacySection() {
  const cards = [
    {
      title: 'PRIVATE',
      body: 'Your data is fully protected and will never be sold, shared, or made available to any third parties. You retain complete control and privacy at all times.',
    },
    {
      title: 'SECURE',
      body: 'Your data is securely encrypted both in transit (using TLS 1.2 via HTTPS) and at rest in the database (with 256-bit Advanced Encryption Standard).',
    },
  ]
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page text-center">
        <h3 className="text-2xl font-bold text-ink-950 sm:text-3xl">Built with Privacy at the Core</h3>
        <Reveal className="mx-auto mt-4 max-w-3xl">
          <p className="text-base leading-relaxed text-ink-300">
            Your data remains fully private by default, ensuring you always have complete control and
            security over it.
          </p>
        </Reveal>
        <Stagger className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {cards.map((c) => (
            <StaggerItem key={c.title} className="card p-6 text-left">
              <p className="font-display text-xl font-bold uppercase tracking-wider text-accent-600">
                {c.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{c.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  const { setOpen } = usePopup()
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page text-center">
        <SectionHeading title="Ready to get started?" />
        <Reveal delay={0.1} className="mt-6">
          <p className="text-base text-ink-300">
            Begin using the app and unlock all its features today!
          </p>
          <button type="button" onClick={() => setOpen('privyr-signup')} className="btn btn-primary btn-lg mt-6">
            Try Now
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function PrivyrPage() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <StatsSection />
      <FeaturesSection />
      <SetupSection />
      <TestimonialsSection />
      <AppDownloadsSection />
      <PricingSection />
      <PrivacySection />
      <FinalCtaSection />
    </>
  )
}
