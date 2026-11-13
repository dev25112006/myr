import { Link } from 'react-router-dom'
import {
  FaqAccordion,
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
  StatCounters,
  SupportBlock,
} from '@/components/ui'
import { RichList, RichText } from '@/components/ui/RichText'
import { usePopup } from '@/lib/stores'

/* ------------------------------- source data ------------------------------ */

const STATS = [
  { label: 'Team Member', value: 50 },
  { label: 'Total Project', value: 300, suffix: '+' },
  { label: 'Happy Clients', value: 50000, comma: true },
  { label: 'Countries', value: 5, suffix: '+' },
]

type ServiceCard = {
  pre?: string
  title: string
  blurb: string
  to: string
  bookNow?: boolean
}

/** Blurbs verbatim from audit/pages/services.md — intentionally differ from homepage. */
const SERVICE_CARDS: ServiceCard[] = [
  {
    pre: 'Premium',
    title: 'Web Development',
    blurb: 'We craft sleek, user-friendly designs tailored for your success.',
    to: '/website-development/',
  },
  {
    title: 'CRM Development',
    blurb: 'We create tailored CRM solutions for your business success.',
    to: '/crm-development/',
  },
  {
    pre: 'Exclusive',
    title: 'Digital Marketing',
    blurb: 'We excel in digital marketing, maximizing your online success.',
    to: '/digital-marketing/',
  },
  {
    title: 'Networking Solution',
    blurb: 'Streamline connections with tailored networking solutions.',
    to: '/network-solution/',
  },
  {
    title: 'IPBX Solution',
    blurb: 'Seamless communication, enhanced efficiency for your business.',
    to: '/ipbx-solution/',
  },
  {
    title: 'CCTV Solution',
    blurb: 'We fortify your digital and physical spaces with CCTV solutions.',
    to: '/cctv-solution/',
    bookNow: true,
  },
  {
    title: 'Toll-Free 1800 XXX 8899 Number',
    blurb: 'Unlock unparalleled customer engagement with our exclusive 1-800 toll-free number service.',
    to: '/1800-number/',
  },
]

/* --------------------------------- sections -------------------------------- */

function ServiceCardsSection() {
  const { setOpen } = usePopup()

  return (
    <section className="section-deep relative overflow-hidden py-20 sm:py-24">
      <div className="container-page">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((s) => (
            <StaggerItem key={s.title} className="h-full">
              <Link
                to={s.to}
                className="group relative flex h-full flex-col rounded-[1.5rem] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-400/50 hover:bg-ink-950/[0.03]"
              >
                {s.bookNow && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpen('appointment')
                    }}
                    className="absolute right-4 top-4 rounded-full bg-flame-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-flame-600 transition hover:bg-flame-500 hover:text-accent-600"
                  >
                    Book Now
                  </button>
                )}
                <span
                  className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent-400/12 text-lg text-accent-600 transition group-hover:bg-accent-400 group-hover:text-ink-950"
                  aria-hidden
                >
                  ◆
                </span>
                <h3 className="text-lg font-bold text-ink-950 transition group-hover:text-accent-600">
                  {s.pre && <span className="text-accent-600">{s.pre} </span>}
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">{s.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                  Explore <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
          <StaggerItem className="h-full">
            <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-accent-400/30 bg-gradient-to-br from-accent-400/12 to-transparent p-6">
              <div>
                <p className="eyebrow">Talk to an expert</p>
                <p className="mt-3 text-lg font-bold text-ink-950">
                  Schedule an Appointment with Our IT Pro
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen('appointment')}
                className="btn btn-primary btn-md mt-6 w-full"
              >
                Book Now
              </button>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="section-dark py-16 sm:py-20">
      <div className="container-page">
        <StatCounters stats={STATS} />
      </div>
    </section>
  )
}

