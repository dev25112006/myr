import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CHAT_SUPPORT } from '@/components/layout/nav'
import { FaqAccordion, Reveal, SectionHeading, SupportBlock } from '@/components/ui'
import { RichText } from '@/components/ui/RichText'
import { PricingPlans } from '@/components/sections/PricingPlans'
import { WEBSITE_PLANS } from '@/content/plans'
import { useCart } from '@/lib/stores'
import { useCatalogPrice } from '@/lib/useCatalogPrice'
import { inr } from '@/lib/format'

/* ------------------------------- source data ------------------------------ */

const HERO_RATINGS = [
  { name: 'Trustpilot', score: '4.5', reviews: '40,850', label: 'TrustScroe' },
  { name: 'Google', score: '5/5', reviews: '1,239', label: 'Rating' },
  { name: 'Hostadvice', score: '4.2/5', reviews: '2,347', label: 'Rating' },
  { name: 'Wpbegginer', score: '4.7', reviews: '773', label: 'Rating' },
]

const STORY_CARDS = [
  {
    name: 'Amit & Neha Khanna',
    role: 'Co-Founders of UrbanCraft Designs',
    quote:
      '"As business partners and a couple, we had a clear vision for our brand, and this team brought it to life flawlessly! Our website is not only visually appealing but also user-friendly and optimized for sales. It has truly elevated our online presence and business growth!"',
  },
  {
    name: 'Rajesh Verma',
    role: ', Marketing Head at Digital Nexus',
    quote:
      '"The team did an outstanding job revamping our website! The new design is sleek, fast, and user-friendly. We\'ve seen a significant increase in traffic and customer engagement. Highly recommended!"',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder of Ethnic Elegance (E-commerce Business)',
    quote:
      '"Absolutely thrilled with our new e-commerce website! The design perfectly showcases our products, and the seamless shopping experience has significantly boosted our sales. Their expertise and attention to detail made all the difference!"',
  },
]

const TESTIMONIALS = [
  {
    name: 'Rohan Malhotra',
    role: 'Founder of TechSphere Solutions',
    image: '/assets/2025-02-7.jpg',
    quote:
      '“MyR Advance Solution took our website to the next level! The design is sleek, the performance is top-notch, and our user engagement has improved significantly. Highly professional and reliable service!”',
  },
  {
    name: 'Ananya Desai',
    role: 'Owner of Elite Fashion Hub',
    image: '/assets/2025-02-8.jpg',
    quote:
      '“Absolutely impressed with the expertise of MyR Advance Solution! They created a visually stunning and easy-to-navigate website that has boosted our online sales. Truly a game-changer for our business!”',
  },
  {
    name: 'Vikram Singh',
    role: 'CEO of SwiftLogistics',
    image: '/assets/2025-02-6.jpg',
    quote:
      '“The team at MyR Advance Solution delivered exactly what we needed—a fast, efficient, and mobile-friendly website. Their dedication and attention to detail made all the difference. Highly recommended!”',
  },
]

const TRUSTPILOT_QUOTES = [
  '“Incredible service! The team at MyR Advance Solution transformed our website into a high-performing, user-friendly platform. Highly recommended for anyone serious about online success!”',
  '“MyR Advance Solution experts delivered a flawless website with stunning design and smooth functionality. Their professionalism and expertise made the entire process effortless!”',
  '“MyR Advance Solution exceeded our expectations! Their attention to detail and innovative approach helped us create a website that truly stands out. Couldn’t be happier with the results!”',
]

const INCLUDED = [
  {
    title: 'Website Development',
    body: 'Choose a plan, make payment, and let our experts build your site—fast and hassle-free!',
  },
  {
    title: 'Total security',
    body: 'Relax, your websites and visitors are protected by the latest security software.',
  },
  {
    title: '99.9% uptime. Guaranteed',
    body: 'Our 99.9% uptime guarantee means your website is always available.',
  },
  {
    title: 'A single, simple dashboard',
    body: 'Designed to be easy-to-use for beginners and professionals alike, you can see at a glance how your site is performing.',
  },
  {
    title: '24/7 customer support',
    body: 'Access expert support whenever you need it. We typically respond in under 2 minutes and our team speak 10+ languages.',
  },
]

