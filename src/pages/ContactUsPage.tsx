import { Link } from 'react-router-dom'
import { Reveal, SectionHeading } from '@/components/ui'
import { SmartForm } from '@/components/forms/SmartForm'
import { LEAD_FORM_4500 } from '@/content/leadForms'
import { CHAT_ABUSE, CHAT_SALES, CHAT_SUPPORT, WHATSAPP } from '@/components/layout/nav'

const contacts = [
  { title: 'Customer support', text: 'Get help from our customer success team, around the clock.', action: 'Chat with support', href: CHAT_SUPPORT, external: true, icon: '◌' },
  { title: 'Sales enquiries', text: 'Tell us what you are looking to build. Our team can help you choose a solution.', action: 'Talk with a sales expert', href: CHAT_SALES, external: true, icon: '↗' },
  { title: 'Media & press', text: 'For media enquiries and press related questions.', action: 'press@myradvancesolution.com', href: 'mailto:press@myradvancesolution.com', external: true, icon: '✉' },
  { title: 'Report abuse', text: 'Report misuse or a security concern to our team.', action: 'Contact abuse team', href: CHAT_ABUSE, external: true, icon: '!' },
  { title: 'Account recovery', text: 'Need help restoring access to your account?', action: 'account-recovery@myradvancesolution.com', href: 'mailto:account-recovery@myradvancesolution.com', external: true, icon: '⌑' },
  { title: 'WhatsApp', text: 'Message our team directly for quick assistance.', action: 'Chat on WhatsApp', href: WHATSAPP, external: true, icon: '◉' },
]

const locations = [
  { city: 'Lucknow, India', image: '/assets/2024-08-Locations-1.jpg', address: 'TC 14, 3rd Floor, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010' },
  { city: 'Jubail, Saudi Arabia', image: '/assets/2024-08-Locations-2.jpg', address: 'Gulf Support Contracting Est., 8616 – Al Safat Dist, Unit No. 9006, Al Jubail 35514 – 4297' },
  { city: 'Dammam, Saudi Arabia', image: '/assets/2024-08-Locations-1.jpg', address: 'Gulf Support Contracting Est., 12th Street – Dammam 2nd Industrial City, P.O. Box 34508' },
  { city: 'Dubai, UAE', image: '/assets/2024-08-Locations-2.jpg', address: 'The Dome Tower, Cluster N – Jumeirah Lake Towers' },
]

export function ContactUsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#101b2b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_25%,rgba(255,132,87,.32),transparent_35%),linear-gradient(110deg,#101b2b,#153449)]" aria-hidden />
        <div className="container-page relative grid min-h-[410px] items-center gap-10 py-14 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
          <Reveal>
            <p className="eyebrow">We’re here to help</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Less waiting.<br/><span className="text-shimmer">More solutions.</span></h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">Your time matters. Get efficient support through live chat and WhatsApp, or talk directly with our team about the right solution for your business.</p>
            <div className="mt-7 flex flex-wrap gap-3"><a href={CHAT_SUPPORT} target="_blank" rel="noreferrer" className="btn btn-primary btn-md">Chat with our team</a><a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-ghost-dark btn-md">WhatsApp us</a></div>
          </Reveal>
          <Reveal variant="right" delay={0.12} className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-full bg-accent-400/15 blur-3xl" aria-hidden />
            <img src="/assets/2024-08-Live-Support-Chat.png" alt="Customer support specialist ready to help" className="relative max-h-[360px] w-full rounded-[2rem] object-contain" />
          </Reveal>
        </div>
      </section>

      <section id="contact-options" className="section-light py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading tone="light" eyebrow="How can we assist you?" title="The right team is one message away" sub="Our customer success team is available 24/7. Choose the contact option that works best for you." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((item) => <article key={item.title} className="flex min-h-52 flex-col rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-400/15 text-xl font-bold text-accent-700" aria-hidden>{item.icon}</span>
              <h2 className="mt-4 text-lg font-bold text-ink-950">{item.title}</h2><p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
              <a className="mt-4 text-sm font-bold text-accent-700 hover:text-accent-800" href={item.href} target={item.external && item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.action} <span aria-hidden>→</span></a>
            </article>)}
          </div>
          <div className="mt-12 grid gap-4 rounded-3xl bg-[#f5f6f7] p-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['How we help your business', '/how-we-help-your-business/'],
              ['Explore product benefits', '/our-products-benefit/'],
              ['Visit the knowledge base', '/knowledge-base/'],
              ['Talk to sales', '/talk-to-sales/'],
            ].map(([label, href]) => <Link key={label} to={href} className="rounded-2xl border border-ink-900/10 bg-white p-4 text-sm font-semibold text-ink-700 transition hover:border-accent-400/50 hover:text-accent-700">{label} <span className="float-right" aria-hidden>↗</span></Link>)}
          </div>
        </div>
      </section>

      <section id="contact-form" className="section-muted py-16 sm:py-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28"><p className="eyebrow">Send us a message</p><h2 className="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">Let’s talk about what you need.</h2><p className="mt-4 leading-relaxed text-ink-500">Share a few details and our team will help point you in the right direction.</p><div className="mt-6 rounded-2xl border border-ink-900/10 bg-white p-5"><p className="font-semibold text-ink-900">Prefer a quick conversation?</p><a href={CHAT_SALES} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-bold text-accent-700">Talk to a sales expert <span className="ml-2" aria-hidden>↗</span></a></div></div>
          <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-sm sm:p-8"><SmartForm config={LEAD_FORM_4500} light /></div>
        </div>
      </section>

      <section id="our-offices" className="section-light py-16 sm:py-20">
        <div className="container-page"><SectionHeading tone="light" eyebrow="Find out more" title="Our offices" sub="Connect with MYR Advance Solution from our locations across India and the Gulf." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{locations.map((location) => <article key={location.city} className="overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-sm"><img src={location.image} alt="" className="h-44 w-full object-cover" loading="lazy"/><div className="p-5"><h3 className="text-lg font-bold text-ink-950">{location.city}</h3><p className="mt-2 text-sm leading-relaxed text-ink-500">{location.address}</p></div></article>)}</div>
        </div>
      </section>
    </>
  )
}
