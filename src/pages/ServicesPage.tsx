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
      q: 'How to buy a product?',
      a: (
        <ul className="space-y-2">
          <li>
            <RichText onInternalClick={onInternalClick}>
              Browse products on our website. on **[Shop Page](/tech-store/)** Select the desired product.
            </RichText>
          </li>
          <li>Add it to your cart. Proceed to checkout.</li>
          <li>Enter billing and payment information. Complete the purchase.</li>
          <li>
            <RichText onInternalClick={onInternalClick}>
              Receive confirmation and delivery/access details. **If you need assistance, simply raise a query on our "Contact Us" page for a demo or any other support needed.**
            </RichText>
          </li>
        </ul>
      ),
    },
    {
      q: 'How to send a custom query?',
      a: (
        <div className="space-y-2">
          <p className="font-semibold text-ink-950">Follow these steps:</p>
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <RichText onInternalClick={onInternalClick}>
                Visit our website and navigate to the "**[Contact Us](/contact-us/)** " page.
              </RichText>
            </li>
            <li>Fill out the query form with your contact information, including your name, email address, and phone number.</li>
            <li>In the message section, provide details of your query or request, including any specific information or requirements you have.</li>
            <li>Click on the "Submit" or "Send" button to send your query to our team.</li>
            <li>You will receive a confirmation message acknowledging receipt of your query.</li>
            <li>Our team will review your query and respond to you promptly with the relevant information or assistance you need.</li>
          </ul>
          <p className="font-semibold text-ink-950">
            If you have any urgent queries or prefer to contact us directly, you can also find our contact details, such as email address or phone number, on the "Contact Us" page for immediate assistance.
          </p>
        </div>
      ),
    },
    {
      /* Source typo "How work" preserved (flag §7). */
      q: 'How work the support policy?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li><strong className="text-ink-950">Scope:</strong> Covers assistance for product functionality, usage, and troubleshooting.</li>
            <li><strong className="text-ink-950">Channels:</strong> Email, phone, or live chat during specified hours.</li>
            <li><strong className="text-ink-950">Response Time:</strong> Within 72 Hours during business hours.</li>
            <li><strong className="text-ink-950">Ticketing System:</strong> Efficient tracking and resolution.</li>
            <li><strong className="text-ink-950">Support Hours:</strong> Monday to Friday, 10 Am to 6 Pm excluding holidays.</li>
            <li><strong className="text-ink-950">Severity Levels:</strong> Categorized with varied response times.</li>
            <li><strong className="text-ink-950">Escalation Process:</strong> Ensures timely issue resolution.</li>
            <li><strong className="text-ink-950">Updates:</strong> Regular updates and maintenance for improvement.</li>
            <li><strong className="text-ink-950">End of Support:</strong> Communicated in advance, with upgrade options.</li>
            <li><strong className="text-ink-950">Feedback:</strong> Welcome for continuous improvement.</li>
          </ul>
          <p>
            <RichText onInternalClick={onInternalClick}>
              For detailed information, visit our **[policy page.](/privacy-policy/)**
            </RichText>
          </p>
        </div>
      ),
    },
    {
      q: 'How can send a refund request?',
      a: (
        <div className="space-y-2">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <RichText onInternalClick={onInternalClick}>
                Visit our website's "**[Refund request](/my-account/)** " page.
              </RichText>
            </li>
            <li>Fill out the query form with your details.</li>
            <li>Clearly state your refund request in the message.</li>
            <li>Provide purchase details and reason for the refund.</li>
            <li>Click "Submit" or "Send".</li>
          </ul>
          <p>
            <RichText onInternalClick={onInternalClick}>
              To raise your refund, please visit the refund **[policy page](/refund-and-return-policy/)** read carefully for detailed instructions.
            </RichText>
          </p>
        </div>
      ),
    },
    {
      q: 'My account blocked what can I do?',
      a: (
        <ul className="list-inside list-disc space-y-1.5">
          <li className="list-none font-semibold text-ink-950">If your account is blocked:</li>
          <li>
            Contact Customer Support.{' '}
            <a
              href="https://wa.me/+917408443341"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-600 underline underline-offset-2"
            >
              +91 7408443341
            </a>
          </li>
          <li>Provide necessary information.</li>
          <li>Understand the reason for the block.</li>
          <li>Follow instructions to resolve.</li>
          <li>Review policies.</li>
          <li>Seek clarification if needed.</li>
          <li>Be patient for resolution.</li>
        </ul>
      ),
    },
  ]

  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQS"
          title="Frequently Asked Questions"
          sub="Find answers to your questions about MYR Advance Solution’s services, support, and expertise. Tailored IT solutions for your business needs."
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