const ENJOY_FREE = [
  'Unlimited SSL security certificates',
  'Fast performance hosting',
  'Email addresses',
  'Free domain (with annual plans)',
  'Automatic back-ups and updates',
  'Unlimited web traffic',
]

/** Compare table rows — ✓ = present, null = absent, string = text value. Source typos preserved. */
type Cell = boolean | string | null
const COMPARE_ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: 'SSD storage',
    cells: ['50 GB', '100 GB', '200 GB'],
  },
  {
    label:
      'Free Email Create email addresses and forwarders at no extra cost, each mailbox comes with 1 GB of storage space. The free email is available for 1 year.',
    cells: ['1', '100', '100'],
  },
  { label: 'Mobile-Friendly & Responsive Design', cells: [true, true, true] },
  { label: 'Hosting server 1 Year Free', cells: [true, true, true] },
  { label: 'Free domain value', cells: [null, '₹ 749.00', '₹749.00'] },
  { label: 'Custom website design & development', cells: [true, true, true] },
  { label: 'Pre-built or fully custom templates', cells: [true, true, true] },
  { label: 'AI-powered design tools', cells: [null, null, true] },
  { label: 'Drag & drop editor for easy customization', cells: [true, true, true] },
  { label: 'eCommerce-ready with full store setup', cells: [null, true, true] },
  { label: 'Fast-loading, high-performance websites Performance & Optimization', cells: [true, true, true] },
  { label: 'Smart auto-updates for security & speed', cells: [null, true, true] },
  { label: 'SEO-friendly structure with AI optimization', cells: [null, true, true] },
  { label: 'Advanced caching for better performance', cells: [null, null, true] },
  { label: 'Free SSL for secure browsing Security & Reliability', cells: [true, true, true] },
  { label: 'Advanced security firewall & malware protection', cells: [null, null, true] },
  { label: 'Weekly automated backups', cells: [true, true, true] },
  { label: '99.9% uptime for reliability', cells: [true, true, true] },
  { label: 'eCommerce-ready', cells: [null, true, true] },
  { label: 'Payment methods integration', cells: [null, true, true] },
  { label: 'AI-powered heatmaps & marketing tools', cells: [null, null, true] },
  { label: 'Multi-site support for business growth Technical & Advanced Features', cells: [null, true, true] },
  { label: 'Social accounts Intregation', cells: [null, null, true] },
  /* Source table: "AI ChatBot, Intregation" (with comma) — preserved. */
  { label: 'AI ChatBot, Intregation', cells: [null, null, true] },
  { label: 'CDN included', cells: [null, null, true] },
  { label: 'DNS & FTP management', cells: [true, true, true] },
  { label: '24/7 expert support', cells: [null, true, 'Priority support'] },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-flame-500" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  )
}

function Check() {
  return (
    <span className="text-accent-600" aria-label="Included">
      ✓
    </span>
  )
}

/* --------------------------------- sections -------------------------------- */