function MissionSection() {
  const items = [
    'Mission: Empowering businesses through innovative IT solutions, boosting online visibility.',
    'Values: Integrity, professionalism, and customer-centricity enhance search engine rankings.',
    'Commitment: Delivering excellence drives improved search engine visibility and client success.',
  ]
  return (
    <section className="section-light py-20 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="eyebrow">Mission &amp; Values</p>
          <h2 className="mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">
            About our mission, values, and commitment
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-600">
            <RichText>
              Our mission is to empower businesses with cutting-edge technology, driven by integrity, professionalism, and a customer-centric approach. With a commitment to excellence, we ensure our clients achieve their goals and thrive in today’s competitive market. Partner with us to experience the difference in quality, reliability, and customer satisfaction.”
            </RichText>
          </p>
          <RichList items={items} className="mt-6 space-y-3 text-sm leading-relaxed text-ink-700" bullet="▸" />
          <Link to="/about-us/" className="btn btn-light btn-md mt-7">
            Know More
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <img
            src="/assets/2024-08-buy-toll-free-number-768x644-1.png"
            alt=""
            loading="lazy"
            className="mx-auto w-full max-w-md rounded-[2rem] object-contain drop-shadow-[0_30px_60px_rgba(2_6_23,0.25)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

function FaqSection({ onInternalClick }: { onInternalClick: (href: string) => void }) {
  /* Services-page FAQ wording — intentionally differs from homepage (see S02). */
  const items = [
    {
      q: 'Which service should I choose — website, CRM, ERP or digital marketing?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <RichText onInternalClick={onInternalClick}>
                New or outdated online presence → **website development**
              </RichText>
            </li>
            <li>Scattered customer data and slow follow-ups → CRM</li>
            <li>Multi-department operations → ERP</li>
            <li>Low visibility and lead flow → digital marketing</li>
          </ul>
          <p>
            <RichText onInternalClick={onInternalClick}>
              Each service section on this page links to a dedicated page, or **[contact the team](/contact-us/)** and we will map the right starting point for your business.
            </RichText>
          </p>
        </div>
      ),
    },
    {
      q: 'Do you add AI features to CRM, ERP and marketing projects?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>AI-assisted lead scoring and reply drafting in CRM</li>
            <li>
              <RichText onInternalClick={onInternalClick}>
                AI marketing tools for campaign variants and keyword clustering — see **[AI digital marketing](/digital-marketing/)**
              </RichText>
            </li>
            <li>Reporting modules with AI summaries</li>
          </ul>
          <p>
            We use AI where it measurably saves time and keep human review on anything
            customer-facing.
          </p>
        </div>
      ),
    },
    {
      q: 'How does cloud IP PBX telephony work for teams in India and the US?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <RichText onInternalClick={onInternalClick}>
                A cloud IP PBX routes calls over the internet instead of legacy phone lines — see **[IPBX solutions](/ipbx-solution/)**
              </RichText>
            </li>
            <li>Extensions, IVR menus, ring groups, call recording and CRM screen-pops are configured in software</li>
            <li>
              <RichText onInternalClick={onInternalClick}>
                India offices connect through SIP trunks; US teams can run **[toll-free 1800 numbers](/1800-number/)**
              </RichText>
            </li>
            <li>The same system serves multi-location and remote teams</li>
          </ul>
        </div>
      ),
    },
    {
      q: 'Do you work with clients outside India — the US and worldwide?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Yes — remote-first delivery for the United States and worldwide clients</li>
            <li>IST/EST-overlap meetings, WhatsApp and live-chat support</li>
            <li>Quotes in INR or USD</li>
            <li>Discovery, demos and handovers happen online, so timezone differences do not slow delivery</li>
          </ul>
        </div>
      ),
    },
    {
      q: 'What are your payment terms and accepted payment methods?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Projects are billed in INR with a GST invoice, or in USD for applicable regions</li>
            <li>Typical terms: an advance to begin, with milestone payments through delivery</li>
            <li>
              <RichText onInternalClick={onInternalClick}>
                Hardware and ready-made products can be purchased directly through the **[Tech Store](/tech-store/)** checkout
              </RichText>
            </li>
            <li>Subscriptions renew per the agreed billing cycle</li>
          </ul>
        </div>
      ),
    },
    {
      q: "How fast is MYR's support response?",
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li><strong className="text-ink-950">Phone &amp; live chat:</strong> assistance within minutes during support hours</li>
            <li><strong className="text-ink-950">Email:</strong> answered within 24 hours</li>
            <li><strong className="text-ink-950">Support hours:</strong> Monday to Friday, 10 AM to 6 PM IST</li>
            <li><strong className="text-ink-950">Ticketing:</strong> severity-based prioritisation and escalation for critical issues</li>
          </ul>
          <p>
            <RichText onInternalClick={onInternalClick}>
              For detailed information, visit our **[policy page.](/privacy-policy/)**
            </RichText>
          </p>
        </div>
      ),
    },
  ]

  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQS"
          title="Frequently Asked Questions"
          sub="Answers on services, pricing in INR and USD, AI features, cloud telephony and support — for businesses in India, the US and worldwide."
        />
        <div className="mt-12">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}

function UnlockSection() {
  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page space-y-8">
        <SectionHeading
          eyebrow="FAQS"
          title="Unlock the Ideal Solution for Your Needs - Reach Out for Assistance Today !"
          sub="“Discover the **Perfect IT Solution** – Reach Out for Expert Assistance! Explore our range of **IT services** and find the perfect solution tailored to your needs. With **over 9000+ loyal customers who trust us**, rest assured that we provide the **best and most cost-effective solutions.** Don’t hesitate to reach out if you need any help. Our team of experts is here to assist you every step of the way!”"
        />
        <Reveal>
          <SupportBlock
            bullets={[
              <>
                Access expert support whenever you need it via <strong className="text-ink-950">live chat and email</strong>
              </>,
              <>
                Our specialists are adept at handling diverse needs, so you can be sure communication and support will be{' '}
                <strong className="text-ink-950">seamless.</strong>
              </>,
              <>
                Spend less time waiting, our speedy support team typically responds in under{' '}
                <strong className="text-ink-950">2 minutes</strong>
              </>,
            ]}
            ctaLabel="Hi 👋 How can we help?"
            image="/assets/2024-08-sales-support-girl.png"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function ServicesPage() {
  const { setOpen } = usePopup()

  const onInternalClick = (href: string) => {
    if (href === '#login') setOpen('login')
  }

  return (
    <>
      <section className="section-dark grid-noise relative overflow-hidden pb-10 pt-12 sm:pb-14 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" aria-hidden />
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">MYR Advance Solution</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-ink-950 sm:text-5xl">
              Our Core <span className="text-gradient">Services</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              we aim to meet all your technological needs and drive your business towards success in the digital age.
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceCardsSection />
      <StatsSection />
      <MissionSection />
      <FaqSection onInternalClick={onInternalClick} />
      <UnlockSection />
    </>
  )
}