/** Wireframe website screens that scroll through the cinematic film. */
function CineScreens() {
  return (
    <>
      {/* hero-style page: header, big titles, copy, trust badges, CTAs, visual */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-white">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-ink-950 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="h-2.5 w-[7%] rounded-full bg-ink-950/18" />
            <span className="ml-auto h-7 w-[9%] rounded-full border border-ink-950/25" />
            <span className="h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="mt-[4%] flex min-h-0 flex-1 gap-[3.5%]">
            <div className="flex w-[57%] flex-col justify-center gap-[5%]">
              <span className="block h-[14%] w-[96%] rounded-md bg-ink-950" />
              <div className="flex h-[14%] w-[80%] gap-[3%]">
                <span className="h-full w-[62%] rounded-md bg-ink-950" />
                <span className="h-full flex-1 rounded-md bg-accent-400" />
              </div>
              <span className="block h-[5%] w-[90%] rounded-full bg-ink-950/18" />
              <span className="block h-[5%] w-[78%] rounded-full bg-ink-950/18" />
              <span className="block h-[5%] w-[64%] rounded-full bg-ink-950/18" />
              <div className="flex gap-[3%]">
                {['x', 'y', 'z'].map((k) => (
                  <span key={k} className="flex h-7 items-center gap-1.5 rounded-full border border-line bg-white px-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                    <span className="h-2 w-8 rounded-full bg-ink-950/15" />
                  </span>
                ))}
              </div>
              <div className="flex gap-[4%]">
                <span className="h-7 w-[36%] rounded-full bg-ink-950 sm:h-9" />
                <span className="h-7 w-[30%] rounded-full border border-ink-950/30 sm:h-9" />
              </div>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-accent-400 to-accent-600">
              <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/35 blur-xl" />
              <span className="absolute left-[10%] top-[14%] flex w-[62%] flex-col gap-2 rounded-lg bg-white/95 p-3 shadow-card">
                <span className="block h-2.5 w-[80%] rounded-full bg-ink-950/70" />
                <span className="block h-2 w-[60%] rounded-full bg-ink-950/25" />
                <span className="block h-5 w-[46%] rounded-full bg-accent-400/80" />
              </span>
              <span className="absolute bottom-3 left-3 h-[10%] w-[44%] rounded-full bg-white/70" />
              <span className="absolute bottom-3 left-[52%] h-[10%] w-[28%] rounded-full bg-ink-950/70" />
            </div>
          </div>
        </div>
      </div>

      {/* full-width dark title section — cinematic "titles form" */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-ink-950">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-white/95 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="ml-auto h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-[5%]">
            <span className="h-2.5 w-[15%] rounded-full bg-accent-400" />
            <span className="block h-[15%] w-[86%] rounded-lg bg-white/95" />
            <div className="flex h-[15%] w-[64%] gap-[3%]">
              <span className="h-full w-[52%] rounded-lg bg-accent-400" />
              <span className="h-full flex-1 rounded-lg bg-white/95" />
            </div>
            <span className="block h-[5%] w-[72%] rounded-full bg-white/30" />
            <span className="block h-[5%] w-[56%] rounded-full bg-white/30" />
            <div className="flex gap-[4%]">
              <span className="h-7 w-[28%] rounded-full bg-white/95 sm:h-9" />
              <span className="h-7 w-[24%] rounded-full border border-white/45 sm:h-9" />
            </div>
          </div>
          <div className="flex items-center gap-[4%]">
            {['1', '2', '3'].map((k) => (
              <span key={k} className="flex h-7 flex-1 items-center gap-2 rounded-full border border-white/20 px-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                <span className="h-2 w-[46%] rounded-full bg-white/30" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* cards + stats page */}
      <div className="relative min-h-0 flex-1 overflow-hidden border-b border-line bg-paper">
        <div className="flex h-full flex-col gap-[3.5%] p-[4.5%]">
          <div className="flex items-center gap-[3%]">
            <span className="block h-[13%] w-[42%] rounded-md bg-ink-950" />
            <span className="block h-[5%] w-[22%] rounded-full bg-ink-950/18" />
            <span className="ml-auto h-6 w-[12%] rounded-full bg-accent-400/80" />
          </div>
          <div className="flex min-h-0 flex-1 gap-[3%]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex flex-1 flex-col justify-between rounded-xl border border-line bg-white p-[7%]"
              >
                <span className="flex items-center gap-[8%]">
                  <span className="aspect-square h-[34%] rounded-md bg-accent-400/70" />
                  <span className="h-[38%] flex-1 rounded-full bg-ink-950/14" />
                </span>
                <span className="flex flex-col gap-[7%]">
                  <span className="block h-[8%] w-[86%] rounded-full bg-ink-950/70" />
                  <span className="block h-[7%] w-full rounded-full bg-ink-950/12" />
                  <span className="block h-[7%] w-[76%] rounded-full bg-ink-950/12" />
                  <span className="mt-[4%] block h-[8%] w-[44%] rounded-full bg-accent-400/70" />
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-[4%] rounded-xl bg-paper px-[4%] py-[2.5%]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="block h-3.5 w-[46%] rounded-sm bg-ink-950" />
                <span className="block h-2 w-[64%] rounded-full bg-ink-950/15" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* dark section */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-ink-950">
        <div className="flex h-full flex-col p-[4.5%]">
          <div className="flex items-center gap-[2%]">
            <span className="h-4 w-[12%] rounded-md bg-white/95 sm:h-5" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="h-2.5 w-[7%] rounded-full bg-white/35" />
            <span className="ml-auto h-7 w-[9%] rounded-full bg-accent-400" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-[5%]">
            <span className="block h-[14%] w-[76%] rounded-lg bg-white/95" />
            <div className="flex h-[14%] w-[58%] gap-[3%]">
              <span className="h-full w-[58%] rounded-lg bg-accent-400" />
              <span className="h-full flex-1 rounded-lg bg-white/95" />
            </div>
            <span className="block h-[4.5%] w-[66%] rounded-full bg-white/30" />
            <span className="block h-[4.5%] w-[52%] rounded-full bg-white/30" />
            <div className="flex gap-[4%]">
              <span className="h-7 w-[26%] rounded-full bg-white/95" />
              <span className="h-7 w-[22%] rounded-full border border-white/40" />
            </div>
          </div>
          <div className="flex items-center gap-[4%]">
            <span className="h-2 w-[16%] rounded-full bg-white/25" />
            <span className="h-2 w-[12%] rounded-full bg-white/25" />
            <span className="h-2 w-[14%] rounded-full bg-white/25" />
            <span className="ml-auto h-6 w-[12%] rounded-full bg-accent-400/80" />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Full-bleed cinematic background — a website film scrolls upward while
 * the camera cuts through wide / title-zoom / dutch-angle / close shots.
 */
function HeroCinematic() {
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:1400px]" aria-hidden>
      <div className="cine-camera absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[320%] w-[150%] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white shadow-[0_0_80px_rgba(5,12,95,0.12)]">
          <div className="cine-track absolute inset-0">
            <div className="absolute inset-x-0 top-0 flex h-1/2 flex-col">
              <CineScreens />
            </div>
            <div className="absolute inset-x-0 top-1/2 flex h-1/2 flex-col">
              <CineScreens />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#050c5f1f)]" />
    </div>
  )
}

function HeroSection() {
  return (
    <section id="website-solutions" className="section-dark relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
      <HeroCinematic />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/78 to-white/55 lg:bg-gradient-to-r lg:from-white/94 lg:via-white/72 lg:via-55% lg:to-transparent"
        aria-hidden
      />
      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow">Website Development</p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] text-ink-950 sm:text-4xl lg:text-5xl">
              Grow Your Brand with Expert{' '}
              <span className="text-gradient">Website Development + Marketing</span> Solutions
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                Talk to sales
              </a>
              <a href={CHAT_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-md">
                Live Chat
              </a>
              <a href="#Pricing" className="btn btn-ghost-dark btn-md">
                Get Started
              </a>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="container-page relative z-10 mt-12">
        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-white/85 px-6 py-4 text-sm text-ink-300 backdrop-blur-sm sm:px-8">
            <span className="font-semibold text-ink-950">Recommended by WordPress.org</span>
            {HERO_RATINGS.map((r) => (
              <span key={r.name}>
                {r.name}{' '}
                <strong className="text-ink-950">
                  {r.label} {r.score} {r.reviews}
                </strong>{' '}
                reviews
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StoryCardsSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page grid gap-5 lg:grid-cols-3">
        {STORY_CARDS.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08} className="card flex h-full flex-col p-6 sm:p-7">
            <Stars />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-300">{s.quote}</p>
            <div className="mt-6 border-t border-line pt-4">
              <h4 className="font-bold text-ink-950">{s.name}</h4>
              <p className="text-sm text-ink-400">{s.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function DevProcessSection() {
  const why = [
    ['Expert Developers', 'Our team of seasoned professionals brings years of experience in web development, ensuring your website is built to the highest standards.'],
    ['Innovative Solutions', 'We stay ahead of the curve by leveraging the latest technologies and trends to deliver cutting-edge websites that stand out.'],
    ['Customized Designs', 'Every website we create is tailored to your brand’s unique needs, ensuring a seamless and personalized user experience.'],
    ['Scalable & Future-Ready', 'We build websites that grow with your business, equipped with features that adapt to your evolving requirements.'],
  ]
  const process = [
    ['Collaborative Planning', 'We work closely with you to understand your vision, goals, and target audience.'],
    ['Creative Design', 'Our designers craft visually appealing layouts that align with your brand identity.'],
    ['Precision Development', 'Our developers bring the design to life with clean, efficient, and responsive coding.'],
    ['Rigorous Testing', 'We ensure your website is bug-free, fast, and optimized for all devices.'],
    ['Ongoing Support', 'Even after launch, we’re here to provide maintenance and updates to keep your website running smoothly.'],
  ]
  return (
    <section id="development-process" className="section-dark py-20 sm:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Why MyR</p>
          <h2 className="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">
            Your Website, Built by Skilled Developers &amp; Innovations
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-300">
            <RichText>
              At **Myr Advance Solution**, we believe your website is more than just a digital presence—it’s a reflection of your brand’s identity and a gateway to your success. Our team of **skilled developers** combines technical expertise with innovative solutions to create websites that are not only visually stunning but also highly functional and user-friendly.
            </RichText>
          </p>
          <h3 className="mt-8 text-xl font-bold text-ink-950">Why Choose Myr Advance Solution?</h3>
          <ul className="mt-4 space-y-3">
            {why.map(([t, b]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-line bg-ink-950/[0.04] p-4 text-sm text-ink-200">
                <span className="text-accent-600" aria-hidden>✦</span>
                <span>
                  <strong className="text-ink-950">{t}:</strong> {b}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-xl font-bold text-ink-950">Our Development Process:</h3>
          <ul className="mt-4 space-y-3">
            {process.map(([t, b]) => (
              <li key={t} className="flex gap-3 rounded-xl border border-line bg-ink-950/[0.04] p-4 text-sm text-ink-200">
                <span className="text-accent-600" aria-hidden>✦</span>
                <span>
                  <strong className="text-ink-950">{t}:</strong> {b}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.12} className="lg:sticky lg:top-24">
          <img
            src="/assets/2025-02-website-design-MyR-Advance-Solution-3.png"
            alt="Website design process at MyR Advance Solution"
            loading="lazy"
            className="w-full rounded-[2rem] border border-line object-cover shadow-card"
            width={1280}
            height={800}
          />
        </Reveal>
      </div>
    </section>
  )
}

function SupportSection() {
  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SupportBlock
            heading="24/7 support for your website's success."
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
                <strong className="text-ink-950">a few minutes</strong>
              </>,
            ]}
            ctaLabel="👋Got Questions? Chat Now!"
            image="/assets/2025-02-web-support.jpg"
          />
        </Reveal>
      </div>
    </section>
  )
}

function TrustpilotBlurbsSection() {
  return (
    <section className="section-dark border-y border-line py-16">
      <div className="container-page grid gap-5 md:grid-cols-3">
        {TRUSTPILOT_QUOTES.map((q, i) => (
          <Reveal key={i} delay={i * 0.08} className="card p-6">
            <p className="text-sm font-semibold text-accent-600">Trustpilot</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">{q}</p>
          </Reveal>
        ))}
      </div>
      <div className="container-page mt-12">
        <Reveal>
          <div className="card p-6 sm:p-8">
            <p className="text-lg font-bold text-ink-950">Enjoy all this. At no extra cost.</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ENJOY_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                  <Check /> {f}
                </li>
              ))}
            </ul>
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
          title="Trusted by 3K+ website owners"
          /* 3K+ claim preserved as-is (flag §7 customer-count claims coexist). */
          sub="Real stories from website owners who chose MyR Advance Solution."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="card flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 rounded-full border border-line object-cover"
                  width={500}
                  height={500}
                />
                <div>
                  <h3 className="font-bold text-ink-950">{t.name}</h3>
                  <p className="text-sm text-ink-400">{t.role}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-300">{t.quote}</p>
              <div className="mt-5">
                <Stars />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function IncludedTablet({ activeIndex }: { activeIndex: number }) {
  const item = INCLUDED[activeIndex]
  const details = [
    { label: 'Launch your website', value: 'Ready to grow', bars: ['w-[86%]', 'w-[64%]', 'w-[76%]'] },
    { label: 'Security status', value: 'Protected', bars: ['w-[72%]', 'w-[88%]', 'w-[58%]'] },
    { label: 'Service availability', value: '99.9%', bars: ['w-[92%]', 'w-[82%]', 'w-[88%]'] },
    { label: 'Website overview', value: 'All in one place', bars: ['w-[66%]', 'w-[84%]', 'w-[72%]'] },
    { label: 'Support team', value: 'Online 24/7', bars: ['w-[78%]', 'w-[60%]', 'w-[90%]'] },
  ][activeIndex]

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-[1.5rem] border-[4px] border-slate-800 bg-slate-800 p-1 shadow-[0_35px_80px_-32px_rgba(15,23,42,.65)] sm:rounded-[2rem] sm:border-[6px] sm:p-1.5">
      <div className="absolute left-1/2 top-[2px] z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-600" />
      <div className="relative aspect-[1.28] overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-slate-50 via-white to-orange-50/70 p-[7%] sm:rounded-[1.6rem]">
        <div className="mb-[5%] flex items-center justify-between border-b border-slate-200 pb-[3%]">
          <span className="flex items-center gap-2 text-[clamp(9px,1.15vw,14px)] font-bold text-slate-900"><span className="grid h-5 w-5 place-items-center rounded-md bg-orange-500 text-[10px] text-white">M</span> MYR Studio</span>
          <span className="h-2 w-[20%] rounded-full bg-slate-200" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="h-[82%]"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <span className="text-[clamp(8px,.9vw,11px)] font-bold uppercase tracking-[.18em] text-orange-600">Included feature 0{activeIndex + 1}</span>
                <h3 className="mt-[2%] max-w-[90%] text-[clamp(18px,2.6vw,32px)] font-bold leading-tight text-slate-950">{item.title}</h3>
                <p className="mt-[2%] max-w-[80%] text-[clamp(9px,1.1vw,14px)] leading-relaxed text-slate-500">{item.body}</p>
              </div>
              <div className="grid grid-cols-[1.1fr_.9fr] gap-[4%]">
                <div className="rounded-xl border border-slate-200 bg-white p-[6%] shadow-sm">
                  <span className="block text-[clamp(8px,.85vw,11px)] text-slate-400">{details.label}</span>
                  <strong className="mt-1 block text-[clamp(13px,1.7vw,21px)] text-slate-900">{details.value}</strong>
                  <div className="mt-[8%] space-y-[5%]">
                    {details.bars.map((width, i) => <span key={i} className={`block h-1.5 rounded-full bg-slate-100 ${width}`}><i className={`block h-full rounded-full ${i === 0 ? 'bg-orange-400' : 'bg-slate-200'} ${i === 0 ? 'w-[72%]' : 'w-full'}`} /></span>)}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-[7%] text-white shadow-sm">
                  <span className="text-[clamp(8px,.85vw,11px)] text-white/80">Your plan</span>
                  <span className="text-[clamp(13px,1.8vw,22px)] font-bold">All set <span aria-hidden>✓</span></span>
                  <span className="h-1.5 w-[56%] rounded-full bg-white/55" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function IncludedSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const featureListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = featureListRef.current
    if (!root) return
    const features = Array.from(root.querySelectorAll<HTMLElement>('[data-included-feature]'))
    const observer = new IntersectionObserver((entries) => {
      const centered = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (centered) setActiveIndex(Number((centered.target as HTMLElement).dataset.includedFeature))
    }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] })
    features.forEach((feature) => observer.observe(feature))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-dark py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Every plan" title="Included with every plan" />
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div ref={featureListRef} className="order-2 lg:order-1">
            {INCLUDED.map((item, index) => (
              <article
                key={item.title}
                data-included-feature={index}
                className="flex min-h-[26vh] items-center py-3 sm:min-h-[30vh]"
              >
                <div className={`card w-full p-6 transition duration-500 sm:p-8 ${activeIndex === index ? 'border-orange-400/60 shadow-xl shadow-orange-950/10' : 'opacity-75'}`}>
                  <span className="text-xs font-bold uppercase tracking-[.18em] text-accent-600">0{index + 1} / 0{INCLUDED.length}</span>
                  <h3 className="mt-3 text-xl font-bold text-ink-950 sm:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-400 sm:text-base">{item.body}</p>
                  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.45 }} className="mt-5 lg:hidden">
                    <IncludedTablet activeIndex={index} />
                  </motion.div>
                </div>
              </article>
            ))}
            <div className="py-8">
              <a href="#Pricing" className="btn btn-primary btn-lg w-full">Get Started</a>
            </div>
          </div>
          <div className="hidden lg:order-2 lg:sticky lg:top-[20vh] lg:block lg:self-start">
            <IncludedTablet activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparePlansSection() {
  const { add } = useCart()
  const navigate = useNavigate()
  const price2765 = useCatalogPrice(2765, 14499)
  const price2766 = useCatalogPrice(2766, 24499)
  const price2767 = useCatalogPrice(2767, 59499)
  const currentPrices = [price2765, price2766, price2767]

  const buy = (productId: number) => {
    const plan = WEBSITE_PLANS.find((p) => p.productId === productId)
    if (!plan) return
    add({ id: productId, qty: 1, price: currentPrices[WEBSITE_PLANS.indexOf(plan)], name: plan.name })
    navigate('/checkout/')
  }

  const prices: [string, string, string] = [`₹30,000 ${inr(price2765, { paise: false })}`, `₹60,699 ${inr(price2766, { paise: false })}`, `₹75,000 ${inr(price2767, { paise: false })}`]

  return (
    <section id="viewallfeatures" className="section-light py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          tone="light"
          eyebrow="Plans"
          title="Compare our plans"
          sub="See at a glance what each plan costs and what you get for your money."
        />
        <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-[0_24px_60px_-45px_rgb(2_6_23/0.4)]">
          <p className="border-b border-ink-900/8 px-4 py-2 text-xs font-medium text-ink-500 sm:hidden">
            ← Swipe to compare plans →
          </p>
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10">
                <th className="sticky left-0 z-10 w-[36%] bg-white p-4 text-xs font-bold uppercase tracking-wide text-ink-500" />
                {WEBSITE_PLANS.map((p) => (
                  <th key={p.productId} className="p-4 text-center">
                    {p.tag?.tone === 'popular' && (
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-accent-600">
                        Most Popular
                      </span>
                    )}
                    <span className="block font-bold text-ink-900">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-900/8">
                <td className="sticky left-0 z-10 bg-white p-4" />
                {prices.map((price, i) => (
                  <td key={i} className="p-4 text-center font-display text-lg font-bold text-ink-900">
                    {price}
                  </td>
                ))}
              </tr>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-ink-900/8 last:border-0">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white p-4 text-left align-top text-xs font-medium text-ink-600"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="p-4 text-center align-top text-ink-700">
                      {cell === true ? <Check /> : cell === null || cell === '' ? '' : cell}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-ink-900/10">
                <td className="sticky left-0 z-10 bg-white p-4" />
                {WEBSITE_PLANS.map((p) => (
                  <td key={p.productId} className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => buy(p.productId)}
                      className="btn btn-primary btn-sm"
                    >
                      Buy Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}

function FaqSection() {
  /* Website-development page FAQs — 6 questions, verbatim from this page's manifest. */
  const items = [
    {
      q: 'How long does it take to build my website?',
      a: (
        <p>
          <RichText>
            Your website goes **live with a maintenance or coming soon page within 24 hours**. The full development is completed within **15-20 days**, based on content and requirements.
          </RichText>
        </p>
      ),
    },
    {
      q: 'Do you offer custom website designs?',
      a: <p>Yes! We create unique, tailored designs to match your brand and business needs.</p>,
    },
    {
      q: 'Will my website be mobile-friendly?',
      a: (
        <p>
          <RichText>
            Absolutely! All our websites are **fully responsive** and **optimized** for mobile devices.
          </RichText>
        </p>
      ),
    },
    {
      q: "Can I update my website after it's live?",
      a: <p>Yes! We provide easy-to-use tools and support so you can manage updates effortlessly.</p>,
    },
    {
      q: 'Do you offer SEO optimization?',
      a: (
        <p>
          <RichText>
            Yes! We provide **basic SEO** with every website to ensure a strong foundation. For advanced SEO strategies, you can choose from our **SEO plans** at an additional cost.
          </RichText>
        </p>
      ),
    },
    {
      q: 'What if I need support after my website is launched?',
      a: (
        <p>
          <RichText>
            We provide **24/7 support via [live chat,](https://1367.3cx.cloud/myradvancesolutionpr) WhatsApp dedicated group, and phone**, while email queries are responded to within **24 hours**.
          </RichText>
        </p>
      ),
    },
  ]

  return (
    <section className="section-deep py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="FAQS"
          title="Website Development (FAQs)"
          sub="Answers to common questions about building your website with MyR Advance Solution."
        />
        <div className="mt-12">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export function WebsiteDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <PricingPlans
        id="Pricing"
        eyebrow="Pick your perfect plan"
        title="Pick your perfect plan"
        sub="Get started in complete confidence. Our 30-day money-back guarantee means it’s risk-free."
      />
      <StoryCardsSection />
      <DevProcessSection />
      <SupportSection />
      <TrustpilotBlurbsSection />
      <TestimonialsSection />
      <IncludedSection />
      <ComparePlansSection />
      <FaqSection />
    </>
  )
}
